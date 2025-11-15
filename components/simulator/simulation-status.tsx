"use client"

import { Activity, Send } from "lucide-react"

export function SimulationStatus({
  isRunning,
  transmissionCount,
  lastTransmissionTime,
}: {
  isRunning: boolean
  transmissionCount: number
  lastTransmissionTime: string | null
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
      <div className="p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Status</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
          <span className="text-sm font-semibold">{isRunning ? "Running" : "Stopped"}</span>
        </div>
      </div>

      <div className="p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Send className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Transmissions</p>
        </div>
        <p className="text-sm font-semibold">{transmissionCount}</p>
      </div>

      <div className="p-3 bg-muted rounded-lg col-span-2 md:col-span-1">
        <p className="text-xs text-muted-foreground mb-1">Last Transmission</p>
        <p className="text-sm font-semibold">{lastTransmissionTime || "Never"}</p>
      </div>
    </div>
  )
}
