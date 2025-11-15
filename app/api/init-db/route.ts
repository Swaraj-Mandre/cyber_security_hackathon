import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const databaseUrl = process.env.NEON_POSTGRES_URL || process.env.NEON_NEON_DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json({ error: "Database URL not configured" }, { status: 500 })
    }

    const sql = neon(databaseUrl)

    await sql`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        age INT,
        gender VARCHAR(10),
        medical_conditions VARCHAR(500),
        emergency_contact VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS ambulances (
        id SERIAL PRIMARY KEY,
        ambulance_id VARCHAR(50) UNIQUE NOT NULL,
        driver_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'available',
        current_patient_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS vitals (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(50) NOT NULL,
        ambulance_id VARCHAR(50),
        heart_rate INT,
        spo2 DECIMAL(5, 2),
        systolic_bp INT,
        diastolic_bp INT,
        temperature DECIMAL(5, 2),
        status VARCHAR(50),
        encrypted_data TEXT,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(50) NOT NULL,
        alert_type VARCHAR(50),
        alert_level VARCHAR(50),
        message TEXT,
        is_acknowledged BOOLEAN DEFAULT FALSE,
        acknowledged_by VARCHAR(255),
        acknowledged_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS vital_history (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(50) NOT NULL,
        heart_rate_avg INT,
        spo2_avg DECIMAL(5, 2),
        systolic_bp_avg INT,
        diastolic_bp_avg INT,
        temperature_avg DECIMAL(5, 2),
        status VARCHAR(50),
        date_recorded DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_patient_id ON vitals(patient_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_ambulance_id ON vitals(ambulance_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_recorded_at ON vitals(recorded_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_alert_patient_id ON alerts(patient_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_alert_created_at ON alerts(created_at)`

    // Seed data
    await sql`
      INSERT INTO patients (patient_id, name, age, gender, medical_conditions) 
      VALUES 
        ('PAT001', 'John Doe', 45, 'M', 'Hypertension'),
        ('PAT002', 'Jane Smith', 52, 'F', 'Diabetes, Heart Disease'),
        ('PAT003', 'Michael Johnson', 38, 'M', 'Asthma')
      ON CONFLICT (patient_id) DO NOTHING
    `

    await sql`
      INSERT INTO ambulances (ambulance_id, driver_name, status) 
      VALUES 
        ('AMB001', 'Officer Mike', 'available'),
        ('AMB002', 'Officer Sarah', 'available')
      ON CONFLICT (ambulance_id) DO NOTHING
    `

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      tables: ["patients", "ambulances", "vitals", "alerts", "vital_history"],
    })
  } catch (error) {
    console.error("[v0] Database init error:", error)
    return NextResponse.json({ error: "Failed to initialize database", details: String(error) }, { status: 500 })
  }
}
