import { PublicKey } from '@solana/web3.js'

const ADMIN_WALLETS = [process.env.NEXT_PUBLIC_PAYMENT_WALLET || ''].filter(Boolean)

export function isAdminWallet(publicKey: PublicKey | null): boolean {
  if (!publicKey) return false
  return ADMIN_WALLETS.includes(publicKey.toString())
}
