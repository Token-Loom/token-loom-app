import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

export async function encrypt(data: string, key: string): Promise<string> {
  // Create a random IV
  const iv = randomBytes(IV_LENGTH)

  // Create cipher
  const cipher = createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv)

  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  // Get auth tag
  const authTag = cipher.getAuthTag()

  // Combine IV, encrypted data, and auth tag
  const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'base64')])

  // Return as base64 string
  return combined.toString('base64')
}

export async function decrypt(encryptedData: string, key: string): Promise<string> {
  // Convert combined data back to buffer
  const combined = Buffer.from(encryptedData, 'base64')

  // Extract IV, auth tag, and encrypted data
  const iv = combined.subarray(0, IV_LENGTH)
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH)

  // Create decipher
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv)
  decipher.setAuthTag(authTag)

  // Decrypt the data
  let decrypted = decipher.update(encrypted)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  // Return as utf8 string
  return decrypted.toString('utf8')
}
