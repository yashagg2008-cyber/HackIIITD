# HealPulse 🩺✨
### Voice-First AI Post-Consultation Recovery Companion & Deterministic Clinical Decision Support System (CDSS)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![HL7 FHIR R4](https://img.shields.io/badge/HL7_FHIR-R4_Compliant-E04E39)](https://www.hl7.org/fhir/)
[![ABDM](https://img.shields.io/badge/ABDM-HIE--CM_DEPA-006699)](https://abdm.gov.in/)
[![DPDP Act 2023](https://img.shields.io/badge/DPDP_Act_2023-PII_Sanitized-10B981)](https://www.meity.gov.in/)

---

## 📖 Overview

**HealPulse** is an ABDM-compliant (Ayushman Bharat Digital Mission), zero-hallucination post-consultation recovery companion and triage gateway designed for Indian healthcare workflows. It bridges the critical 14-day recovery gap following hospital discharge or outpatient consultations by pairing **multilingual voice-first check-ins** with a **transparent deterministic CDSS rule engine**, **instant LOINC/SNOMED-CT FHIR R4 bundle generation**, and a **"Doctor's 30-Second Snapshot"** for rapid clinician handover.

---

## 🌟 Key Features

### 1. 🎙️ Multilingual Voice Check-ins (Bhashini ULCA Integration)
- Native Speech-to-Text (STT) and Text-to-Speech (TTS) pipeline supporting **English (`en-IN`)**, **Hindi (`hi-IN`)**, and **Tamil (`ta-IN`)**.
- Browser Web Speech API integration with deterministic simulated audio streams as reliable fallback.

### 2. 🛡️ DPDP Act 2023 Local PII Regex Sanitizer
- **On-Device Data Protection**: Sensitive patient data—including **12-digit Aadhaar numbers**, **ABHA IDs (`XX-XXXX-XXXX-XXXX`)**, **Indian mobile numbers (`+91 / 10-digit`)**, and **patient name identifiers**—are automatically masked *locally* before any cloud or LLM processing.

### 3. ⚖️ Zero-Hallucination Deterministic CDSS Engine
- Transparent rule-based triage system classifying patient recovery into **GREEN** (Stable), **YELLOW** (Clinical Review Advised), or **RED** (Urgent Medical Attention).
- Validates:
  - **SpO2 Levels** (<93% Red, 93-94% Yellow, ≥95% Green)
  - **Blood Pressure** (Systolic <90 or ≥160 mmHg Red)
  - **Resting Heart Rate** (<50 or >115 bpm Red)
  - **Temperature Trends** (≥101.5°F Red, ≥99.5°F Yellow)
  - **Pain / Exertional Symptoms** (Mapped to SNOMED-CT)
- Rule-by-rule explainability table showing parameter values, target corridors, and clinical rationales.

### 4. 🚨 Rule-3 Hardcoded Red-Flag Safety Interceptor
- Automatic detection of high-acuity keywords (`chest pain`, `bleeding`, `breathing difficulty`, `सीने में तेज दर्द`, `நெஞ்சு வலி`, etc.).
- Instantly suppresses standard LLM chat generation and launches a high-contrast emergency triage modal with a single-tap **108 Ambulance SOS dialer**.

### 5. 👨‍⚕️ Doctor's 30-Second Snapshot Mode (Single-Device Handover)
- Tailored for high-throughput OPD and emergency clinicians.
- Aggregates 14-day vital sign trends with interactive **Recharts graphs** (Hemodynamic trajectory and Temperature/SpO2 curves).
- Summarizes medication adherence percentages (RxNorm-referenced) and LOINC-coded baseline lab panels.

### 6. 📄 ABHA & HL7 FHIR R4 Bundle Generator
- Produces valid, production-ready **HL7 FHIR R4 Document Bundles** (`type: "collection"`) conforming to NRCeS India profiles.
- Encodes:
  - `Patient` (ABHA ID, demographic identifiers)
  - `Observation` (Vitals coded to LOINC: `8480-6`, `8462-4`, `8867-4`, `2708-6`, `8310-5`)
  - `Observation` (Symptoms mapped to SNOMED-CT)
  - `DiagnosticReport` (LOINC lab report)
- Includes one-click **Copy JSON** and **Download .JSON** utilities.

### 7. 🔐 ABDM HIE-CM Consent Artefact Manager
- Demonstrates Consent Manager workflows (DEPA consent requests, 30-day token TTLs, grant/revoke actions, and HTTP audit logs).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Responsive Line & Area Charts)
- **Standards & Vocabularies**:
  - HL7 FHIR R4 (NRCeS India profile)
  - SNOMED-CT (Clinical Findings)
  - LOINC (Logical Observation Identifiers Names and Codes)
  - RxNorm (Medication Identifiers)
  - ABDM HIE-CM (Health Information Exchange - Consent Manager)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/) or `pnpm` / `yarn`
- [Git](https://git-scm.com/)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/healpulse.git
   cd healpulse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
healpulse/
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx          # Main HealPulse Application Component & CDSS Logic
    ├── index.css        # Tailwind directives and utility classes
    └── main.jsx         # React DOM root entrypoint
```

---

## 🔒 Privacy & Safety Notice

> **Important**: HealPulse is designed as an ABDM-compliant Clinical Decision Support System (CDSS) for post-consultation recovery monitoring and educational triage. It **does not** provide automated medical diagnoses or prescribe medications. In the event of acute distress or clinical emergency, patients must immediately contact emergency services (108) or visit the nearest hospital.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
