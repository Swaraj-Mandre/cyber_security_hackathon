"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AlertPanel({ alerts }: { alerts: any[] }) {
  const [acknowledging, setAcknowledging] = useState<number | null>(null)

  const handleAcknowledge = async (alertId: number) => {
    try {
      setAcknowledging(alertId)
      const response = await fetch("/api/alerts/acknowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId,
          acknowledgedBy: "Dr. Administrator",
        }),
      })

      if (response.ok) {
        // Update UI - alert should be removed from list
        window.location.reload()
      }
    } catch (error) {
      console.error("Error acknowledging alert:", error)
    } finally {
      setAcknowledging(null)
    }
  }

  if (alerts.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No active alerts</div>
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert: any) => (
        <Card
          key={alert.id}
          className={`p-4 border-2 ${
            alert.alertLevel === "CRITICAL"
              ? "border-destructive bg-destructive/5"
              : "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle
                className={`w-5 h-5 mt-1 flex-shrink-0 ${
                  alert.alertLevel === "CRITICAL" ? "text-destructive" : "text-yellow-600 dark:text-yellow-400"
                }`}
              />
              <div>
                <p className="font-semibold text-foreground">Patient {alert.patientId}</p>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(alert.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
            <Button
              onClick={() => handleAcknowledge(alert.id)}
              disabled={acknowledging === alert.id}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {acknowledging === alert.id ? "Acknowledging..." : "Acknowledge"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
