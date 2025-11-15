"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code } from "lucide-react"

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <Code className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
              <p className="text-muted-foreground">Secure Real-Time Ambulance Data Transmission System</p>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="space-y-6">
          {/* Transmit Vitals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>POST /api/vitals/transmit</CardTitle>
                <Badge className="bg-blue-500">Create</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  Receives encrypted vital data from ambulance, classifies patient condition, and triggers alerts if
                  needed.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Request Body</h3>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                  {`{
  "patientId": "PAT001",
  "ambulanceId": "AMB001",
  "heartRate": 92,
  "spo2": 96,
  "systolicBp": 135,
  "diastolicBp": 85,
  "temperature": 37.2
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response (Success)</h3>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                  {`{
  "success": true,
  "message": "Vitals transmitted and processed successfully",
  "vitalId": 123,
  "classification": {
    "status": "Stable",
    "riskFactors": [],
    "score": 30
  },
  "patient": {
    "name": "John Doe",
    "age": 45
  }
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Status Codes</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <Badge>201</Badge> Created - Vitals successfully stored
                  </p>
                  <p>
                    <Badge variant="outline">400</Badge> Bad Request - Missing required fields
                  </p>
                  <p>
                    <Badge variant="outline">500</Badge> Server Error - Processing failed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Latest Vitals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GET /api/vitals/latest</CardTitle>
                <Badge className="bg-green-500">Read</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  Retrieves the most recent vital readings for a patient (decrypted).
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Query Parameters</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <code className="bg-muted px-2 py-1 rounded">patientId</code> (required) - Patient ID
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Example Request</h3>
                <pre className="bg-muted p-3 rounded-lg text-xs">{`GET /api/vitals/latest?patientId=PAT001`}</pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response</h3>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                  {`{
  "success": true,
  "vital": {
    "id": 123,
    "patientId": "PAT001",
    "ambulanceId": "AMB001",
    "heartRate": 92,
    "spo2": 96,
    "systolicBp": 135,
    "diastolicBp": 85,
    "temperature": 37.2,
    "status": "Stable",
    "recordedAt": "2024-11-04T10:30:00Z"
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GET /api/alerts/active</CardTitle>
                <Badge className="bg-green-500">Read</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">Retrieves all unacknowledged critical alerts.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response</h3>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                  {`{
  "success": true,
  "alerts": [
    {
      "id": 1,
      "patientId": "PAT003",
      "alertType": "CRITICAL_VITALS",
      "alertLevel": "CRITICAL",
      "message": "Critical condition detected: Heart rate 145 bpm (critical)",
      "isAcknowledged": false,
      "createdAt": "2024-11-04T10:32:00Z"
    }
  ],
  "count": 1
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Acknowledge Alert */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>POST /api/alerts/acknowledge</CardTitle>
                <Badge className="bg-blue-500">Update</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">Marks an alert as acknowledged by a doctor.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Request Body</h3>
                <pre className="bg-muted p-3 rounded-lg text-xs">
                  {`{
  "alertId": 1,
  "acknowledgedBy": "Dr. Smith"
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response</h3>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                  {`{
  "success": true,
  "message": "Alert acknowledged"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Verify Encryption */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GET /api/vitals/verify-encryption</CardTitle>
                <Badge className="bg-purple-500">Verify</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  Verifies that vital data is encrypted in the database and successfully decrypts it to prove integrity.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Query Parameters</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <code className="bg-muted px-2 py-1 rounded">patientId</code> (required) - Patient ID
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Example Request</h3>
                <pre className="bg-muted p-3 rounded-lg text-xs">{`GET /api/vitals/verify-encryption?patientId=PAT001`}</pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response</h3>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                  {`{
  "success": true,
  "message": "Data is ENCRYPTED and successfully decrypted",
  "vital": {
    "id": 123,
    "patientId": "PAT001",
    "encrypted": true,
    "encryptedDataSample": "L2hs7f+Vk...",
    "decryptedData": {
      "patientId": "PAT001",
      "heartRate": 92,
      "spo2": 96,
      "timestamp": "2024-11-04T10:30:00Z"
    },
    "verification": {
      "encryptionFormat": "AES-256-GCM",
      "integrity": "Verified via authentication tag"
    }
  }
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Purpose</h3>
                <p className="text-sm text-muted-foreground">
                  Use this endpoint to verify that data is properly encrypted in the database. Demonstrates that all
                  vital data is stored in encrypted format with AES-256-GCM encryption.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🔒 Security & Encryption</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Encryption Method</h3>
              <p className="text-sm text-muted-foreground">
                All vital data is encrypted using AES-256-GCM before storage. The encryption provides:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Confidentiality through AES-256 encryption</li>
                <li>Integrity through GCM authentication</li>
                <li>Unique IV (Initialization Vector) for each transmission</li>
                <li>Secure key derivation from environment secret</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Encrypted Data Format</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Encrypted data is stored as:{" "}
                <code className="bg-muted px-2 py-1 rounded">base64_iv:hex_ciphertext:base64_auth_tag</code>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Environment Variables Required</h3>
              <pre className="bg-muted p-3 rounded-lg text-xs space-y-1">
                {`NEON_POSTGRES_URL=<database_url>
ENCRYPTION_KEY=<your_secret_key>`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Patient Classification */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📊 Patient Classification System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-semibold">Parameter</th>
                    <th className="text-left py-2 px-2 font-semibold">Critical</th>
                    <th className="text-left py-2 px-2 font-semibold">Moderate</th>
                    <th className="text-left py-2 px-2 font-semibold">Stable</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">Heart Rate</td>
                    <td className="py-2 px-2 text-destructive">{`<40 or >140`}</td>
                    <td className="py-2 px-2 text-yellow-600">{`<50 or >120`}</td>
                    <td className="py-2 px-2 text-green-600">60-100</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">SpO₂ (%)</td>
                    <td className="py-2 px-2 text-destructive">{`<85`}</td>
                    <td className="py-2 px-2 text-yellow-600">{`<90`}</td>
                    <td className="py-2 px-2 text-green-600">≥95</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">Systolic BP</td>
                    <td className="py-2 px-2 text-destructive">{`<60 or >200`}</td>
                    <td className="py-2 px-2 text-yellow-600">{`<90 or >180`}</td>
                    <td className="py-2 px-2 text-green-600">100-140</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2">Diastolic BP</td>
                    <td className="py-2 px-2 text-destructive">{`<40 or >120`}</td>
                    <td className="py-2 px-2 text-yellow-600">{`<60 or >110`}</td>
                    <td className="py-2 px-2 text-green-600">70-100</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2">Temperature (°C)</td>
                    <td className="py-2 px-2 text-destructive">{`<32 or >40`}</td>
                    <td className="py-2 px-2 text-yellow-600">{`<36 or >38.5`}</td>
                    <td className="py-2 px-2 text-green-600">36.5-37.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
