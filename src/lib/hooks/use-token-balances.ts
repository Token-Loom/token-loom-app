'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import type { TokenInfo } from '@/lib/types/burn'
import { getTokenMetadata } from '@/lib/solana/token-metadata'

export function useTokenBalances() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTokens = useCallback(async () => {
    if (!publicKey) {
      console.log('No wallet connected')
      setTokens([])
      return
    }

    try {
      console.log('Fetching tokens for wallet:', publicKey.toString())
      setIsLoading(true)
      setError(null)

      const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID
      })

      console.log('Found token accounts:', accounts.value.length)

      // Filter accounts with non-zero balance first
      const nonZeroAccounts = accounts.value.filter(
        account => Number(account.account.data.parsed.info.tokenAmount.amount) > 0
      )

      console.log('Non-zero balance accounts:', nonZeroAccounts.length)

      // Then fetch metadata for filtered accounts
      const tokenPromises = nonZeroAccounts.map(async account => {
        const parsedInfo = account.account.data.parsed.info
        console.log('Processing token:', parsedInfo.mint, 'Balance:', parsedInfo.tokenAmount.amount)

        const mintPubkey = new PublicKey(parsedInfo.mint)
        const metadata = await getTokenMetadata(connection, mintPubkey)
        console.log('Metadata for token:', parsedInfo.mint, metadata)

        return {
          mint: parsedInfo.mint,
          symbol: metadata?.symbol || parsedInfo.mint.slice(0, 4),
          name: metadata?.name || `Token ${parsedInfo.mint.slice(0, 4)}`,
          balance: Number(parsedInfo.tokenAmount.amount),
          decimals: parsedInfo.tokenAmount.decimals,
          uiAmount: Number(parsedInfo.tokenAmount.uiAmount)
        }
      })

      const tokenList = await Promise.all(tokenPromises)
      console.log('Final token list:', tokenList)
      setTokens(tokenList)
    } catch (err) {
      console.error('Error fetching token balances:', err)
      setError('Failed to fetch token balances')
    } finally {
      setIsLoading(false)
    }
  }, [connection, publicKey])

  useEffect(() => {
    // Clear tokens when network changes
    setTokens([])
    // Fetch tokens
    fetchTokens()
    // Set up interval to refresh token balances
    const interval = setInterval(fetchTokens, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [fetchTokens, connection.rpcEndpoint])

  const refetch = useCallback(() => {
    fetchTokens()
  }, [fetchTokens])

  return {
    tokens,
    isLoading,
    error,
    refetch
  }
}
