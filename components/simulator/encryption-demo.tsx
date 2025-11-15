"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

export function EncryptionDemo() {
  const [patientId, setPatientId] = useState("PAT001")
  const [verificationData, setVerificationData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showEncrypted, setShowEncrypted] = useState(false)
  const [showDecrypted, setShowDecrypted] = useState(true)

  const handleVerify = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/vitals/verify-encryption?patientId=${patientId}`)
      const data = await response.json()
      setVerificationData(data)
      console.log("[v0] Verification result:", data)
    } catch (error) {
      console.error("[v0] Verification failed:", error)
      setVerificationData({ error: "Failed to verify encryption" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <CardTitle>Encryption Verification</CardTitle>
          </div>
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            AES-256-GCM
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Select Patient to Verify</label>
          <div className="flex gap-2">
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={loading}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="PAT001">John Doe (PAT001)</option>
              <option value="PAT002">Jane Smith (PAT002)</option>
              <option value="PAT003">Michael Johnson (PAT003)</option>
            </select>
            <Button onClick={handleVerify} disabled={loading} className="gap-2">
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>

        {verificationData && (
          <div className="space-y-4">
            {verificationData.error ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{verificationData.error}</span>
              </div>
            ) : verificationData.success ? (
              <>
                <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-md flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">{verificationData.message}</span>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Vital ID</p>
                    <p className="text-sm font-mono">{verificationData.vital.id}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Encryption Status</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">
                        <Lock className="w-3 h-3 mr-1" />
                        Encrypted
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {verificationData.vital.verification.encryptionFormat}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-muted-foreground">Encrypted Data in Database</p>
                      <button
                        onClick={() => setShowEncrypted(!showEncrypted)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        {showEncrypted ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showEncrypted ? "Hide" : "Show"}
                      </button>
                    </div>
                    {showEncrypted && (
                      <div className="bg-background p-2 rounded border border-border text-xs font-mono overflow-x-auto text-muted-foreground">
                        {verificationData.vital.encryptedDataSample}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-muted-foreground">Decrypted Data (from database)</p>
                      <button
                        onClick={() => setShowDecrypted(!showDecrypted)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        {showDecrypted ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showDecrypted ? "Hide" : "Show"}
                      </button>
                    </div>
                    {showDecrypted && (
                      <div className="bg-background p-2 rounded border border-border text-xs font-mono overflow-x-auto">
                        <pre>{JSON.stringify(verificationData.vital.decryptedData, null, 2)}</pre>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Plain Text Vitals (in database)</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-background p-2 rounded border border-border text-xs">
                        <p className="text-muted-foreground">Heart Rate</p>
                        <p className="font-mono font-semibold">
                          {verificationData.vital.plainTextVitals.heartRate} bpm
                        </p>
                      </div>
                      <div className="bg-background p-2 rounded border border-border text-xs">
                        <p className="text-muted-foreground">SpO₂</p>
                        <p className="font-mono font-semibold">{verificationData.vital.plainTextVitals.spo2}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Integrity Verification</p>
                    <div className="bg-background p-2 rounded border border-border text-xs space-y-1">
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Encryption Method:</span>{" "}
                        {verificationData.vital.verification.encryptionFormat}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Integrity Check:</span>{" "}
                        {verificationData.vital.verification.integrity}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{verificationData.message}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
