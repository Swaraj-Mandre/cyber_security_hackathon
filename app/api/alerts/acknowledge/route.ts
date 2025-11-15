import { type NextRequest, NextResponse } from "next/server"
import { acknowledgeAlert } from "@/lib/db"

/**
 * Acknowledges an alert
 * POST /api/alerts/acknowledge
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, acknowledgedBy } = body

    if (!alertId || !acknowledgedBy) {
      return NextResponse.json({ error: "Alert ID and acknowledged by are required" }, { status: 400 })
    }

    const updatedAlert = await acknowledgeAlert(alertId, acknowledgedBy)

    return NextResponse.json({
      success: true,
      message: "Alert acknowledged",
      alert: updatedAlert,
    })
  } catch (error) {
    console.error("Error acknowledging alert:", error)
    return NextResponse.json({ error: "Failed to acknowledge alert" }, { status: 500 })
  }
}
