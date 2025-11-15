import { neon } from "@neondatabase/serverless"

// Create a singleton instance of the SQL client
let sqlInstance: ReturnType<typeof neon> | null = null

/**
 * Gets or creates a Neon SQL client instance
 */
export function getSql() {
  if (!sqlInstance) {
    const databaseUrl = process.env.NEON_POSTGRES_URL || process.env.NEON_NEON_NEON_DATABASE_URL
    if (!databaseUrl) {
      throw new Error("Database URL is not configured")
    }
    sqlInstance = neon(databaseUrl)
  }
  return sqlInstance
}

/**
 * Fetches current vital data for a patient
 */
export async function getLatestVitals(patientId: string) {
  const sql = getSql()
  const result = await sql`SELECT * FROM vitals WHERE patient_id = ${patientId} ORDER BY recorded_at DESC LIMIT 1`
  return result[0] || null
}

/**
 * Fetches all recent vitals for a patient
 */
export async function getRecentVitals(patientId: string, minutes = 60) {
  const sql = getSql()
  const result = await sql`SELECT * FROM vitals 
     WHERE patient_id = ${patientId} 
     AND recorded_at > NOW() - INTERVAL '${minutes} minutes'
     ORDER BY recorded_at ASC`
  return result
}

/**
 * Stores vital data in the database
 */
export async function storeVitals(vitalData: {
  patientId: string
  ambulanceId: string
  heartRate: number
  spo2: number
  systolicBp: number
  diastolicBp: number
  temperature: number
  status: string
  encryptedData?: string
}) {
  const sql = getSql()
  const result = await sql`INSERT INTO vitals 
     (patient_id, ambulance_id, heart_rate, spo2, systolic_bp, diastolic_bp, temperature, status, encrypted_data)
     VALUES (${vitalData.patientId}, ${vitalData.ambulanceId}, ${vitalData.heartRate}, ${vitalData.spo2}, ${vitalData.systolicBp}, ${vitalData.diastolicBp}, ${vitalData.temperature}, ${vitalData.status}, ${vitalData.encryptedData || null})
     RETURNING *`
  return result[0]
}

/**
 * Creates an alert for critical conditions
 */
export async function createAlert(alertData: {
  patientId: string
  alertType: string
  alertLevel: string
  message: string
}) {
  const sql = getSql()
  const result = await sql`INSERT INTO alerts (patient_id, alert_type, alert_level, message)
     VALUES (${alertData.patientId}, ${alertData.alertType}, ${alertData.alertLevel}, ${alertData.message})
     RETURNING *`
  return result[0]
}

/**
 * Fetches all active (unacknowledged) alerts
 */
export async function getActiveAlerts() {
  const sql = getSql()
  const result = await sql`SELECT * FROM alerts WHERE is_acknowledged = FALSE ORDER BY created_at DESC`
  return result
}

/**
 * Fetches all alerts for a specific patient
 */
export async function getPatientAlerts(patientId: string) {
  const sql = getSql()
  const result = await sql`SELECT * FROM alerts WHERE patient_id = ${patientId} ORDER BY created_at DESC LIMIT 50`
  return result
}

/**
 * Acknowledges an alert
 */
export async function acknowledgeAlert(alertId: number, acknowledgedBy: string) {
  const sql = getSql()
  const result = await sql`UPDATE alerts 
     SET is_acknowledged = TRUE, acknowledged_by = ${acknowledgedBy}, acknowledged_at = NOW()
     WHERE id = ${alertId}
     RETURNING *`
  return result[0]
}

/**
 * Fetches patient information
 */
export async function getPatient(patientId: string) {
  const sql = getSql()
  const result = await sql`SELECT * FROM patients WHERE patient_id = ${patientId}`
  return result[0] || null
}

/**
 * Gets all patients
 */
export async function getAllPatients() {
  const sql = getSql()
  const result = await sql`SELECT * FROM patients`
  return result
}

/**
 * Fetches all latest vitals for all patients grouped by patient
 */
export async function getAllLatestVitals() {
  const sql = getSql()
  const result = await sql`
    SELECT DISTINCT ON (patient_id) *
    FROM vitals
    ORDER BY patient_id, recorded_at DESC
  `
  return result
}

/**
 * Fetches all patients with their latest vitals
 */
export async function getAllPatientsWithVitals() {
  const sql = getSql()
  const result = await sql`
    SELECT 
      p.patient_id,
      p.name,
      p.age,
      p.medical_condition,
      v.id as vital_id,
      v.heart_rate,
      v.spo2,
      v.systolic_bp,
      v.diastolic_bp,
      v.temperature,
      v.status,
      v.recorded_at,
      v.encrypted_data,
      v.ambulance_id
    FROM patients p
    LEFT JOIN LATERAL (
      SELECT * FROM vitals
      WHERE patient_id = p.patient_id
      ORDER BY recorded_at DESC
      LIMIT 1
    ) v ON true
    ORDER BY p.patient_id
  `
  return result
}
