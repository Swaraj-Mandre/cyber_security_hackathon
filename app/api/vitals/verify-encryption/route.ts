import { type NextRequest, NextResponse } from "next/server"
import { getLatestVitals } from "@/lib/db"
import { decryptVitalData, isValidEncryptedFormat } from "@/lib/encryption"

/**
 * Verifies that vital data is encrypted in the database
 * GET /api/vitals/verify-encryption?patientId=PAT001
 * Shows both encrypted and decrypted data for verification
 */
export async function GET(request: NextRequest) {
  try {
    const patientId = request.nextUrl.searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const vital = await getLatestVitals(patientId)

    if (!vital) {
      return NextResponse.json({ error: "No vital data found for this patient" }, { status: 404 })
    }

    // Check if encrypted data exists
    const isEncrypted = vital.encrypted_data && isValidEncryptedFormat(vital.encrypted_data)

    if (!isEncrypted) {
      return NextResponse.json(
        {
          success: false,
          message: "Data is NOT encrypted in database",
          vital: {
            id: vital.id,
            patientId: vital.patient_id,
            encrypted: false,
          },
        },
        { status: 200 },
      )
    }

    // Decrypt to verify
    let decryptedData = null
    try {
      decryptedData = decryptVitalData(vital.encrypted_data)
    } catch (error) {
      console.error("[v0] Decryption failed:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Data is encrypted but decryption failed",
          vital: {
            id: vital.id,
            patientId: vital.patient_id,
            encrypted: true,
            encryptedDataSample: vital.encrypted_data.substring(0, 100) + "...",
          },
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data is ENCRYPTED and successfully decrypted",
        vital: {
          id: vital.id,
          patientId: vital.patient_id,
          ambulanceId: vital.ambulance_id,
          status: vital.status,
          recordedAt: vital.recorded_at,
          encrypted: true,
          encryptedDataSample: vital.encrypted_data.substring(0, 100) + "...",
          decryptedData: decryptedData,
          plainTextVitals: {
            heartRate: vital.heart_rate,
            spo2: vital.spo2,
            systolicBp: vital.systolic_bp,
            diastolicBp: vital.diastolic_bp,
            temperature: vital.temperature,
          },
          verification: {
            dataMatchesEncrypted: JSON.stringify(decryptedData) === JSON.stringify(vital),
            encryptionFormat: "AES-256-GCM",
            integrity: "Verified via authentication tag",
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify encryption", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
