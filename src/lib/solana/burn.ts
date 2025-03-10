import { Connection, PublicKey, Transaction, ParsedAccountData } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, createBurnInstruction, getAssociatedTokenAddress } from '@solana/spl-token'
import { createFeeInstruction, checkSufficientBalance } from './fees'
import { isAdminWallet } from './admin-config'

export interface BurnTokenParams {
  connection: Connection
  tokenMint: string
  amount: string
  wallet: PublicKey
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  isControlledBurn?: boolean
  onProgress?: (status: string | null) => void
}

export async function burnTokens({
  connection,
  tokenMint,
  amount,
  wallet,
  signTransaction,
  isControlledBurn = false,
  onProgress
}: BurnTokenParams): Promise<string | null> {
  try {
    onProgress?.('Checking balance...')

    // Skip fee check and collection for admin wallets
    const isAdmin = isAdminWallet(wallet)
    if (!isAdmin) {
      // Check if wallet has sufficient balance for fee
      const { hasBalance, currentBalance, requiredAmount } = await checkSufficientBalance(
        connection,
        wallet,
        isControlledBurn
      )
      if (!hasBalance) {
        const currentSol = currentBalance / 1e9
        const requiredSol = requiredAmount / 1e9
        throw new Error(
          `Insufficient SOL balance. You have ${currentSol} SOL but need ${requiredSol} SOL (${requiredSol - currentSol} SOL more) to cover platform and network fees.`
        )
      }
    }

    onProgress?.('Preparing burn transaction...')

    // Convert token mint string to PublicKey
    const mintPubkey = new PublicKey(tokenMint)

    // Get the token account address
    const tokenAccount = await getAssociatedTokenAddress(mintPubkey, wallet, false, TOKEN_PROGRAM_ID)

    // Get token account info to verify decimals
    const tokenAccountInfo = await connection.getParsedAccountInfo(tokenAccount)
    if (!tokenAccountInfo.value) {
      throw new Error('Token account not found')
    }

    const parsedData = (tokenAccountInfo.value.data as ParsedAccountData).parsed
    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error('Invalid token account data format')
    }

    // Ensure we correctly access the decimals from the parsed data
    const decimals = (parsedData as any).info.tokenAmount.decimals
    if (typeof decimals !== 'number') {
      throw new Error('Could not determine token decimals')
    }

    console.log('Token account data:', {
      parsedData,
      decimals
    })

    // Convert amount to raw amount based on decimals
    // Handle the amount as a string to avoid floating point precision issues
    let [wholePart, decimalPart = ''] = amount.split('.')

    // Remove any leading zeros from the whole part
    wholePart = wholePart.replace(/^0+/, '') || '0'

    // Pad or truncate decimal part to match decimals
    decimalPart = decimalPart.padEnd(decimals, '0').slice(0, decimals)

    // Combine whole and decimal parts
    const rawAmountStr = `${wholePart}${decimalPart}`

    // Convert to BigInt, removing any leading zeros
    const rawAmount = BigInt(rawAmountStr)

    console.log({
      inputAmount: amount,
      decimals,
      rawAmountStr,
      rawAmount: rawAmount.toString()
    })

    // Create burn instruction
    const burnInstruction = createBurnInstruction(tokenAccount, mintPubkey, wallet, rawAmount)

    onProgress?.('Creating transaction...')

    // Create transaction and add burn instruction
    const transaction = new Transaction()

    // Only add fee instruction if not an admin wallet
    if (!isAdmin) {
      const feeInstruction = createFeeInstruction(wallet, isControlledBurn)
      transaction.add(feeInstruction)
    }

    transaction.add(burnInstruction)
    transaction.feePayer = wallet
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    onProgress?.('Signing transaction...')

    let signedTransaction: Transaction
    try {
      signedTransaction = await signTransaction(transaction)
    } catch (err) {
      // Silently handle user rejection
      if (
        err instanceof Error &&
        (err.message.toLowerCase().includes('user rejected') ||
          err.message.toLowerCase().includes('user denied') ||
          err.message.toLowerCase().includes('user cancelled') ||
          err.message.toLowerCase().includes('user canceled'))
      ) {
        onProgress?.(null) // Clear the progress status
        return null
      }
      throw err
    }

    onProgress?.('Sending transaction...')

    // Send and confirm transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())
    const latestBlockhash = await connection.getLatestBlockhash()
    await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    })

    onProgress?.('Transaction confirmed!')

    return signature
  } catch (error) {
    // Only log actual errors, not user cancellations
    if (error) {
      console.error('Error burning tokens:', error)
    }
    throw error
  }
}
