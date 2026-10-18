"""ContinuumCare demo API. Uses only the Python standard library and SQLite."""
from __future__ import annotations

import json
import hashlib
import os
import re
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse

ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("CONTINUUMCARE_DB", ROOT / "data" / "continuumcare.sqlite3"))
STATIC = ROOT / "static"
PORT = int(os.environ.get("PORT", "8018"))


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    return db


@contextmanager
def connection():
    db = connect()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    with connection() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY, name TEXT NOT NULL, age INTEGER NOT NULL,
            pathway TEXT NOT NULL, abha_demo TEXT, risk TEXT NOT NULL DEFAULT 'green',
            medications TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS checkins (
            id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id TEXT NOT NULL REFERENCES patients(id),
            energy TEXT NOT NULL, symptoms TEXT NOT NULL, severity TEXT NOT NULL,
            notes TEXT NOT NULL DEFAULT '', language TEXT NOT NULL DEFAULT 'en',
            risk TEXT NOT NULL, created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id TEXT NOT NULL REFERENCES patients(id),
            label TEXT NOT NULL, detail TEXT NOT NULL DEFAULT '', due_date TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0, category TEXT NOT NULL DEFAULT 'care'
        );
        CREATE TABLE IF NOT EXISTS clinician_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id TEXT NOT NULL REFERENCES patients(id),
            body TEXT NOT NULL, created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS patient_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id TEXT NOT NULL REFERENCES patients(id),
            title TEXT NOT NULL, original_filename TEXT NOT NULL, document_date TEXT NOT NULL,
            mime_type TEXT NOT NULL, size_bytes INTEGER NOT NULL, sha256 TEXT NOT NULL,
            content BLOB NOT NULL, created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS checkins_patient_date ON checkins(patient_id, created_at DESC);
        CREATE INDEX IF NOT EXISTS tasks_patient_due ON tasks(patient_id, due_date);
        """)
        if db.execute("SELECT COUNT(*) FROM patients").fetchone()[0] == 0:
            seed_demo(db)


def seed_demo(db: sqlite3.Connection) -> None:
    patients = [
        ("CC-2048", "Riya Mehta", 42, "Oncology follow-up", "DEMO-ABHA-2048", "red", '["Treatment plan medication", "Supportive medication"]'),
        ("CC-2035", "Arjun Nair", 56, "Cardiac recovery", "DEMO-ABHA-2035", "green", '["Cardiac medication", "Supportive medication"]'),
        ("CC-2029", "Meera Iyer", 38, "Post-viral recovery", "DEMO-ABHA-2029", "yellow", '["Prescribed medication"]'),
        ("CC-2011", "Kabir Singh", 63, "Oncology follow-up", "DEMO-ABHA-2011", "yellow", '["Treatment plan medication", "Supportive medication"]'),
        ("CC-1996", "Ananya Rao", 47, "Thyroid monitoring", "DEMO-ABHA-1996", "green", '["Prescribed medication"]'),
        ("CC-1984", "Dev Patel", 51, "Cardiac recovery", "DEMO-ABHA-1984", "yellow", '["Cardiac medication"]'),
        ("CC-1968", "Sana Khan", 34, "Post-viral recovery", "DEMO-ABHA-1968", "green", '["Prescribed medication"]'),
        ("CC-1950", "Vikram Joshi", 59, "Oncology follow-up", "DEMO-ABHA-1950", "yellow", '["Treatment plan medication"]'),
    ]
    db.executemany("INSERT INTO patients(id,name,age,pathway,abha_demo,risk,medications,created_at) VALUES(?,?,?,?,?,?,?,?)", [(*p, now_iso()) for p in patients])
    today = datetime.now().date()
    tasks = []
    for i, (pid, *_rest) in enumerate(patients):
        tasks.extend([
            (pid, "Daily symptom check-in", "A short check-in for your care team", today.isoformat(), 0, "checkin"),
            (pid, "Morning medication", "Follow the instructions provided by your clinician", today.isoformat(), 1, "medication"),
            (pid, "Follow-up appointment", "Clinic follow-up", (today + timedelta(days=5 + i % 4)).isoformat(), 0, "appointment"),
        ])
    db.executemany("INSERT INTO tasks(patient_id,label,detail,due_date,completed,category) VALUES(?,?,?,?,?,?)", tasks)
    # Fictional demonstration events; no real patient or clinical data is included.
    samples = [
        ("CC-2048", "A little low", '["Breathlessness", "Fatigue"]', "Somewhat", "I have felt more breathless than usual.", "en", "red", -1),
        ("CC-2035", "About usual", "[]", "A little", "", "en", "green", 0),
        ("CC-2011", "Very low", '["Nausea"]', "Somewhat", "", "en", "yellow", 0),
        ("CC-1996", "About usual", "[]", "A little", "", "en", "green", 0),
        ("CC-1984", "A little low", '["Dizziness"]', "A little", "", "en", "yellow", 0),
        ("CC-1968", "About usual", "[]", "A little", "Feeling a bit better.", "en", "green", 0),
        ("CC-1950", "Very low", '["Fatigue"]', "Somewhat", "Fatigue has been increasing.", "en", "yellow", -1),
    ]
    for pid, energy, symptoms, severity, notes, language, risk, days_ago in samples:
        created = (datetime.now(timezone.utc) + timedelta(days=days_ago)).isoformat(timespec="seconds")
        db.execute("INSERT INTO checkins(patient_id,energy,symptoms,severity,notes,language,risk,created_at) VALUES(?,?,?,?,?,?,?,?)", (pid, energy, symptoms, severity, notes, language, risk, created))


def risk_for(symptoms: list[str], severity: str) -> tuple[str, list[str]]:
    """Conservative demo rules for routing clinician review, not clinical prediction."""
    normalized = {s.strip().lower() for s in symptoms}
    reasons: list[str] = []
    urgent = {"breathlessness", "chest pain", "fainting"}
    if normalized & urgent:
        reasons.append("Patient selected a symptom marked for prompt clinician review in this demo protocol.")
        return "red", reasons
    if severity == "A lot":
        reasons.append("Patient rated symptom burden as 'A lot'.")
        return "red", reasons
    if normalized or severity == "Somewhat":
        reasons.append("Patient reported symptoms or moderate symptom burden.")
        return "yellow", reasons
    return "green", ["No symptoms selected in this check-in."]


def patient_json(db: sqlite3.Connection, row: sqlite3.Row) -> dict:
    pid = row["id"]
    latest = db.execute("SELECT * FROM checkins WHERE patient_id=? ORDER BY created_at DESC,id DESC LIMIT 1", (pid,)).fetchone()
    tasks = db.execute("SELECT * FROM tasks WHERE patient_id=? ORDER BY due_date, id", (pid,)).fetchall()
    notes = db.execute("SELECT * FROM clinician_notes WHERE patient_id=? ORDER BY created_at DESC LIMIT 10", (pid,)).fetchall()
    documents = db.execute("SELECT id,title,original_filename,document_date,mime_type,size_bytes,sha256,created_at FROM patient_documents WHERE patient_id=? ORDER BY document_date DESC,id DESC", (pid,)).fetchall()
    history = db.execute("SELECT * FROM checkins WHERE patient_id=? ORDER BY created_at DESC,id DESC LIMIT 12", (pid,)).fetchall()
    return {
        "id": row["id"], "name": row["name"], "age": row["age"], "pathway": row["pathway"],
        "abha_demo": row["abha_demo"], "risk": row["risk"], "medications": json.loads(row["medications"]),
        "latest_checkin": serialize_checkin(latest) if latest else None,
        "tasks": [dict(t) for t in tasks], "notes": [dict(n) for n in notes],
        "documents": [dict(d) for d in documents],
        "history": [serialize_checkin(h) for h in history]
    }


def serialize_checkin(row: sqlite3.Row) -> dict:
    d = dict(row)
    d["symptoms"] = json.loads(d["symptoms"])
    d["risk_reasons"] = risk_for(d["symptoms"], d["severity"])[1]
    return d


def fhir_bundle(db: sqlite3.Connection, patient: dict) -> dict:
    """Produce a compact FHIR R4-shaped demo export. Coding is illustrative only."""
    entries = [{"resource": {
        "resourceType": "Patient", "id": patient["id"], "active": True,
        "name": [{"use": "usual", "text": patient["name"]}],
        "birthDate": f"{datetime.now().year - patient['age']}-01-01",
        "identifier": [{"system": "https://example.invalid/demo-patient-id", "value": patient["id"]}],
        "extension": [{"url": "https://example.invalid/demo-abha-reference", "valueString": patient["abha_demo"]}],
    }}]
    for c in patient["history"]:
        entries.append({"resource": {
            "resourceType": "Observation", "id": f"checkin-{c['id']}", "status": "final",
            "subject": {"reference": f"Patient/{patient['id']}"}, "effectiveDateTime": c["created_at"],
            "category": [{"text": "Patient-reported outcome (demo)"}],
            "code": {"text": "Daily symptom check-in"},
            "valueString": f"Energy: {c['energy']}; symptoms: {', '.join(c['symptoms']) or 'none selected'}; severity: {c['severity']}",
            "note": [{"text": c["notes"]}] if c["notes"] else [],
        }})
    entries.append({"resource": {
        "resourceType": "CarePlan", "id": f"plan-{patient['id']}", "status": "active", "intent": "plan",
        "subject": {"reference": f"Patient/{patient['id']}"}, "title": f"{patient['pathway']} (demo)",
        "description": "Illustrative demo plan. Not a clinical order.",
    }})
    for i, medication in enumerate(patient["medications"], start=1):
        entries.append({"resource": {
            "resourceType": "MedicationStatement", "id": f"med-{patient['id']}-{i}",
            "status": "active", "subject": {"reference": f"Patient/{patient['id']}"},
            "medicationCodeableConcept": {"text": medication},
            "informationSource": {"display": "Fictional demo record; not a prescription"},
        }})
    for task in patient["tasks"]:
        entries.append({"resource": {
            "resourceType": "Task", "id": f"task-{task['id']}",
            "status": "completed" if task["completed"] else "ready", "intent": "order",
            "for": {"reference": f"Patient/{patient['id']}"}, "description": task["label"],
            "note": [{"text": task["detail"]}] if task["detail"] else [],
            "executionPeriod": {"end": task["due_date"]},
            "restriction": {"period": {"end": task["due_date"]}},
        }})
    for document in patient["documents"]:
        entries.append({"resource": {
            "resourceType": "DocumentReference", "id": f"document-{document['id']}",
            "status": "current", "subject": {"reference": f"Patient/{patient['id']}"},
            "date": document["created_at"], "description": document["title"],
            "content": [{"attachment": {
                "contentType": document["mime_type"], "url": f"/api/patients/{patient['id']}/documents/{document['id']}",
                "title": document["original_filename"], "creation": document["document_date"],
                "size": document["size_bytes"], "hash": document["sha256"],
            }}],
        }})
    return {"resourceType": "Bundle", "type": "collection", "timestamp": now_iso(), "entry": entries}


class Handler(BaseHTTPRequestHandler):
    server_version = "ContinuumCareDemo/1.0"

    def log_message(self, fmt: str, *args) -> None:
        print(f"[{self.log_date_time_string()}] {fmt % args}")

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def body_json(self):
        length = min(int(self.headers.get("Content-Length", "0")), 100_000)
        return json.loads(self.rfile.read(length) or b"{}")

    def do_GET(self):
        path = urlparse(self.path).path
        try:
            if path == "/api/health":
                return self.send_json({"ok": True, "mode": "local-demo", "database": "sqlite"})
            if path == "/api/bootstrap":
                with connection() as db:
                    rows = db.execute("SELECT * FROM patients ORDER BY CASE risk WHEN 'red' THEN 0 WHEN 'yellow' THEN 1 ELSE 2 END, name").fetchall()
                    patients = [patient_json(db, r) for r in rows]
                    return self.send_json({"patients": patients, "today": datetime.now().date().isoformat(), "mode": "local-demo"})
            match = re.fullmatch(r"/api/patients/([A-Za-z0-9-]+)/fhir", path)
            if match:
                with connection() as db:
                    row = db.execute("SELECT * FROM patients WHERE id=?", (match.group(1),)).fetchone()
                    if not row: return self.send_json({"error": "Patient not found"}, 404)
                    bundle = fhir_bundle(db, patient_json(db, row))
                    return self.send_json(bundle)
            match = re.fullmatch(r"/api/patients/([A-Za-z0-9-]+)/documents/(\d+)", path)
            if match:
                with connection() as db:
                    row = db.execute("SELECT original_filename,mime_type,content FROM patient_documents WHERE id=? AND patient_id=?", (int(match.group(2)), match.group(1))).fetchone()
                    if not row: return self.send_json({"error": "Document not found"}, 404)
                    body = row["content"]
                    self.send_response(200)
                    self.send_header("Content-Type", row["mime_type"])
                    self.send_header("Content-Length", str(len(body)))
                    self.send_header("Content-Disposition", f"inline; filename*=UTF-8''{quote(row['original_filename'])}")
                    self.send_header("X-Content-Type-Options", "nosniff")
                    self.send_header("Cache-Control", "no-store")
                    self.end_headers()
                    self.wfile.write(body)
                    return
            return self.serve_static(path)
        except Exception as exc:
            return self.send_json({"error": str(exc)}, 500)

    def do_POST(self):
        path = urlparse(self.path).path
        try:
            upload = re.fullmatch(r"/api/patients/([A-Za-z0-9-]+)/documents", path)
            if upload:
                try: length = int(self.headers.get("Content-Length", "0"))
                except ValueError: return self.send_json({"error": "Invalid document size"}, 400)
                if length <= 0 or length > 15 * 1024 * 1024: return self.send_json({"error": "PDF must be between 1 byte and 15 MB"}, 413 if length > 15 * 1024 * 1024 else 400)
                content_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
                if content_type != "application/pdf": return self.send_json({"error": "Choose a PDF file"}, 415)
                content = self.rfile.read(length)
                if len(content) != length or not content.startswith(b"%PDF-") or b"%%EOF" not in content[-2048:]:
                    return self.send_json({"error": "This file does not look like a valid PDF"}, 400)
                query = parse_qs(urlparse(self.path).query)
                title = (query.get("title", [""])[0]).strip()[:160]
                document_date = (query.get("document_date", [""])[0])[:10]
                filename = Path(query.get("filename", ["record.pdf"])[0]).name[:180]
                if not title: title = Path(filename).stem[:160] or "Medical record"
                try: datetime.strptime(document_date, "%Y-%m-%d")
                except ValueError: return self.send_json({"error": "Enter a valid document date"}, 400)
                if not filename.lower().endswith(".pdf"): return self.send_json({"error": "Only PDF files are supported"}, 415)
                with connection() as db:
                    if not db.execute("SELECT 1 FROM patients WHERE id=?", (upload.group(1),)).fetchone(): return self.send_json({"error": "Patient not found"}, 404)
                    cur = db.execute("INSERT INTO patient_documents(patient_id,title,original_filename,document_date,mime_type,size_bytes,sha256,content,created_at) VALUES(?,?,?,?,?,?,?,?,?)", (upload.group(1),title,filename,document_date,"application/pdf",len(content),hashlib.sha256(content).hexdigest(),sqlite3.Binary(content),now_iso()))
                    row = db.execute("SELECT id,title,original_filename,document_date,mime_type,size_bytes,sha256,created_at FROM patient_documents WHERE id=?", (cur.lastrowid,)).fetchone()
                    return self.send_json({"document": dict(row)}, 201)
            data = self.body_json()
            if path == "/api/checkins":
                pid = str(data.get("patient_id", ""))
                energy = str(data.get("energy", ""))
                severity = str(data.get("severity", ""))
                symptoms = data.get("symptoms", [])
                if not isinstance(symptoms, list) or len(symptoms) > 20: return self.send_json({"error": "Invalid symptom list"}, 400)
                allowed_symptoms = {"Nausea", "Pain", "Breathlessness", "Fatigue", "Dizziness", "Other"}
                if any(not isinstance(s, str) or s not in allowed_symptoms for s in symptoms): return self.send_json({"error": "Choose symptoms from the check-in list"}, 400)
                if energy not in {"About usual", "A little low", "Very low"} or severity not in {"None", "A little", "Somewhat", "A lot"}:
                    return self.send_json({"error": "Please select valid check-in responses"}, 400)
                notes = str(data.get("notes", ""))[:1000]
                lang = str(data.get("language", "en"))[:8]
                risk, reasons = risk_for([str(s) for s in symptoms], severity)
                with connection() as db:
                    if not db.execute("SELECT 1 FROM patients WHERE id=?", (pid,)).fetchone(): return self.send_json({"error": "Patient not found"}, 404)
                    cur = db.execute("INSERT INTO checkins(patient_id,energy,symptoms,severity,notes,language,risk,created_at) VALUES(?,?,?,?,?,?,?,?)", (pid, energy, json.dumps(symptoms), severity, notes, lang, risk, now_iso()))
                    db.execute("UPDATE patients SET risk=? WHERE id=?", (risk, pid))
                    row = db.execute("SELECT * FROM checkins WHERE id=?", (cur.lastrowid,)).fetchone()
                    return self.send_json({"checkin": serialize_checkin(row), "risk_reasons": reasons}, 201)
            match = re.fullmatch(r"/api/tasks/(\d+)/complete", path)
            if match:
                with connection() as db:
                    cur = db.execute("UPDATE tasks SET completed=CASE completed WHEN 0 THEN 1 ELSE 0 END WHERE id=?", (int(match.group(1)),))
                    if cur.rowcount == 0: return self.send_json({"error": "Task not found"}, 404)
                    task = db.execute("SELECT * FROM tasks WHERE id=?", (int(match.group(1)),)).fetchone()
                    return self.send_json({"task": dict(task)})
            match = re.fullmatch(r"/api/patients/([A-Za-z0-9-]+)/notes", path)
            if match:
                body = str(data.get("body", "")).strip()[:2000]
                if not body: return self.send_json({"error": "Note cannot be empty"}, 400)
                with connection() as db:
                    if not db.execute("SELECT 1 FROM patients WHERE id=?", (match.group(1),)).fetchone(): return self.send_json({"error": "Patient not found"}, 404)
                    cur = db.execute("INSERT INTO clinician_notes(patient_id,body,created_at) VALUES(?,?,?)", (match.group(1), body, now_iso()))
                    note = db.execute("SELECT * FROM clinician_notes WHERE id=?", (cur.lastrowid,)).fetchone()
                    return self.send_json({"note": dict(note)}, 201)
            match = re.fullmatch(r"/api/patients/([A-Za-z0-9-]+)/tasks", path)
            if match:
                pid = match.group(1)
                label = str(data.get("label", "")).strip()[:120]
                detail = str(data.get("detail", "")).strip()[:300]
                due_date = str(data.get("due_date", ""))[:10]
                category = str(data.get("category", "care"))
                try: datetime.strptime(due_date, "%Y-%m-%d")
                except ValueError: return self.send_json({"error": "Enter a valid due date"}, 400)
                if category not in {"care", "checkin", "lab", "appointment", "medication"}:
                    return self.send_json({"error": "Choose a valid task type"}, 400)
                if not label: return self.send_json({"error": "Task name cannot be empty"}, 400)
                with connection() as db:
                    if not db.execute("SELECT 1 FROM patients WHERE id=?", (pid,)).fetchone(): return self.send_json({"error": "Patient not found"}, 404)
                    cur = db.execute("INSERT INTO tasks(patient_id,label,detail,due_date,category) VALUES(?,?,?,?,?)", (pid,label,detail,due_date,category))
                    task = db.execute("SELECT * FROM tasks WHERE id=?", (cur.lastrowid,)).fetchone()
                    return self.send_json({"task": dict(task)}, 201)
            if path == "/api/patients":
                name = str(data.get("name", "")).strip()[:100]
                pathway = str(data.get("pathway", "")).strip()[:100]
                try: age = int(data.get("age"))
                except (ValueError, TypeError): age = 0
                if not name or not pathway or not 0 < age < 120: return self.send_json({"error": "Enter a name, pathway, and valid age"}, 400)
                pid = "CC-" + datetime.now().strftime("%y%m%d%H%M%S")
                with connection() as db:
                    db.execute("INSERT INTO patients(id,name,age,pathway,abha_demo,risk,medications,created_at) VALUES(?,?,?,?,?,?,?,?)", (pid, name, age, pathway, "DEMO-" + pid, "green", "[]", now_iso()))
                    db.execute("INSERT INTO tasks(patient_id,label,detail,due_date,category) VALUES(?,?,?,?,?)", (pid, "Daily symptom check-in", "A short check-in for your care team", datetime.now().date().isoformat(), "checkin"))
                    row = db.execute("SELECT * FROM patients WHERE id=?", (pid,)).fetchone()
                    return self.send_json({"patient": patient_json(db, row)}, 201)
            return self.send_json({"error": "Not found"}, 404)
        except json.JSONDecodeError:
            return self.send_json({"error": "Request body must be valid JSON"}, 400)
        except Exception as exc:
            return self.send_json({"error": str(exc)}, 500)

    def serve_static(self, path):
        if path in ("", "/"): path = "/index.html"
        target = (STATIC / path.lstrip("/")).resolve()
        if STATIC.resolve() not in target.parents or not target.is_file():
            return self.send_json({"error": "Not found"}, 404)
        mime = {".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml"}.get(target.suffix, "application/octet-stream")
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    init_db()
    print(f"ContinuumCare demo running at http://127.0.0.1:{PORT}")
    print(f"SQLite database: {DB_PATH}")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
