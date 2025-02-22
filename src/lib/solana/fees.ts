import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { isAdminWallet } from './admin-config'

const PAYMENT_WALLET = process.env.NEXT_PUBLIC_PAYMENT_WALLET || ''
if (!PAYMENT_WALLET) {
  throw new Error('NEXT_PUBLIC_PAYMENT_WALLET environment variable is not set')
}

// Fee amounts in lamports
export const IMMEDIATE_BURN_FEE_LAMPORTS = 100_000_000 // 0.1 SOL
export const CONTROLLED_BURN_FEE_LAMPORTS = 200_000_000 // 0.2 SOL
export const NETWORK_FEE_LAMPORTS = 10000 // 0.00001 SOL to be safe (covers both burn and fee transfer)

export function createFeeInstruction(fromWallet: PublicKey, isControlledBurn: boolean = false) {
  const paymentWallet = new PublicKey(PAYMENT_WALLET)
  const feeAmount = isControlledBurn ? CONTROLLED_BURN_FEE_LAMPORTS : IMMEDIATE_BURN_FEE_LAMPORTS

  return SystemProgram.transfer({
    fromPubkey: fromWallet,
    toPubkey: paymentWallet,
    lamports: feeAmount
  })
}

export async function checkSufficientBalance(
  connection: Connection,
  wallet: PublicKey,
  isControlledBurn: boolean = false
): Promise<{
  hasBalance: boolean
  currentBalance: number
  requiredAmount: number
}> {
  const balance = await connection.getBalance(wallet)
  const isAdmin = isAdminWallet(wallet)

  // For admin wallets, only need network fees
  if (isAdmin) {
    return {
      hasBalance: balance >= NETWORK_FEE_LAMPORTS,
      currentBalance: balance,
      requiredAmount: NETWORK_FEE_LAMPORTS
    }
  }

  // For regular users, need platform fee + network fees
  const platformFee = isControlledBurn ? CONTROLLED_BURN_FEE_LAMPORTS : IMMEDIATE_BURN_FEE_LAMPORTS
  const requiredAmount = platformFee + NETWORK_FEE_LAMPORTS

  return {
    hasBalance: balance >= requiredAmount,
    currentBalance: balance,
    requiredAmount
  }
}

export function getRequiredFeeAmount(isControlledBurn: boolean = false, wallet?: PublicKey): number {
  if (wallet && isAdminWallet(wallet)) {
    return NETWORK_FEE_LAMPORTS
  }
  const platformFee = isControlledBurn ? CONTROLLED_BURN_FEE_LAMPORTS : IMMEDIATE_BURN_FEE_LAMPORTS
  return platformFee + NETWORK_FEE_LAMPORTS
}
