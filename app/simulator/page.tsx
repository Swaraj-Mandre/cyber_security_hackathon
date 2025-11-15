"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Radio } from "lucide-react"
import { VitalsForm } from "@/components/simulator/vitals-form"
import { SimulationStatus } from "@/components/simulator/simulation-status"
import { DatabaseStatus } from "@/components/simulator/database-status"
import { EncryptionDemo } from "@/components/simulator/encryption-demo"

export default function SimulatorPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [transmissionCount, setTransmissionCount] = useState(0)
  const [lastTransmissionTime, setLastTransmissionTime] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState("PAT001")
  const [selectedAmbulance, setSelectedAmbulance] = useState("AMB001")

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(async () => {
      try {
        // Generate realistic vital data variations
        const baseHeartRate = 70 + (Math.random() - 0.5) * 20
        const baseSpo2 = 95 + (Math.random() - 0.5) * 10
        const baseSystolicBp = 120 + (Math.random() - 0.5) * 30
        const baseDiastolicBp = 80 + (Math.random() - 0.5) * 20
        const baseTemperature = 37 + (Math.random() - 0.5) * 3

        const vitalsData = {
          patientId: selectedPatient,
          ambulanceId: selectedAmbulance,
          heartRate: Math.max(40, Math.min(150, baseHeartRate)),
          spo2: Math.max(80, Math.min(100, baseSpo2)),
          systolicBp: Math.max(60, Math.min(200, baseSystolicBp)),
          diastolicBp: Math.max(40, Math.min(120, baseDiastolicBp)),
          temperature: Math.max(35, Math.min(40, baseTemperature)),
        }

        const response = await fetch("/api/vitals/transmit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vitalsData),
        })

        if (response.ok) {
          const data = await response.json()
          setTransmissionCount((prev) => prev + 1)
          setLastTransmissionTime(new Date().toLocaleTimeString())
          console.log("[v0] Vital transmission successful:", data)
        } else {
          const error = await response.json()
          console.error("[v0] Transmission failed:", error)
        }
      } catch (error) {
        console.error("[v0] Error transmitting vitals:", error)
      }
    }, 10000) // Transmit every 10 seconds

    return () => clearInterval(interval)
  }, [isRunning, selectedPatient, selectedAmbulance])

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary rounded-lg">
            <Radio className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ambulance IoT Simulator</h1>
            <p className="text-sm text-muted-foreground">Simulate real-time vital data transmission from ambulance</p>
          </div>
        </div>

        <DatabaseStatus />

        {/* Simulation Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Select Patient</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  disabled={isRunning}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="PAT001">John Doe (PAT001)</option>
                  <option value="PAT002">Jane Smith (PAT002)</option>
                  <option value="PAT003">Michael Johnson (PAT003)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Select Ambulance</label>
                <select
                  value={selectedAmbulance}
                  onChange={(e) => setSelectedAmbulance(e.target.value)}
                  disabled={isRunning}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="AMB001">Ambulance AMB001</option>
                  <option value="AMB002">Ambulance AMB002</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? "destructive" : "default"}
                size="lg"
                className="flex-1"
              >
                <Activity className="w-4 h-4 mr-2" />
                {isRunning ? "Stop Simulation" : "Start Simulation"}
              </Button>
            </div>

            <SimulationStatus
              isRunning={isRunning}
              transmissionCount={transmissionCount}
              lastTransmissionTime={lastTransmissionTime}
            />
          </CardContent>
        </Card>

        {/* Manual Vital Input */}
        <VitalsForm
          patientId={selectedPatient}
          ambulanceId={selectedAmbulance}
          onTransmitSuccess={() => {
            setTransmissionCount((prev) => prev + 1)
            setLastTransmissionTime(new Date().toLocaleTimeString())
          }}
        />

        {/* Encryption Verification Demo */}
        <EncryptionDemo />
      </div>
    </main>
  )
}
