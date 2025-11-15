import { type NextRequest, NextResponse } from "next/server"
import { encryptVitalData } from "@/lib/encryption"
import { storeVitals, createAlert, getPatient } from "@/lib/db"
import { classifyPatientCondition, shouldTriggerAlert, generateAlertMessage } from "@/lib/classification"
import { validateVitals } from "@/lib/vital-validator"

/**
 * Receives encrypted vital data from ambulance
 * POST /api/vitals/transmit
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { patientId, ambulanceId, heartRate, spo2, systolicBp, diastolicBp, temperature } = body

    // Validate required fields exist
    if (!patientId || !ambulanceId) {
      return NextResponse.json({ error: "Missing required fields: patientId and ambulanceId" }, { status: 400 })
    }

    if (
      heartRate === undefined ||
      spo2 === undefined ||
      systolicBp === undefined ||
      diastolicBp === undefined ||
      temperature === undefined
    ) {
      return NextResponse.json({ error: "Missing required vital fields" }, { status: 400 })
    }

    // Validate vital values are legitimate medical readings
    const validation = validateVitals({
      heartRate,
      spo2,
      systolicBp,
      diastolicBp,
      temperature,
    })

    if (!validation.isValid) {
      return NextResponse.json({ error: "Invalid vital readings", details: validation.errors }, { status: 400 })
    }

    // Classify patient condition based on vitals
    const classification = classifyPatientCondition({
      heartRate,
      spo2,
      systolicBp,
      diastolicBp,
      temperature,
    })

    // Encrypt the vital data - CRITICAL STEP
    const vitalDataToEncrypt = {
      patientId,
      ambulanceId,
      heartRate,
      spo2,
      systolicBp,
      diastolicBp,
      temperature,
      timestamp: new Date().toISOString(),
    }

    const encryptedData = encryptVitalData(vitalDataToEncrypt)

    // Store vitals in database with encrypted data
    const storedVital = await storeVitals({
      patientId,
      ambulanceId,
      heartRate,
      spo2,
      systolicBp,
      diastolicBp,
      temperature,
      status: classification.status,
      encryptedData, // Always store encrypted data
    })

    // If critical, create an alert
    if (shouldTriggerAlert(classification)) {
      const alertMessage = generateAlertMessage(classification.riskFactors)
      await createAlert({
        patientId,
        alertType: "CRITICAL_VITALS",
        alertLevel: "CRITICAL",
        message: alertMessage,
      })
    }

    // Get patient info for response
    const patient = await getPatient(patientId)

    return NextResponse.json(
      {
        success: true,
        message: "Vitals transmitted and encrypted successfully",
        vitalId: storedVital.id,
        classification,
        encrypted: true,
        patient: patient ? { name: patient.name, age: patient.age } : null,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error processing vital transmission:", error)
    return NextResponse.json(
      {
        error: "Failed to process vital data transmission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
