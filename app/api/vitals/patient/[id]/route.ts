import { type NextRequest, NextResponse } from "next/server"
import { getRecentVitals } from "@/lib/db"
import { decryptVitalData, isValidEncryptedFormat } from "@/lib/encryption"

/**
 * Retrieves recent vital readings for a specific patient
 * GET /api/vitals/patient/[id]?limit=20
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id
    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || "20", 10)

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const vitals = await getRecentVitals(patientId, 120) // Last 2 hours

    const decryptedVitals = vitals.slice(-limit).map((vital: any) => {
      let decryptedData = null
      if (vital.encrypted_data && isValidEncryptedFormat(vital.encrypted_data)) {
        try {
          decryptedData = decryptVitalData(vital.encrypted_data)
        } catch (error) {
          console.warn("Could not decrypt vital data")
        }
      }

      return {
        id: vital.id,
        heartRate: vital.heart_rate,
        spo2: vital.spo2,
        systolicBp: vital.systolic_bp,
        diastolicBp: vital.diastolic_bp,
        temperature: vital.temperature,
        status: vital.status,
        recordedAt: vital.recorded_at,
      }
    })

    return NextResponse.json({
      success: true,
      vitals: decryptedVitals,
      count: decryptedVitals.length,
    })
  } catch (error) {
    console.error("Error retrieving patient vitals:", error)
    return NextResponse.json({ error: "Failed to retrieve vital data" }, { status: 500 })
  }
}
