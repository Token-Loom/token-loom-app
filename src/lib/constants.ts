import { PublicKey } from '@solana/web3.js'

// Token Program Constants
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
export const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

// UI Constants
export const TOAST_REMOVE_DELAY = 5000
export const TOAST_LIMIT = 3
export const TOKEN_REFRESH_INTERVAL = 30000 // 30 seconds

// Theme Constants
export const THEME = {
  colors: {
    primary: {
      default: 'neutral-950',
      dark: 'neutral-50'
    },
    secondary: {
      default: 'neutral-500',
      dark: 'neutral-400'
    },
    destructive: {
      default: 'red-500',
      dark: 'red-900'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  }
}

// API Constants
export const API_ENDPOINTS = {
  burn: '/api/burn',
  status: '/api/status',
  admin: '/api/admin'
}

// Error Messages
export const ERROR_MESSAGES = {
  NO_WALLET: 'No wallet connected',
  FETCH_FAILED: 'Failed to fetch data',
  BURN_FAILED: 'Failed to execute burn',
  INVALID_AMOUNT: 'Invalid amount specified',
  INSUFFICIENT_BALANCE: 'Insufficient token balance'
}
