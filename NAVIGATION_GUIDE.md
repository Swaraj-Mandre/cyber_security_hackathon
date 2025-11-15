# System Navigation Guide

## Home Page - Your Starting Point

**URL**: http://localhost:3000

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Secure Real-Time Ambulance Data Transmission           │
│              Advanced IoT Emergency System                  │
│                                                             │
│  [End-to-End]  [Live Monitoring]  [Smart Alerts]          │
│   Encryption      Real-Time         Auto Detection          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🏥 Hospital Dashboard          📡 Ambulance Sim   │   │
│  │                                                     │   │
│  │  Real-time patient monitoring   Test vital trans   │   │
│  │  and alert management           mission system     │   │
│  │                                                     │   │
│  │  [Access Dashboard]             [Launch Simulator] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [📚 API Documentation] - Complete Endpoint Reference      │
│                                                             │
│  Technical Stack:                                           │
│  Backend: Next.js | DB: PostgreSQL | Encryption: AES-256  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### From Home Page You Can:
- Click **"Access Dashboard"** → Hospital monitoring
- Click **"Launch Simulator"** → Test ambulance data
- Click **"API Documentation"** → API reference
- Read system overview and architecture

---

## Hospital Dashboard

**URL**: http://localhost:3000/dashboard

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  🏥 Hospital Dashboard                      ✓ System Active │
│  Real-time Ambulance Vital Monitoring                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔴 CRITICAL ALERTS (if any)                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ⚠️  Patient PAT003                                   │  │
│  │ Critical Heart Rate 145 bpm, SpO2 82%              │  │
│  │ [Acknowledge]                                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  [Patient Monitor] [Active Alerts] [Analytics]            │
│                                                             │
│  PATIENT GRID:                                             │
│  ┌──────────────┬──────────────┬──────────────┐           │
│  │ John Doe     │ Jane Smith   │ Michael ...  │           │
│  │ PAT001       │ PAT002       │ PAT003       │           │
│  │ ✅ Stable    │ ⚠️ Moderate  │ 🔴 Critical  │           │
│  │              │              │              │           │
│  │ HR: 72       │ HR: 105      │ HR: 145      │           │
│  │ SpO2: 98%    │ SpO2: 92%    │ SpO2: 82%    │           │
│  │ Temp: 37.2°C │ Temp: 38.1°C │ Temp: 39.5°C │           │
│  └──────────────┴──────────────┴──────────────┘           │
│                                                             │
│  VITAL CHART (When patient selected):                     │
│  [Chart showing Heart Rate, SpO2, Temperature over time]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Dashboard Features:
1. **Header**: System status and active indicator
2. **Alert Section**: Critical alerts with acknowledgment
3. **Tabs**:
   - **Patient Monitor**: View all patients with live status
   - **Active Alerts**: List of unacknowledged critical alerts
   - **Analytics**: System statistics and uptime
4. **Patient Grid**: 
   - Click card to see detailed vitals
   - Color-coded status (Green/Yellow/Red)
   - Quick vital glance (HR, SpO2, Temp)
5. **Vitals Chart**: 
   - Historical data for selected patient
   - Real-time updates every 30 seconds

### Dashboard Actions:
- Select patient → see detailed chart
- Click "Acknowledge" → mark alert as handled
- Switch tabs → view different information
- Data updates automatically every 5-10 seconds

---

## Ambulance Simulator

**URL**: http://localhost:3000/simulator

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  📡 Ambulance IoT Simulator                                │
│  Simulate real-time vital data transmission               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SIMULATION CONTROLS:                                      │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Select Patient:              Select Ambulance:     │  │
│  │ [▼ John Doe (PAT001)]       [▼ AMB001]             │  │
│  │                                                     │  │
│  │ [🔴 Start Simulation] or [⏹️  Stop]               │  │
│  │                                                     │  │
│  │ Status: 🟢 Running                                 │  │
│  │ Transmissions: 45                                  │  │
│  │ Last Transmission: 2:45:30 PM                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  MANUAL VITAL TRANSMISSION:                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Heart Rate:    [72] bpm                             │  │
│  │ SpO2:          [98] %                               │  │
│  │ Systolic BP:   [120] mmHg                           │  │
│  │ Diastolic BP:  [80] mmHg                            │  │
│  │ Temperature:   [37.2] °C                            │  │
│  │                                                     │  │
│  │ [📤 Transmit Vitals]                               │  │
│  │                                                     │  │
│  │ ✅ Vitals transmitted successfully. Status: Stable │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Simulator Modes:

**Mode 1: Auto Simulation (Easiest)**
1. Select Patient
2. Select Ambulance  
3. Click "Start Simulation"
4. System sends vitals every 10 seconds automatically
5. Watch transmission counter increment
6. Click "Stop" to stop

**Mode 2: Manual Input (Custom Testing)**
1. Adjust vital values in form
2. Click "Transmit Vitals"
3. Get instant feedback
4. See classification result
5. Repeat with different values

### Test Cases:

**Stable Patient** (Green):
- HR: 75, SpO2: 98, Sys BP: 125, Dia BP: 82, Temp: 37.1

**Moderate Patient** (Yellow):
- HR: 105, SpO2: 92, Sys BP: 155, Dia BP: 95, Temp: 38.2

**Critical Patient** (Red):
- HR: 145, SpO2: 82, Sys BP: 205, Dia BP: 125, Temp: 39.8

---

## API Documentation Page

**URL**: http://localhost:3000/api-docs

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  API Documentation                                          │
│  Secure Real-Time Ambulance Data Transmission              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  POST /api/vitals/transmit      [CREATE]                  │
│  ├─ Description: Receive vital data from ambulance        │
│  ├─ Request Body:                                          │
│  │  {                                                      │
│  │    "patientId": "PAT001",                              │
│  │    "ambulanceId": "AMB001",                            │
│  │    "heartRate": 92,                                    │
│  │    "spo2": 96,                                         │
│  │    "systolicBp": 135,                                  │
│  │    "diastolicBp": 85,                                  │
│  │    "temperature": 37.2                                 │
│  │  }                                                      │
│  ├─ Response: Classification result with status            │
│  └─ Status: 201 Created                                    │
│                                                             │
│  GET /api/vitals/latest         [READ]                    │
│  ├─ Parameters: ?patientId=PAT001                         │
│  ├─ Returns: Decrypted latest vitals for patient          │
│  └─ Status: 200 OK                                         │
│                                                             │
│  GET /api/alerts/active         [READ]                    │
│  ├─ Returns: All unacknowledged critical alerts           │
│  ├─ Fields: id, patientId, message, createdAt            │
│  └─ Status: 200 OK                                         │
│                                                             │
│  POST /api/alerts/acknowledge   [UPDATE]                  │
│  ├─ Body: { "alertId": 1, "acknowledgedBy": "Dr. X" }    │
│  ├─ Returns: Updated alert object                         │
│  └─ Status: 200 OK                                         │
│                                                             │
│  🔒 SECURITY & ENCRYPTION                                 │
│  • Algorithm: AES-256-GCM                                  │
│  • All vitals encrypted before storage                     │
│  • Unique IV per transmission                             │
│  • Authentication tags for integrity                       │
│                                                             │
│  📊 PATIENT CLASSIFICATION                                │
│  [Classification table with thresholds]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### API Doc Sections:
- Complete endpoint reference
- Request/response examples
- Status codes and meanings
- Security implementation details
- Patient classification thresholds
- Parameter ranges and validation

---

## User Flow Diagram

\`\`\`
START
  │
  ├─→ [Home Page] http://localhost:3000
  │   ├─ Read system overview
  │   └─ Understand architecture
  │
  ├─→ [Dashboard] http://localhost:3000/dashboard
  │   ├─ Monitor patients
  │   ├─ View alerts
  │   ├─ Acknowledge alerts
  │   └─ Check analytics
  │
  ├─→ [Simulator] http://localhost:3000/simulator
  │   ├─ Start auto simulation
  │   │  └─ Data sends every 10 seconds
  │   └─ Or manual transmit
  │      └─ Send custom vitals
  │
  ├─→ [API Docs] http://localhost:3000/api-docs
  │   ├─ Study API reference
  │   ├─ Understand requests
  │   └─ Review security
  │
  └─→ [Deploy to Production]
      ├─ Push to GitHub
      ├─ Connect Vercel
      ├─ Set env variables
      └─ Vercel auto-deploys
\`\`\`

---

## Quick Navigation Shortcuts

| Go To | URL | Purpose |
|-------|-----|---------|
| Home | `http://localhost:3000` | Start here, learn about system |
| Dashboard | `http://localhost:3000/dashboard` | Monitor patients, manage alerts |
| Simulator | `http://localhost:3000/simulator` | Test system with vital data |
| API Docs | `http://localhost:3000/api-docs` | API reference and examples |

---

## Common Navigation Tasks

### Task 1: Monitor Real-Time Vitals
1. Open Dashboard
2. See all patients in grid
3. Click any patient card
4. View vitals chart at bottom
5. Data updates automatically

### Task 2: Test Critical Alert
1. Open Simulator
2. Select a patient
3. Enter critical vitals:
   - HR: 145
   - SpO2: 82
4. Click "Transmit Vitals"
5. Go to Dashboard
6. See red critical alert
7. Click "Acknowledge"

### Task 3: Auto-Test System
1. Open Simulator
2. Click "Start Simulation"
3. Go to Dashboard (new tab)
4. Watch patients update
5. Some will go critical
6. Acknowledge alerts
7. Back to Simulator
8. Click "Stop Simulation"

### Task 4: Review API
1. Open API Docs
2. Read endpoint descriptions
3. Study request/response format
4. Check security section
5. Review classification table

---

## Browser Tips

- **Open Multiple Tabs**: 
  - Tab 1: Simulator
  - Tab 2: Dashboard
  - See real-time updates

- **Use DevTools** (F12):
  - Network tab: See API calls
  - Console: Check for errors
  - Application: View stored data

- **Responsive Design**:
  - Works on mobile
  - Works on tablet
  - Works on desktop

---

## Keyboard Shortcuts

- `Ctrl/Cmd + R`: Refresh page
- `F12`: Open DevTools
- `Ctrl/Cmd + Shift + I`: Inspect element
- `Ctrl/Cmd + Shift + K`: Open console

---

## Getting Help While Navigating

1. **On Home Page**: Read feature descriptions
2. **On Dashboard**: Hover over elements for tooltips
3. **On Simulator**: Form labels explain each field
4. **On API Docs**: Complete examples provided
5. **See README.md**: Comprehensive documentation

---

**Navigation is intuitive!** Start at Home page and follow your needs.

Each page has clear labels, buttons, and sections to guide you.
