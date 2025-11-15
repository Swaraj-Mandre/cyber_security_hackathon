-- Create patients table
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
);

-- Create ambulances table
CREATE TABLE IF NOT EXISTS ambulances (
  id SERIAL PRIMARY KEY,
  ambulance_id VARCHAR(50) UNIQUE NOT NULL,
  driver_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'available',
  current_patient_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vitals table (stores real-time patient vitals)
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
);

-- Create alerts table (stores critical condition alerts)
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
);

-- Create vital_history table (stores historical data for analytics)
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
);

-- Create indexes for faster queries
CREATE INDEX idx_patient_id ON vitals(patient_id);
CREATE INDEX idx_ambulance_id ON vitals(ambulance_id);
CREATE INDEX idx_recorded_at ON vitals(recorded_at);
CREATE INDEX idx_alert_patient_id ON alerts(patient_id);
CREATE INDEX idx_alert_created_at ON alerts(created_at);

-- Create seed data for testing
INSERT INTO patients (patient_id, name, age, gender, medical_conditions) VALUES
('PAT001', 'John Doe', 45, 'M', 'Hypertension'),
('PAT002', 'Jane Smith', 52, 'F', 'Diabetes, Heart Disease'),
('PAT003', 'Michael Johnson', 38, 'M', 'Asthma')
ON CONFLICT (patient_id) DO NOTHING;

INSERT INTO ambulances (ambulance_id, driver_name, status) VALUES
('AMB001', 'Officer Mike', 'available'),
('AMB002', 'Officer Sarah', 'available')
ON CONFLICT (ambulance_id) DO NOTHING;
