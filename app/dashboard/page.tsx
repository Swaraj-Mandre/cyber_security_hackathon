"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { PatientGrid } from "@/components/dashboard/patient-grid"
import { AlertPanel } from "@/components/dashboard/alert-panel"
import { VitalsChart } from "@/components/dashboard/vitals-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch patients and alerts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // In a real app, we'd fetch from API
        // For now, we'll load data after a delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Poll for new alerts
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/alerts/active")
        if (response.ok) {
          const data = await response.json()
          setAlerts(data.alerts)
        }
      } catch (error) {
        console.error("Error fetching alerts:", error)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Poll every 3 seconds for new patient data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patients/with-vitals")
        if (response.ok) {
          const data = await response.json()
          // Update state if patients exist
          if (data.patients && data.patients.length > 0) {
            setPatients(data.patients)
          }
        }
      } catch (error) {
        console.error("Error fetching patients:", error)
      }
    }

    const interval = setInterval(fetchPatients, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Critical Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <AlertPanel alerts={alerts} />
          </div>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">Patient Monitor</TabsTrigger>
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <PatientGrid selectedPatient={selectedPatient} onSelectPatient={setSelectedPatient} patients={patients} />
            {selectedPatient && (
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Vitals for {selectedPatient}</CardTitle>
                </CardHeader>
                <CardContent>
                  <VitalsChart patientId={selectedPatient} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Active Alerts ({alerts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertPanel alerts={alerts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Patients Monitored</p>
                    <p className="text-2xl font-bold">{patients.length}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <p className="text-2xl font-bold text-destructive">{alerts.length}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                    <p className="text-2xl font-bold">99.9%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
