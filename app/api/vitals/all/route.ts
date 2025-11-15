import { type NextRequest, NextResponse } from "next/server"
import { getAllLatestVitals } from "@/lib/db"
import { decryptVitalData, isValidEncryptedFormat } from "@/lib/encryption"

/**
 * Retrieves all latest vital readings for all patients (decrypted)
 * GET /api/vitals/all
 */
export async function GET(request: NextRequest) {
  try {
    const vitals = await getAllLatestVitals()

    // Decrypt all vital data
    const decryptedVitals = vitals.map((vital) => {
      let decryptedData = null
      if (vital.encrypted_data && isValidEncryptedFormat(vital.encrypted_data)) {
        try {
          decryptedData = decryptVitalData(vital.encrypted_data)
        } catch (error) {
          console.warn("Could not decrypt vital data for patient", vital.patient_id, ":", error)
        }
      }

      return {
        id: vital.id,
        patientId: vital.patient_id,
        ambulanceId: vital.ambulance_id,
        heartRate: vital.heart_rate,
        spo2: vital.spo2,
        systolicBp: vital.systolic_bp,
        diastolicBp: vital.diastolic_bp,
        temperature: vital.temperature,
        status: vital.status,
        recordedAt: vital.recorded_at,
        decrypted: decryptedData,
      }
    })

    return NextResponse.json({
      success: true,
      vitals: decryptedVitals,
      count: decryptedVitals.length,
    })
  } catch (error) {
    console.error("[v0] Error retrieving all vitals:", error)
    return NextResponse.json({ error: "Failed to retrieve vital data" }, { status: 500 })
  }
}
