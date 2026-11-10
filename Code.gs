/**
 * HOOM SISWA OPERATOR - Google Apps Script receiver
 * 1) Buat Google Spreadsheet, buka Extensions > Apps Script.
 * 2) Tempel kode ini, simpan.
 * 3) Deploy > New deployment > Web app.
 *    Execute as: Me | Who has access: Anyone (atau sesuai kebijakan organisasi).
 * 4) Salin URL /exec ke Pengaturan PWA.
 */
const SHEET_NAME = "HOOM_DATA";
const HEADERS = ["ID","HARI","TANGGAL","LOKASI","NAMA","MODEL UNIT","CODE UNIT","HOOM / DAY (MENIT)","KETERANGAN","WAKTU INPUT"];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const r = payload.record;
    if (!r || !r.id) throw new Error("Record atau ID tidak ditemukan");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEADERS); sh.setFrozenRows(1); }
    const last = sh.getLastRow();
    if (last >= 2) {
      const ids = sh.getRange(2,1,last-1,1).getValues().flat();
      if (ids.includes(r.id)) return output({ok:true,duplicate:true,id:r.id});
    }
    sh.appendRow([r.id,r.hari,r.tanggal,r.lokasi,r.nama,r.model,r.code,r.hoom,r.keterangan,r.createdAt]);
    return output({ok:true,id:r.id});
  } catch(err) {
    return output({ok:false,error:String(err)});
  }
}
function doGet() {
  return output({ok:true,message:"HOOM SISWA OPERATOR endpoint aktif"});
}
function output(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
