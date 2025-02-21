import { Connection, PublicKey } from '@solana/web3.js'

const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

export interface TokenMetadata {
  name: string
  symbol: string
  uri?: string
}

export async function getTokenMetadata(connection: Connection, mint: PublicKey): Promise<TokenMetadata | null> {
  try {
    const pda = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      METADATA_PROGRAM_ID
    )[0]

    const account = await connection.getAccountInfo(pda)
    if (!account) return null

    // First 1 byte is version, next 32 bytes are update authority
    const name = extractString(account.data, 33, 32)
    const symbol = extractString(account.data, 65, 10)
    const uri = extractString(account.data, 75, 200)

    return { name, symbol, uri }
  } catch {
    // Return null if metadata doesn't exist or there's an error
    return null
  }
}

function extractString(data: Buffer, offset: number, length: number): string {
  const slice = data.slice(offset, offset + length)
  const nullIndex = slice.indexOf(0)
  return slice.slice(0, nullIndex >= 0 ? nullIndex : undefined).toString('utf8')
}
