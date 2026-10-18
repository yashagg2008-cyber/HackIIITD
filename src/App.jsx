import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  Mic,
  MicOff,
  Volume2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  FileCode,
  UserPlus,
  Users,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  PhoneCall,
  Send,
  Sparkles,
  Lock,
  RefreshCw,
  Copy,
  Download,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Thermometer,
  Wind,
  Pill,
  ClipboardList,
  Languages,
  Eye,
  EyeOff,
  Terminal,
  X,
  Plus,
  Clock,
  Check,
  FileText,
  ArrowUpRight,
  Bot,
  UserCheck,
  Info,
  Zap,
  HelpCircle,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

// ============================================================================
// 1. INITIAL MOCK PATIENT DATABASE (SURESH KUMAR & ANANYA SHARMA)
// ============================================================================

const INITIAL_PATIENTS = [
  {
    id: 'pat-suresh-01',
    name: 'Suresh Kumar',
    age: 58,
    gender: 'Male',
    bloodGroup: 'B+',
    abhaId: '91-8829-1029-3842',
    abhaAddress: 'suresh.kumar58@abdm',
    phone: '+91 98112 45890',
    primaryCondition: 'Post-CABG Surgery (Day 14) & Type 2 Diabetes Mellitus',
    surgeryOrAdmissionDate: '2026-10-04',
    attendingDoctor: 'Dr. Rajeshwari Nair, MCh (CTVS)',
    hospital: 'AIIMS / National Heart Institute, New Delhi',
    clinicalCohort: 'cardiac',
    comorbidities: ['Coronary Artery Disease (Triple Vessel)', 'Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    allergies: ['Penicillin (Mild Rash)'],
    medications: [
      { id: 'm1', name: 'Aspirin (Ecosprin)', dosage: '75 mg', frequency: 'Once Daily (Post Lunch)', rxNorm: '1191', adherence: 96, takenToday: true },
      { id: 'm2', name: 'Atorvastatin', dosage: '40 mg', frequency: 'Once Daily (At Bedtime)', rxNorm: '83367', adherence: 100, takenToday: true },
      { id: 'm3', name: 'Metformin SR', dosage: '500 mg', frequency: 'Twice Daily (Morning/Night)', rxNorm: '6809', adherence: 92, takenToday: true },
      { id: 'm4', name: 'Metoprolol Succinate', dosage: '25 mg', frequency: 'Once Daily (Morning)', rxNorm: '866924', adherence: 96, takenToday: false }
    ],
    baselineLabs: [
      { test: 'HbA1c', value: '7.2', unit: '%', refRange: '< 6.5%', loinc: '4548-4', date: '2026-10-03', status: 'Borderline' },
      { test: 'LDL Cholesterol', value: '82', unit: 'mg/dL', refRange: '< 70 mg/dL (Post-CABG)', loinc: '13457-7', date: '2026-10-03', status: 'Near Target' },
      { test: 'Fasting Blood Glucose', value: '118', unit: 'mg/dL', refRange: '70 - 110 mg/dL', loinc: '1558-6', date: '2026-10-15', status: 'Controlled' },
      { test: 'Serum Creatinine', value: '1.02', unit: 'mg/dL', refRange: '0.7 - 1.3 mg/dL', loinc: '2160-0', date: '2026-10-15', status: 'Normal' },
      { test: '2D Echo LVEF', value: '54', unit: '%', refRange: '55 - 70%', loinc: '10230-1', date: '2026-10-06', status: 'Stable Post-Op' }
    ],
    quickPrompts: [
      'Is mild breathlessness normal after climbing stairs?',
      'Can I take my Aspirin 75mg after breakfast instead of lunch?',
      'My sternal incision itches slightly when dry. What should I do?',
      '🚨 Trigger Red Flag: I have sudden chest pain and sweating'
    ],
    logs: [
      { day: 'Day 1', date: 'Oct 05', sysBP: 138, diaBP: 86, hr: 88, spo2: 95, temp: 99.1, painScore: 5, symptomText: 'Post-op sternal tightness, mild fatigue', snomedCode: '29857009', snomedDisplay: 'Post-operative sternal discomfort', triage: 'YELLOW' },
      { day: 'Day 2', date: 'Oct 06', sysBP: 136, diaBP: 84, hr: 86, spo2: 96, temp: 98.9, painScore: 4, symptomText: 'Slight soreness around incision while coughing', snomedCode: '225566008', snomedDisplay: 'Incisional pain', triage: 'GREEN' },
      { day: 'Day 3', date: 'Oct 07', sysBP: 134, diaBP: 84, hr: 84, spo2: 96, temp: 98.6, painScore: 4, symptomText: 'Walked 100m in corridor, mild fatigue', snomedCode: '84229001', snomedDisplay: 'Fatigue', triage: 'GREEN' },
      { day: 'Day 4', date: 'Oct 08', sysBP: 132, diaBP: 82, hr: 82, spo2: 97, temp: 98.6, painScore: 3, symptomText: 'Appetite improving, sleeping better', snomedCode: '161891005', snomedDisplay: 'Normal recovery', triage: 'GREEN' },
      { day: 'Day 5', date: 'Oct 09', sysBP: 130, diaBP: 80, hr: 80, spo2: 97, temp: 98.4, painScore: 3, symptomText: 'No acute complaints, dressing clean and dry', snomedCode: '161891005', snomedDisplay: 'Well controlled status', triage: 'GREEN' },
      { day: 'Day 6', date: 'Oct 10', sysBP: 135, diaBP: 84, hr: 85, spo2: 96, temp: 98.8, painScore: 3, symptomText: 'Mild ankle puffiness in evening after sitting', snomedCode: '267038008', snomedDisplay: 'Mild peripheral edema', triage: 'YELLOW' },
      { day: 'Day 7', date: 'Oct 11', sysBP: 128, diaBP: 80, hr: 78, spo2: 97, temp: 98.6, painScore: 2, symptomText: 'Leg elevation helped swelling subside', snomedCode: '161891005', snomedDisplay: 'Symptom resolved', triage: 'GREEN' },
      { day: 'Day 8', date: 'Oct 12', sysBP: 126, diaBP: 78, hr: 76, spo2: 98, temp: 98.4, painScore: 2, symptomText: 'Walked 15 mins twice today comfortably', snomedCode: '161891005', snomedDisplay: 'Good exercise tolerance', triage: 'GREEN' },
      { day: 'Day 9', date: 'Oct 13', sysBP: 128, diaBP: 79, hr: 77, spo2: 98, temp: 98.6, painScore: 2, symptomText: 'Feeling rested, blood sugar 116 fasting', snomedCode: '161891005', snomedDisplay: 'Normoglycemic recovery', triage: 'GREEN' },
      { day: 'Day 10', date: 'Oct 14', sysBP: 125, diaBP: 78, hr: 75, spo2: 98, temp: 98.5, painScore: 2, symptomText: 'Mild itching along healed sternal scar', snomedCode: '418290006', snomedDisplay: 'Pruritus of surgical scar', triage: 'GREEN' },
      { day: 'Day 11', date: 'Oct 15', sysBP: 124, diaBP: 76, hr: 74, spo2: 98, temp: 98.6, painScore: 1, symptomText: 'No breathlessness on flat walking', snomedCode: '161891005', snomedDisplay: 'Stable recovery', triage: 'GREEN' },
      { day: 'Day 12', date: 'Oct 16', sysBP: 126, diaBP: 78, hr: 76, spo2: 98, temp: 98.4, painScore: 1, symptomText: 'Routine spirometry exercises completed', snomedCode: '161891005', snomedDisplay: 'Adherent to rehab', triage: 'GREEN' },
      { day: 'Day 13', date: 'Oct 17', sysBP: 132, diaBP: 82, hr: 82, spo2: 96, temp: 98.7, painScore: 2, symptomText: 'Mild breathlessness after 1 flight of stairs', snomedCode: '267036007', snomedDisplay: 'Dyspnea on exertion (mild)', triage: 'YELLOW' },
      { day: 'Day 14', date: 'Oct 18', sysBP: 124, diaBP: 78, hr: 74, spo2: 98, temp: 98.4, painScore: 1, symptomText: 'Resting comfortably this morning, vitals stable', snomedCode: '161891005', snomedDisplay: 'Clinical stability', triage: 'GREEN' }
    ]
  },
  {
    id: 'pat-ananya-02',
    name: 'Ananya Sharma',
    age: 29,
    gender: 'Female',
    bloodGroup: 'O+',
    abhaId: '91-4412-8831-9021',
    abhaAddress: 'ananya.sharma29@abdm',
    phone: '+91 98201 77341',
    primaryCondition: 'Acute Viral Fever / Dengue Convalescence (Day 14)',
    surgeryOrAdmissionDate: '2026-10-04',
    attendingDoctor: 'Dr. Vikramaditya Sen, MD (Internal Medicine)',
    hospital: 'Safdarjung / Max Super Speciality Clinic, New Delhi',
    clinicalCohort: 'febrile',
    comorbidities: ['No chronic illnesses', 'Episode of Dengue NS1+ (Resolved)'],
    allergies: ['Ibuprofen / NSAIDs (Contraindicated in Viral Thrombocytopenia)'],
    medications: [
      { id: 'm10', name: 'Paracetamol (Dolo)', dosage: '650 mg', frequency: 'SOS (Only if Temp > 100.0°F)', rxNorm: '161', adherence: 100, takenToday: false },
      { id: 'm11', name: 'WHO Oral Rehydration Salts (ORS)', dosage: '200 mL', frequency: '5-6 times daily (2 Liters/day)', rxNorm: '312119', adherence: 95, takenToday: true },
      { id: 'm12', name: 'Folic Acid + Vitamin B-Complex', dosage: '5 mg', frequency: 'Once Daily (After Breakfast)', rxNorm: '4511', adherence: 98, takenToday: true }
    ],
    baselineLabs: [
      { test: 'Platelet Count (Current)', value: '1,68,000', unit: '/µL', refRange: '1,50,000 - 4,50,000 /µL', loinc: '777-3', date: '2026-10-16', status: 'Recovered (Nadir: 88k)' },
      { test: 'Hematocrit (PCV)', value: '38.4', unit: '%', refRange: '36 - 46%', loinc: '4544-3', date: '2026-10-16', status: 'Normal (No Hemoconcentration)' },
      { test: 'Total Leukocyte Count (WBC)', value: '5,400', unit: '/µL', refRange: '4,000 - 11,000 /µL', loinc: '6690-2', date: '2026-10-16', status: 'Normal' },
      { test: 'C-Reactive Protein (CRP)', value: '3.8', unit: 'mg/L', refRange: '< 5.0 mg/L', loinc: '1988-5', date: '2026-10-16', status: 'Normalizing' },
      { test: 'SGOT / AST', value: '39', unit: 'U/L', refRange: '10 - 40 U/L', loinc: '1920-8', date: '2026-10-16', status: 'Normal' }
    ],
    quickPrompts: [
      'I have been afebrile for 4 days but still feel post-viral fatigue. Is this expected?',
      'How much ORS and fluids should I continue drinking now that my fever is gone?',
      'Can I resume gym workouts this week after viral fever recovery?',
      '🚨 Trigger Red Flag: I have severe bleeding from gums and dizziness'
    ],
    logs: [
      { day: 'Day 1', date: 'Oct 05', sysBP: 108, diaBP: 70, hr: 104, spo2: 98, temp: 102.4, painScore: 6, symptomText: 'High grade fever with retro-orbital headache and myalgia', snomedCode: '386661006', snomedDisplay: 'Fever with chills and myalgia', triage: 'YELLOW' },
      { day: 'Day 2', date: 'Oct 06', sysBP: 106, diaBP: 68, hr: 102, spo2: 98, temp: 101.8, painScore: 5, symptomText: 'Body ache, taking Paracetamol and plenty of ORS', snomedCode: '68962001', snomedDisplay: 'Myalgia', triage: 'YELLOW' },
      { day: 'Day 3', date: 'Oct 07', sysBP: 108, diaBP: 70, hr: 98, spo2: 98, temp: 100.9, painScore: 4, symptomText: 'Fever spikes reducing in frequency, mild nausea', snomedCode: '422587007', snomedDisplay: 'Nausea', triage: 'YELLOW' },
      { day: 'Day 4', date: 'Oct 08', sysBP: 110, diaBP: 72, hr: 92, spo2: 99, temp: 99.8, painScore: 3, symptomText: 'Low-grade temperature, appetite slowly returning', snomedCode: '386661006', snomedDisplay: 'Low grade pyrexia', triage: 'YELLOW' },
      { day: 'Day 5', date: 'Oct 09', sysBP: 110, diaBP: 72, hr: 88, spo2: 99, temp: 99.2, painScore: 3, symptomText: 'Mild convalescent rash on forearms, no bleeding', snomedCode: '271807003', snomedDisplay: 'Viral exanthem of recovery', triage: 'GREEN' },
      { day: 'Day 6', date: 'Oct 10', sysBP: 112, diaBP: 74, hr: 84, spo2: 99, temp: 98.8, painScore: 2, symptomText: 'Afebrile for 24 hours, platelets rising', snomedCode: '161891005', snomedDisplay: 'Afebrile status', triage: 'GREEN' },
      { day: 'Day 7', date: 'Oct 11', sysBP: 112, diaBP: 74, hr: 82, spo2: 99, temp: 98.6, painScore: 2, symptomText: 'Moderate post-viral tiredness in afternoon', snomedCode: '84229001', snomedDisplay: 'Post-viral fatigue', triage: 'GREEN' },
      { day: 'Day 8', date: 'Oct 12', sysBP: 114, diaBP: 74, hr: 80, spo2: 99, temp: 98.4, painScore: 2, symptomText: 'Good oral fluid intake, no fever', snomedCode: '161891005', snomedDisplay: 'Well hydrated', triage: 'GREEN' },
      { day: 'Day 9', date: 'Oct 13', sysBP: 114, diaBP: 76, hr: 78, spo2: 99, temp: 98.6, painScore: 1, symptomText: 'Rash completely faded, energy improving', snomedCode: '161891005', snomedDisplay: 'Convalescence normal', triage: 'GREEN' },
      { day: 'Day 10', date: 'Oct 14', sysBP: 112, diaBP: 74, hr: 78, spo2: 99, temp: 98.4, painScore: 1, symptomText: 'Resumed light work from home', snomedCode: '161891005', snomedDisplay: 'Functional recovery', triage: 'GREEN' },
      { day: 'Day 11', date: 'Oct 15', sysBP: 114, diaBP: 76, hr: 76, spo2: 99, temp: 98.4, painScore: 1, symptomText: 'Sleeping 8 hours, no headaches', snomedCode: '161891005', snomedDisplay: 'Stable recovery', triage: 'GREEN' },
      { day: 'Day 12', date: 'Oct 16', sysBP: 116, diaBP: 76, hr: 75, spo2: 99, temp: 98.5, painScore: 1, symptomText: 'Platelets confirmed at 1.68 Lakh', snomedCode: '161891005', snomedDisplay: 'Hematological recovery', triage: 'GREEN' },
      { day: 'Day 13', date: 'Oct 17', sysBP: 114, diaBP: 74, hr: 76, spo2: 99, temp: 98.4, painScore: 1, symptomText: 'Mild fatigue after evening walk', snomedCode: '84229001', snomedDisplay: 'Mild asthenia', triage: 'GREEN' },
      { day: 'Day 14', date: 'Oct 18', sysBP: 114, diaBP: 76, hr: 74, spo2: 99, temp: 98.4, painScore: 0, symptomText: 'Feeling energetic and completely fever-free', snomedCode: '161891005', snomedDisplay: 'Complete clinical recovery', triage: 'GREEN' }
    ]
  }
];

// ============================================================================
// 2. MODULAR API INTEGRATION LAYER & SERVICES
// ============================================================================

/**
 * 2.1 BhashiniApiService
 * Handles multilingual Speech-to-Text (STT), Text-to-Speech (TTS),
 * fallback simulated audio streams, and DPDP Act 2023 local PII Regex Masking.
 */
const BhashiniApiService = {
  supportedLanguages: [
    {
      code: 'en-IN',
      label: 'English (India)',
      nativeLabel: 'English',
      bhashiniModelId: 'ai4bharat/conformer-en-gpu--t4',
      ttsVoiceLang: 'en-IN'
    },
    {
      code: 'hi-IN',
      label: 'Hindi (हिन्दी)',
      nativeLabel: 'हिन्दी',
      bhashiniModelId: 'ai4bharat/conformer-hi-gpu--t4',
      ttsVoiceLang: 'hi-IN'
    },
    {
      code: 'ta-IN',
      label: 'Tamil (தமிழ்)',
      nativeLabel: 'தமிழ்',
      bhashiniModelId: 'ai4bharat/conformer-ta-gpu--t4',
      ttsVoiceLang: 'ta-IN'
    }
  ],

  // Realistic voice simulation samples (includes PII to demonstrate DPDP Act Regex Masking live!)
  getSampleVoiceStreams: (patient, langCode) => {
    const isCardiac = patient.clinicalCohort === 'cardiac';
    if (langCode === 'hi-IN') {
      return isCardiac
        ? [
            {
              title: 'Routine Check-in (Hindi + PII Demo)',
              nativeText: `नमस्ते डॉक्टर, मेरा नाम ${patient.name} है, मेरा फोन 9811245890 और आधार 4921 8832 1029 है। आज सुबह चलने के बाद मुझे हल्की सांस फूलने और थकान महसूस हुई, लेकिन सीने में कोई तेज दर्द नहीं है।`,
              translatedEn: `Hello Doctor, my name is ${patient.name}, my phone is 9811245890 and Aadhaar is 4921 8832 1029. This morning after walking I felt mild breathlessness and fatigue, but no sharp chest pain.`,
              suggestedVitals: { sysBP: 134, diaBP: 84, hr: 84, spo2: 96, temp: 98.6, painScore: 2 }
            },
            {
              title: 'Stable Recovery Check-in (Hindi)',
              nativeText: `आज मेरी तबीयत बिल्कुल ठीक है। मैंने समय पर एस्पिरिन और मेटफॉर्मिन ले ली है। घाव सूखा है और कोई तकलीफ नहीं है।`,
              translatedEn: `Today my health is completely fine. I have taken Aspirin and Metformin on time. The incision is dry and there is no discomfort.`,
              suggestedVitals: { sysBP: 122, diaBP: 78, hr: 74, spo2: 98, temp: 98.4, painScore: 1 }
            },
            {
              title: '🚨 Red-Flag Emergency Stream (Hindi)',
              nativeText: `मुझे अचानक सीने में तेज दर्द हो रहा है और सांस लेने में तकलीफ हो रही है, पसीना भी आ रहा है।`,
              translatedEn: `I am having sudden severe chest pain and breathing difficulty, along with sweating.`,
              suggestedVitals: { sysBP: 164, diaBP: 98, hr: 118, spo2: 91, temp: 98.8, painScore: 8 }
            }
          ]
        : [
            {
              title: 'Viral Fever Follow-up (Hindi + PII Demo)',
              nativeText: `नमस्ते, मेरा नाम ${patient.name} है और मेरा नंबर +91-9820177341 है। आज बुखार नहीं है, तापमान 98.4 है, बस दोपहर में थोड़ी कमजोरी और थकान लगती है।`,
              translatedEn: `Hello, my name is ${patient.name} and my number is +91-9820177341. Today there is no fever, temperature is 98.4, just feeling mild weakness and fatigue in the afternoon.`,
              suggestedVitals: { sysBP: 114, diaBP: 74, hr: 78, spo2: 99, temp: 98.4, painScore: 1 }
            },
            {
              title: 'Moderate Fever Recurrence (Hindi)',
              nativeText: `आज शाम से हल्का बुखार 100.4 डिग्री और सिरदर्द महसूस हो रहा है। मैंने ओआरएस (ORS) पिया है।`,
              translatedEn: `Since this evening I am feeling a mild fever of 100.4 degrees and headache. I have taken ORS.`,
              suggestedVitals: { sysBP: 110, diaBP: 70, hr: 96, spo2: 98, temp: 100.4, painScore: 4 }
            }
          ];
    }

    if (langCode === 'ta-IN') {
      return isCardiac
        ? [
            {
              title: 'Routine Check-in (Tamil + PII Demo)',
              nativeText: `வணக்கம் டாக்டர், என் பெயர் ${patient.name}, என் தொலைபேசி எண் 9811245890 மற்றும் ஆதார் 4921-8832-1029. மாடிப்படி ஏறிய பிறகு லேசான மூச்சு வாங்குதல் மற்றும் சோர்வு உள்ளது, ஆனால் நெஞ்சு வலி இல்லை.`,
              translatedEn: `Hello Doctor, my name is ${patient.name}, my phone number is 9811245890 and Aadhaar is 4921-8832-1029. After climbing stairs there is mild breathlessness and fatigue, but no chest pain.`,
              suggestedVitals: { sysBP: 134, diaBP: 83, hr: 84, spo2: 96, temp: 98.6, painScore: 2 }
            },
            {
              title: 'Stable Check-in (Tamil)',
              nativeText: `இன்று நான் நலமாக இருக்கிறேன். காலை மருந்துகளை சரியாக எடுத்துக்கொண்டேன். அறுவை சிகிச்சை தழும்பு நன்றாக ஆறி வருகிறது.`,
              translatedEn: `Today I am doing well. I took my morning medicines properly. The surgical scar is healing well.`,
              suggestedVitals: { sysBP: 124, diaBP: 78, hr: 75, spo2: 98, temp: 98.4, painScore: 1 }
            }
          ]
        : [
            {
              title: 'Viral Recovery Check-in (Tamil + PII Demo)',
              nativeText: `வணக்கம், என் பெயர் ${patient.name}, போன் 9820177341. இன்று காய்ச்சல் இல்லை, உடல் வெப்பநிலை சீராக உள்ளது. லேசான உடல் சோர்வு மட்டும் உள்ளது.`,
              translatedEn: `Hello, my name is ${patient.name}, phone 9820177341. Today there is no fever, body temperature is normal. Only mild body fatigue is present.`,
              suggestedVitals: { sysBP: 114, diaBP: 75, hr: 76, spo2: 99, temp: 98.4, painScore: 1 }
            }
          ];
    }

    // Default English (en-IN)
    return isCardiac
      ? [
          {
            title: 'Mild Exertional Breathlessness (with PII Demo)',
            nativeText: `Hello Doctor, my name is ${patient.name}, my mobile is +91 98112 45890 and Aadhaar is 4921 8832 1029. I had mild breathlessness after climbing one flight of stairs today and slight sternal soreness, but it settled after resting for 5 minutes.`,
            translatedEn: `Hello Doctor, my name is ${patient.name}, my mobile is +91 98112 45890 and Aadhaar is 4921 8832 1029. I had mild breathlessness after climbing one flight of stairs today and slight sternal soreness, but it settled after resting for 5 minutes.`,
            suggestedVitals: { sysBP: 134, diaBP: 84, hr: 84, spo2: 96, temp: 98.6, painScore: 2 }
          },
          {
            title: 'Optimal Stable Check-in',
            nativeText: `Feeling rested and comfortable this morning. Walked 15 minutes in the park without any shortness of breath or chest discomfort. Took Aspirin and Atorvastatin on schedule.`,
            translatedEn: `Feeling rested and comfortable this morning. Walked 15 minutes in the park without any shortness of breath or chest discomfort. Took Aspirin and Atorvastatin on schedule.`,
            suggestedVitals: { sysBP: 124, diaBP: 78, hr: 74, spo2: 98, temp: 98.4, painScore: 1 }
          },
          {
            title: '🚨 Red-Flag Cardiac Alert Check-in',
            nativeText: `I started having sudden chest pain radiating to my left arm and breathing difficulty 10 minutes ago while resting.`,
            translatedEn: `I started having sudden chest pain radiating to my left arm and breathing difficulty 10 minutes ago while resting.`,
            suggestedVitals: { sysBP: 162, diaBP: 96, hr: 116, spo2: 91, temp: 98.7, painScore: 8 }
          }
        ]
      : [
          {
            title: 'Post-Viral Fatigue Check-in (with PII Demo)',
            nativeText: `Hi Doctor, my name is ${patient.name}, phone 9820177341 and Aadhaar 7741-2290-8123. I have had no fever for the last 4 days and my appetite is back, though I still feel mild fatigue by evening.`,
            translatedEn: `Hi Doctor, my name is ${patient.name}, phone 9820177341 and Aadhaar 7741-2290-8123. I have had no fever for the last 4 days and my appetite is back, though I still feel mild fatigue by evening.`,
            suggestedVitals: { sysBP: 114, diaBP: 74, hr: 76, spo2: 99, temp: 98.4, painScore: 1 }
          },
          {
            title: 'Low-Grade Fever Spike Check-in',
            nativeText: `My temperature rose slightly to 100.2 F this afternoon with mild headache and body ache. Drinking ORS regularly.`,
            translatedEn: `My temperature rose slightly to 100.2 F this afternoon with mild headache and body ache. Drinking ORS regularly.`,
            suggestedVitals: { sysBP: 108, diaBP: 70, hr: 94, spo2: 98, temp: 100.2, painScore: 3 }
          }
        ];
  },

  /**
   * DPDP Act 2023 Compliance: Local Regex PII Sanitizer
   * Masks Aadhaar, Phone Numbers, ABHA IDs, Emails, and Patient Names before cloud processing.
   */
  maskPII: (rawText, activePatientName = '') => {
    if (!rawText) return { sanitizedText: '', redactions: [] };
    let sanitized = rawText;
    const redactions = [];

    // 1. Aadhaar Pattern (12 digits in 4-4-4 format)
    const aadhaarRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
    const aadhaarMatches = sanitized.match(aadhaarRegex);
    if (aadhaarMatches) {
      aadhaarMatches.forEach((m) => redactions.push({ type: 'AADHAAR_ID', original: m, replacement: '[AADHAAR-REDACTED]' }));
      sanitized = sanitized.replace(aadhaarRegex, '[AADHAAR-REDACTED]');
    }

    // 2. ABHA ID Pattern (XX-XXXX-XXXX-XXXX)
    const abhaRegex = /\b\d{2}-\d{4}-\d{4}-\d{4}\b/g;
    const abhaMatches = sanitized.match(abhaRegex);
    if (abhaMatches) {
      abhaMatches.forEach((m) => redactions.push({ type: 'ABHA_NUMBER', original: m, replacement: '[ABHA-REDACTED]' }));
      sanitized = sanitized.replace(abhaRegex, '[ABHA-REDACTED]');
    }

    // 3. Indian Mobile Number Pattern (+91 or 10 digits starting with 6-9)
    const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g;
    const phoneMatches = sanitized.match(phoneRegex);
    if (phoneMatches) {
      phoneMatches.forEach((m) => redactions.push({ type: 'PHONE_NUMBER', original: m, replacement: '[PHONE-REDACTED]' }));
      sanitized = sanitized.replace(phoneRegex, '[PHONE-REDACTED]');
    }

    // 4. Explicit Name Phrases (English, Hindi, Tamil) + Active Patient Name
    if (activePatientName && activePatientName.trim().length > 2) {
      const escapedName = activePatientName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const nameRegex = new RegExp(escapedName, 'gi');
      if (nameRegex.test(sanitized)) {
        redactions.push({ type: 'PATIENT_NAME', original: activePatientName, replacement: '[PATIENT-NAME-REDACTED]' });
        sanitized = sanitized.replace(nameRegex, '[PATIENT-NAME-REDACTED]');
      }
    }

    const introNameRegex = /(?:my name is|i am|मेरा नाम|என் பெயர்)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi;
    sanitized = sanitized.replace(introNameRegex, (fullMatch, capturedName) => {
      redactions.push({ type: 'SELF_IDENTIFIER', original: capturedName, replacement: '[NAME-REDACTED]' });
      return fullMatch.replace(capturedName, '[NAME-REDACTED]');
    });

    return { sanitizedText: sanitized, redactions };
  },

  speakText: (text, langCode = 'en-IN', onEndCallback) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.98;
      utterance.onend = () => {
        if (onEndCallback) onEndCallback();
      };
      utterance.onerror = () => {
        if (onEndCallback) onEndCallback();
      };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      if (onEndCallback) onEndCallback();
    }
  }
};

/**
 * 2.2 AbdmHieCmApiService
 * Simulates National Health Authority (NHA) ABDM HIE-CM Consent Artefact workflows.
 */
const AbdmHieCmApiService = {
  createInitialConsentState: (patient) => {
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return {
      consentId: `artefact-nha-${patient.id.slice(-4)}-99281`,
      status: 'GRANTED',
      purpose: 'CAREMGT (Post-Consultation Longitudinal Triage)',
      hipName: patient.hospital,
      hiuName: 'HealPulse CDSS Gateway (ABDM Sandbox Verified)',
      grantedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      hiTypes: ['Observation', 'DiagnosticReport', 'MedicationRequest', 'OPConsultation'],
      tokenValidDays: 30,
      auditLogs: [
        {
          timestamp: '08:00:12 AM',
          method: 'POST',
          endpoint: '/v0.5/consent-requests/init',
          status: 202,
          summary: `Initiated DEPA consent request for ${patient.abhaAddress}`
        },
        {
          timestamp: '08:00:15 AM',
          method: 'POST',
          endpoint: '/v0.5/consents/on-notify',
          status: 200,
          summary: `HIE-CM Callback: Consent GRANTED by ${patient.abhaId} (30-Day TTL)`
        },
        {
          timestamp: '08:01:02 AM',
          method: 'GET',
          endpoint: '/v0.5/consents/status',
          status: 200,
          summary: `Token Signature Verified (RS256) • Scope: Observation, DiagnosticReport`
        }
      ]
    };
  }
};

/**
 * 2.3 DeterministicCdssEngine
 * Rule-based Clinical Decision Support System (CDSS) evaluating vitals & symptoms
 * into GREEN (Stable), YELLOW (Clinical Review Advised), or RED (Urgent Emergency).
 */
const RED_FLAG_KEYWORDS = [
  'chest pain',
  'severe pain',
  'crushing pain',
  'left arm pain',
  'radiating pain',
  'severe bleeding',
  'bleeding from gums',
  'coughing blood',
  'breathing difficulty',
  'shortness of breath at rest',
  'cannot breathe',
  'gasping',
  'sudden confusion',
  'fainting',
  'unconscious',
  'syncope',
  'blackout',
  'slurred speech',
  'सीने में तेज दर्द',
  'सीने में दर्द',
  'सांस लेने में तकलीफ',
  'बेहोशी',
  'तेज रक्तस्राव',
  'நெஞ்சு வலி',
  'மூச்சுத் திணறல்',
  'மயக்கம்'
];

const DeterministicCdssEngine = {
  detectRedFlagKeywords: (text = '') => {
    const lower = text.toLowerCase();
    const matched = RED_FLAG_KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase()));
    return {
      isRedFlag: matched.length > 0,
      matchedKeywords: matched
    };
  },

  mapTextToSnomed: (text = '', cohort = 'cardiac') => {
    const lower = text.toLowerCase();
    if (lower.includes('chest pain') || lower.includes('सीने में') || lower.includes('நெஞ்சு வலி')) {
      return { code: '29857009', display: 'Chest pain (finding)' };
    }
    if (lower.includes('bleed') || lower.includes('रक्तस्राव')) {
      return { code: '131148009', display: 'Hemorrhage / Bleeding (finding)' };
    }
    if (lower.includes('breathing difficulty') || lower.includes('shortness of breath') || lower.includes('breathless') || lower.includes('सांस') || lower.includes('மூச்சு')) {
      return { code: '267036007', display: 'Dyspnea / Shortness of breath (finding)' };
    }
    if (lower.includes('fever') || lower.includes('100.') || lower.includes('101.') || lower.includes('बुखार') || lower.includes('காய்ச்சல்')) {
      return { code: '386661006', display: 'Fever / Pyrexia (finding)' };
    }
    if (lower.includes('fatigue') || lower.includes('tired') || lower.includes('weak') || lower.includes('थकान') || lower.includes('சோர்வு')) {
      return { code: '84229001', display: 'Fatigue / Asthenia (finding)' };
    }
    if (lower.includes('incision') || lower.includes('scar') || lower.includes('sternal') || lower.includes('wound') || lower.includes('घाव')) {
      return { code: '225566008', display: 'Surgical incision site finding' };
    }
    if (lower.includes('headache') || lower.includes('सिरदर्द')) {
      return { code: '25064002', display: 'Headache (finding)' };
    }
    return {
      code: '161891005',
      display: cohort === 'cardiac' ? 'Post-operative cardiac recovery stable' : 'Post-viral convalescence stable'
    };
  },

  evaluateCheckIn: (patient, vitals, symptomText) => {
    const rules = [];
    let highestTier = 'GREEN';

    const elevateTier = (target) => {
      const order = { GREEN: 1, YELLOW: 2, RED: 3 };
      if (order[target] > order[highestTier]) {
        highestTier = target;
      }
    };

    const sysBP = Number(vitals.sysBP) || 120;
    const diaBP = Number(vitals.diaBP) || 80;
    const hr = Number(vitals.hr) || 75;
    const spo2 = Number(vitals.spo2) || 98;
    const temp = Number(vitals.temp) || 98.4;
    const painScore = Number(vitals.painScore) || 0;

    // 1. Check Red-Flag Text Triggers first
    const redFlagCheck = DeterministicCdssEngine.detectRedFlagKeywords(symptomText);
    if (redFlagCheck.isRedFlag) {
      elevateTier('RED');
      rules.push({
        id: 'RULE-RF-01',
        tier: 'RED',
        parameter: 'High-Acuity Symptom Keyword',
        observed: redFlagCheck.matchedKeywords.join(', '),
        threshold: 'Zero Red-Flag Symptoms',
        explanation: 'Critical red-flag symptom detected in patient report. Immediate emergency triage required.'
      });
    }

    // 2. SpO2 Evaluation
    if (spo2 < 93) {
      elevateTier('RED');
      rules.push({
        id: 'RULE-SPO2-RED',
        tier: 'RED',
        parameter: 'Oxygen Saturation (SpO2)',
        observed: `${spo2}%`,
        threshold: '>= 95%',
        explanation: 'Hypoxemia threshold breached (< 93%). Urgent clinical stabilization advised.'
      });
    } else if (spo2 >= 93 && spo2 <= 94) {
      elevateTier('YELLOW');
      rules.push({
        id: 'RULE-SPO2-YLW',
        tier: 'YELLOW',
        parameter: 'Oxygen Saturation (SpO2)',
        observed: `${spo2}%`,
        threshold: '>= 95%',
        explanation: 'Borderline oxygen saturation (93-94%). Repeat measurement at rest and notify care team.'
      });
    } else {
      rules.push({
        id: 'RULE-SPO2-GRN',
        tier: 'GREEN',
        parameter: 'Oxygen Saturation (SpO2)',
        observed: `${spo2}%`,
        threshold: '>= 95%',
        explanation: 'Normoxic peripheral oxygenation.'
      });
    }

    // 3. Blood Pressure Evaluation
    if (sysBP >= 160 || sysBP < 90 || diaBP >= 100) {
      elevateTier('RED');
      rules.push({
        id: 'RULE-BP-RED',
        tier: 'RED',
        parameter: 'Blood Pressure (Systolic/Diastolic)',
        observed: `${sysBP}/${diaBP} mmHg`,
        threshold: '100-139 / 60-89 mmHg',
        explanation: sysBP < 90
          ? 'Symptomatic hypotension risk (< 90 mmHg systolic). Evaluate for shock or over-medication.'
          : 'Severe hypertension (>= 160/100 mmHg). High post-operative cardiovascular strain.'
      });
    } else if (sysBP >= 135 || diaBP >= 85 || sysBP < 100) {
      elevateTier('YELLOW');
      rules.push({
        id: 'RULE-BP-YLW',
        tier: 'YELLOW',
        parameter: 'Blood Pressure (Systolic/Diastolic)',
        observed: `${sysBP}/${diaBP} mmHg`,
        threshold: '100-134 / 60-84 mmHg',
        explanation: 'Mild blood pressure elevation above optimal post-consultation target.'
      });
    } else {
      rules.push({
        id: 'RULE-BP-GRN',
        tier: 'GREEN',
        parameter: 'Blood Pressure (Systolic/Diastolic)',
        observed: `${sysBP}/${diaBP} mmHg`,
        threshold: '100-134 / 60-84 mmHg',
        explanation: 'Hemodynamically stable within target corridor.'
      });
    }

    // 4. Heart Rate Evaluation
    if (hr > 115 || hr < 50) {
      elevateTier('RED');
      rules.push({
        id: 'RULE-HR-RED',
        tier: 'RED',
        parameter: 'Heart Rate (Pulse)',
        observed: `${hr} bpm`,
        threshold: '55 - 95 bpm',
        explanation: 'Significant tachycardia (> 115 bpm) or bradycardia (< 50 bpm) requiring urgent ECG review.'
      });
    } else if (hr > 92 || hr < 55) {
      elevateTier('YELLOW');
      rules.push({
        id: 'RULE-HR-YLW',
        tier: 'YELLOW',
        parameter: 'Heart Rate (Pulse)',
        observed: `${hr} bpm`,
        threshold: '55 - 92 bpm',
        explanation: 'Mildly elevated resting heart rate; monitor hydration, fever, or beta-blocker adherence.'
      });
    } else {
      rules.push({
        id: 'RULE-HR-GRN',
        tier: 'GREEN',
        parameter: 'Heart Rate (Pulse)',
        observed: `${hr} bpm`,
        threshold: '55 - 92 bpm',
        explanation: 'Well-controlled resting heart rate.'
      });
    }

    // 5. Temperature Evaluation
    if (temp >= 101.5) {
      elevateTier('RED');
      rules.push({
        id: 'RULE-TEMP-RED',
        tier: 'RED',
        parameter: 'Body Temperature',
        observed: `${temp} °F`,
        threshold: '< 99.5 °F',
        explanation: patient.clinicalCohort === 'cardiac'
          ? 'High-grade post-op fever (>= 101.5°F): Rule out sternal wound or systemic infection urgently.'
          : 'High-grade pyrexia recurrence (>= 101.5°F): Requires immediate physician evaluation.'
      });
    } else if (temp >= 99.5) {
      elevateTier('YELLOW');
      rules.push({
        id: 'RULE-TEMP-YLW',
        tier: 'YELLOW',
        parameter: 'Body Temperature',
        observed: `${temp} °F`,
        threshold: '< 99.5 °F',
        explanation: 'Low-to-moderate grade temperature elevation (99.5 - 101.4°F). Monitor every 4 hours.'
      });
    } else {
      rules.push({
        id: 'RULE-TEMP-GRN',
        tier: 'GREEN',
        parameter: 'Body Temperature',
        observed: `${temp} °F`,
        threshold: '< 99.5 °F',
        explanation: 'Afebrile baseline maintained.'
      });
    }

    // 6. Pain / Discomfort / Symptom Score Evaluation
    const lowerText = (symptomText || '').toLowerCase();
    const hasMildExertionalSymptom =
      lowerText.includes('breathless') ||
      lowerText.includes('stairs') ||
      lowerText.includes('swelling') ||
      lowerText.includes('edema') ||
      lowerText.includes('headache');

    if (painScore >= 7) {
      elevateTier('RED');
      rules.push({
        id: 'RULE-PAIN-RED',
        tier: 'RED',
        parameter: 'Pain / Symptom Severity Scale',
        observed: `${painScore} / 10`,
        threshold: '<= 3 / 10',
        explanation: 'Severe acute discomfort reported (>= 7/10).'
      });
    } else if (painScore >= 3 || hasMildExertionalSymptom) {
      elevateTier('YELLOW');
      rules.push({
        id: 'RULE-SYM-YLW',
        tier: 'YELLOW',
        parameter: 'Symptom & Exertional Tolerance',
        observed: `Score ${painScore}/10 ${hasMildExertionalSymptom ? '(Exertional/Mild Symptom Noted)' : ''}`,
        threshold: 'Score <= 2/10, Asymptomatic',
        explanation: 'Mild-to-moderate symptom or exertional breathlessness logged; flagged for clinician snapshot review.'
      });
    } else {
      rules.push({
        id: 'RULE-SYM-GRN',
        tier: 'GREEN',
        parameter: 'Symptom & Discomfort Scale',
        observed: `${painScore} / 10`,
        threshold: '<= 2 / 10',
        explanation: 'Minimal discomfort; recovery trajectory on track.'
      });
    }

    const snomed = DeterministicCdssEngine.mapTextToSnomed(symptomText, patient.clinicalCohort);

    const actionMap = {
      GREEN: {
        title: 'Green Zone — Recovery On Track',
        badge: 'STABLE RECOVERY',
        recommendation: `Continue prescribed ${patient.medications.map((m) => m.name).slice(0, 2).join(' & ')} regimen, maintain hydration/ambulation goals, and log your next routine check-in tomorrow.`,
        nextStep: 'Routine self-monitoring continues. Data synced to ABHA longitudinal record.'
      },
      YELLOW: {
        title: 'Yellow Zone — Clinical Review Advised',
        badge: 'AMBER TRIAGE ALERT',
        recommendation: `Mild physiological or symptomatic deviation detected. Rest in a comfortable position, verify medication adherence, and share "Doctor's 30-Second Snapshot Mode" with ${patient.attendingDoctor} within 12–24 hours.`,
        nextStep: 'Priority flag added to Doctor Snapshot view for non-emergent clinical review.'
      },
      RED: {
        title: 'Red Zone — Immediate Medical Attention Required',
        badge: 'CRITICAL RED TRIAGE',
        recommendation: `Critical vital sign or red-flag symptom threshold breached. Do NOT wait for a routine appointment. Contact emergency medical services (108) or proceed to ${patient.hospital} Emergency Department immediately.`,
        nextStep: 'Emergency protocol activated. Hand device to responder in Doctor Snapshot Mode.'
      }
    };

    return {
      tier: highestTier,
      ...actionMap[highestTier],
      rules,
      snomed,
      evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  }
};

/**
 * 2.4 FhirR4EncoderService
 * Generates standardized HL7 FHIR R4 Bundle JSON payloads (NRCeS India compliant)
 * referencing official SNOMED-CT and LOINC codes.
 */
const FhirR4EncoderService = {
  generateBundle: (patient, consentState) => {
    const latestLog = patient.logs[patient.logs.length - 1] || {
      sysBP: 120,
      diaBP: 80,
      hr: 74,
      spo2: 98,
      temp: 98.4,
      painScore: 1,
      symptomText: 'Routine check-in',
      snomedCode: '161891005',
      snomedDisplay: 'Stable recovery',
      triage: 'GREEN'
    };

    const timestamp = new Date().toISOString();

    return {
      resourceType: 'Bundle',
      id: `fhir-bundle-${patient.id}-${Date.now().toString().slice(-5)}`,
      meta: {
        versionId: '1',
        lastUpdated: timestamp,
        profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle'],
        security: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality',
            code: 'R',
            display: 'restricted (DPDP Act 2023 & ABDM HIE-CM Consent Bound)'
          }
        ]
      },
      identifier: {
        system: 'https://ndhm.gov.in/fhir/bundles',
        value: consentState?.consentId || 'artefact-nha-active'
      },
      type: 'collection',
      timestamp,
      entry: [
        {
          fullUrl: `urn:uuid:patient-${patient.id}`,
          resource: {
            resourceType: 'Patient',
            id: patient.id,
            meta: {
              profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient']
            },
            identifier: [
              {
                type: {
                  coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MR', display: 'ABHA Number' }]
                },
                system: 'https://healthid.ndhm.gov.in',
                value: patient.abhaId
              },
              {
                system: 'https://ndhm.gov.in/phr-address',
                value: patient.abhaAddress
              }
            ],
            name: [{ use: 'official', text: patient.name }],
            gender: patient.gender.toLowerCase(),
            age: patient.age
          }
        },
        {
          fullUrl: `urn:uuid:observation-vitals-${patient.id}`,
          resource: {
            resourceType: 'Observation',
            id: `obs-vitals-${latestLog.day.replace(/\s+/g, '').toLowerCase()}`,
            status: 'final',
            category: [
              {
                coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }]
              }
            ],
            code: {
              coding: [{ system: 'http://loinc.org', code: '85353-1', display: 'Vital signs, weight, height, head circumference, oxygen saturation and BMI panel' }],
              text: 'HealPulse Post-Consultation Vital Signs Panel'
            },
            subject: { reference: `Patient/${patient.id}`, display: patient.name },
            effectiveDateTime: timestamp,
            component: [
              {
                code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }] },
                valueQuantity: { value: latestLog.sysBP, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
              },
              {
                code: { coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }] },
                valueQuantity: { value: latestLog.diaBP, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
              },
              {
                code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }] },
                valueQuantity: { value: latestLog.hr, unit: '/min', system: 'http://unitsofmeasure.org', code: '/min' }
              },
              {
                code: { coding: [{ system: 'http://loinc.org', code: '2708-6', display: 'Oxygen saturation in Arterial blood' }] },
                valueQuantity: { value: latestLog.spo2, unit: '%', system: 'http://unitsofmeasure.org', code: '%' }
              },
              {
                code: { coding: [{ system: 'http://loinc.org', code: '8310-5', display: 'Body temperature' }] },
                valueQuantity: { value: latestLog.temp, unit: '[degF]', system: 'http://unitsofmeasure.org', code: '[degF]' }
              }
            ]
          }
        },
        {
          fullUrl: `urn:uuid:observation-symptom-${patient.id}`,
          resource: {
            resourceType: 'Observation',
            id: `obs-snomed-symptom-${Date.now().toString().slice(-4)}`,
            status: 'final',
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: latestLog.snomedCode || '161891005',
                  display: latestLog.snomedDisplay || 'Clinical finding'
                }
              ],
              text: 'Bhashini Voice Check-in SNOMED-CT Mapped Symptom'
            },
            subject: { reference: `Patient/${patient.id}` },
            effectiveDateTime: timestamp,
            valueString: latestLog.symptomText,
            interpretation: [
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                    code: latestLog.triage === 'RED' ? 'AA' : latestLog.triage === 'YELLOW' ? 'A' : 'N',
                    display: `HealPulse Deterministic CDSS Tier: ${latestLog.triage}`
                  }
                ]
              }
            ]
          }
        },
        {
          fullUrl: `urn:uuid:diagnostic-report-${patient.id}`,
          resource: {
            resourceType: 'DiagnosticReport',
            id: `diag-baseline-${patient.id}`,
            status: 'final',
            code: {
              coding: [{ system: 'http://loinc.org', code: '11502-2', display: 'Laboratory report' }],
              text: 'Baseline Discharge & Follow-up Laboratory Panel'
            },
            subject: { reference: `Patient/${patient.id}` },
            performer: [{ display: patient.hospital }],
            result: patient.baselineLabs.map((lab) => ({
              reference: `Observation/loinc-${lab.loinc}`,
              display: `${lab.test}: ${lab.value} ${lab.unit} (${lab.status})`
            }))
          }
        }
      ]
    };
  }
};

/**
 * 2.5 SecureChatLLMService
 * Manages calls to the AI companion with profile context injection, strict
 * anti-hallucination guardrails, exponential backoff, and deterministic fallback.
 */
const SecureChatLLMService = {
  buildSystemInstruction: (patient) => {
    const latest = patient.logs[patient.logs.length - 1] || {};
    const medsList = patient.medications.map((m) => `${m.name} ${m.dosage} (${m.frequency})`).join('; ');
    const labsList = patient.baselineLabs.map((l) => `${l.test}: ${l.value} ${l.unit}`).join('; ');

    return `You are HealPulse AI, an ABDM-integrated, anti-hallucination Post-Consultation Recovery Companion.
ACTIVE PATIENT CONTEXT:
- Patient Name: ${patient.name} (${patient.age}y, ${patient.gender}, ABHA: ${patient.abhaId})
- Primary Condition: ${patient.primaryCondition}
- Attending Physician: ${patient.attendingDoctor} at ${patient.hospital}
- Active Prescribed Medications: ${medsList}
- Baseline Lab Records: ${labsList}
- Latest Check-in Vitals (${latest.date || 'Today'}): BP ${latest.sysBP}/${latest.diaBP} mmHg, HR ${latest.hr} bpm, SpO2 ${latest.spo2}%, Temp ${latest.temp}°F, CDSS Triage: ${latest.triage}.

MANDATORY ANTI-HALLUCINATION & SAFETY GUARDRAILS:
1. RULE 1 (NO DIAGNOSIS OR PRESCRIBING): You are strictly prohibited from diagnosing medical conditions, prescribing new medications, or altering prescribed dosages/schedules.
2. RULE 2 (EMPATHETIC GROUNDED SUPPORT): Provide warm, concise, easy-to-understand post-consultation recovery guidance grounded strictly in the patient's existing care plan above. Always advise consulting ${patient.attendingDoctor} before making any changes to medications or activity levels.
3. Keep responses structured, reassuring, and under 110 words.`;
  },

  generateGroundedFallback: (userMessage, patient) => {
    const lower = userMessage.toLowerCase();
    const isCardiac = patient.clinicalCohort === 'cardiac';

    if (lower.includes('aspirin') || lower.includes('metformin') || lower.includes('atorvastatin') || lower.includes('paracetamol') || lower.includes('medicine') || lower.includes('dose') || lower.includes('breakfast')) {
      return `**Grounded Medication Guidance (${patient.name}):**\n\nPer your active discharge plan from **${patient.attendingDoctor}**, your current regimen includes:\n${patient.medications.map((m) => `• **${m.name} (${m.dosage})** — ${m.frequency}`).join('\n')}\n\n*Safety Guardrail (Rule 1 & 2):* As an AI recovery companion, I cannot alter your medication timing or dosage. Aspirin is typically scheduled after food to protect your stomach lining—please confirm with **${patient.attendingDoctor}** during your next review before changing the time you take it.`;
    }

    if (lower.includes('breathless') || lower.includes('stairs') || lower.includes('walk') || lower.includes('gym') || lower.includes('workout') || lower.includes('exercise')) {
      return isCardiac
        ? `**Post-CABG Activity & Pacing Support:**\n\nOn Day 14 post-CABG, mild exertion while climbing stairs can temporarily increase your heart rate and breathing effort (your Day 13 log noted mild exertional dyspnea with SpO2 at 96%).\n\n• Pace yourself slowly on stairs and pause if you feel winded.\n• Continue gentle flat-surface walking and incentive spirometry.\n• **Important:** I cannot provide a medical diagnosis. If breathlessness occurs at rest, worsens, or is accompanied by chest discomfort, please consult **${patient.attendingDoctor}** immediately.`
        : `**Post-Viral Activity Pacing (${patient.name}):**\n\nDuring Dengue/viral fever convalescence (even with recovered platelets at 1,68,000/µL), your body is still replenishing energy reserves. High-intensity gym workouts can trigger post-viral exhaustion.\n\n• Stick to light walks and stretching for now.\n• Please consult **${patient.attendingDoctor}** before resuming strenuous gym sessions.`;
    }

    if (lower.includes('itch') || lower.includes('scar') || lower.includes('incision') || lower.includes('wound')) {
      return `**Sternal Incision Care Support:**\n\nMild itching along a healing surgical scar around Day 10–14 is a common part of tissue remodeling. Your latest logs show your temperature is normal (**98.4°F**).\n\n• Avoid scratching or applying unprescribed creams/oils to the sternal incision.\n• Keep the area clean and dry.\n• **Clinical Reminder:** If you notice redness, warmth, swelling, fluid drainage, or fever, please show your incision to **${patient.attendingDoctor}** promptly.`;
    }

    if (lower.includes('ors') || lower.includes('fluid') || lower.includes('fatigue') || lower.includes('tired')) {
      return `**Hydration & Convalescence Support:**\n\nYour care plan with **${patient.attendingDoctor}** includes **ORS (up to 2L/day)** and **Folic Acid + Vitamin B-Complex**. Post-viral fatigue can persist for 1–2 weeks even after you are completely afebrile (**98.4°F** today).\n\n• Continue steady oral hydration (water, coconut water, ORS) and prioritize 8 hours of rest.\n• *Guardrail Notice:* I do not diagnose conditions. If fatigue worsens or fever returns, please consult **${patient.attendingDoctor}**.`;
    }

    const latest = patient.logs[patient.logs.length - 1] || {};
    return `**HealPulse Recovery Companion (${patient.name}):**\n\nThank you for sharing. Based on your latest logged vitals (**BP ${latest.sysBP}/${latest.diaBP} mmHg, SpO2 ${latest.spo2}%, Temp ${latest.temp}°F**), you are currently in the **${latest.triage} Triage Zone**.\n\n• Please continue following your prescribed regimen under **${patient.attendingDoctor}**.\n• *Clinical Safety Note:* HealPulse AI does not diagnose conditions or modify prescriptions. You can use **"Doctor's 30-Second Snapshot Mode"** in the top bar to share your 14-day trend and SNOMED-CT logs directly with your physician.`;
  },

  sendMessage: async (userQuery, patient) => {
    const apiKey = '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    const systemPrompt = SecureChatLLMService.buildSystemInstruction(patient);

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    const delays = [1000, 2000];
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const result = await response.json();
          const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return { text, source: 'Gemini 3 Flash (Grounded CDSS Guardrails)' };
        }
      } catch (err) {
        // Silent retry per exponential backoff guidelines
      }
      if (attempt < delays.length) {
        await new Promise((res) => setTimeout(res, delays[attempt]));
      }
    }

    // High-reliability deterministic grounded fallback
    return {
      text: SecureChatLLMService.generateGroundedFallback(userQuery, patient),
      source: 'HealPulse Deterministic Guardrail Engine'
    };
  }
};

// ============================================================================
// 3. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // --- Patient Database & Active Profile State ---
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [activePatientId, setActivePatientId] = useState(INITIAL_PATIENTS[0].id);
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);

  const activePatient = useMemo(
    () => patients.find((p) => p.id === activePatientId) || patients[0],
    [patients, activePatientId]
  );

  // --- Navigation & Mode State ---
  // Tabs: 'checkin' | 'cdss' | 'snapshot' | 'fhir' | 'chat'
  const [activeTab, setActiveTab] = useState('checkin');
  const [isDoctorSnapshotMode, setIsDoctorSnapshotMode] = useState(false);

  // --- ABDM HIE-CM Consent State per Patient ---
  const [consentsByPatient, setConsentsByPatient] = useState(() => ({
    'pat-suresh-01': AbdmHieCmApiService.createInitialConsentState(INITIAL_PATIENTS[0]),
    'pat-ananya-02': AbdmHieCmApiService.createInitialConsentState(INITIAL_PATIENTS[1])
  }));

  const activeConsent = useMemo(
    () => consentsByPatient[activePatient.id] || AbdmHieCmApiService.createInitialConsentState(activePatient),
    [consentsByPatient, activePatient]
  );

  // --- Bhashini Voice & Check-In State ---
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rawTranscript, setRawTranscript] = useState('');
  const [translatedTranscript, setTranslatedTranscript] = useState('');
  const [vitalsForm, setVitalsForm] = useState({
    sysBP: 124,
    diaBP: 78,
    hr: 74,
    spo2: 98,
    temp: 98.4,
    painScore: 1
  });
  const [latestEvaluation, setLatestEvaluation] = useState(null);
  const [showCdssModal, setShowCdssModal] = useState(false);
  const [showFhirInspectorModal, setShowFhirInspectorModal] = useState(false);
  const [copiedFhir, setCopiedFhir] = useState(false);

  // --- Emergency Red-Flag Overlay State ---
  const [emergencyOverlay, setEmergencyOverlay] = useState({
    isOpen: false,
    triggerSource: '',
    matchedKeywords: [],
    inputText: ''
  });

  // --- Persistent AI Chatspace State ---
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState(() => ({
    'pat-suresh-01': [
      {
        id: 'welcome-suresh',
        role: 'assistant',
        timestamp: '08:02 AM',
        source: 'Context-Grounded Guardrail',
        text: `Namaste **Suresh Kumar** ji. I am your HealPulse Post-Consultation Companion, synced with your **Post-CABG (Day 14) & Diabetes** care plan under **Dr. Rajeshwari Nair**.\n\nI have loaded your active medications (*Aspirin 75mg, Atorvastatin 40mg, Metformin 500mg, Metoprolol 25mg*) and your latest stable vitals (**BP 124/78 mmHg, SpO2 98%**). How are you feeling today?`
      }
    ],
    'pat-ananya-02': [
      {
        id: 'welcome-ananya',
        role: 'assistant',
        timestamp: '08:02 AM',
        source: 'Context-Grounded Guardrail',
        text: `Hello **Ananya Sharma**. I am synced with your **Viral Fever / Dengue Convalescence (Day 14)** recovery record under **Dr. Vikramaditya Sen**.\n\nYour latest platelet count (**1,68,000 /µL**) and morning temperature (**98.4°F**) are in the safe green zone. How can I support your recovery today?`
      }
    ]
  }));

  // --- New Patient Profile Form State ---
  const [newProfileForm, setNewProfileForm] = useState({
    name: '',
    age: '46',
    gender: 'Male',
    abhaId: '91-7392-5510-8491',
    primaryCondition: 'Post-Laparoscopic Cholecystectomy (Day 5) & Hypertension',
    attendingDoctor: 'Dr. Meenakshi Sundaram, MS (General Surgery)',
    hospital: 'Apollo Hospitals, Chennai / New Delhi',
    clinicalCohort: 'cardiac',
    med1Name: 'Pantoprazole 40mg',
    med1Freq: 'Once Daily (Before Breakfast)',
    med2Name: 'Amlodipine 5mg',
    med2Freq: 'Once Daily (Morning)',
    lab1Test: 'Total Bilirubin',
    lab1Val: '0.9',
    lab1Unit: 'mg/dL',
    lab2Test: 'WBC Count',
    lab2Val: '6,800',
    lab2Unit: '/µL'
  });

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Sync default check-in form when switching patients
  useEffect(() => {
    const latest = activePatient.logs[activePatient.logs.length - 1];
    if (latest) {
      setVitalsForm({
        sysBP: latest.sysBP,
        diaBP: latest.diaBP,
        hr: latest.hr,
        spo2: latest.spo2,
        temp: latest.temp,
        painScore: latest.painScore
      });
      const defaultSample = BhashiniApiService.getSampleVoiceStreams(activePatient, selectedLang)[0];
      if (defaultSample) {
        setRawTranscript(defaultSample.nativeText);
        setTranslatedTranscript(defaultSample.translatedEn);
      }
      const initialEval = DeterministicCdssEngine.evaluateCheckIn(
        activePatient,
        latest,
        latest.symptomText
      );
      setLatestEvaluation(initialEval);
    }
  }, [activePatientId]);

  // Update sample phrase when language changes
  useEffect(() => {
    const samples = BhashiniApiService.getSampleVoiceStreams(activePatient, selectedLang);
    if (samples && samples[0]) {
      setRawTranscript(samples[0].nativeText);
      setTranslatedTranscript(samples[0].translatedEn);
    }
  }, [selectedLang]);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistories, activePatientId, isChatDrawerOpen, activeTab]);

  // Live DPDP PII Masking Computation
  const piiAnalysis = useMemo(
    () => BhashiniApiService.maskPII(rawTranscript, activePatient.name),
    [rawTranscript, activePatient.name]
  );

  // Live FHIR R4 Bundle Computation
  const fhirBundleJson = useMemo(
    () => FhirR4EncoderService.generateBundle(activePatient, activeConsent),
    [activePatient, activeConsent]
  );

  // Toggle Doctor's 30-Second Snapshot Mode
  const handleToggleDoctorSnapshot = () => {
    const nextState = !isDoctorSnapshotMode;
    setIsDoctorSnapshotMode(nextState);
    if (nextState) {
      setActiveTab('snapshot');
    }
  };

  // Start / Stop Bhashini Voice Recording (Web Speech API + Simulated Stream Fallback)
  const handleToggleMicRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = selectedLang;
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setRawTranscript(transcript);
          setTranslatedTranscript(transcript);
        };
        recognition.onerror = () => {
          // Graceful fallback to simulated Bhashini ULCA stream if mic permission denied
          const fallbackSample = BhashiniApiService.getSampleVoiceStreams(activePatient, selectedLang)[0];
          if (fallbackSample) {
            setRawTranscript(fallbackSample.nativeText);
            setTranslatedTranscript(fallbackSample.translatedEn);
            setVitalsForm(fallbackSample.suggestedVitals);
          }
          setIsRecording(false);
        };
        recognition.onend = () => setIsRecording(false);

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {
        // Fallback if browser blocks SpeechRecognition
      }
    }

    // Simulated Bhashini ULCA streaming fallback
    setIsRecording(true);
    const sample = BhashiniApiService.getSampleVoiceStreams(activePatient, selectedLang)[0];
    setTimeout(() => {
      if (sample) {
        setRawTranscript(sample.nativeText);
        setTranslatedTranscript(sample.translatedEn);
        setVitalsForm(sample.suggestedVitals);
      }
      setIsRecording(false);
    }, 1100);
  };

  // Speak text aloud via Bhashini TTS wrapper
  const handleSpeak = (textToSpeak, lang = selectedLang) => {
    setIsSpeaking(true);
    BhashiniApiService.speakText(textToSpeak, lang, () => setIsSpeaking(false));
  };

  // Submit Voice & Vitals Check-in through Deterministic CDSS Engine
  const handleCheckInSubmit = (e) => {
    if (e) e.preventDefault();

    const effectiveTextForClinicalEval = `${piiAnalysis.sanitizedText} ${translatedTranscript}`.trim();
    const evaluation = DeterministicCdssEngine.evaluateCheckIn(
      activePatient,
      vitalsForm,
      effectiveTextForClinicalEval
    );

    setLatestEvaluation(evaluation);

    const newLogEntry = {
      day: `Day ${activePatient.logs.length + 1}`,
      date: 'Today (Live)',
      sysBP: Number(vitalsForm.sysBP),
      diaBP: Number(vitalsForm.diaBP),
      hr: Number(vitalsForm.hr),
      spo2: Number(vitalsForm.spo2),
      temp: Number(vitalsForm.temp),
      painScore: Number(vitalsForm.painScore),
      symptomText: piiAnalysis.sanitizedText || 'Routine check-in completed',
      snomedCode: evaluation.snomed.code,
      snomedDisplay: evaluation.snomed.display,
      triage: evaluation.tier
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === activePatient.id
          ? { ...p, logs: [...p.logs.slice(-13), newLogEntry] }
          : p
      )
    );

    // Check if Red Flag keyword or RED CDSS Tier was triggered
    const redFlagScan = DeterministicCdssEngine.detectRedFlagKeywords(effectiveTextForClinicalEval);
    if (redFlagScan.isRedFlag || evaluation.tier === 'RED') {
      setEmergencyOverlay({
        isOpen: true,
        triggerSource: 'Bhashini Voice Check-In & CDSS Engine',
        matchedKeywords: redFlagScan.matchedKeywords.length > 0 ? redFlagScan.matchedKeywords : ['Critical Vital Sign Threshold Breached'],
        inputText: piiAnalysis.sanitizedText
      });
    } else {
      setShowCdssModal(true);
    }
  };

  // Toggle Medication Adherence today
  const handleToggleMedication = (medId) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== activePatient.id) return p;
        return {
          ...p,
          medications: p.medications.map((m) =>
            m.id === medId ? { ...m, takenToday: !m.takenToday } : m
          )
        };
      })
    );
  };

  // Handle ABDM Consent Grant / Revoke / Refresh
  const handleConsentAction = (actionType) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setConsentsByPatient((prev) => {
      const current = prev[activePatient.id] || AbdmHieCmApiService.createInitialConsentState(activePatient);
      if (actionType === 'REVOKE') {
        return {
          ...prev,
          [activePatient.id]: {
            ...current,
            status: 'REVOKED',
            tokenValidDays: 0,
            auditLogs: [
              {
                timestamp: nowTime,
                method: 'POST',
                endpoint: '/v0.5/consents/revoke',
                status: 200,
                summary: `Patient revoked HIE-CM artefact ${current.consentId}. HIU data sharing halted.`
              },
              ...current.auditLogs
            ]
          }
        };
      }
      // GRANT or RENEW
      return {
        ...prev,
        [activePatient.id]: {
          ...current,
          status: 'GRANTED',
          tokenValidDays: 30,
          auditLogs: [
            {
              timestamp: nowTime,
              method: 'POST',
              endpoint: '/v0.5/consent-requests/init',
              status: 200,
              summary: `New 30-Day ABDM Consent Artefact granted & verified for ${activePatient.abhaId}.`
            },
            ...current.auditLogs
          ]
        }
      };
    });
  };

  // Handle Chat Submission with Hardcoded Red-Flag Safety Trigger (Rule 3)
  const handleSendChatMessage = async (customPromptText) => {
    const messageText = (customPromptText !== undefined ? customPromptText : chatInput).trim();
    if (!messageText) return;

    if (customPromptText === undefined) {
      setChatInput('');
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      timestamp: nowTime,
      text: messageText
    };

    // RULE 3: HARDCODED SAFETY TRIGGER INTERCEPTOR (Suppresses standard LLM output)
    const redFlagCheck = DeterministicCdssEngine.detectRedFlagKeywords(messageText);
    if (redFlagCheck.isRedFlag) {
      const emergencyBotMsg = {
        id: `rf-${Date.now() + 1}`,
        role: 'assistant',
        isEmergencyAlert: true,
        timestamp: nowTime,
        source: 'RULE-3 HARDCODED SAFETY INTERCEPTOR (LLM SUPPRESSED)',
        matchedKeywords: redFlagCheck.matchedKeywords,
        text: `🚨 **CRITICAL MEDICAL RED-FLAG DETECTED (${redFlagCheck.matchedKeywords.join(', ')})**\n\nStandard AI response generation has been **suppressed** per clinical safety guardrails. Your symptoms require **immediate emergency medical evaluation**.\n\n• **Call 108 Ambulance** immediately or proceed to the nearest Emergency Department (**${activePatient.hospital}**).\n• Stop all physical exertion and sit or lie down in a supported position.\n• Alert a family member or caregiver right now.`
      };

      setChatHistories((prev) => ({
        ...prev,
        [activePatient.id]: [...(prev[activePatient.id] || []), userMsg, emergencyBotMsg]
      }));

      setEmergencyOverlay({
        isOpen: true,
        triggerSource: 'AI Companion Hardcoded Rule-3 Interceptor',
        matchedKeywords: redFlagCheck.matchedKeywords,
        inputText: messageText
      });
      return;
    }

    // Standard Context-Grounded Anti-Hallucination Flow
    setChatHistories((prev) => ({
      ...prev,
      [activePatient.id]: [...(prev[activePatient.id] || []), userMsg]
    }));

    setIsChatLoading(true);
    const response = await SecureChatLLMService.sendMessage(messageText, activePatient);
    setIsChatLoading(false);

    const assistantMsg = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: response.source,
      text: response.text
    };

    setChatHistories((prev) => ({
      ...prev,
      [activePatient.id]: [...(prev[activePatient.id] || []), assistantMsg]
    }));
  };

  // Handle Creating a New Live Demo Profile
  const handleCreateNewProfile = (e) => {
    e.preventDefault();
    if (!newProfileForm.name.trim()) return;

    const newId = `pat-custom-${Date.now().toString().slice(-4)}`;
    const slug = newProfileForm.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    const createdPatient = {
      id: newId,
      name: newProfileForm.name.trim(),
      age: Number(newProfileForm.age) || 45,
      gender: newProfileForm.gender,
      bloodGroup: 'O+',
      abhaId: newProfileForm.abhaId || '91-5521-9043-1182',
      abhaAddress: `${slug}@abdm`,
      phone: '+91 98400 11223',
      primaryCondition: newProfileForm.primaryCondition,
      surgeryOrAdmissionDate: '2026-10-12',
      attendingDoctor: newProfileForm.attendingDoctor,
      hospital: newProfileForm.hospital,
      clinicalCohort: newProfileForm.clinicalCohort,
      comorbidities: [newProfileForm.primaryCondition],
      allergies: ['No Known Drug Allergies'],
      medications: [
        {
          id: `m-${Date.now()}-1`,
          name: newProfileForm.med1Name || 'Pantoprazole 40mg',
          dosage: '1 Tab',
          frequency: newProfileForm.med1Freq || 'Once Daily',
          rxNorm: '40790',
          adherence: 100,
          takenToday: true
        },
        {
          id: `m-${Date.now()}-2`,
          name: newProfileForm.med2Name || 'Paracetamol 650mg',
          dosage: '1 Tab',
          frequency: newProfileForm.med2Freq || 'SOS',
          rxNorm: '161',
          adherence: 95,
          takenToday: true
        }
      ],
      baselineLabs: [
        {
          test: newProfileForm.lab1Test || 'Hemoglobin',
          value: newProfileForm.lab1Val || '13.4',
          unit: newProfileForm.lab1Unit || 'g/dL',
          refRange: 'Normal Baseline',
          loinc: '718-7',
          date: '2026-10-15',
          status: 'Normal'
        },
        {
          test: newProfileForm.lab2Test || 'WBC Count',
          value: newProfileForm.lab2Val || '6,800',
          unit: newProfileForm.lab2Unit || '/µL',
          refRange: '4,000 - 11,000 /µL',
          loinc: '6690-2',
          date: '2026-10-15',
          status: 'Normal'
        }
      ],
      quickPrompts: [
        `Is my recovery from ${newProfileForm.primaryCondition} on track?`,
        `Can I take ${newProfileForm.med1Name} after meals?`,
        `🚨 Trigger Red Flag: I have sudden chest pain and breathing difficulty`
      ],
      logs: [
        { day: 'Day 1', date: 'Oct 14', sysBP: 132, diaBP: 84, hr: 84, spo2: 97, temp: 99.0, painScore: 4, symptomText: 'Initial post-discharge soreness', snomedCode: '225566008', snomedDisplay: 'Post-procedure discomfort', triage: 'YELLOW' },
        { day: 'Day 2', date: 'Oct 15', sysBP: 128, diaBP: 82, hr: 80, spo2: 98, temp: 98.7, painScore: 3, symptomText: 'Mobility improving, tolerating oral diet', snomedCode: '161891005', snomedDisplay: 'Recovery progressing', triage: 'GREEN' },
        { day: 'Day 3', date: 'Oct 16', sysBP: 126, diaBP: 80, hr: 78, spo2: 98, temp: 98.6, painScore: 2, symptomText: 'No fever, taking medications on schedule', snomedCode: '161891005', snomedDisplay: 'Medication adherent', triage: 'GREEN' },
        { day: 'Day 4', date: 'Oct 17', sysBP: 124, diaBP: 78, hr: 76, spo2: 99, temp: 98.4, painScore: 1, symptomText: 'Resting comfortably, minimal soreness', snomedCode: '161891005', snomedDisplay: 'Stable recovery', triage: 'GREEN' },
        { day: 'Day 5', date: 'Oct 18', sysBP: 122, diaBP: 78, hr: 74, spo2: 99, temp: 98.4, painScore: 1, symptomText: 'Feeling well this morning', snomedCode: '161891005', snomedDisplay: 'Clinical stability', triage: 'GREEN' }
      ]
    };

    setPatients((prev) => [...prev, createdPatient]);
    setConsentsByPatient((prev) => ({
      ...prev,
      [newId]: AbdmHieCmApiService.createInitialConsentState(createdPatient)
    }));
    setChatHistories((prev) => ({
      ...prev,
      [newId]: [
        {
          id: `welcome-${newId}`,
          role: 'assistant',
          timestamp: 'Just now',
          source: 'Context-Grounded Guardrail',
          text: `Welcome **${createdPatient.name}**. Your ABDM profile (**${createdPatient.abhaId}**) and care plan under **${createdPatient.attendingDoctor}** for **${createdPatient.primaryCondition}** are now active.`
        }
      ]
    }));
    setActivePatientId(newId);
    setShowNewProfileModal(false);
  };

  // Copy FHIR JSON helper
  const handleCopyFhirJson = () => {
    const str = JSON.stringify(fhirBundleJson, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(str);
    }
    setCopiedFhir(true);
    setTimeout(() => setCopiedFhir(false), 2000);
  };

  // Download FHIR JSON helper
  const handleDownloadFhirJson = () => {
    const str = JSON.stringify(fhirBundleJson, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealPulse-FHIR-R4-${activePatient.abhaId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper badge styling for CDSS tiers
  const getTriageStyle = (tier) => {
    if (tier === 'RED') {
      return {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-800',
        pill: 'bg-[#EF4444] text-white',
        hex: '#EF4444'
      };
    }
    if (tier === 'YELLOW') {
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-900',
        pill: 'bg-[#F59E0B] text-slate-950',
        hex: '#F59E0B'
      };
    }
    return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      pill: 'bg-[#10B981] text-white',
      hex: '#10B981'
    };
  };

  const currentLog = activePatient.logs[activePatient.logs.length - 1] || {};
  const activeTierStyle = getTriageStyle(latestEvaluation?.tier || currentLog.triage || 'GREEN');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col pb-28 font-sans selection:bg-teal-600 selection:text-white">
      {/* ===================================================================
          1. TOP HEADER BAR: BRANDING, PROFILE SWITCHER & DOCTOR 30s SNAPSHOT
      =================================================================== */}
      <header className="sticky top-0 z-30 bg-[#0F172A] text-white border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0D9488] to-emerald-500 flex items-center justify-center shadow-md shadow-teal-950/50">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">HealPulse</h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  ABDM • FHIR R4 • CDSS
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Voice-First AI Post-Consultation Companion & Deterministic Triage
              </p>
            </div>
          </div>

          {/* Right Controls: Profile Switcher + New Profile + Doctor Snapshot Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Profile Switcher Dropdown */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 min-h-[48px]">
              <Users className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
              <div className="flex flex-col mr-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Active Patient Profile
                </span>
                <select
                  aria-label="Switch Active Patient Profile"
                  value={activePatientId}
                  onChange={(e) => setActivePatientId(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer pr-2"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} ({p.age}
                      {p.gender[0]} • {p.clinicalCohort === 'cardiac' ? 'Post-CABG' : 'Viral Recovery'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* New Demo Profile Button */}
            <button
              type="button"
              onClick={() => setShowNewProfileModal(true)}
              className="min-h-[48px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Create a New Patient Profile Live"
            >
              <UserPlus className="w-4 h-4 text-teal-400" />
              <span className="hidden md:inline">+ New Profile</span>
            </button>

            {/* Doctor's 30-Second Snapshot Mode Toggle (Single-Device Handover) */}
            <button
              type="button"
              onClick={handleToggleDoctorSnapshot}
              className={`min-h-[48px] px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md ${
                isDoctorSnapshotMode
                  ? 'bg-[#10B981] text-slate-950 ring-2 ring-emerald-300'
                  : 'bg-[#0D9488] hover:bg-teal-500 text-white'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span>
                {isDoctorSnapshotMode ? 'Exit Doctor Snapshot' : "Doctor's 30s Snapshot Mode"}
              </span>
            </button>
          </div>
        </div>

        {/* Sub-Bar: Active Patient ABHA Banner & Consent Status */}
        <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {activePatient.name} ({activePatient.age}y, {activePatient.gender})
              </span>
              <span className="text-slate-300 font-mono">
                ABHA: <strong className="text-teal-300">{activePatient.abhaId}</strong>
              </span>
              <span className="text-slate-300 hidden md:inline">
                Dx: <strong className="text-slate-100">{activePatient.primaryCondition}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* ABDM Consent Badge */}
              <button
                type="button"
                onClick={() => setActiveTab('fhir')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border transition ${
                  activeConsent.status === 'GRANTED'
                    ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-300'
                    : 'bg-red-950/80 border-red-600/50 text-red-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  HIE-CM Consent: {activeConsent.status} ({activeConsent.tokenValidDays}d TTL)
                </span>
              </button>

              {/* Quick Emergency Test Button */}
              <button
                type="button"
                onClick={() =>
                  setEmergencyOverlay({
                    isOpen: true,
                    triggerSource: 'Manual Emergency Protocol Test',
                    matchedKeywords: ['chest pain', 'breathing difficulty'],
                    inputText: 'Emergency 108 Triage Simulation Activated'
                  })
                }
                className="px-2.5 py-1 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[11px] font-semibold flex items-center gap-1 transition"
              >
                <PhoneCall className="w-3 h-3" />
                <span>108 SOS</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================
          2. MODULAR NAVIGATION TABS
      =================================================================== */}
      <nav className="bg-white border-b border-slate-200 sticky top-[105px] sm:top-[101px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
          {[
            { id: 'checkin', label: '1. Voice Check-in (Bhashini)', icon: Mic },
            { id: 'cdss', label: '2. CDSS Triage Engine', icon: Activity },
            { id: 'snapshot', label: "3. Doctor's 30s Snapshot", icon: Stethoscope },
            { id: 'fhir', label: '4. ABHA & FHIR R4 Inspector', icon: FileCode },
            { id: 'chat', label: '5. Grounded AI Chatspace', icon: Bot }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsDoctorSnapshotMode(tab.id === 'snapshot');
                }}
                className={`min-h-[48px] px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#0D9488] text-white shadow-sm'
                    : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ===================================================================
          3. MAIN WORKSPACE CONTENT AREA
      =================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Patient Context Quick Summary Strip */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-[#0D9488] font-bold text-xs border border-teal-200">
                {activePatient.clinicalCohort === 'cardiac' ? 'POST-CABG CARDIAC COHORT' : 'FEBRILE / VIRAL RECOVERY COHORT'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                {activePatient.name} • {activePatient.primaryCondition}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Attending Clinician: <strong className="text-slate-800">{activePatient.attendingDoctor}</strong> ({activePatient.hospital}) • ABHA Address: <span className="font-mono text-teal-700">{activePatient.abhaAddress}</span>
            </p>
          </div>

          {/* Current Deterministic Triage Pill & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`px-4 py-2.5 rounded-xl border ${activeTierStyle.bg} ${activeTierStyle.border} flex items-center gap-3`}>
              <div className={`w-3 h-3 rounded-full ${
                (latestEvaluation?.tier || currentLog.triage) === 'RED'
                  ? 'bg-red-600 animate-ping'
                  : (latestEvaluation?.tier || currentLog.triage) === 'YELLOW'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`} />
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Current CDSS Status
                </div>
                <div className={`text-sm font-extrabold ${activeTierStyle.text}`}>
                  {latestEvaluation?.badge || `${currentLog.triage} ZONE`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFhirInspectorModal(true)}
              className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <FileCode className="w-4 h-4 text-teal-400" />
              <span>Live FHIR R4 JSON</span>
            </button>
          </div>
        </section>

        {/* =================================================================
            MODULE 1: VOICE CHECK-IN & BHASHINI API + DPDP PII MASKING
        ================================================================= */}
        {activeTab === 'checkin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Bhashini Multilingual Voice Capture & DPDP Masking */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                        Bhashini ULCA Voice-First Check-In
                      </h3>
                      <p className="text-xs text-slate-500">
                        Multilingual ASR/TTS Pipeline with Real-Time DPDP Act 2023 PII Sanitization
                      </p>
                    </div>
                  </div>

                  {/* Language Selector: en-IN, hi-IN, ta-IN */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {BhashiniApiService.supportedLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSelectedLang(lang.code)}
                        className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          selectedLang === lang.code
                            ? 'bg-[#0D9488] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-200/70'
                        }`}
                      >
                        {lang.nativeLabel} ({lang.code})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Simulated Voice Streams for Instant Demo Testing */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Load Sample Native Voice Stream (Tests Bhashini + PII Masking + CDSS):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BhashiniApiService.getSampleVoiceStreams(activePatient, selectedLang).map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setRawTranscript(sample.nativeText);
                          setTranslatedTranscript(sample.translatedEn);
                          setVitalsForm(sample.suggestedVitals);
                        }}
                        className="min-h-[42px] px-3 py-2 rounded-xl bg-teal-50/70 hover:bg-teal-100/80 text-teal-900 border border-teal-200 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                        <span>{sample.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Microphone Control & TTS Readback */}
                <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={handleToggleMicRecording}
                    className={`min-h-[52px] px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 transition shadow-sm ${
                      isRecording
                        ? 'bg-[#EF4444] text-white animate-pulse'
                        : 'bg-[#0D9488] hover:bg-teal-700 text-white'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span>
                      {isRecording
                        ? `Listening (${selectedLang})... Tap to Stop`
                        : `Record Voice Check-In (${selectedLang})`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeak(rawTranscript, selectedLang)}
                    disabled={!rawTranscript}
                    className="min-h-[52px] px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
                  >
                    <Volume2 className={`w-4 h-4 text-[#0D9488] ${isSpeaking ? 'animate-bounce' : ''}`} />
                    <span>Bhashini TTS Readback</span>
                  </button>

                  <div className="ml-auto text-right hidden sm:block">
                    <div className="text-[11px] font-mono text-slate-500">
                      Pipeline: {BhashiniApiService.supportedLanguages.find((l) => l.code === selectedLang)?.bhashiniModelId}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      • Web Speech API + ULCA Fallback Ready
                    </div>
                  </div>
                </div>

                {/* Raw Transcript Input (Editable to test custom PII / Red Flags) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      1. Raw Voice Transcript (Try typing Aadhaar / Phone / Name or Red Flags)
                    </label>
                    <span className="text-[11px] text-slate-500">Editable Live Buffer</span>
                  </div>
                  <textarea
                    rows={3}
                    value={rawTranscript}
                    onChange={(e) => {
                      setRawTranscript(e.target.value);
                      setTranslatedTranscript(e.target.value);
                    }}
                    placeholder="Speak or type patient symptoms here..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-900 focus:border-[#0D9488] focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                </div>

                {/* DPDP Act 2023 Local Regex PII Masking Preview Box */}
                <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 space-y-3 border border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                        2. DPDP Act 2023 On-Device PII Regex Sanitizer (Pre-Cloud Payload)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {piiAnalysis.redactions.length} PII Token(s) Masked Locally
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed">
                    {piiAnalysis.sanitizedText || 'No transcript input yet.'}
                  </div>

                  {piiAnalysis.redactions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">Redacted Identifiers:</span>
                      {piiAnalysis.redactions.map((item, index) => (
                        <span
                          key={index}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-red-200"
                        >
                          {item.type}: "{item.original}" → {item.replacement}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Structured Vital Observations & Instant CDSS Submission */}
            <div className="lg:col-span-5 space-y-6">
              <form
                onSubmit={handleCheckInSubmit}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                        Home Vitals & Symptom Check-In
                      </h3>
                      <p className="text-xs text-slate-500">
                        Auto-mapped to LOINC & SNOMED-CT FHIR R4 Observations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      min="60"
                      max="240"
                      value={vitalsForm.sysBP}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, sysBP: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900 focus:border-[#0D9488] focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">LOINC: 8480-6</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      min="40"
                      max="150"
                      value={vitalsForm.diaBP}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, diaBP: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900 focus:border-[#0D9488] focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">LOINC: 8462-4</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      min="35"
                      max="210"
                      value={vitalsForm.hr}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, hr: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900 focus:border-[#0D9488] focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">LOINC: 8867-4</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      SpO2 Oxygen (%)
                    </label>
                    <input
                      type="number"
                      min="70"
                      max="100"
                      value={vitalsForm.spo2}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, spo2: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900 focus:border-[#0D9488] focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">LOINC: 2708-6</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Temperature (°F)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="95"
                      max="107"
                      value={vitalsForm.temp}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, temp: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900 focus:border-[#0D9488] focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">LOINC: 8310-5</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      Pain / Fatigue (0-10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={vitalsForm.painScore}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, painScore: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-base font-bold text-slate-900 focus:border-[#0D9488] focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">SNOMED Scale</span>
                  </div>
                </div>

                {/* Quick Simulation Presets for Vitals */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Quick Vital Scenario Presets:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVitalsForm({ sysBP: 122, diaBP: 78, hr: 74, spo2: 98, temp: 98.4, painScore: 1 });
                        setRawTranscript('Feeling rested and comfortable today. No acute complaints.');
                        setTranslatedTranscript('Feeling rested and comfortable today. No acute complaints.');
                      }}
                      className="min-h-[42px] px-2 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition"
                    >
                      🟢 Green Vitals
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVitalsForm({ sysBP: 142, diaBP: 88, hr: 94, spo2: 94, temp: 99.8, painScore: 4 });
                        setRawTranscript('Mild breathlessness after climbing stairs and slight evening fatigue.');
                        setTranslatedTranscript('Mild breathlessness after climbing stairs and slight evening fatigue.');
                      }}
                      className="min-h-[42px] px-2 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition"
                    >
                      🟡 Yellow Vitals
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVitalsForm({ sysBP: 166, diaBP: 102, hr: 120, spo2: 91, temp: 101.6, painScore: 8 });
                        setRawTranscript('Sudden chest pain and breathing difficulty at rest.');
                        setTranslatedTranscript('Sudden chest pain and breathing difficulty at rest.');
                      }}
                      className="min-h-[42px] px-2 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 text-xs font-bold transition"
                    >
                      🔴 Red Vitals
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[54px] rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Evaluate Check-In via Deterministic CDSS & Encode FHIR</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =================================================================
            MODULE 2: DETERMINISTIC CDSS TRIAGE ENGINE VIEW
        ================================================================= */}
        {activeTab === 'cdss' && latestEvaluation && (
          <div className="space-y-6">
            {/* Top Triage Banner */}
            <div className={`rounded-2xl border-2 p-6 ${activeTierStyle.bg} ${activeTierStyle.border} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${activeTierStyle.pill}`}>
                    {latestEvaluation.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-600">
                    Evaluated at {latestEvaluation.evaluatedAt} • Deterministic Rule Engine v2.4
                  </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-extrabold ${activeTierStyle.text}`}>
                  {latestEvaluation.title}
                </h3>
                <p className="text-sm text-slate-800 max-w-3xl leading-relaxed">
                  {latestEvaluation.recommendation}
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200">
                    SNOMED-CT Mapped: <strong>{latestEvaluation.snomed.code}</strong> ({latestEvaluation.snomed.display})
                  </span>
                  <span className="bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200">
                    Action: {latestEvaluation.nextStep}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSpeak(latestEvaluation.recommendation, 'en-IN')}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-[#0D9488]" />
                  <span>Listen to Triage Guidance</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDoctorSnapshotMode(true);
                    setActiveTab('snapshot');
                  }}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <span>Open Doctor Snapshot</span>
                </button>
              </div>
            </div>

            {/* Explainable Rule-by-Rule Breakdown Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    Explainable Deterministic Rule Trace (Zero-Hallucination Clinical Logic)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Every vital sign and extracted SNOMED symptom is verified against transparent clinical thresholds
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCdssModal(true)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0D9488] font-bold text-xs border border-teal-200"
                >
                  View Summary Card Modal
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-3">Rule ID</th>
                      <th className="py-3 px-3">Clinical Parameter</th>
                      <th className="py-3 px-3">Observed Value</th>
                      <th className="py-3 px-3">Target Corridor</th>
                      <th className="py-3 px-3">Tier</th>
                      <th className="py-3 px-3">Deterministic Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {latestEvaluation.rules.map((r) => {
                      const st = getTriageStyle(r.tier);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-3 font-mono text-xs text-slate-500">{r.id}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">{r.parameter}</td>
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{r.observed}</td>
                          <td className="py-3.5 px-3 font-mono text-xs text-slate-600">{r.threshold}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${st.pill}`}>
                              {r.tier}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-700">{r.explanation}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            MODULE 3: DOCTOR'S 30-SECOND SNAPSHOT MODE (SINGLE-DEVICE HANDOVER)
        ================================================================= */}
        {activeTab === 'snapshot' && (
          <div className="space-y-6">
            {/* Clinician Handover Banner */}
            <div className="bg-[#0F172A] text-white rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30">
                      Single-Device Clinician Handover View
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      14-Day Longitudinal Summary
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mt-1">
                    Doctor&apos;s 30-Second Clinical Snapshot — {activePatient.name} ({activePatient.age}{activePatient.gender[0]})
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Primary Diagnosis: <strong>{activePatient.primaryCondition}</strong> • Attending: {activePatient.attendingDoctor}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowFhirInspectorModal(true)}
                  className="min-h-[48px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  <FileCode className="w-4 h-4" />
                  <span>Inspect FHIR R4 Bundle</span>
                </button>
              </div>
            </div>

            {/* High-Density KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400">Latest Blood Pressure</span>
                <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
                  {currentLog.sysBP}/{currentLog.diaBP} <span className="text-xs font-normal text-slate-500">mmHg</span>
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  14d Baseline: {activePatient.logs[0]?.sysBP}/{activePatient.logs[0]?.diaBP} mmHg
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400">Heart Rate & SpO2</span>
                <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
                  {currentLog.hr} <span className="text-xs font-normal text-slate-500">bpm</span> • {currentLog.spo2}%
                </div>
                <div className="text-xs text-teal-700 font-semibold mt-1">
                  LOINC 8867-4 / 2708-6 Verified
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400">Body Temperature</span>
                <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
                  {currentLog.temp} <span className="text-xs font-normal text-slate-500">°F</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-1">
                  Day 1 Peak: {activePatient.logs[0]?.temp} °F
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-400">14-Day Triage Distribution</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                    {activePatient.logs.filter((l) => l.triage === 'GREEN').length} Green
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
                    {activePatient.logs.filter((l) => l.triage === 'YELLOW').length} Yellow
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-900 font-bold text-xs">
                    {activePatient.logs.filter((l) => l.triage === 'RED').length} Red
                  </span>
                </div>
              </div>
            </div>

            {/* 14-Day Recovery Trend Charts (Recharts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Hemodynamic Trend (Systolic BP, Diastolic BP, Heart Rate) */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A]">
                      14-Day Hemodynamic Trajectory (BP & Heart Rate)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Systolic BP (mmHg), Diastolic BP (mmHg), and Resting Pulse (bpm)
                    </p>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                    LOINC: 85354-9
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activePatient.logs} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#475569' }} />
                      <YAxis domain={[55, 175]} tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <ReferenceLine y={140} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Sys Alert 140', fill: '#EF4444', fontSize: 10 }} />
                      <Line type="monotone" dataKey="sysBP" name="Systolic BP" stroke="#0D9488" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="diaBP" name="Diastolic BP" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="hr" name="Heart Rate (bpm)" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Temperature & Symptom/Pain Recovery Curve */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0F172A]">
                      14-Day Temperature (°F) & SpO2 (%) Curve
                    </h4>
                    <p className="text-xs text-slate-500">
                       tracks post-op / post-viral defervescence and oxygenation stability
                    </p>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                    LOINC: 8310-5 / 2708-6
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activePatient.logs} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0D9488" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#0D9488" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#475569' }} />
                      <YAxis domain={[90, 104]} tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <ReferenceLine y={99.5} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Fever 99.5°F', fill: '#EF4444', fontSize: 10 }} />
                      <Area type="monotone" dataKey="temp" name="Temperature (°F)" stroke="#F59E0B" strokeWidth={2.5} fill="url(#tempGrad)" />
                      <Area type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#0D9488" strokeWidth={2} fill="url(#spo2Grad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Baseline Labs & Active Medication Adherence Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Baseline Diagnostic Labs (6 cols) */}
              <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-[#0D9488]" />
                    <span>Baseline Lab Panel (LOINC Coded)</span>
                  </h4>
                  <span className="text-xs text-slate-500">ABDM DiagnosticReport</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {activePatient.baselineLabs.map((lab, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-2 text-xs sm:text-sm">
                      <div>
                        <div className="font-bold text-slate-900">{lab.test}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          LOINC: {lab.loinc} • Ref: {lab.refRange}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-extrabold text-slate-900">
                          {lab.value} {lab.unit}
                        </div>
                        <span className="text-[11px] font-semibold text-teal-700">
                          {lab.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Medications & Interactive Adherence Toggle (6 cols) */}
              <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                    <Pill className="w-4 h-4 text-[#0D9488]" />
                    <span>Active Regimen & Adherence (RxNorm)</span>
                  </h4>
                  <span className="text-xs text-slate-500">Tap to toggle today&apos;s dose</span>
                </div>
                <div className="space-y-2.5">
                  {activePatient.medications.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => handleToggleMedication(med.id)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/70 flex items-center justify-between gap-3 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            med.takenToday ? 'bg-[#10B981] text-white' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">
                            {med.name} — <span className="text-[#0D9488]">{med.dosage}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {med.frequency} • <span className="font-mono">RxNorm: {med.rxNorm}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          {med.adherence}% 14d
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SNOMED-CT Mapped 14-Day Symptom Log Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-[#0F172A]">
                  14-Day SNOMED-CT Mapped Symptom & Triage Log
                </h4>
                <span className="text-xs font-mono text-slate-500">
                  Showing {activePatient.logs.length} Longitudinal Entries
                </span>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-100 text-[11px] font-bold uppercase text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3">Day / Date</th>
                      <th className="py-2.5 px-3">Vitals (BP • HR • SpO2 • Temp)</th>
                      <th className="py-2.5 px-3">Patient Voice Note (DPDP Sanitized)</th>
                      <th className="py-2.5 px-3">SNOMED-CT Concept</th>
                      <th className="py-2.5 px-3">CDSS Triage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {[...activePatient.logs].reverse().map((entry, idx) => {
                      const st = getTriageStyle(entry.triage);
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {entry.day} <span className="text-slate-400 font-normal">({entry.date})</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                            {entry.sysBP}/{entry.diaBP} • {entry.hr}bpm • {entry.spo2}% • {entry.temp}°F
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{entry.symptomText}</td>
                          <td className="py-2.5 px-3 font-mono text-teal-800 whitespace-nowrap">
                            SCT:{entry.snomedCode} ({entry.snomedDisplay})
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${st.pill}`}>
                              {entry.triage}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            MODULE 4: ABHA LONGITUDINAL RECORD & LIVE FHIR R4 JSON INSPECTOR
        ================================================================= */}
        {activeTab === 'fhir' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: ABDM HIE-CM Consent Artefact Manager */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        ABDM HIE-CM Digital Consent Manager
                      </h3>
                      <p className="text-xs text-slate-500">
                        DEPA Time-Boxed Consent Artefact & REST Audit Trail
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consent Artefact ID:</span>
                    <span className="font-mono font-bold text-slate-900">{activeConsent.consentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ABHA Address:</span>
                    <span className="font-mono font-bold text-[#0D9488]">{activePatient.abhaAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Purpose of Use:</span>
                    <span className="font-semibold text-slate-800">{activeConsent.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status / Token Validity:</span>
                    <span
                      className={`font-extrabold ${
                        activeConsent.status === 'GRANTED' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {activeConsent.status} ({activeConsent.tokenValidDays} Days Remaining)
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 block mb-1">Authorized FHIR HI Types:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeConsent.hiTypes.map((hi) => (
                        <span
                          key={hi}
                          className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-mono text-[11px]"
                        >
                          {hi}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grant / Revoke Controls */}
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleConsentAction('GRANT')}
                    className="flex-1 min-h-[48px] px-3 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Grant / Renew 30d Consent</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConsentAction('REVOKE')}
                    className="flex-1 min-h-[48px] px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <X className="w-4 h-4" />
                    <span>Revoke Consent</span>
                  </button>
                </div>

                {/* Live HIE-CM REST API Console Log */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>HIE-CM REST API Transaction Log</span>
                  </span>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {activeConsent.auditLogs.map((log, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-teal-400 font-bold">
                            {log.method} {log.endpoint}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            HTTP {log.status} • {log.timestamp}
                          </span>
                        </div>
                        <div className="text-slate-300">{log.summary}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Live FHIR R4 Bundle Payload Inspector */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-teal-400" />
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Live HL7 FHIR R4 Bundle Payload (`type: &quot;collection&quot;`)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      NRCeS India Profile • Includes Patient, Vital Signs Observation (LOINC), SNOMED-CT Observation & DiagnosticReport
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyFhirJson}
                      className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      {copiedFhir ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedFhir ? 'Copied!' : 'Copy JSON'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadFhirJson}
                      className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#0D9488] hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download .JSON</span>
                    </button>
                  </div>
                </div>

                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[500px] text-xs font-mono text-teal-300 leading-relaxed">
                  {JSON.stringify(fhirBundleJson, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            MODULE 5: FULL-VIEW GROUNDED ANTI-HALLUCINATION AI CHATSPACE
        ================================================================= */}
        {activeTab === 'chat' && (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden flex flex-col h-[640px]">
            {/* Chat Header with Anti-Hallucination Guardrail Badges */}
            <div className="bg-[#0F172A] text-white p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D9488] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    HealPulse Anti-Hallucination Recovery Companion
                  </h3>
                  <p className="text-xs text-slate-300">
                    Context Injected: <strong>{activePatient.name}</strong> ({activePatient.primaryCondition})
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
                  Rule 1: No Diagnosis / Rx Changes
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-semibold">
                  Rule 3: Hardcoded 108 Red-Flag Trigger Active
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60">
              {(chatHistories[activePatient.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl p-4 shadow-xs space-y-2 ${
                      msg.role === 'user'
                        ? 'bg-[#0D9488] text-white'
                        : msg.isEmergencyAlert
                        ? 'bg-red-50 border-2 border-[#EF4444] text-red-950'
                        : 'bg-white border border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[11px] opacity-80">
                      <span className="font-bold uppercase tracking-wider">
                        {msg.role === 'user' ? activePatient.name : msg.source || 'HealPulse AI'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </div>
                    {msg.isEmergencyAlert && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        <a
                          href="tel:108"
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>Dial 108 Emergency Ambulance</span>
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setEmergencyOverlay({
                              isOpen: true,
                              triggerSource: 'AI Chatspace Red-Flag Alert',
                              matchedKeywords: msg.matchedKeywords || ['Emergency Symptom'],
                              inputText: msg.text
                            })
                          }
                          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                        >
                          Open Full Emergency Overlay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0D9488]" />
                    <span>Verifying response against anti-hallucination guardrails & {activePatient.name}&apos;s profile...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Tailored Quick Prompt Pills & Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 mr-1">
                  Quick Prompts:
                </span>
                {activePatient.quickPrompts.map((prompt, idx) => {
                  const isRedFlagPrompt = prompt.includes('Trigger Red Flag');
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendChatMessage(prompt.replace('🚨 Trigger Red Flag: ', ''))}
                      className={`min-h-[38px] px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition ${
                        isRedFlagPrompt
                          ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300 font-bold'
                          : 'bg-teal-50/70 hover:bg-teal-100 text-teal-900 border-teal-200'
                      }`}
                    >
                      {prompt}
                    </button>
                  );
                })}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask a recovery question for ${activePatient.name} (or type 'chest pain' to test Rule 3 Red-Flag)...`}
                  className="flex-1 min-h-[48px] px-4 rounded-xl border border-slate-300 text-sm focus:border-[#0D9488] focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[48px] px-5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-sm flex items-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================
          4. PERSISTENT BOTTOM AI CHATSPACE DRAWER (AVAILABLE ON ALL TABS)
      =================================================================== */}
      {activeTab !== 'chat' && (
        <div className="fixed bottom-11 right-4 sm:right-6 z-30 w-[calc(100%-2rem)] sm:w-[430px]">
          {isChatDrawerOpen ? (
            <div className="bg-white border-2 border-[#0D9488] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[470px]">
              {/* Drawer Header */}
              <div className="bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-teal-400" />
                  <div>
                    <div className="text-xs font-bold">
                      Grounded AI Companion ({activePatient.name})
                    </div>
                    <div className="text-[10px] text-teal-300">
                      Anti-Hallucination Guardrails + Red-Flag Trigger Active
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChatDrawerOpen(false);
                      setActiveTab('chat');
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs"
                    title="Expand Full View"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChatDrawerOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Messages */}
              <div className="p-3.5 overflow-y-auto space-y-3 bg-slate-50 flex-1 max-h-64">
                {(chatHistories[activePatient.id] || []).slice(-4).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-xl p-3 text-xs space-y-1 max-w-[90%] ${
                        msg.role === 'user'
                          ? 'bg-[#0D9488] text-white'
                          : msg.isEmergencyAlert
                          ? 'bg-red-50 border border-red-400 text-red-950 font-semibold'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Prompt Chips inside Persistent Drawer */}
              <div className="px-3 pt-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
                {activePatient.quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChatMessage(prompt.replace('🚨 Trigger Red Flag: ', ''))}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border ${
                      prompt.includes('Trigger Red Flag')
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-teal-50 text-teal-900 border-teal-200'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Drawer Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="p-2.5 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask recovery question or test red-flag..."
                  className="flex-1 min-h-[42px] px-3 rounded-xl border border-slate-300 text-xs focus:border-[#0D9488] focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[42px] px-3.5 rounded-xl bg-[#0D9488] text-white font-bold text-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsChatDrawerOpen(true)}
              className="w-full min-h-[52px] px-4 py-3 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white shadow-xl border border-teal-500/40 flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0D9488] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>AI Recovery Companion ({activePatient.name.split(' ')[0]})</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Tap for grounded Q&A or Red-Flag safety test
                  </div>
                </div>
              </div>
              <ChevronUp className="w-5 h-5 text-teal-400" />
            </button>
          )}
        </div>
      )}

      {/* ===================================================================
          5. HARDCODED EMERGENCY RED-FLAG ALERT OVERLAY MODAL (RULE 3)
      =================================================================== */}
      {emergencyOverlay.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#EF4444] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#EF4444] text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
                  <AlertOctagon className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-extrabold text-[11px] uppercase tracking-wider">
                    Rule 3 Hardcoded Safety Trigger • LLM Output Suppressed
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-red-700 mt-1">
                    EMERGENCY MEDICAL TRIAGE ALERT
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyOverlay({ ...emergencyOverlay, isOpen: false })}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2 text-xs sm:text-sm text-red-950">
              <div>
                <strong>Patient:</strong> {activePatient.name} ({activePatient.age}y, {activePatient.gender}) • <strong>ABHA:</strong> {activePatient.abhaId}
              </div>
              <div>
                <strong>Condition Context:</strong> {activePatient.primaryCondition}
              </div>
              <div>
                <strong>Red-Flag Trigger Detected:</strong>{' '}
                <span className="font-mono font-bold underline">
                  {emergencyOverlay.matchedKeywords.join(', ')}
                </span>
              </div>
              <div className="text-xs text-red-800 italic">
                Input: &quot;{emergencyOverlay.inputText}&quot;
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <p className="font-bold text-slate-900">Immediate Stabilization Protocol:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Stop all physical activity immediately and sit or rest in a semi-upright position.</li>
                <li>Do not self-medicate or double-dose without emergency physician instruction.</li>
                <li>Keep this device unlocked in <strong>Doctor&apos;s 30-Second Snapshot Mode</strong> for paramedics.</li>
              </ul>
            </div>

            {/* High-Contrast Emergency Action Buttons (min 48px touch targets) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href="tel:108"
                className="min-h-[54px] px-5 py-3 rounded-2xl bg-[#EF4444] hover:bg-red-700 text-white font-black text-base flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/30 transition"
              >
                <PhoneCall className="w-5 h-5" />
                <span>CALL 108 AMBULANCE</span>
              </a>

              <a
                href={`tel:${activePatient.phone}`}
                onClick={(e) => {
                  e.preventDefault();
                  setEmergencyOverlay({ ...emergencyOverlay, isOpen: false });
                  setIsDoctorSnapshotMode(true);
                  setActiveTab('snapshot');
                }}
                className="min-h-[54px] px-5 py-3 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                <Stethoscope className="w-5 h-5 text-teal-400" />
                <span>Open Doctor Snapshot Mode</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          6. CDSS TRIAGE SUMMARY CARD MODAL
      =================================================================== */}
      {showCdssModal && latestEvaluation && (
        <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${activeTierStyle.pill}`}>
                {latestEvaluation.badge}
              </span>
              <button
                type="button"
                onClick={() => setShowCdssModal(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-extrabold text-[#0F172A]">
              {latestEvaluation.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {latestEvaluation.recommendation}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="font-bold text-slate-800">
                SNOMED-CT Clinical Encoding:
              </div>
              <div className="font-mono text-teal-800">
                Code: {latestEvaluation.snomed.code} — {latestEvaluation.snomed.display}
              </div>
              <div className="text-slate-500">
                DPDP Sanitized Note: &quot;{piiAnalysis.sanitizedText}&quot;
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCdssModal(false);
                  setActiveTab('cdss');
                }}
                className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-[#0D9488] text-white font-bold text-xs"
              >
                View Rule Trace ({latestEvaluation.rules.length} Rules)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCdssModal(false);
                  setIsDoctorSnapshotMode(true);
                  setActiveTab('snapshot');
                }}
                className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-[#0F172A] text-white font-bold text-xs"
              >
                Doctor&apos;s 30s Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          7. LIVE FHIR R4 JSON INSPECTOR MODAL
      =================================================================== */}
      {showFhirInspectorModal && (
        <div className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-teal-400" />
                <h3 className="text-base sm:text-lg font-bold">
                  Live FHIR R4 Bundle Inspector ({activePatient.name})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyFhirJson}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-teal-300"
                >
                  {copiedFhir ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFhirInspectorModal(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-x-auto max-h-[420px] text-xs font-mono text-teal-300">
              {JSON.stringify(fhirBundleJson, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* ===================================================================
          8. CREATE NEW PATIENT PROFILE MODAL (FOR LIVE PRESENTATIONS)
      =================================================================== */}
      {showNewProfileModal && (
        <div className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateNewProfile}
            className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#0D9488]" />
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Create New Live Demo Patient Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewProfileModal(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vikramaditya Rao"
                  value={newProfileForm.name}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={newProfileForm.age}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, age: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newProfileForm.gender}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, gender: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ABHA ID (14-Digit)</label>
                <input
                  type="text"
                  value={newProfileForm.abhaId}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, abhaId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CDSS Clinical Cohort</label>
                <select
                  value={newProfileForm.clinicalCohort}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, clinicalCohort: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white"
                >
                  <option value="cardiac">Post-Surgical / Cardiac / Chronic</option>
                  <option value="febrile">Acute Febrile / Viral Recovery</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Primary Condition & Recovery Cohort</label>
                <input
                  type="text"
                  value={newProfileForm.primaryCondition}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, primaryCondition: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Attending Physician</label>
                <input
                  type="text"
                  value={newProfileForm.attendingDoctor}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, attendingDoctor: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Medication</label>
                <input
                  type="text"
                  value={newProfileForm.med1Name}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, med1Name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowNewProfileModal(false)}
                className="min-h-[48px] px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[48px] px-5 py-2 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs"
              >
                Create & Switch to Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================
          9. FIXED COMPLIANCE & SAFETY FOOTER (MANDATORY ACROSS ALL VIEWS)
      =================================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A] text-slate-200 border-t border-slate-800 px-4 py-2.5 text-center shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium">
          <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <span>
            HealPulse is an ABDM-compliant Clinical Decision Support System (CDSS) for post-consultation triage. It does not provide automated diagnoses. In an emergency, visit a hospital immediately.
          </span>
        </div>
      </footer>
    </div>
  );
}
