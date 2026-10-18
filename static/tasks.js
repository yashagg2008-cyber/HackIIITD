function openTask(patientId=''){
  const form=document.getElementById('taskForm');
  const select=document.getElementById('taskPatient');
  select.innerHTML=state.patients.map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} · ${escapeHtml(p.id)}</option>`).join('');
  if(patientId)select.value=patientId;
  form.elements.due_date.value=new Date().toISOString().slice(0,10);
  document.getElementById('taskDialog').showModal();
}

function handlePrimaryAction(){
  if(state.page==='care')openTask();
  else openAddPatient();
}

const baseRenderTable=renderTable;
renderTable=function(){
  const carePage=state.page==='care';
  document.querySelector('.filter-list').hidden=carePage;
  const search=document.getElementById('patientSearch');
  search.placeholder=carePage?'Search tasks':'Search patients';
  search.setAttribute('aria-label',carePage?'Search care-plan tasks':'Search patients');
  document.querySelectorAll('thead th').forEach((cell,index)=>{
    cell.textContent=carePage?['Patient','Task','Due date','Instructions','Status'][index]:['Patient','Care pathway','Last check-in','Reported signal','Review'][index];
  });
  baseRenderTable();
  if(carePage){
    const visible=allTasks().filter(t=>!state.query||`${t.patient_name} ${t.label} ${t.category}`.toLowerCase().includes(state.query));
    document.getElementById('patientCountText').textContent=`Showing ${visible.length} care-plan tasks`;
  }
};

const baseSetPage=setPage;
setPage=function(page){
  baseSetPage(page);
  document.getElementById('primaryAction').innerHTML=page==='care'?'<span>＋</span> Add follow-up task':'<span>＋</span> Add patient';
};

const baseRenderAlerts=renderAlerts;
renderAlerts=function(){
  baseRenderAlerts();
  document.querySelector('.alert-panel .panel-heading p').textContent='Reported updates and check-in reminders';
  const missed=state.patients.filter(p=>p.risk!=='green'&&!p.latest_checkin);
  if(!missed.length)return;
  const list=document.getElementById('alertsList');
  for(const p of missed){
    const item=document.createElement('button');
    item.className='alert-item';
    item.dataset.patient=p.id;
    item.innerHTML=`<span class="alert-icon yellow">◷</span><span><b>${escapeHtml(p.name)} · Check-in reminder</b><p>No daily check-in received yet. No symptom response is available.</p><small>Today · Reminder status</small></span>`;
    list.append(item);
  }
  document.getElementById('alertCount').textContent=String(Number(document.getElementById('alertCount').textContent||0)+missed.length);
};

async function handleTask(event){
  event.preventDefault();
  const form=event.currentTarget;
  const fields=new FormData(form);
  try{
    await api(`/api/patients/${encodeURIComponent(fields.get('patient_id'))}/tasks`,{
      method:'POST',
      body:JSON.stringify({label:fields.get('label'),detail:fields.get('detail'),due_date:fields.get('due_date'),category:fields.get('category')})
    });
    closeDialog('taskDialog');
    form.reset();
    await load();
    toast('Follow-up task added to the local care plan.');
  }catch(error){toast(error.message)}
}

const renderPatientDetail=openDetail;
openDetail=async function(patientId){
  await renderPatientDetail(patientId);
  const patient=state.patients.find(p=>p.id===patientId);
  if(!patient)return;
  const column=document.querySelector('#detailContent .detail-layout > div:first-child');
  if(!column)return;
  const records=document.createElement('article');
  records.className='detail-card records-card';
  const entries=patient.documents||[];
  records.innerHTML=`<div class="records-heading"><div><h3>Past medical records</h3><p>PDFs attached to this local patient record.</p></div><button type="button" class="button outline" onclick="openDocumentUpload('${escapeHtml(patient.id)}')">＋ Upload PDF</button></div><div class="document-list">${entries.length?entries.map(d=>`<div class="document-item"><span class="document-icon">PDF</span><span class="document-copy"><b>${escapeHtml(d.title)}</b><small>${escapeHtml(d.original_filename)} · ${formatDate(d.document_date)} · ${Math.max(1,Math.ceil(d.size_bytes/1024))} KB</small></span><a class="document-link" href="/api/patients/${encodeURIComponent(patient.id)}/documents/${d.id}" target="_blank" rel="noopener">View</a><a class="document-link" href="/api/patients/${encodeURIComponent(patient.id)}/documents/${d.id}" download="${escapeHtml(d.original_filename)}">Download</a></div>`).join(''):'<p class="empty-documents">No PDFs attached yet. Add a discharge summary, lab report, or other past record.</p>'}</div>`;
  column.append(records);
  const timeline=document.querySelector('#detailContent .timeline');
  if(timeline)for(const doc of entries){
    const item=document.createElement('div');item.className='timeline-item';
    const title=document.createElement('b');title.textContent='Uploaded medical record';
    const date=document.createElement('small');date.textContent=formatDate(doc.document_date);
    const body=document.createElement('p');body.textContent=doc.title;
    const link=document.createElement('a');link.className='document-link';link.href=`/api/patients/${encodeURIComponent(patient.id)}/documents/${doc.id}`;link.target='_blank';link.rel='noopener';link.textContent='View PDF';
    item.append(title,date,body,link);timeline.append(item);
  }
};

function openDocumentUpload(patientId){
  const form=document.getElementById('documentForm');
  form.reset();
  form.elements.patient_id.value=patientId;
  form.elements.document_date.value=new Date().toISOString().slice(0,10);
  document.getElementById('documentFileName').textContent='Select a PDF file · up to 15 MB';
  closeDialog('detailDialog');
  document.getElementById('documentDialog').showModal();
}

async function handleDocumentUpload(event){
  event.preventDefault();
  const form=event.currentTarget;
  const patientId=form.elements.patient_id.value;
  const file=form.elements.file.files[0];
  if(!file){toast('Choose a PDF file to continue.');return}
  if(file.size>15*1024*1024){toast('That PDF is over the 15 MB limit.');return}
  if(!file.name.toLowerCase().endsWith('.pdf')||(file.type&&file.type!=='application/pdf')){toast('Choose a PDF document.');return}
  const params=new URLSearchParams({title:form.elements.title.value.trim(),document_date:form.elements.document_date.value,filename:file.name});
  const submit=form.querySelector('[type="submit"]');
  submit.disabled=true;submit.textContent='Saving…';
  try{
    const response=await fetch(`/api/patients/${encodeURIComponent(patientId)}/documents?${params}`,{method:'POST',headers:{'Content-Type':'application/pdf','Accept':'application/json'},body:file});
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(result.error||`Upload failed (${response.status})`);
    closeDialog('documentDialog');
    await load();
    await openDetail(patientId);
    toast('PDF added to the local patient record.');
  }catch(error){toast(`PDF was not saved: ${error.message}`)}
  finally{submit.disabled=false;submit.textContent='Save to patient record'}
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('taskForm').addEventListener('submit',handleTask);
  const file=document.querySelector('#documentForm [name="file"]');
  file.addEventListener('change',()=>{const selected=file.files[0];document.getElementById('documentFileName').textContent=selected?`${selected.name} · ${Math.max(1,Math.ceil(selected.size/1024))} KB`:'Select a PDF file · up to 15 MB'});
  document.getElementById('documentForm').addEventListener('submit',handleDocumentUpload);
});
