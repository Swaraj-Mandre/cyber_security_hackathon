"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Lock } from "lucide-react"
import { validateVitals } from "@/lib/vital-validator"

export function VitalsForm({
  patientId,
  ambulanceId,
  onTransmitSuccess,
}: {
  patientId: string
  ambulanceId: string
  onTransmitSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    heartRate: 72,
    spo2: 98,
    systolicBp: 120,
    diastolicBp: 80,
    temperature: 37.2,
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value)

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }))

    // Validate on change
    const updatedData = { ...formData, [name]: numValue }
    const validation = validateVitals(updatedData)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
    } else {
      setValidationErrors([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Final validation
    const validation = validateVitals(formData)
    if (!validation.isValid) {
      setMessage({
        type: "error",
        text: "Cannot transmit: " + validation.errors[0],
      })
      setValidationErrors(validation.errors)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/vitals/transmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          ambulanceId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Vitals transmitted securely (encrypted). Status: ${data.classification.status}. Vital ID: ${data.vitalId}`,
        })
        setValidationErrors([])
        onTransmitSuccess()
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to transmit vitals",
        })
        if (data.details) {
          setValidationErrors(Array.isArray(data.details) ? data.details : [data.details])
        }
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error transmitting vitals: " + (error instanceof Error ? error.message : "Unknown error"),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Manual Vital Transmission</CardTitle>
          <div className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
            <Lock className="w-3 h-3" />
            <span>Encrypted</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Heart Rate (bpm) <span className="text-xs text-muted-foreground">(40-180)</span>
              </label>
              <Input
                type="number"
                name="heartRate"
                value={formData.heartRate}
                onChange={handleInputChange}
                min="40"
                max="180"
                step="1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                SpO₂ (%) <span className="text-xs text-muted-foreground">(60-100)</span>
              </label>
              <Input
                type="number"
                name="spo2"
                value={formData.spo2}
                onChange={handleInputChange}
                min="60"
                max="100"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Systolic BP (mmHg) <span className="text-xs text-muted-foreground">(40-250)</span>
              </label>
              <Input
                type="number"
                name="systolicBp"
                value={formData.systolicBp}
                onChange={handleInputChange}
                min="40"
                max="250"
                step="1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Diastolic BP (mmHg) <span className="text-xs text-muted-foreground">(20-150)</span>
              </label>
              <Input
                type="number"
                name="diastolicBp"
                value={formData.diastolicBp}
                onChange={handleInputChange}
                min="20"
                max="150"
                step="1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Temperature (°C) <span className="text-xs text-muted-foreground">(32-42)</span>
              </label>
              <Input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                min="32"
                max="42"
                step="0.1"
                required
              />
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md text-sm space-y-1">
              {validationErrors.map((error, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}

          <Button type="submit" disabled={loading || validationErrors.length > 0} className="w-full">
            {loading ? "Encrypting & Transmitting..." : "Transmit Vitals (Encrypted)"}
          </Button>

          {message && (
            <div
              className={`flex items-start gap-2 p-3 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  : message.type === "error"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                    : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
