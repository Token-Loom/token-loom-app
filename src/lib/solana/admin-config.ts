import { PublicKey } from '@solana/web3.js'

// Get admin wallets from environment variables
const getAdminWallets = (): string[] => {
  const wallets: string[] = []

  // Add the primary payment wallet
  const paymentWallet = process.env.NEXT_PUBLIC_PAYMENT_WALLET
  if (paymentWallet) {
    wallets.push(paymentWallet)
  }

  // Add additional admin wallets
  const additionalWallets = process.env.NEXT_PUBLIC_ADMIN_WALLETS
  if (additionalWallets) {
    // Split by comma and trim each address
    const addresses = additionalWallets.split(',').map(addr => addr.trim())
    wallets.push(...addresses)
  }

  // Filter out empty strings and duplicates
  return [...new Set(wallets.filter(Boolean))]
}

// Export the list of admin wallets
export const ADMIN_WALLETS = getAdminWallets()

// Function to check if a wallet is an admin
export function isAdminWallet(publicKey: PublicKey | null): boolean {
  if (!publicKey) return false
  return ADMIN_WALLETS.includes(publicKey.toString())
}

// Function to get admin wallet names (for display purposes)
export function getAdminWalletName(walletAddress: string): string {
  if (walletAddress === process.env.NEXT_PUBLIC_PAYMENT_WALLET) {
    return 'Payment Wallet'
  }
  return 'Admin Wallet'
}
