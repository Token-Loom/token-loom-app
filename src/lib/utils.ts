import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, startLength = 4, endLength = 4): string {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

export function formatTokenAmount(amount: number, decimals: number = 9): string {
  if (amount === 0) return '0'

  // For very large numbers, we want to avoid scientific notation
  const fullNumber = amount.toFixed(decimals)

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = fullNumber.split('.')

  // Format integer part with commas
  const formattedInteger = parseInt(integerPart).toLocaleString('en-US')

  // If there's a decimal part, trim trailing zeros and append
  if (decimalPart) {
    const trimmedDecimal = decimalPart.replace(/0+$/, '')
    if (trimmedDecimal) {
      return `${formattedInteger}.${trimmedDecimal}`
    }
  }

  return formattedInteger
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toString()
}
