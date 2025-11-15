import { NextResponse } from "next/server"
import { getActiveAlerts } from "@/lib/db"

/**
 * Retrieves all active (unacknowledged) alerts
 * GET /api/alerts/active
 */
export async function GET() {
  try {
    const alerts = await getActiveAlerts()

    return NextResponse.json({
      success: true,
      alerts: alerts.map((alert: any) => ({
        id: alert.id,
        patientId: alert.patient_id,
        alertType: alert.alert_type,
        alertLevel: alert.alert_level,
        message: alert.message,
        isAcknowledged: alert.is_acknowledged,
        createdAt: alert.created_at,
      })),
      count: alerts.length,
    })
  } catch (error) {
    console.error("Error retrieving alerts:", error)
    return NextResponse.json({ error: "Failed to retrieve alerts" }, { status: 500 })
  }
}
