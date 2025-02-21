import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { TokenInfo } from '@/lib/types/burn'

// Constants for known DEX programs
const RAYDIUM_LP_PROGRAM_ID = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
const ORCA_LP_PROGRAM_ID = new PublicKey('9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP')

// Raydium pool layout
const RAYDIUM_POOL_LAYOUT = {
  baseTokenMint: 32, // offset for base token mint
  quoteTokenMint: 64, // offset for quote token mint
  lpMint: 96 // offset for LP token mint
}

// Orca pool layout
const ORCA_POOL_LAYOUT = {
  tokenAMint: 32, // offset for token A mint
  tokenBMint: 64, // offset for token B mint
  lpMint: 96 // offset for LP token mint
}

interface LPTokenInfo extends TokenInfo {
  isLPToken: boolean
  token0?: {
    mint: string
    symbol: string
  }
  token1?: {
    mint: string
    symbol: string
  }
  poolAddress?: string
}

interface ParsedTokenData {
  parsed: {
    info: {
      mint: string
      amount: string
      uiAmount: number
      symbol?: string
      name?: string
      decimals: number
    }
  }
}

/**
 * Checks if a token is an LP token by checking its metadata and program ID
 */
export async function isLPToken(connection: Connection, tokenMint: PublicKey): Promise<boolean> {
  try {
    const accountInfo = await connection.getParsedAccountInfo(tokenMint)
    if (!accountInfo.value) return false

    // Check if the token was created by known DEX programs
    const programId = accountInfo.value.owner
    return [RAYDIUM_LP_PROGRAM_ID.toString(), ORCA_LP_PROGRAM_ID.toString()].includes(programId.toString())
  } catch (error) {
    console.error('Error checking LP token:', error)
    return false
  }
}

/**
 * Gets token symbol from mint address
 */
async function getTokenSymbol(connection: Connection, mintAddress: PublicKey): Promise<string> {
  try {
    const mintAccountInfo = await connection.getParsedAccountInfo(mintAddress)
    if (mintAccountInfo.value && 'parsed' in mintAccountInfo.value.data) {
      const parsedData = mintAccountInfo.value.data as ParsedAccountData
      return parsedData.parsed.info.symbol || mintAddress.toString().slice(0, 6)
    }
    return mintAddress.toString().slice(0, 6)
  } catch (error) {
    console.error('Error getting token symbol:', error)
    return mintAddress.toString().slice(0, 6)
  }
}

/**
 * Fetches LP token metadata including the underlying tokens
 */
export async function getLPTokenMetadata(
  connection: Connection,
  tokenMint: PublicKey
): Promise<{ token0: string; token1: string; poolAddress: string } | null> {
  try {
    // Get the LP token account info
    const accountInfo = await connection.getParsedAccountInfo(tokenMint)
    if (!accountInfo.value) return null

    // For Raydium LP tokens
    if (accountInfo.value.owner.equals(RAYDIUM_LP_PROGRAM_ID)) {
      // Find the pool account that created this LP token
      const pools = await connection.getProgramAccounts(RAYDIUM_LP_PROGRAM_ID, {
        filters: [
          {
            memcmp: {
              offset: RAYDIUM_POOL_LAYOUT.lpMint,
              bytes: tokenMint.toBase58()
            }
          }
        ]
      })

      if (pools.length > 0) {
        const poolAccount = pools[0]
        const data = poolAccount.account.data

        // Extract token mints from pool data
        const token0Mint = new PublicKey(
          data.slice(RAYDIUM_POOL_LAYOUT.baseTokenMint, RAYDIUM_POOL_LAYOUT.baseTokenMint + 32)
        )
        const token1Mint = new PublicKey(
          data.slice(RAYDIUM_POOL_LAYOUT.quoteTokenMint, RAYDIUM_POOL_LAYOUT.quoteTokenMint + 32)
        )

        return {
          token0: token0Mint.toString(),
          token1: token1Mint.toString(),
          poolAddress: poolAccount.pubkey.toString()
        }
      }
    }

    // For Orca LP tokens
    if (accountInfo.value.owner.equals(ORCA_LP_PROGRAM_ID)) {
      // Find the pool account that created this LP token
      const pools = await connection.getProgramAccounts(ORCA_LP_PROGRAM_ID, {
        filters: [
          {
            memcmp: {
              offset: ORCA_POOL_LAYOUT.lpMint,
              bytes: tokenMint.toBase58()
            }
          }
        ]
      })

      if (pools.length > 0) {
        const poolAccount = pools[0]
        const data = poolAccount.account.data

        // Extract token mints from pool data
        const token0Mint = new PublicKey(data.slice(ORCA_POOL_LAYOUT.tokenAMint, ORCA_POOL_LAYOUT.tokenAMint + 32))
        const token1Mint = new PublicKey(data.slice(ORCA_POOL_LAYOUT.tokenBMint, ORCA_POOL_LAYOUT.tokenBMint + 32))

        return {
          token0: token0Mint.toString(),
          token1: token1Mint.toString(),
          poolAddress: poolAccount.pubkey.toString()
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching LP token metadata:', error)
    return null
  }
}

/**
 * Gets token information including LP token details if applicable
 */
export async function getTokenInfo(connection: Connection, tokenMint: PublicKey): Promise<LPTokenInfo | null> {
  try {
    // Get basic token info
    const accountInfo = await connection.getParsedAccountInfo(tokenMint)
    if (!accountInfo.value) return null

    const parsedData = (accountInfo.value.data as ParsedAccountData).parsed
    if (!parsedData) return null

    const isLP = await isLPToken(connection, tokenMint)
    let lpMetadata = null

    if (isLP) {
      lpMetadata = await getLPTokenMetadata(connection, tokenMint)
    }

    const tokenInfo: LPTokenInfo = {
      mint: tokenMint.toString(),
      symbol: parsedData.info.symbol || 'Unknown',
      name: parsedData.info.name || 'Unknown Token',
      decimals: parsedData.info.decimals,
      balance: 0, // This should be set by the caller
      uiAmount: 0, // This should be set by the caller
      isLPToken: isLP
    }

    if (isLP && lpMetadata) {
      // Get symbols for both tokens in the pair
      const token0Symbol = await getTokenSymbol(connection, new PublicKey(lpMetadata.token0))
      const token1Symbol = await getTokenSymbol(connection, new PublicKey(lpMetadata.token1))

      tokenInfo.token0 = {
        mint: lpMetadata.token0,
        symbol: token0Symbol
      }
      tokenInfo.token1 = {
        mint: lpMetadata.token1,
        symbol: token1Symbol
      }
      tokenInfo.poolAddress = lpMetadata.poolAddress
    }

    return tokenInfo
  } catch (error) {
    console.error('Error getting token info:', error)
    return null
  }
}

/**
 * Gets all tokens in a wallet including LP tokens
 */
export async function getWalletTokens(connection: Connection, walletAddress: PublicKey): Promise<LPTokenInfo[]> {
  try {
    const accounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      programId: TOKEN_PROGRAM_ID
    })

    const tokens: LPTokenInfo[] = []
    for (const { account } of accounts.value) {
      const parsedData = account.data as ParsedTokenData
      if (!parsedData.parsed) continue

      const tokenMint = new PublicKey(parsedData.parsed.info.mint)
      const tokenInfo = await getTokenInfo(connection, tokenMint)

      if (tokenInfo) {
        const { amount, uiAmount } = parsedData.parsed.info
        tokenInfo.balance = parseInt(amount)
        tokenInfo.uiAmount = uiAmount
        tokens.push(tokenInfo)
      }
    }

    return tokens
  } catch (error) {
    console.error('Error getting wallet tokens:', error)
    return []
  }
}
