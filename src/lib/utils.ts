import { cn } from './theme'

export { cn }

export function truncateAddress(address: string, startLength = 4, endLength = 4): string {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

export function formatTokenAmount(amount: number | string, decimals: number = 9): string {
  if (amount === 0 || amount === '0') return '0'

  // Convert string to number if needed
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  // For very large numbers, we want to avoid scientific notation
  const fullNumber = numericAmount.toFixed(decimals)

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

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumFractionDigits: 1
  }

  return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(value)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date)
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: unknown[]) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> {
  let inThrottle = false
  let lastResult: ReturnType<T>

  return function executedFunction(...args: Parameters<T>): ReturnType<T> {
    if (!inThrottle) {
      lastResult = func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }

    return lastResult
  }
}
