import { Connection, PublicKey } from '@solana/web3.js'

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

export async function getTokenMetadata(connection: Connection, mint: PublicKey) {
  try {
    const [metadataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    )

    const accountInfo = await connection.getAccountInfo(metadataPda)
    if (!accountInfo) return null

    // Skip the first byte (it's a version number)
    const buffer = accountInfo.data.slice(1)
    const metadata = decodeMetadata(buffer)

    return {
      name: metadata.name.replace(/\0/g, ''),
      symbol: metadata.symbol.replace(/\0/g, ''),
      uri: metadata.uri.replace(/\0/g, '')
    }
  } catch (error) {
    console.error('Error fetching token metadata:', error)
    return null
  }
}

// Minimal metadata decoder for our needs
function decodeMetadata(buffer: Buffer) {
  let offset = 0

  // Skip update authority (32 bytes)
  offset += 32

  // Skip mint (32 bytes)
  offset += 32

  // Read name string
  const nameLen = buffer.readUInt32LE(offset)
  offset += 4
  const name = buffer.slice(offset, offset + nameLen).toString('utf8')
  offset += nameLen

  // Read symbol string
  const symbolLen = buffer.readUInt32LE(offset)
  offset += 4
  const symbol = buffer.slice(offset, offset + symbolLen).toString('utf8')
  offset += symbolLen

  // Read uri string
  const uriLen = buffer.readUInt32LE(offset)
  offset += 4
  const uri = buffer.slice(offset, offset + uriLen).toString('utf8')

  return { name, symbol, uri }
}
