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
  if ('phantom' in window) {
    const provider = window.phantom?.solana
    if (provider?.isPhantom) {
      return provider
    }
  }
  return null
}

// Function to handle mobile wallet connection
export const connectPhantomMobile = () => {
  if (typeof window === 'undefined') return

  // Generate a new keypair for this connection
  const dappKeyPair = nacl.box.keyPair()

  // Save keypair to local storage for retrieving after redirect
  localStorage.setItem(
    'phantom_keypair',
    JSON.stringify({
      publicKey: Buffer.from(dappKeyPair.publicKey).toString('hex'),
      secretKey: Buffer.from(dappKeyPair.secretKey).toString('hex')
    })
  )

  // Store the current URL for redirect
  localStorage.setItem('phantom_redirect_url', window.location.href)

  // For mobile web browser flow, we need to construct the URL differently
  const phantomConnectUrl = new URL('https://phantom.app/ul/v1/connect')
  phantomConnectUrl.searchParams.append('app_url', window.location.origin)
  phantomConnectUrl.searchParams.append('dapp_encryption_public_key', bs58.encode(dappKeyPair.publicKey))
  phantomConnectUrl.searchParams.append('redirect_url', window.location.href)
  phantomConnectUrl.searchParams.append('cluster', 'mainnet-beta')

  console.log('Connecting with URL:', phantomConnectUrl.toString())

  // For mobile browsers, we need to use window.location.href
  window.location.href = phantomConnectUrl.toString()
}

interface PhantomResponseData {
  public_key: string
  session: string
}

// Function to handle the connection response from Phantom
export const handlePhantomResponse = (
  url: string,
  onDebug?: (message: string) => void
): { publicKey: string; session: string } | null => {
  try {
    onDebug?.('Handling response URL')
    onDebug?.(`Full URL: ${url}`)

    // Check if we have a stored redirect URL
    const storedRedirectUrl = localStorage.getItem('phantom_redirect_url')
    onDebug?.(`Stored redirect URL: ${storedRedirectUrl}`)

    const urlParams = new URLSearchParams(new URL(url).search)

    // Log all parameters except sensitive data
    const params = Object.fromEntries(urlParams.entries())
    onDebug?.(`Parameters: ${Object.keys(params).join(', ')}`)

    const data = urlParams.get('data')
    const nonce = urlParams.get('nonce')
    const phantomEncryptionPublicKey = urlParams.get('phantom_encryption_public_key')

    // Check for error response
    if (urlParams.get('errorCode')) {
      const errorMessage = urlParams.get('errorMessage')
      onDebug?.(`Error: ${errorMessage}`)
      throw new Error(errorMessage || 'Unknown error')
    }

    if (!data || !nonce || !phantomEncryptionPublicKey) {
      onDebug?.('Missing required parameters')
      onDebug?.(`data: ${!!data}, nonce: ${!!nonce}, phantom_key: ${!!phantomEncryptionPublicKey}`)
      throw new Error('Missing required parameters')
    }

    // Retrieve our keypair from local storage
    const keypairString = localStorage.getItem('phantom_keypair')
    if (!keypairString) {
      onDebug?.('No keypair in storage')
      throw new Error('No keypair found in storage')
    }

    const keypair = JSON.parse(keypairString)
    onDebug?.('Retrieved keypair')

    const dappSecretKey = new Uint8Array(Buffer.from(keypair.secretKey, 'hex'))

    // Create shared secret
    const sharedSecretDapp = nacl.box.before(bs58.decode(phantomEncryptionPublicKey), dappSecretKey)
    onDebug?.('Created shared secret')

    // Decrypt the data
    const decryptedData = nacl.box.open.after(bs58.decode(data), bs58.decode(nonce), sharedSecretDapp)
    if (!decryptedData) {
      onDebug?.('Failed to decrypt data')
      throw new Error('Unable to decrypt data')
    }
    onDebug?.('Decrypted data successfully')

    // Parse the decrypted data
    const decodedData = JSON.parse(Buffer.from(decryptedData).toString('utf8')) as PhantomResponseData
    onDebug?.('Parsed response data')

    // Clean up storage
    localStorage.removeItem('phantom_keypair')
    localStorage.removeItem('phantom_redirect_url')

    return {
      publicKey: decodedData.public_key,
      session: decodedData.session
    }
  } catch (error) {
    onDebug?.(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return null
  }
}
