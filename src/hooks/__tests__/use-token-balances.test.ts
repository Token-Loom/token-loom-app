import { renderHook, act } from '@testing-library/react'
import { useTokenBalances } from '../use-token-balances'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { getTokenMetadata } from '@/lib/solana/token-metadata'
import { PublicKey } from '@solana/web3.js'

// Mock the dependencies
jest.mock('@solana/wallet-adapter-react', () => ({
  useConnection: jest.fn(),
  useWallet: jest.fn()
}))

jest.mock('@/lib/solana/token-metadata', () => ({
  getTokenMetadata: jest.fn()
}))

describe('useTokenBalances', () => {
  const mockConnection = {
    getParsedTokenAccountsByOwner: jest.fn(),
    rpcEndpoint: 'https://api.mainnet-beta.solana.com'
  }

  const mockPublicKey = new PublicKey('5KKsLVU6TcbVDK4BS6K1QRksGJaCjZmY8JLjCHYKHRF')

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useConnection as jest.Mock).mockReturnValue({ connection: mockConnection })
    ;(useWallet as jest.Mock).mockReturnValue({ publicKey: mockPublicKey })
  })

  it('should return empty tokens array when wallet is not connected', async () => {
    ;(useWallet as jest.Mock).mockReturnValue({ publicKey: null })

    const { result } = renderHook(() => useTokenBalances())

    expect(result.current.tokens).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should fetch and format token balances correctly', async () => {
    const mockTokenAccounts = {
      value: [
        {
          account: {
            data: {
              parsed: {
                info: {
                  mint: '5KKsLVU6TcbVDK4BS6K1QRksGJaCjZmY8JLjCHYKHRF',
                  tokenAmount: {
                    amount: '1000000000',
                    decimals: 9,
                    uiAmount: 1
                  }
                }
              }
            }
          }
        }
      ]
    }

    const mockMetadata = {
      symbol: 'TEST',
      name: 'Test Token'
    }

    mockConnection.getParsedTokenAccountsByOwner.mockResolvedValue(mockTokenAccounts)
    ;(getTokenMetadata as jest.Mock).mockResolvedValue(mockMetadata)

    const { result } = renderHook(() => useTokenBalances())

    // Wait for the initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.tokens).toEqual([
      {
        mint: '5KKsLVU6TcbVDK4BS6K1QRksGJaCjZmY8JLjCHYKHRF',
        symbol: 'TEST',
        name: 'Test Token',
        balance: 1000000000,
        decimals: 9,
        uiAmount: 1
      }
    ])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle metadata fetch failure gracefully', async () => {
    const mockTokenAccounts = {
      value: [
        {
          account: {
            data: {
              parsed: {
                info: {
                  mint: '5KKsLVU6TcbVDK4BS6K1QRksGJaCjZmY8JLjCHYKHRF',
                  tokenAmount: {
                    amount: '1000000000',
                    decimals: 9,
                    uiAmount: 1
                  }
                }
              }
            }
          }
        }
      ]
    }

    mockConnection.getParsedTokenAccountsByOwner.mockResolvedValue(mockTokenAccounts)
    ;(getTokenMetadata as jest.Mock).mockRejectedValue(new Error('Metadata fetch failed'))

    const { result } = renderHook(() => useTokenBalances())

    // Wait for the initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.tokens).toEqual([
      {
        mint: '5KKsLVU6TcbVDK4BS6K1QRksGJaCjZmY8JLjCHYKHRF',
        symbol: '5KKs',
        name: 'Token 5KKs',
        balance: 1000000000,
        decimals: 9,
        uiAmount: 1
      }
    ])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle token fetch failure', async () => {
    const mockError = new Error('Failed to fetch tokens')
    mockConnection.getParsedTokenAccountsByOwner.mockRejectedValue(mockError)

    const { result } = renderHook(() => useTokenBalances())

    // Wait for the initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.tokens).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Failed to fetch tokens')
  })

  it('should refetch tokens when refetch is called', async () => {
    const { result } = renderHook(() => useTokenBalances())

    await act(async () => {
      result.current.refetch()
    })

    expect(mockConnection.getParsedTokenAccountsByOwner).toHaveBeenCalledTimes(2) // Initial fetch + refetch
  })

  it('should set up and clean up interval correctly', () => {
    jest.useFakeTimers()

    const { unmount } = renderHook(() => useTokenBalances())

    expect(mockConnection.getParsedTokenAccountsByOwner).toHaveBeenCalledTimes(1) // Initial fetch

    // Fast forward 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    expect(mockConnection.getParsedTokenAccountsByOwner).toHaveBeenCalledTimes(2) // After interval

    unmount()

    // Fast forward another 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    // Should not have been called again after unmount
    expect(mockConnection.getParsedTokenAccountsByOwner).toHaveBeenCalledTimes(2)

    jest.useRealTimers()
  })
})
