import { truncateAddress, formatTokenAmount, formatNumber, formatDuration } from '../utils'

describe('truncateAddress', () => {
  it('should truncate a long address correctly', () => {
    const address = '5KKsLVU6TcbVDK4BS6K1QRksGJaCjZmY8JLjCHYKHRF'
    const truncated = truncateAddress(address)
    expect(truncated).toBe('5KKs...KHRF')
  })

  it('should handle empty string', () => {
    expect(truncateAddress('')).toBe('')
  })

  it('should handle short addresses', () => {
    expect(truncateAddress('12345')).toBe('12345')
  })

  it('should handle custom lengths', () => {
    const address = '5KKsLVU6TcbVDK4BS6K1QRksGJaCjZmY8JLjCHYKHRF'
    expect(truncateAddress(address, 6, 8)).toBe('5KKsLV...jCHYKHRF')
  })
})

describe('formatTokenAmount', () => {
  it('should format zero correctly', () => {
    expect(formatTokenAmount(0)).toBe('0')
  })

  it('should format whole numbers with commas', () => {
    expect(formatTokenAmount(1000000)).toBe('1,000,000')
  })

  it('should handle decimals correctly', () => {
    expect(formatTokenAmount(1234.5678, 4)).toBe('1,234.5678')
  })

  it('should trim trailing zeros in decimals', () => {
    expect(formatTokenAmount(1234.5, 4)).toBe('1,234.5')
  })
})

describe('formatNumber', () => {
  it('should format numbers in compact notation by default', () => {
    expect(formatNumber(1234567)).toBe('1.2M')
  })

  it('should respect custom format options', () => {
    expect(formatNumber(1234.567, { maximumFractionDigits: 2, notation: 'standard' })).toBe('1,234.57')
  })
})

describe('formatDuration', () => {
  it('should format seconds correctly', () => {
    expect(formatDuration(45000)).toBe('45s')
  })

  it('should format minutes and seconds correctly', () => {
    expect(formatDuration(125000)).toBe('2m 5s')
  })

  it('should format hours and minutes correctly', () => {
    expect(formatDuration(3665000)).toBe('1h 1m')
  })

  it('should format days and hours correctly', () => {
    expect(formatDuration(90000000)).toBe('1d 1h')
  })
})
