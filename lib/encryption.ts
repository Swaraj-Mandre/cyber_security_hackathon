import crypto from "crypto"

// Generate a key from environment variable or create a default one
const getEncryptionKey = (): Buffer => {
  const keyEnv = process.env.ENCRYPTION_KEY
  if (!keyEnv) {
    throw new Error("ENCRYPTION_KEY environment variable is not set")
  }
  // Ensure the key is exactly 32 bytes (256 bits) for AES-256
  const key = crypto.scryptSync(keyEnv, "salt", 32)
  return key
}

/**
 * Encrypts vital data using AES-256-GCM
 * @param data - Plain text data to encrypt
 * @returns Encrypted data in format: iv:encryptedData:authTag (all base64)
 */
export function encryptVitalData(data: Record<string, any>): string {
  try {
    const key = getEncryptionKey()
    const plaintext = JSON.stringify(data)

    // Generate a random IV (Initialization Vector)
    const iv = crypto.randomBytes(16)

    // Create cipher
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)

    // Encrypt the data
    let encryptedData = cipher.update(plaintext, "utf8", "hex")
    encryptedData += cipher.final("hex")

    // Get authentication tag
    const authTag = cipher.getAuthTag()

    // Return combined format: iv:encryptedData:authTag (all in base64 for safe transmission)
    const result = `${iv.toString("base64")}:${encryptedData}:${authTag.toString("base64")}`
    return result
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt vital data")
  }
}

/**
 * Decrypts vital data encrypted with encryptVitalData
 * @param encryptedString - Encrypted data in format: iv:encryptedData:authTag
 * @returns Decrypted data as parsed object
 */
export function decryptVitalData(encryptedString: string): Record<string, any> {
  try {
    const key = getEncryptionKey()
    const parts = encryptedString.split(":")

    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format")
    }

    const iv = Buffer.from(parts[0], "base64")
    const encryptedData = parts[1]
    const authTag = Buffer.from(parts[2], "base64")

    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(authTag)

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return JSON.parse(decrypted)
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt vital data")
  }
}

/**
 * Validates encrypted data integrity
 * @param encryptedString - Encrypted data to validate
 * @returns true if valid format, false otherwise
 */
export function isValidEncryptedFormat(encryptedString: string): boolean {
  try {
    const parts = encryptedString.split(":")
    if (parts.length !== 3) return false

    // Try to decode base64 parts
    Buffer.from(parts[0], "base64")
    Buffer.from(parts[2], "base64")

    return true
  } catch {
    return false
  }
}
