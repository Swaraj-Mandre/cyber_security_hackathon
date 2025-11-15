"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        const response = await fetch("/api/vitals/latest?patientId=PAT001")

        if (response.ok || response.status === 404) {
          // 404 is OK - it means database is reachable but no data yet
          setStatus("connected")
          setMessage("Database connected successfully")
          console.log("[v0] Database connection verified")
        } else if (response.status === 500) {
          setStatus("disconnected")
          setMessage("Database not initialized. Please initialize from home page.")
          console.error("[v0] Database connection failed")
        }
      } catch (error) {
        setStatus("disconnected")
        setMessage("Cannot connect to database. Please check your connection.")
        console.error("[v0] Database check error:", error)
      }
    }

    checkDatabaseConnection()
  }, [])

  return (
    <Card
      className={`border-2 ${status === "connected" ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10" : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {status === "checking" && <Loader className="w-4 h-4 animate-spin text-yellow-600 dark:text-yellow-400" />}
          {status === "connected" && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
          {status === "disconnected" && <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
          Database Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-sm ${status === "connected" ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}
        >
          {status === "checking" && "Checking database connection..."}
          {status === "connected" && message}
          {status === "disconnected" && message}
        </p>
      </CardContent>
    </Card>
  )
}
