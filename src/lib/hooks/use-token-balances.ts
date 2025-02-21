'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useCallback, useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { getTokenMetadata } from '@/lib/solana/token-metadata'
import { TokenInfo } from '@/types'

export function useTokenBalances() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTokens = useCallback(async () => {
    if (!publicKey) {
      setTokens([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      })

      const nonZeroAccounts = accounts.value.filter(
        account => Number(account.account.data.parsed.info.tokenAmount.amount) > 0
      )

      const tokenPromises = nonZeroAccounts.map(async account => {
        const parsedInfo = account.account.data.parsed.info
        const mintPubkey = new PublicKey(parsedInfo.mint)

        try {
          const metadata = await getTokenMetadata(connection, mintPubkey)

          return {
            mint: parsedInfo.mint,
            symbol: metadata?.symbol || parsedInfo.mint.slice(0, 4),
            name: metadata?.name || `Token ${parsedInfo.mint.slice(0, 4)}`,
            balance: Number(parsedInfo.tokenAmount.amount),
            decimals: parsedInfo.tokenAmount.decimals,
            uiAmount: Number(parsedInfo.tokenAmount.uiAmount)
          }
        } catch {
          // If metadata fetch fails, return token with minimal info
          return {
            mint: parsedInfo.mint,
            symbol: parsedInfo.mint.slice(0, 4),
            name: `Token ${parsedInfo.mint.slice(0, 4)}`,
            balance: Number(parsedInfo.tokenAmount.amount),
            decimals: parsedInfo.tokenAmount.decimals,
            uiAmount: Number(parsedInfo.tokenAmount.uiAmount)
          }
        }
      })

      const tokenList = await Promise.all(tokenPromises)
      setTokens(tokenList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch token balances')
    } finally {
      setIsLoading(false)
    }
  }, [connection, publicKey])

  useEffect(() => {
    setTokens([])
    fetchTokens()

    const interval = setInterval(fetchTokens, 30000)
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
