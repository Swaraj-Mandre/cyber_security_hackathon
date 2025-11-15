/**
 * Validates vital readings against medical standards
 * Returns validation result with errors if any vital is out of range
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateVitals(vitals: {
  heartRate: number
  spo2: number
  systolicBp: number
  diastolicBp: number
  temperature: number
}): ValidationResult {
  const errors: string[] = []

  // Heart Rate: Normal range 40-180 bpm (includes athletes and critical patients)
  if (vitals.heartRate < 40 || vitals.heartRate > 180) {
    errors.push(`Heart rate ${vitals.heartRate} bpm is out of valid range (40-180)`)
  }

  // SpO2: Must be 60-100% (medical devices don't read below 60%)
  if (vitals.spo2 < 60 || vitals.spo2 > 100) {
    errors.push(`SpO2 ${vitals.spo2}% is out of valid range (60-100)`)
  }

  // Systolic BP: Normal range 40-250 mmHg
  if (vitals.systolicBp < 40 || vitals.systolicBp > 250) {
    errors.push(`Systolic BP ${vitals.systolicBp} mmHg is out of valid range (40-250)`)
  }

  // Diastolic BP: Normal range 20-150 mmHg
  if (vitals.diastolicBp < 20 || vitals.diastolicBp > 150) {
    errors.push(`Diastolic BP ${vitals.diastolicBp} mmHg is out of valid range (20-150)`)
  }

  // Systolic must always be >= Diastolic
  if (vitals.systolicBp < vitals.diastolicBp) {
    errors.push(`Systolic BP (${vitals.systolicBp}) cannot be less than Diastolic BP (${vitals.diastolicBp})`)
  }

  // Temperature: Valid range 32-42°C (includes hypothermia and hyperthermia)
  if (vitals.temperature < 32 || vitals.temperature > 42) {
    errors.push(`Temperature ${vitals.temperature}°C is out of valid range (32-42)`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Checks if a vital value is within emergency medical protocols
 */
export function isEmergencyVital(vitals: {
  heartRate: number
  spo2: number
  systolicBp: number
  diastolicBp: number
  temperature: number
}): boolean {
  // Emergency conditions
  if (vitals.heartRate < 50 || vitals.heartRate > 140) return true
  if (vitals.spo2 < 85) return true
  if (vitals.systolicBp < 90 || vitals.systolicBp > 180) return true
  if (vitals.temperature > 39 || vitals.temperature < 35) return true

  return false
}
