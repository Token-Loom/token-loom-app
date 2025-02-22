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

  // Check user agent for mobile devices including foldables
  const userAgentCheck =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|SM-F|Fold/i.test(
      navigator.userAgent
    )

  // Check for touch support
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // Check screen characteristics
  const screenCheck = window.innerWidth <= 1024 || window.screen.width <= 1024

  // For foldable devices, check for specific features
  const foldableCheck =
    'windowSegments' in window || // Check for foldable-specific API
    // Samsung foldable detection
    /SM-F|Fold/i.test(navigator.userAgent) ||
    // Additional foldable checks
    ('screen' in window && 'orientation' in window.screen) ||
    // Check for multi-screen API
    'getWindowSegments' in window

  // Return true if any of these conditions are met
  return userAgentCheck || (touchSupport && screenCheck) || foldableCheck
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

  // Store current URL for redirect
  const currentUrl = window.location.href
  localStorage.setItem('phantom_redirect_url', currentUrl)

  // Try to detect if Phantom is installed
  const isPhantomInstalled = 'phantom' in window || document.querySelector('meta[name="phantom-deeplink"]')

  // For mobile web browser, create connection parameters
  const params = new URLSearchParams({
    app_url: window.location.origin,
    redirect_link: currentUrl,
    dapp_encryption_public_key: localStorage.getItem('phantom_dapp_public_key') || '',
    cluster: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
    app_identity: JSON.stringify({
      name: 'ControlledBurn',
      icon: `${window.location.origin}/logo.svg`,
      url: window.location.origin
    })
  })

  // Create the connection URL
  const phantomConnectUrl = `https://phantom.app/ul/v1/connect?${params.toString()}`

  // If Phantom is installed, try direct deep linking first
  if (isPhantomInstalled) {
    const deepLink = `phantom://ul/v1/connect?${params.toString()}`
    window.location.href = deepLink

    // Fallback to web URL after a short delay if deep link fails
    setTimeout(() => {
      if (document.visibilityState !== 'hidden') {
        window.location.href = phantomConnectUrl
      }
    }, 500)
  } else {
    // For devices without Phantom installed, use the browse endpoint
    const encodedUrl = encodeURIComponent(currentUrl)
    const webDeepLink = `https://phantom.app/ul/browse/${encodedUrl}?ref=${encodeURIComponent(phantomConnectUrl)}`
    window.location.href = webDeepLink
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
