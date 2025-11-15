"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AlertCircle } from "lucide-react"

interface VitalRecord {
  time: string
  heartRate: number
  spo2: number
  temperature: number
}

export function VitalsChart({ patientId }: { patientId: string }) {
  const [data, setData] = useState<VitalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/vitals/patient/${patientId}?limit=20`)

        if (!response.ok) {
          throw new Error(`Failed to fetch vitals: ${response.statusText}`)
        }

        const result = await response.json()
        const chartData: VitalRecord[] = result.vitals.map((v: any) => ({
          time: new Date(v.recordedAt).toLocaleTimeString(),
          heartRate: v.heartRate || 0,
          spo2: v.spo2 || 0,
          temperature: v.temperature || 0,
        }))

        setData(chartData)
      } catch (error) {
        console.error("Error fetching vitals:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch vitals")
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchVitals()
      const interval = setInterval(fetchVitals, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [patientId])

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="flex items-start gap-2 text-red-800 dark:text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error loading chart</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading || !data.length) {
    return (
      <div className="text-center text-muted-foreground h-96 flex items-center justify-center">
        Loading vitals data...
      </div>
    )
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate (bpm)" strokeWidth={2} />
          <Line type="monotone" dataKey="spo2" stroke="#3b82f6" name="SpO₂ (%)" strokeWidth={2} />
          <Line type="monotone" dataKey="temperature" stroke="#f59e0b" name="Temperature (°C)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
