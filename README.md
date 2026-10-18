# ContinuumCare

ContinuumCare is a local, end-to-end care-coordination demo for showing the handoff between a patient check-in and a clinician review. It runs with Python's standard library and SQLite; it does not need npm, an API key, or a cloud account.

> **Demo and safety boundary:** All seeded records are fictional. The app is not a medical device, does not diagnose or predict disease, and must not be used to make clinical decisions. Do not enter real patient data. Risk colors are transparent demonstration rules and are not clinically validated. This project does not connect to ABDM/ABHA, hospital systems, a real LLM, or a production speech service.

## Run locally

Requirements: Python 3.9 or newer.

1. Download or clone this folder.
2. From this folder, run:

   ```sh
   python server.py
   ```

3. Open [http://127.0.0.1:8018](http://127.0.0.1:8018).

On Windows, `start.bat` launches the same local server. Press `Ctrl+C` in the terminal to stop it. SQLite data is stored in `data/continuumcare.sqlite3`; deleting that file resets the demo seed data. Set `PORT` to choose another port. Set `CONTINUUMCARE_DB` to store the database somewhere else.

## Demo flows

- **Clinician workspace:** review the watchlist, filter and search patients, inspect each longitudinal timeline, add a care-team note, and export a FHIR-shaped JSON bundle.
- **Patient home:** switch to a fictional patient, choose English, Hindi, Tamil, or Bengali for key prompts, complete a symptom check-in, and see care-plan tasks.
- **End-to-end handoff:** check-ins are stored in SQLite and immediately update the selected patient's timeline and review flag in the clinician workspace.
- **Care plans:** mark routine tasks complete or add a patient-facing follow-up reminder with a due date and type; task state persists locally.
- **Add patient:** create a fictional local record and an initial daily check-in task.
- **Voice input:** where the browser supports Web Speech recognition, a user-initiated button can transcribe speech into the notes field. Browser speech services may process audio outside this app; review the browser's speech privacy behavior before using it. Typing is always available.
- **FHIR-shaped export:** download a Bundle containing demo Patient, Observation, CarePlan, and MedicationStatement resources. Example identifiers and incomplete coding are deliberate; the export is not validated or ready for exchange with an EHR.
- **Past-record PDF intake:** attach a PDF to a patient with a title and document date, then view or download it from that patient's longitudinal record. The local server validates the PDF signature, enforces a 15 MB limit, stores it in SQLite, and includes a FHIR-shaped `DocumentReference` in the demo export. This is a document vault only: it does not extract or interpret text from PDFs.

## Demo triage rules

The API applies these explainable rules to patient responses:

- **Red / prompt review:** breathlessness, chest pain, fainting, or symptom severity marked “A lot”.
- **Yellow / review:** any other symptom selected or severity marked “Somewhat”.
- **Green / no selected symptom:** no symptom selected and severity marked “None” or “A little”.

These rules are included to demonstrate event routing only. They do not use medications, lab values, a trained classifier, or clinical guidelines. A missed check-in is not treated as a clinical event.

## API overview

All routes are served by the local Python server.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Local service status |
| `GET` | `/api/bootstrap` | Patient records, check-ins, notes, tasks |
| `POST` | `/api/checkins` | Save a patient check-in and its demo review flag |
| `POST` | `/api/tasks/{id}/complete` | Toggle a care-plan task |
| `POST` | `/api/patients/{id}/tasks` | Add a care-plan task |
| `POST` | `/api/patients` | Create a fictional patient record |
| `POST` | `/api/patients/{id}/notes` | Save a clinician note |
| `POST` | `/api/patients/{id}/documents?title=...&document_date=YYYY-MM-DD&filename=...` | Store a PDF (raw `application/pdf` request body; max 15 MB) |
| `GET` | `/api/patients/{id}/documents/{document_id}` | View an attached PDF |
| `GET` | `/api/patients/{id}/fhir` | Export a FHIR-shaped demo Bundle |

## GitHub upload

This folder is self-contained and can be uploaded as a repository. The `.gitignore` excludes the local SQLite database and Python cache. Keep fictional seed data only; never commit real health information, credentials, or private keys. Add an appropriate license before publishing if you want others to reuse the code.

To publish it from a terminal after creating an empty repository on GitHub:

```sh
git init -b main
git add .
git commit -m "Initial ContinuumCare demo"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your repository URL. This project package has not been pushed to GitHub.

## Production work still required

Before any real clinical use, this project would need an authenticated backend, authorization by role, encryption and key management, audited access, secure deployment, consent and privacy workflows, retention and deletion controls, accessibility and language review, threat modeling, clinical safety validation, FHIR conformance testing, and formal ABDM onboarding plus approved consent-based integrations. Uploaded documents are stored unencrypted in the local demo database and must be fictional test documents only. PDF text extraction, LLM summarization, trained adverse-event prediction, and ABHA data exchange are not connected.
