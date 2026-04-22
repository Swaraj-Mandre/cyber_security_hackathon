# Secure Real-Time Ambulance Data Transmission System

An advanced IoT-enabled emergency healthcare system combining cybersecurity and real-time data transmission to improve emergency medical response times and patient outcomes.

## 🏥 System Overview

This system enables secure, real-time transmission of patient vital signs from ambulances to hospital dashboards with:

- **End-to-End Encryption**: AES-256-GCM encryption for all patient data
- **Real-Time Monitoring**: Live vital signs updates with WebSocket support ready
- **Intelligent Classification**: Automatic patient condition assessment (Critical/Moderate/Stable)
- **Smart Alerting**: Automated alerts for critical conditions
- **HIPAA-Ready Architecture**: Secure data handling and compliance

## 🏗️ System Architecture

### Components

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    AMBULANCE SIDE                           │
├─────────────────────────────────────────────────────────────┤
│  • IoT Sensors (Heart Rate, SpO2, BP, Temperature)         │
│  • Data Encryption (AES-256-GCM)                           │
│  • Transmission Module (HTTP POST)                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Encrypted Vital Data
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (Next.js)                          │
├─────────────────────────────────────────────────────────────┤
│  • /api/vitals/transmit - Receive & decrypt vitals        │
│  • /api/vitals/latest - Retrieve patient data             │
│  • /api/alerts/active - Get active alerts                 │
│  • /api/alerts/acknowledge - Acknowledge alerts           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│         DATABASE (PostgreSQL - Neon)                       │
├─────────────────────────────────────────────────────────────┤
│  • patients - Patient information                          │
│  • ambulances - Ambulance fleet data                       │
│  • vitals - Real-time vital readings                       │
│  • alerts - Critical condition alerts                      │
│  • vital_history - Historical analytics                    │
└─────────────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│         HOSPITAL DASHBOARD (React)                         │
├─────────────────────────────────────────────────────────────┤
│  • Patient Monitor - Live vital displays                   │
│  • Alert Panel - Critical condition notifications          │
│  • Analytics - System statistics & history                 │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 🔒 Security Features

### Encryption
- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **IV Generation**: Cryptographically random 16-byte IV
- **Authentication**: GCM authentication tag for integrity verification

### Data Protection
- All vitals encrypted before storage
- Decryption only on hospital side
- Audit trail for all data access
- SQL injection prevention with parameterized queries

## 📊 Patient Condition Classification

### Thresholds

| Parameter | Critical | Moderate | Stable |
|-----------|----------|----------|--------|
| Heart Rate (bpm) | <40 or >140 | <50 or >120 | 60-100 |
| SpO₂ (%) | <85 | <90 | ≥95 |
| Systolic BP (mmHg) | <60 or >200 | <90 or >180 | 100-140 |
| Diastolic BP (mmHg) | <40 or >120 | <60 or >110 | 70-100 |
| Temperature (°C) | <32 or >40 | <36 or >38.5 | 36.5-37.5 |

### Classification Logic
- **Critical**: Any parameter in critical range → CRITICAL status
- **Moderate**: 2+ parameters in moderate range → CRITICAL status
- **Moderate**: 1 parameter in moderate range → MODERATE status
- **Stable**: All parameters normal → STABLE status

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon provided)
- Environment variables configured

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd ambulance-system
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
# In your Vercel project settings, add:
NEON_POSTGRES_URL=postgresql://...
ENCRYPTION_KEY=your-secret-key-here
\`\`\`

4. **Initialize database**
The database schema is automatically created via the `/scripts/01-init-database.sql` file.

5. **Run the development server**
\`\`\`bash
npm run dev
\`\`\`

6. **Access the application**
- Home: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Simulator: http://localhost:3000/simulator

## 📡 API Endpoints

### Transmit Vital Data
\`\`\`bash
POST /api/vitals/transmit
Content-Type: application/json

{
  "patientId": "PAT001",
  "ambulanceId": "AMB001",
  "heartRate": 92,
  "spo2": 96,
  "systolicBp": 135,
  "diastolicBp": 85,
  "temperature": 37.2
}

Response:
{
  "success": true,
  "vitalId": 123,
  "classification": {
    "status": "Stable",
    "riskFactors": [],
    "score": 30
  }
}
\`\`\`

### Get Latest Vitals
\`\`\`bash
GET /api/vitals/latest?patientId=PAT001

Response:
{
  "success": true,
  "vital": {
    "heartRate": 92,
    "spo2": 96,
    "status": "Stable",
    "recordedAt": "2024-11-04T10:30:00Z"
  }
}
\`\`\`

### Get Active Alerts
\`\`\`bash
GET /api/alerts/active

Response:
{
  "success": true,
  "alerts": [
    {
      "id": 1,
      "patientId": "PAT003",
      "alertLevel": "CRITICAL",
      "message": "Critical condition detected: Heart rate 145 bpm (critical), SpO2 82% (critical)",
      "createdAt": "2024-11-04T10:32:00Z"
    }
  ],
  "count": 1
}
\`\`\`

### Acknowledge Alert
\`\`\`bash
POST /api/alerts/acknowledge
Content-Type: application/json

{
  "alertId": 1,
  "acknowledgedBy": "Dr. Smith"
}

Response:
{
  "success": true,
  "message": "Alert acknowledged"
}
\`\`\`

## 🧪 Testing with Simulator

1. **Navigate to Simulator**: http://localhost:3000/simulator
2. **Select Patient and Ambulance** from dropdowns
3. **Choose simulation method**:
   - **Auto Simulation**: Click "Start Simulation" to send vitals every 10 seconds
   - **Manual Input**: Adjust vital values and click "Transmit Vitals"
4. **Monitor Dashboard**: http://localhost:3000/dashboard shows all activity

## 📈 Features by Component

### Hospital Dashboard
- ✅ Patient monitoring grid with real-time status
- ✅ Critical alert notifications with acknowledgment
- ✅ Vital signs charts with historical data
- ✅ System analytics and statistics
- ✅ Color-coded patient status (Green/Yellow/Red)

### Ambulance Simulator
- ✅ Automatic vital data simulation
- ✅ Manual vital input form
- ✅ Transmission status tracking
- ✅ Real-time feedback on data transmission
- ✅ Multiple patient/ambulance selection

### Backend Security
- ✅ AES-256-GCM encryption/decryption
- ✅ Database transaction handling
- ✅ Input validation and sanitization
- ✅ Error handling with logging
- ✅ Rate limiting ready

## 🔄 Real-Time Updates

The system is structured to support WebSocket upgrades:

1. **Current**: HTTP polling (5-10 second intervals)
2. **Next Phase**: WebSocket connections for true real-time updates
3. **Implementation**: Ready for Socket.io or native WebSocket integration

## 📝 Database Schema

### Patients Table
\`\`\`sql
- id (PRIMARY KEY)
- patient_id (UNIQUE)
- name
- age
- gender
- medical_conditions
- emergency_contact
\`\`\`

### Vitals Table
\`\`\`sql
- id (PRIMARY KEY)
- patient_id (FOREIGN KEY)
- ambulance_id
- heart_rate, spo2, systolic_bp, diastolic_bp, temperature
- status (Critical/Moderate/Stable)
- encrypted_data
- recorded_at
\`\`\`

### Alerts Table
\`\`\`sql
- id (PRIMARY KEY)
- patient_id (FOREIGN KEY)
- alert_type
- alert_level
- message
- is_acknowledged
- acknowledged_by
- acknowledged_at
\`\`\`

## 🛠️ Development

### Adding New Features

1. **Add database migrations**: Create new SQL files in `/scripts`
2. **Create API routes**: Add to `/app/api/`
3. **Build UI components**: Add to `/components/`
4. **Update classifications**: Modify `/lib/classification.ts`

### Environment Variables

\`\`\`
NEON_POSTGRES_URL          # Database URL (provided by Neon)
ENCRYPTION_KEY             # Secret key for AES encryption (set by you)
NEXT_PUBLIC_API_URL        # Frontend API base URL (optional)
\`\`\`

## 🚨 Troubleshooting

### "Database URL is not configured"
- Verify `NEON_POSTGRES_URL` environment variable is set
- Check Vercel project settings under "Environment Variables"

### "ENCRYPTION_KEY is not set"
- Set `ENCRYPTION_KEY` environment variable
- Example: `ENCRYPTION_KEY=your-super-secret-key-123`

### "Failed to decrypt vital data"
- Ensure same encryption key used for transmission and reception
- Check encrypted data format (should be: `base64:hex:base64`)

## 📚 Further Reading

- [AES-256-GCM Security](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [HIPAA Compliance Guidelines](https://www.hhs.gov/hipaa)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/sql-syntax.html)

## 📄 License

MIT License - See LICENSE file for details

---
**Last Updated**: November 2024  
