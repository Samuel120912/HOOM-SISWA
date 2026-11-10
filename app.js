const $=id=>document.getElementById(id);
const STORAGE_KEY="hoom_siswa_operator_records_v1";
const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbwB0nAtOBuR_J3C6m3bJQY-Lex4GmgoUktbABEr1qcHqmO_Fnxb_hxNRYYIA4HbRWYX/exec";
let records=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");
const days=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
function dayName(v){if(!v)return "";const d=new Date(v+"T00:00:00");return days[d.getDay()]}
function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")}
$("tanggal").value=today();$("hari").value=dayName(today());$("tanggal").addEventListener("change",e=>$("hari").value=dayName(e.target.value));
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(records));render()}
function render(){
 $("count").textContent=records.length+" record";$("queueStatus").textContent=records.length+" data tersimpan di perangkat";
 const host=$("records");host.innerHTML="";
 if(!records.length){host.innerHTML='<div class="empty">Belum ada data. Isi form untuk mulai mencatat.</div>';return}
 [...records].reverse().forEach(r=>{
  const el=document.createElement("div");el.className="item";
  const left=document.createElement("div");const strong=document.createElement("strong");strong.textContent=r.nama+" · "+r.code;
  const sub=document.createElement("div");sub.className="muted";sub.textContent=`${r.hari}, ${r.tanggal} · ${r.lokasi} · ${r.model} · ${r.hoom} menit`;
  const status=document.createElement("div");status.className="muted";status.textContent=r.syncStatus==="synced"?"Terkirim ke spreadsheet":r.syncStatus==="sent"?"Terkirim, menunggu verifikasi":"Belum disinkronkan";
  left.append(strong,sub,status);const del=document.createElement("button");del.className="danger";del.textContent="Hapus";del.type="button";del.addEventListener("click",()=>{if(confirm("Hapus data ini dari perangkat?")){records=records.filter(x=>x.id!==r.id);save()}});el.append(left,del);host.append(el);
 });
}
$("entryForm").addEventListener("submit",e=>{
 e.preventDefault();const r={id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+"-"+Math.random().toString(16).slice(2),hari:$("hari").value,tanggal:$("tanggal").value,lokasi:$("lokasi").value,nama:$("nama").value,model:$("model").value.trim(),code:$("code").value.trim(),hoom:Number($("hoom").value),keterangan:$("keterangan").value.trim(),createdAt:new Date().toISOString(),syncStatus:"pending"};
 records.push(r);save();$("entryForm").reset();$("tanggal").value=today();$("hari").value=dayName(today());alert("Data tersimpan di perangkat.");if(navigator.onLine)sync();window.scrollTo({top:0,behavior:"smooth"});
});
$("resetBtn").addEventListener("click",()=>$("entryForm").reset());
function csvCell(v){return '"'+String(v??"").replace(/"/g,'""')+'"'}
$("csvBtn").addEventListener("click",()=>{
 const headers=["ID","HARI","TANGGAL","LOKASI","NAMA","MODEL UNIT","CODE UNIT","HOOM / DAY (MENIT)","KETERANGAN","WAKTU INPUT"];
 const rows=records.map(r=>[r.id,r.hari,r.tanggal,r.lokasi,r.nama,r.model,r.code,r.hoom,r.keterangan,r.createdAt]);
 const csv="\uFEFF"+[headers,...rows].map(row=>row.map(csvCell).join(",")).join("\r\n");
 download(new Blob([csv],{type:"text/csv;charset=utf-8"}),"HOOM_SISWA_OPERATOR.csv");
});
function download(blob,name){const a=document.createElement("a");const u=URL.createObjectURL(blob);a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
$("pdfBtn").addEventListener("click",()=>window.print());
$("syncBtn").addEventListener("click",sync);
async function sync(){
 const endpoint=APPS_SCRIPT_URL;
 const pending=records.filter(r=>r.syncStatus==="pending"||r.syncStatus==="sent");if(!pending.length){alert("Tidak ada data yang perlu disinkronkan.");return}
 if(!navigator.onLine){alert("Perangkat sedang offline. Data tetap aman di perangkat dan dapat disinkronkan saat online.");return}
 $("syncBtn").disabled=true;$("syncBtn").textContent="Mengirim...";
 try{
  // Apps Script web apps commonly do not expose readable CORS responses.
  // no-cors sends the payload; IDs let the receiving script deduplicate retries.
  for(const r of pending){
   await fetch(endpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"upsert",record:r})});
   r.syncStatus="sent";
  }
  save();alert("Permintaan sinkronisasi sudah dikirim. Karena pembatasan respons lintas-domain Google Apps Script, status ditandai 'menunggu verifikasi'. Periksa tab HOOM_DATA di Spreadsheet sebelum menghapus data lokal.");
 }catch(err){console.error(err);alert("Sinkronisasi gagal. Data tetap tersimpan di perangkat. Periksa koneksi dan URL Apps Script.");}
 finally{$("syncBtn").disabled=false;$("syncBtn").textContent="Sinkronkan ke Spreadsheet"}
}
function net(){const online=navigator.onLine;$("network").innerHTML=online?'<span class="dot"></span>Online':'<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#d97706;margin-right:5px"></span>Offline';}
window.addEventListener("online",()=>{net();sync()});window.addEventListener("offline",net);net();render();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));
