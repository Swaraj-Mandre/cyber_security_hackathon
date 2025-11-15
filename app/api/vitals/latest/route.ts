import { type NextRequest, NextResponse } from "next/server"
import { getLatestVitals } from "@/lib/db"
import { decryptVitalData, isValidEncryptedFormat } from "@/lib/encryption"

/**
 * Retrieves the latest vital readings for a patient (decrypted)
 * GET /api/vitals/latest?patientId=PAT001
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

    // Decrypt if encrypted data exists
    let decryptedData = null
    if (vital.encrypted_data && isValidEncryptedFormat(vital.encrypted_data)) {
      try {
        decryptedData = decryptVitalData(vital.encrypted_data)
      } catch (error) {
        console.warn("Could not decrypt vital data:", error)
      }
    }

    return NextResponse.json({
      success: true,
      vital: {
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
      },
    })
  } catch (error) {
    console.error("Error retrieving vital data:", error)
    return NextResponse.json({ error: "Failed to retrieve vital data" }, { status: 500 })
  }
}
