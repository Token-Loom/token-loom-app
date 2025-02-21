import { Keypair } from '@solana/web3.js'
import { encrypt, decrypt } from '@/lib/crypto'

export interface BurnWalletInfo {
  walletAddress: string
  encryptedPrivateKey: string
}

export async function generateBurnWallet(encryptionKey: string): Promise<BurnWalletInfo> {
  // Generate new Solana keypair
  const keypair = Keypair.generate()

  // Get wallet address as base58 string
  const walletAddress = keypair.publicKey.toBase58()

  // Convert private key to string and encrypt it
  const privateKeyString = Buffer.from(keypair.secretKey).toString('base64')
  const encryptedPrivateKey = await encrypt(privateKeyString, encryptionKey)

  return {
    walletAddress,
    encryptedPrivateKey
  }
}

export async function decryptBurnWallet(encryptedPrivateKey: string, encryptionKey: string): Promise<Keypair> {
  // Decrypt the private key
  const privateKeyString = await decrypt(encryptedPrivateKey, encryptionKey)

  // Convert back to Uint8Array and create keypair
  const privateKeyBytes = Buffer.from(privateKeyString, 'base64')
  return Keypair.fromSecretKey(privateKeyBytes)
}
