# Encryption Testing Guide

## Complete End-to-End Testing Workflow

### Step 1: Verify Database is Initialized

1. Go to home page: http://localhost:3000
2. Click "Initialize Database" button
3. Wait for success message

### Step 2: Test Data Validation

**Go to Simulator page:** http://localhost:3000/simulator

#### Test Valid Data
1. Manual Vital Transmission section
2. Enter valid values:
   - Heart Rate: 75 bpm
   - SpO₂: 97%
   - Systolic BP: 130 mmHg
   - Diastolic BP: 85 mmHg
   - Temperature: 37°C
3. Click "Transmit Vitals (Encrypted)"
4. Should see: "Vitals transmitted securely (encrypted)"

**Expected Result:** Data validated, encrypted, and stored

#### Test Invalid Data
Try entering out-of-range values:

- Heart Rate: 200 (too high)
- SpO₂: 50% (too low)
- Systolic BP: 30 mmHg (too low)
- Temperature: 45°C (too high)

**Expected Result:** Real-time validation error shows below input

### Step 3: Test Encryption in Database

**Still on Simulator page, scroll down to "Encryption Verification"**

1. Select a patient that just had vitals transmitted (e.g., PAT001)
2. Click "Verify" button
3. Observe results:

**Success Response Should Show:**
- ✅ Green checkmark: "Data is ENCRYPTED and successfully decrypted"
- Encryption Status: Shows "Encrypted" badge with "AES-256-GCM"
- Encrypted Data Sample: Shows encrypted string (appears random)
- Decrypted Data: Shows readable JSON with patient vitals
- Plain Text Vitals: Shows heart rate, SpO₂, etc.
- Integrity Verification: "Verified via authentication tag"

### Step 4: Test Critical Alert Generation

1. Enter Critical vitals manually:
   - Heart Rate: 150 bpm (critical)
   - SpO₂: 82% (critical)
   - Systolic BP: 200 mmHg (critical)
   - Diastolic BP: 90 mmHg
   - Temperature: 39°C

2. Click "Transmit Vitals (Encrypted)"

3. Should see: "Status: Critical"

4. Go to Hospital Dashboard: http://localhost:3000/dashboard

5. Check if alert appears in the Alerts panel

### Step 5: Test Automatic Simulation

1. Simulator page: http://localhost:3000/simulator
2. Select a patient
3. Select an ambulance
4. Click "Start Simulation"
5. Watch transmission count increase every 10 seconds
6. Timestamp updates with each transmission
7. Stop simulation and verify all data is encrypted

### Step 6: Test API Endpoints Directly

#### Using curl or Postman:

**Transmit Vitals (Create Encrypted Record)**
\`\`\`bash
curl -X POST http://localhost:3000/api/vitals/transmit \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PAT001",
    "ambulanceId": "AMB001",
    "heartRate": 85,
    "spo2": 95,
    "systolicBp": 125,
    "diastolicBp": 80,
    "temperature": 37.0
  }'
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "message": "Vitals transmitted and encrypted successfully",
  "vitalId": 123,
  "encrypted": true,
  "classification": {
    "status": "Stable",
    "riskFactors": [],
    "score": 30
  }
}
\`\`\`

**Get Latest Vitals (With Decryption)**
\`\`\`bash
curl http://localhost:3000/api/vitals/latest?patientId=PAT001
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "vital": {
    "id": 123,
    "heartRate": 85,
    "spo2": 95,
    "status": "Stable",
    "decrypted": {
      "patientId": "PAT001",
      "heartRate": 85,
      "spo2": 95,
      "timestamp": "2024-11-04T10:30:00Z"
    }
  }
}
\`\`\`

**Verify Encryption**
\`\`\`bash
curl http://localhost:3000/api/vitals/verify-encryption?patientId=PAT001
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "message": "Data is ENCRYPTED and successfully decrypted",
  "vital": {
    "id": 123,
    "encrypted": true,
    "encryptedDataSample": "L2hs7f+Vk/w=:a1b2c3...",
    "decryptedData": {
      "patientId": "PAT001",
      "heartRate": 85,
      "spo2": 95
    },
    "verification": {
      "encryptionFormat": "AES-256-GCM",
      "integrity": "Verified via authentication tag"
    }
  }
}
\`\`\`

### Step 7: Validation Rules Testing

Test these edge cases:

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| HR too low | HR: 35 | Error: "out of valid range (40-180)" |
| HR too high | HR: 200 | Error: "out of valid range (40-180)" |
| SpO₂ too low | SpO₂: 55 | Error: "out of valid range (60-100)" |
| SpO₂ too high | SpO₂: 105 | Error: "out of valid range (60-100)" |
| Systolic too low | SBP: 30 | Error: "out of valid range (40-250)" |
| Systolic too high | SBP: 300 | Error: "out of valid range (40-250)" |
| Diastolic too low | DBP: 15 | Error: "out of valid range (20-150)" |
| Diastolic too high | DBP: 160 | Error: "out of valid range (20-150)" |
| Systolic < Diastolic | SBP: 100, DBP: 120 | Error: "Systolic cannot be less than Diastolic" |
| Temp too low | Temp: 30°C | Error: "out of valid range (32-42)" |
| Temp too high | Temp: 45°C | Error: "out of valid range (32-42)" |
| Valid normal | HR: 72, SpO₂: 98, SBP: 120, DBP: 80, T: 37 | ✅ Success, Status: Stable |
| Valid critical | HR: 145, SpO₂: 82, SBP: 200, DBP: 95, T: 39 | ✅ Success, Status: Critical, Alert created |

### Step 8: Console Logs Verification

Open browser developer tools (F12) and check Console tab:

**When transmitting vitals, you should see:**
\`\`\`
[v0] Vital transmission received {patientId: "PAT001", ...}
[v0] Vitals passed validation
[v0] Patient classified as Stable
[v0] Encrypting vital data
[v0] Data encrypted successfully, format: ABCDef+VkxY=:a1b2c3...
[v0] Vitals stored in database with ID: 123
[v0] Vital transmission completed successfully
\`\`\`

**When verifying encryption, you should see:**
\`\`\`
[v0] Verification result: {success: true, message: "Data is ENCRYPTED..."}
\`\`\`

### Step 9: Hospital Dashboard Testing

1. Go to Dashboard: http://localhost:3000/dashboard
2. Transmit some vitals from Simulator
3. Switch back to Dashboard (may need to refresh)
4. Should see:
   - Patient card with latest vitals
   - Status classification (Stable/Moderate/Critical)
   - Color coding (green/yellow/red)
   - If critical, alert should appear in alert panel
   - Real-time chart updates (if configured)

### Step 10: Database Verification (Optional)

To directly verify data in database:

\`\`\`bash
# Connect to your Neon database (example)
psql "postgresql://user:password@host/database"

# Check vitals table
SELECT id, patient_id, heart_rate, status, 
       encrypted_data IS NOT NULL as has_encryption
FROM vitals 
ORDER BY recorded_at DESC 
LIMIT 5;

# Should show:
# - id: incrementing integers
# - patient_id: PAT001, PAT002, etc.
# - heart_rate: numeric values
# - status: "Stable", "Critical", etc.
# - has_encryption: true (means encrypted_data column has data)

# Verify encrypted_data is actually encrypted (not readable)
SELECT encrypted_data 
FROM vitals 
WHERE patient_id = 'PAT001' 
LIMIT 1;

# Should show something like:
# ABCDef+VkxY=:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9:xyz+QWE/Ty8=
# (NOT readable patient data - that's good!)
\`\`\`

## Troubleshooting

### Issue: "Data is NOT encrypted in database"

**Solution:**
1. Check database was initialized: Visit home page → click "Initialize Database"
2. Verify vitals were transmitted: Check console logs
3. Re-transmit vitals from simulator page

### Issue: "Decryption failed"

**Solution:**
1. Check `ENCRYPTION_KEY` environment variable is set
2. Verify it's the same key used for encryption
3. Check for SQL errors in console
4. Restart the app

### Issue: Validation errors not showing

**Solution:**
1. Check browser console for JavaScript errors
2. Verify validator.ts file exists at `lib/vital-validator.ts`
3. Check network tab to see API response

### Issue: Database connection fails

**Solution:**
1. Verify Neon integration is connected
2. Check `NEON_POSTGRES_URL` is set in environment
3. Try clicking "Initialize Database" button on home page

## Success Criteria

You've successfully implemented end-to-end encryption if:

- ✅ All vitals are validated before transmission
- ✅ Validation shows errors for out-of-range values
- ✅ Valid vitals transmit successfully
- ✅ Transmit response shows `"encrypted": true`
- ✅ Verification endpoint shows encrypted data in database
- ✅ Decrypted data matches transmitted data
- ✅ Authentication tag verification succeeds
- ✅ Critical vitals trigger alerts
- ✅ Dashboard displays decrypted data
- ✅ All console logs show successful encryption steps
