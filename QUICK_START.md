# Quick Start - Secure Real-Time Ambulance Data Transmission System

## Get Running in 5 Minutes

### Step 1: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### Step 2: Open in Browser
- **Home Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Simulator**: http://localhost:3000/simulator
- **API Docs**: http://localhost:3000/api-docs

### Step 3: Test the System

1. Go to **Simulator** (http://localhost:3000/simulator)
2. Select Patient: `John Doe (PAT001)`
3. Select Ambulance: `AMB001`
4. Click **"Start Simulation"**
5. Go to **Dashboard** (http://localhost:3000/dashboard)
6. Watch patient data update in real-time!

## System Test Cases

### Test 1: Send Stable Vitals
**Simulator** → Manual Input:
- Heart Rate: 75 bpm
- SpO2: 98%
- Systolic BP: 125 mmHg
- Result: ✓ Status shows "Stable" (Green)

### Test 2: Send Critical Vitals
**Simulator** → Manual Input:
- Heart Rate: 145 bpm
- SpO2: 82%
- Systolic BP: 210 mmHg
- Result: 🔴 Status shows "Critical" (Red) + Alert appears

### Test 3: Test Alert Acknowledgment
1. Critical alert appears on Dashboard
2. Click "Acknowledge" button
3. Alert disappears from active list

## Key Features to Explore

- **Real-Time Monitoring**: Patient cards update instantly
- **Encryption**: All data encrypted with AES-256-GCM
- **Auto Classification**: Conditions automatically classified
- **Alert System**: Critical alerts trigger automatically
- **Analytics**: View system statistics and trends

## Environment Setup

### Quick Setup (Local Testing):

Already configured! Just run:
\`\`\`bash
npm run dev
\`\`\`

### For Production Deployment:

1. **Add to Vercel**:
   - Push to GitHub
   - Connect GitHub repo to Vercel
   - Vercel auto-detects Next.js

2. **Set Environment Variables**:
   - `NEON_POSTGRES_URL`: From Neon integration (already connected)
   - `ENCRYPTION_KEY`: Generate with `openssl rand -base64 32`

3. **Deploy**:
   \`\`\`bash
   git push origin main
   # Vercel auto-deploys
   \`\`\`

## API Quick Reference

### Transmit Patient Vitals
\`\`\`bash
curl -X POST http://localhost:3000/api/vitals/transmit \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PAT001",
    "ambulanceId": "AMB001",
    "heartRate": 92,
    "spo2": 96,
    "systolicBp": 135,
    "diastolicBp": 85,
    "temperature": 37.2
  }'
\`\`\`

### Get Latest Vitals
\`\`\`bash
curl http://localhost:3000/api/vitals/latest?patientId=PAT001
\`\`\`

### Get Active Alerts
\`\`\`bash
curl http://localhost:3000/api/alerts/active
\`\`\`

## Simulator Quick Controls

**Auto Mode** (Recommended for Testing):
1. Select patient
2. Select ambulance
3. Click "Start Simulation"
4. Watch vitals transmit every 10 seconds

**Manual Mode** (Custom Values):
1. Adjust vital readings
2. Click "Transmit Vitals"
3. Immediate feedback

## Dashboard Quick Tips

- **Patient Cards**: Color-coded by status (Green/Yellow/Red)
- **Click Patient Card**: Shows detailed vital chart
- **Alerts Tab**: View all critical alerts
- **Analytics Tab**: System statistics

## Status Indicators

- Green: Stable condition (Normal vitals)
- Yellow: Moderate condition (Some abnormal vitals)
- Red: Critical condition (Multiple abnormal vitals)

## Database Schema (Auto-Created)

Tables created automatically:
- `patients`: 3 test patients pre-loaded
- `ambulances`: 2 test ambulances pre-loaded
- `vitals`: Incoming vital readings
- `alerts`: Critical condition alerts
- `vital_history`: Historical data

## Troubleshooting

### Port Already in Use?
\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
\`\`\`

### Database Not Connecting?
- Check `NEON_POSTGRES_URL` environment variable
- Verify Neon integration is connected
- Restart development server

### Encryption Error?
- Ensure `ENCRYPTION_KEY` is set
- Generate new key: `openssl rand -base64 32`
- Restart server

## Next Steps

1. **Explore the Dashboard** - See live patient monitoring
2. **Run Simulations** - Test with different vital ranges
3. **Check API Docs** - Understand all endpoints
4. **Review README.md** - Full system documentation
5. **Deploy to Production** - See DEPLOYMENT_GUIDE.md

## File Locations

\`\`\`
app/
  ├── page.tsx                 ← Home page (start here!)
  ├── dashboard/page.tsx       ← Hospital dashboard
  ├── simulator/page.tsx       ← Ambulance simulator
  └── api/                     ← REST API endpoints
lib/
  ├── encryption.ts            ← AES-256 encryption
  ├── db.ts                    ← Database functions
  └── classification.ts        ← Condition classifier
components/
  ├── dashboard/               ← Dashboard components
  └── simulator/               ← Simulator components
\`\`\`

## Key Commands

\`\`\`bash
npm run dev       # Start development
npm run build     # Build for production
npm run start     # Start production server
npm test          # Run tests (when added)
npm run lint      # Run linter
\`\`\`

## Features Available

- AES-256-GCM Encryption ✓
- Real-Time Vitals Monitoring ✓
- Automatic Patient Classification ✓
- Critical Alert System ✓
- Hospital Dashboard ✓
- Ambulance Simulator ✓
- API Documentation ✓
- PostgreSQL Database ✓

## Support

- **Home Page**: Home page explains the system
- **API Docs**: Visit /api-docs for complete API reference
- **README.md**: Full system documentation
- **IMPLEMENTATION_GUIDE.md**: Architecture details

## System Status

- Database: Connected
- Encryption: Active (AES-256-GCM)
- API: Ready
- Dashboard: Live
- Simulator: Ready to test

---

**Ready to use!** Start with: `npm run dev`

Questions? See README.md for detailed documentation.
