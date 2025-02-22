import { Connection, PublicKey, Transaction, ParsedAccountData } from '@solana/web3.js'
import { createBurnInstruction } from '@solana/spl-token'
import { createFeeInstruction } from './fees'
import { isAdminWallet } from './admin-config'
import { isLPToken } from './tokens'

interface ParsedTokenAccountData {
  info: {
    mint: {
      decimals: number
    }
  }
}

export interface BurnLPTokenParams {
  connection: Connection
  tokenMint: string
  amount: string
  wallet: PublicKey
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  isControlledBurn?: boolean
  onProgress?: (status: string | null) => void
}

/**
 * Burns LP tokens. This is similar to regular token burning but includes additional
 * checks and fee calculations specific to LP tokens.
 */
export async function burnLPTokens({
  connection,
  tokenMint,
  amount,
  wallet,
  signTransaction,
  isControlledBurn = false,
  onProgress
}: BurnLPTokenParams): Promise<string | null> {
  try {
    onProgress?.('Verifying LP token...')

    // Verify this is actually an LP token
    const mintPubkey = new PublicKey(tokenMint)
    const isLP = await isLPToken(connection, mintPubkey)
    if (!isLP) {
      throw new Error('Not a valid LP token')
    }

    onProgress?.('Checking balance...')

    // Skip fee check and collection for admin wallets
    const isAdmin = isAdminWallet(wallet)
    if (!isAdmin) {
      // Note: LP token burns might have different fee structures
      // You might want to implement a different fee calculation for LP tokens
      const feeAmount = isControlledBurn ? 0.2 : 0.1 // Example fee amounts
      const balance = await connection.getBalance(wallet)
      if (balance < feeAmount * 1e9) {
        throw new Error(
          `Insufficient SOL balance. You need at least ${feeAmount} SOL to cover platform and network fees.`
        )
      }
    }

    onProgress?.('Preparing burn transaction...')

    // Get the token account address
    const tokenAccount = await connection.getTokenAccountsByOwner(wallet, {
      mint: mintPubkey
    })

    if (tokenAccount.value.length === 0) {
      throw new Error('No token account found for this LP token')
    }

    // Get token account info to verify decimals
    const tokenAccountInfo = await connection.getParsedAccountInfo(tokenAccount.value[0].pubkey)
    if (!tokenAccountInfo.value) {
      throw new Error('Token account not found')
    }

    const parsedData = (tokenAccountInfo.value.data as ParsedAccountData).parsed
    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error('Invalid token account data format')
    }

    const tokenData = parsedData as unknown as ParsedTokenAccountData
    const decimals = tokenData.info.mint.decimals

    // Convert amount to raw amount based on decimals
    // Handle decimal places carefully to avoid floating point precision issues
    const parts = amount.split('.')
    const wholePart = parts[0]
    const fractionalPart = parts[1] || ''

    // Pad or truncate decimal places as needed
    const paddedFractionalPart = fractionalPart.padEnd(decimals, '0').slice(0, decimals)

    // Combine whole and fractional parts
    const rawAmountStr = wholePart + paddedFractionalPart

    // Remove any leading zeros to avoid BigInt conversion issues
    const cleanedAmountStr = rawAmountStr.replace(/^0+/, '') || '0'
    const rawAmount = BigInt(cleanedAmountStr)

    // Create burn instruction
    const burnInstruction = createBurnInstruction(tokenAccount.value[0].pubkey, mintPubkey, wallet, rawAmount)

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
      console.error('Error burning LP tokens:', error)
    }
    throw error
  }
}
