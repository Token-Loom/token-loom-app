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
  // On mobile, we'll always use deep linking
  if (isMobileDevice()) return true
  // On desktop, check for the injected provider
  const provider = window.phantom?.solana
  const hasProvider = provider?.isPhantom || false
  console.log('Phantom check:', {
    isMobile: isMobileDevice(),
    hasPhantom: 'phantom' in window,
    hasProvider: !!provider,
    isPhantom: provider?.isPhantom
  })
  return hasProvider
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
  // On mobile, we don't expect a provider
  if (isMobileDevice()) return null
  console.log('Getting provider:', {
    isMobile: isMobileDevice(),
    hasPhantom: 'phantom' in window,
    provider: window.phantom?.solana
  })
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

  // For mobile web browser flow, we need to encode the entire URL
  const currentUrl = window.location.href
  const encodedUrl = encodeURIComponent(currentUrl)

  // Construct URL exactly as shown in documentation
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    redirect_link: currentUrl,
    app_url: window.location.origin,
    cluster: 'mainnet-beta'
  })

  // For mobile web browser, we need to use a special format
  const phantomUrl = `https://phantom.app/ul/v1/connect?${params.toString()}`

  // Check if we're already in the Phantom in-app browser
  const isPhantomInAppBrowser = window.navigator.userAgent.includes('PhantomBrowser')

  if (isPhantomInAppBrowser) {
    // If we're in Phantom's browser, redirect directly back to the app
    window.location.href = currentUrl
  } else {
    // If we're in the regular browser, use the deep link
    const deepLink = `https://phantom.app/ul/browse/${encodedUrl}?ref=${encodeURIComponent(phantomUrl)}`
    window.location.href = deepLink
  }
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

    return {
      publicKey: decodedData.public_key,
      session: decodedData.session
    }
  } catch (error) {
    onDebug?.(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return null
  }
}
