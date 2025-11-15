import { type NextRequest, NextResponse } from "next/server"
import { getAllPatientsWithVitals } from "@/lib/db"
import { decryptVitalData, isValidEncryptedFormat } from "@/lib/encryption"
import { classifyPatientCondition } from "@/lib/classification"

/**
 * Retrieves all patients with their latest vital readings
 * GET /api/patients/with-vitals
 */
export async function GET(request: NextRequest) {
  try {
    const patients = await getAllPatientsWithVitals()

    const enrichedPatients = patients.map((patient: any) => {
      let decryptedData = null
      let condition = "Stable"

      // Decrypt vital data if available
      if (patient.encrypted_data && isValidEncryptedFormat(patient.encrypted_data)) {
        try {
          decryptedData = decryptVitalData(patient.encrypted_data)
        } catch (error) {
          console.warn("Could not decrypt vital data for patient", patient.patient_id)
        }
      }

      // Classify condition
      if (patient.heart_rate !== null) {
        const vitalData = {
          heartRate: patient.heart_rate,
          spo2: patient.spo2,
          systolicBp: patient.systolic_bp,
          diastolicBp: patient.diastolic_bp,
          temperature: patient.temperature,
        }
        condition = classifyPatientCondition(vitalData).status
      }

      return {
        id: patient.patient_id,
        name: patient.name,
        age: patient.age,
        condition: patient.medical_condition,
        status: condition,
        vitals: {
          heartRate: patient.heart_rate,
          spo2: patient.spo2,
          systolicBp: patient.systolic_bp,
          diastolicBp: patient.diastolic_bp,
          temperature: patient.temperature,
          recordedAt: patient.recorded_at,
          encrypted: patient.encrypted_data ? true : false,
        },
        ambulanceId: patient.ambulance_id,
        vitalId: patient.vital_id,
      }
    })

    return NextResponse.json({
      success: true,
      patients: enrichedPatients,
      count: enrichedPatients.length,
    })
  } catch (error) {
    console.error("[v0] Error retrieving patients with vitals:", error)
    return NextResponse.json({ error: "Failed to retrieve patient data" }, { status: 500 })
  }
}
