"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Activity, Zap, Thermometer, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Patient {
  id: string
  name: string
  status: "Critical" | "Moderate" | "Stable"
  vitals: {
    heartRate: number | null
    spo2: number | null
    temperature: number | null
    recordedAt: string | null
  }
}

export function PatientGrid({
  selectedPatient,
  onSelectPatient,
}: {
  selectedPatient: string | null
  onSelectPatient: (patientId: string) => void
}) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/patients/with-vitals")

        if (!response.ok) {
          throw new Error(`Failed to fetch patients: ${response.statusText}`)
        }

        const data = await response.json()
        const formattedPatients = data.patients.map((p: any) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          vitals: {
            heartRate: p.vitals.heartRate,
            spo2: p.vitals.spo2,
            temperature: p.vitals.temperature,
            recordedAt: p.vitals.recordedAt,
          },
        }))

        setPatients(formattedPatients)
      } catch (error) {
        console.error("Error fetching patients:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch patients")
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()

    const interval = setInterval(fetchPatients, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "border-destructive bg-destructive/5"
      case "Moderate":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
      case "Stable":
        return "border-green-500 bg-green-50 dark:bg-green-900/10"
      default:
        return "border-border"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-destructive text-destructive-foreground"
      case "Moderate":
        return "bg-yellow-600 text-white"
      case "Stable":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-start gap-2">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Error loading patients</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (loading && patients.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-20 mb-4" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <Card
          key={patient.id}
          className={`p-5 cursor-pointer border-2 transition-all hover:shadow-lg ${getStatusColor(
            patient.status,
          )} ${selectedPatient === patient.id ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelectPatient(patient.id)}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{patient.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{patient.id}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(patient.status)}`}>
                {patient.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">HR</p>
                  <p className="font-semibold text-sm">
                    {patient.vitals.heartRate ? `${patient.vitals.heartRate} bpm` : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">SpO₂</p>
                  <p className="font-semibold text-sm">{patient.vitals.spo2 ? `${patient.vitals.spo2}%` : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Temp</p>
                  <p className="font-semibold text-sm">
                    {patient.vitals.temperature ? `${patient.vitals.temperature}°C` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {patient.vitals.recordedAt && (
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                Last update: {new Date(patient.vitals.recordedAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
