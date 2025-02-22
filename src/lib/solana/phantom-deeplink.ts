// Base URL for Phantom deep links
const PHANTOM_DEEPLINK_BASE_URL = 'https://phantom.app/ul'

interface PhantomProvider {
  isPhantom?: boolean
  solana?: {
    isPhantom: boolean
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
export const getPhantomProvider = () => {
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

  const params: Record<string, string> = {
    app_url: window.location.origin,
    redirect_url: window.location.href,
    cluster: 'mainnet-beta'
  }

  const deepLink = buildPhantomDeepLink('connect', params)
  window.location.href = deepLink
}
