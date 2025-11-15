"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Radio, Lock, AlertCircle, BarChart3, Database, CheckCircle, Loader } from "lucide-react"

export default function Home() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [initMessage, setInitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleInitializeDatabase = async () => {
    setIsInitializing(true)
    setInitMessage(null)

    try {
      const response = await fetch("/api/init-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const data = await response.json()
        setInitMessage({
          type: "success",
          text: `Database initialized successfully! Tables created: ${data.tables.join(", ")}`,
        })
        console.log("[v0] Database initialized:", data)
      } else {
        const error = await response.json()
        setInitMessage({
          type: "error",
          text: `Initialization failed: ${error.error}`,
        })
      }
    } catch (error) {
      setInitMessage({
        type: "error",
        text: "Error initializing database. Check console for details.",
      })
      console.error("[v0] Database init error:", error)
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-lg">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Secure Real-Time Ambulance Data Transmission
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Advanced IoT-enabled emergency healthcare system with end-to-end encryption, real-time monitoring, and
            intelligent alert system for improved patient outcomes.
          </p>
        </div>

        <Card className="mb-12 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Setup
                </CardTitle>
                <CardDescription>Initialize PostgreSQL database with tables and seed data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground">
              Click the button below to create all necessary database tables and populate them with test data. This must
              be done before launching the simulator.
            </p>
            <Button onClick={handleInitializeDatabase} disabled={isInitializing} size="lg" className="w-full md:w-auto">
              {isInitializing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Initialize Database
                </>
              )}
            </Button>
            {initMessage && (
              <div
                className={`flex items-start gap-2 p-3 rounded-md ${
                  initMessage.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                }`}
              >
                {initMessage.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm">{initMessage.text}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="border-2">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">End-to-End Encryption</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AES-256-GCM encryption protects all patient data during transmission
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Live Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time vital signs monitoring with instant hospital dashboard updates
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Smart Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatic classification of conditions with targeted alerts for critical cases
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Hospital Dashboard */}
          <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs font-semibold rounded">
                  Production
                </span>
              </div>
              <CardTitle>Hospital Dashboard</CardTitle>
              <CardDescription>Real-time patient monitoring and alert management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View live vital readings from ambulances, classify patient conditions automatically, and manage critical
                alerts from doctors.
              </p>
              <Link href="/dashboard">
                <Button className="w-full">Access Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Ambulance Simulator */}
          <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Radio className="w-6 h-6 text-primary" />
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-semibold rounded">
                  Testing
                </span>
              </div>
              <CardTitle>Ambulance Simulator</CardTitle>
              <CardDescription>Simulate real-time vital data transmission</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Test the system by simulating ambulance vital data transmission. Start automatic simulations or manually
                transmit custom vital readings.
              </p>
              <Link href="/simulator">
                <Button className="w-full">Launch Simulator</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="mb-12">
          <Link href="/api-docs">
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Complete API reference and integration guide</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Technical Stack */}
        <Card>
          <CardHeader>
            <CardTitle>System Architecture</CardTitle>
            <CardDescription>Built with modern web technologies and security best practices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Backend</p>
                <p className="text-sm font-medium">Next.js API Routes</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Database</p>
                <p className="text-sm font-medium">PostgreSQL (Neon)</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Encryption</p>
                <p className="text-sm font-medium">AES-256-GCM</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Frontend</p>
                <p className="text-sm font-medium">React + Tailwind CSS</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
