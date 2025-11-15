/**
 * Classification thresholds for patient conditions
 */
const THRESHOLDS = {
  CRITICAL: {
    heartRate: { min: 40, max: 140 },
    spo2: { min: 85 },
    systolicBp: { min: 60, max: 200 },
    diastolicBp: { min: 40, max: 120 },
    temperature: { min: 32, max: 40 },
  },
  MODERATE: {
    heartRate: { min: 50, max: 120 },
    spo2: { min: 90 },
    systolicBp: { min: 90, max: 180 },
    diastolicBp: { min: 60, max: 110 },
    temperature: { min: 36, max: 38.5 },
  },
  STABLE: {
    heartRate: { min: 60, max: 100 },
    spo2: { min: 95 },
    systolicBp: { min: 100, max: 140 },
    diastolicBp: { min: 70, max: 100 },
    temperature: { min: 36.5, max: 37.5 },
  },
}

export interface VitalReadings {
  heartRate: number
  spo2: number
  systolicBp: number
  diastolicBp: number
  temperature: number
}

export interface ClassificationResult {
  status: "Critical" | "Moderate" | "Stable"
  riskFactors: string[]
  score: number
}

/**
 * Classifies patient condition based on vital readings
 * Returns the most critical status from all vital parameters
 */
export function classifyPatientCondition(vitals: VitalReadings): ClassificationResult {
  const riskFactors: string[] = []
  let criticalCount = 0
  let moderateCount = 0

  // Check heart rate
  if (vitals.heartRate < THRESHOLDS.CRITICAL.heartRate.min || vitals.heartRate > THRESHOLDS.CRITICAL.heartRate.max) {
    riskFactors.push(`Heart rate ${vitals.heartRate} bpm (critical)`)
    criticalCount++
  } else if (
    vitals.heartRate < THRESHOLDS.MODERATE.heartRate.min ||
    vitals.heartRate > THRESHOLDS.MODERATE.heartRate.max
  ) {
    riskFactors.push(`Heart rate ${vitals.heartRate} bpm (moderate)`)
    moderateCount++
  }

  // Check SpO2
  if (vitals.spo2 < THRESHOLDS.CRITICAL.spo2.min) {
    riskFactors.push(`SpO2 ${vitals.spo2}% (critical)`)
    criticalCount++
  } else if (vitals.spo2 < THRESHOLDS.MODERATE.spo2.min) {
    riskFactors.push(`SpO2 ${vitals.spo2}% (moderate)`)
    moderateCount++
  }

  // Check systolic BP
  if (
    vitals.systolicBp < THRESHOLDS.CRITICAL.systolicBp.min ||
    vitals.systolicBp > THRESHOLDS.CRITICAL.systolicBp.max
  ) {
    riskFactors.push(`Systolic BP ${vitals.systolicBp} mmHg (critical)`)
    criticalCount++
  } else if (
    vitals.systolicBp < THRESHOLDS.MODERATE.systolicBp.min ||
    vitals.systolicBp > THRESHOLDS.MODERATE.systolicBp.max
  ) {
    riskFactors.push(`Systolic BP ${vitals.systolicBp} mmHg (moderate)`)
    moderateCount++
  }

  // Check diastolic BP
  if (
    vitals.diastolicBp < THRESHOLDS.CRITICAL.diastolicBp.min ||
    vitals.diastolicBp > THRESHOLDS.CRITICAL.diastolicBp.max
  ) {
    riskFactors.push(`Diastolic BP ${vitals.diastolicBp} mmHg (critical)`)
    criticalCount++
  } else if (
    vitals.diastolicBp < THRESHOLDS.MODERATE.diastolicBp.min ||
    vitals.diastolicBp > THRESHOLDS.MODERATE.diastolicBp.max
  ) {
    riskFactors.push(`Diastolic BP ${vitals.diastolicBp} mmHg (moderate)`)
    moderateCount++
  }

  // Check temperature
  if (
    vitals.temperature < THRESHOLDS.CRITICAL.temperature.min ||
    vitals.temperature > THRESHOLDS.CRITICAL.temperature.max
  ) {
    riskFactors.push(`Temperature ${vitals.temperature}°C (critical)`)
    criticalCount++
  } else if (
    vitals.temperature < THRESHOLDS.MODERATE.temperature.min ||
    vitals.temperature > THRESHOLDS.MODERATE.temperature.max
  ) {
    riskFactors.push(`Temperature ${vitals.temperature}°C (moderate)`)
    moderateCount++
  }

  // Determine overall status
  let status: "Critical" | "Moderate" | "Stable" = "Stable"
  let score = 0

  if (criticalCount >= 1) {
    status = "Critical"
    score = 90 + Math.min(criticalCount * 3, 10)
  } else if (moderateCount >= 2) {
    status = "Critical"
    score = 80
  } else if (moderateCount >= 1) {
    status = "Moderate"
    score = 60 + moderateCount * 10
  } else {
    status = "Stable"
    score = 30
  }

  return {
    status,
    riskFactors,
    score: Math.min(score, 100),
  }
}

/**
 * Determines if an alert should be triggered
 */
export function shouldTriggerAlert(classification: ClassificationResult): boolean {
  return classification.status === "Critical"
}

/**
 * Generates alert message based on risk factors
 */
export function generateAlertMessage(riskFactors: string[]): string {
  if (riskFactors.length === 0) return ""
  return `Critical condition detected: ${riskFactors.join(", ")}`
}
