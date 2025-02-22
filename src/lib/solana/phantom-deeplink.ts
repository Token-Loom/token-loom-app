import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { Buffer } from 'buffer'
import { PublicKey, Transaction } from '@solana/web3.js'

// Base URL for Phantom deep links
const PHANTOM_DEEPLINK_BASE_URL = 'https://phantom.app/ul'

interface PhantomProvider {
  isPhantom?: boolean
  publicKey?: PublicKey
  isConnected?: boolean
  signTransaction?: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  solana?: {
    isPhantom: boolean
    connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>
    disconnect: () => Promise<void>
  }
}

declare global {
  interface Window {
    phantom?: PhantomProvider
    solana?: PhantomProvider['solana']
  }
}

// Function to check if Phantom wallet is available
export const checkForPhantom = (): boolean => {
  if (typeof window === 'undefined') return false
  const provider = window.phantom?.solana
  return provider?.isPhantom || false
}

// Function to check if we're on a mobile device
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Function to build a Phantom deep link URL
export const buildPhantomDeepLink = (path: string, params: Record<string, string>): string => {
  const searchParams = new URLSearchParams(params)
  return `${PHANTOM_DEEPLINK_BASE_URL}/${path}?${searchParams.toString()}`
}

// Function to get the Phantom provider
export const getPhantomProvider = (): PhantomProvider['solana'] | null => {
  if (typeof window === 'undefined') return null

  // Check for Phantom provider in window.phantom
  if ('phantom' in window) {
    const provider = window.phantom?.solana
    if (provider?.isPhantom) {
      return provider
    }
  }

  // Check for Solana provider in window.solana
  if (window.solana?.isPhantom) {
    return window.solana
  }

  return null
}

// Function to handle mobile wallet connection
export const connectPhantomMobile = () => {
  if (typeof window === 'undefined') return

  // Check if Phantom is installed
  const phantomProvider = getPhantomProvider()
  if (phantomProvider) {
    // If Phantom is installed, use the provider directly
    phantomProvider.connect().catch(error => console.error('Error connecting to Phantom:', error))
    return
  }

  // If Phantom is not installed, use deep linking
  // Generate a new keypair for this connection
  const dappKeyPair = nacl.box.keyPair()

  // Save keypair to session storage for retrieving after redirect
  sessionStorage.setItem(
    'phantom_keypair',
    JSON.stringify({
      publicKey: Buffer.from(dappKeyPair.publicKey).toString('hex'),
      secretKey: Buffer.from(dappKeyPair.secretKey).toString('hex')
    })
  )

  const params: Record<string, string> = {
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    redirect_link: window.location.href,
    app_url: window.location.origin,
    cluster: 'mainnet-beta'
  }

  // Build the URL with the proper format for mobile deep linking
  const urlParams = new URLSearchParams(params)
  const url = `${PHANTOM_DEEPLINK_BASE_URL}/connect?${urlParams.toString()}`

  // For mobile browsers, we need to use window.location.href
  window.location.href = url
}

interface PhantomResponseData {
  public_key: string
  session: string
}

// Function to handle the connection response from Phantom
export const handlePhantomResponse = (url: string): { publicKey: string; session: string } | null => {
  try {
    const urlParams = new URLSearchParams(new URL(url).search)
    const data = urlParams.get('data')
    const nonce = urlParams.get('nonce')
    const phantomEncryptionPublicKey = urlParams.get('phantom_encryption_public_key')

    // Check for error response
    if (urlParams.get('errorCode')) {
      throw new Error(urlParams.get('errorMessage') || 'Unknown error')
    }

    if (!data || !nonce || !phantomEncryptionPublicKey) {
      throw new Error('Missing required parameters')
    }

    // Retrieve our keypair from session storage
    const keypairString = sessionStorage.getItem('phantom_keypair')
    if (!keypairString) {
      throw new Error('No keypair found in session storage')
    }

    const keypair = JSON.parse(keypairString)
    const dappSecretKey = new Uint8Array(Buffer.from(keypair.secretKey, 'hex'))

    // Create shared secret
    const sharedSecretDapp = nacl.box.before(bs58.decode(phantomEncryptionPublicKey), dappSecretKey)

    // Decrypt the data
    const decryptedData = nacl.box.open.after(bs58.decode(data), bs58.decode(nonce), sharedSecretDapp)

    if (!decryptedData) {
      throw new Error('Unable to decrypt data')
    }

    // Parse the decrypted data
    const decodedData = JSON.parse(Buffer.from(decryptedData).toString('utf8')) as PhantomResponseData

    // Clean up session storage
    sessionStorage.removeItem('phantom_keypair')

    return {
      publicKey: decodedData.public_key,
      session: decodedData.session
    }
  } catch (error) {
    console.error('Error handling Phantom response:', error)
    return null
  }
}
