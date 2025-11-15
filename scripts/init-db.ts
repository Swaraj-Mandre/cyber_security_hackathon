import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.NEON_POSTGRES_URL || process.env.NEON_NEON_DATABASE_URL

if (!databaseUrl) {
  throw new Error("Database URL is not configured")
}

const sql = neon(databaseUrl)

/**
 * Initialize the database with all required tables and seed data
 */
async function initializeDatabase() {
  try {
    console.log("[v0] Starting database initialization...")

    // Create patients table
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
    console.log("[v0] Created patients table")

    // Create ambulances table
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
    console.log("[v0] Created ambulances table")

    // Create vitals table
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
    console.log("[v0] Created vitals table")

    // Create alerts table
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
    console.log("[v0] Created alerts table")

    // Create vital_history table
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
    console.log("[v0] Created vital_history table")

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_patient_id ON vitals(patient_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_ambulance_id ON vitals(ambulance_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_recorded_at ON vitals(recorded_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_alert_patient_id ON alerts(patient_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_alert_created_at ON alerts(created_at)`
    console.log("[v0] Created indexes")

    // Seed patients
    await sql`
      INSERT INTO patients (patient_id, name, age, gender, medical_conditions) 
      VALUES 
        ('PAT001', 'John Doe', 45, 'M', 'Hypertension'),
        ('PAT002', 'Jane Smith', 52, 'F', 'Diabetes, Heart Disease'),
        ('PAT003', 'Michael Johnson', 38, 'M', 'Asthma')
      ON CONFLICT (patient_id) DO NOTHING
    `
    console.log("[v0] Seeded patients")

    // Seed ambulances
    await sql`
      INSERT INTO ambulances (ambulance_id, driver_name, status) 
      VALUES 
        ('AMB001', 'Officer Mike', 'available'),
        ('AMB002', 'Officer Sarah', 'available')
      ON CONFLICT (ambulance_id) DO NOTHING
    `
    console.log("[v0] Seeded ambulances")

    console.log("[v0] Database initialization completed successfully!")
    return true
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    throw error
  }
}

// Run initialization
initializeDatabase().catch((error) => {
  console.error("[v0] Failed to initialize database:", error)
  process.exit(1)
})
