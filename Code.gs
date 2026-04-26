// ============================================================
// Heritage — Family Tree App
// Google Apps Script Backend (Code.gs)
// ============================================================

const SHEET_NAME = "Data Silsilah";
const DRIVE_FOLDER_NAME = "Foto_Silsilah_Keluarga";

/**
 * HTTP GET HANDLER — Serves the HTML page
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Heritage — Family Tree')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * ADMIN MENU — Added to Spreadsheet UI
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Heritage Admin')
    .addItem('⚡ Reset & Load Sample Data (10 Generations)', 'initializeSheets')
    .addToUi();
}

/**
 * HELPER — Get or create Google Drive folder
 */
function getDriveFolder() {
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

/**
 * UPLOAD PHOTO — Converts base64 to Drive file, returns public URL
 */
function uploadPhoto(data) {
  try {
    const folder = getDriveFolder();
    const contentType = data.substring(5, data.indexOf(';'));
    const bytes = Utilities.base64Decode(data.substring(data.indexOf(',') + 1));
    const blob = Utilities.newBlob(bytes, contentType, "foto_" + Utilities.getUuid());
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return "https://drive.google.com/uc?export=view&id=" + file.getId();
  } catch (e) {
    throw new Error("Photo upload failed: " + e.toString());
  }
}

/**
 * INITIALIZE SHEETS — Creates sheet and fills with 10-generation sample data
 * WARNING: Deletes existing 'Data Silsilah' sheet data.
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet(SHEET_NAME);

  const headers = [
    "ID", "Timestamp", "Generasi", "Parent ID", "Nama",
    "Status", "Pasangan", "Gender", "Anak", "Foto URL",
    "Alamat", "No HP", "Tgl Meninggal"
  ];

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#0d1117");
  headerRange.setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  const timestamp = new Date();
  const dummyData = [];

  function makeTglMeninggal(gen) {
    const baseYear = 1920 + (gen - 1) * 25;
    const year  = baseYear + Math.floor(Math.random() * 10);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day   = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const rootId = Utilities.getUuid();
  dummyData.push([
    rootId, timestamp, "Generasi 1", "ROOT", "Great Ancestor (Gen 1)",
    "Almarhum", "Spouse of Ancestor", "L", "-", "", "", "", makeTglMeninggal(1)
  ]);

  let currentParentId = rootId;
  for (let gen = 2; gen <= 10; gen++) {
    const genString = `Generasi ${gen}`;
    const status = gen < 8 ? "Almarhum" : "Hidup";
    const tglMeninggal = status === "Almarhum" ? makeTglMeninggal(gen) : "";
    const heirId = Utilities.getUuid();
    const heirGender = gen % 2 === 0 ? "L" : "P";
    const pasangan = status === "Hidup" ? `Spouse Gen ${gen}` : "-";

    dummyData.push([
      heirId, timestamp, genString, currentParentId,
      `Primary Heir Gen ${gen}`, status, pasangan, heirGender,
      "-", "", "", "", tglMeninggal
    ]);

    for (let i = 1; i <= 2; i++) {
      const sibId = Utilities.getUuid();
      const sibGender = i === 1 ? "P" : "L";
      dummyData.push([
        sibId, timestamp, genString, currentParentId,
        `Sibling Gen ${gen}.${i}`, status, "-", sibGender,
        "-", "", "", "", tglMeninggal
      ]);
    }

    currentParentId = heirId;
  }

  if (dummyData.length > 0) {
    sheet.getRange(2, 1, dummyData.length, headers.length).setValues(dummyData);
  }
  sheet.autoResizeColumns(1, headers.length);

  SpreadsheetApp.getUi().alert(
    "✅ Success!",
    "Sheet reset with 10 generations of sample data.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * HELPER — Ensure sheet exists
 */
function checkSpreadsheetAccess() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) initializeSheets();
  return true;
}

/**
 * DASHBOARD STATS
 */
function getDashboardStats() {
  checkSpreadsheetAccess();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return { generation:0, parents:0, members:0, children:0 };

  const rows = data.slice(1);
  const generations = new Set(rows.map(r => r[2]).filter(String));
  const parents = new Set(rows.map(r => r[3]).filter(p => p && p !== "ROOT"));
  const members = rows.length;

  let totalChildren = 0;
  rows.forEach(r => {
    const cell = r[8];
    if (cell && cell !== "-") totalChildren += cell.toString().split(",").length;
  });

  return { generation: generations.size, parents: parents.size, members, children: totalChildren };
}

/**
 * FORM HELPERS
 */
function getGenerasiList() {
  const list = [];
  for (let i = 1; i <= 10; i++) list.push(`Generasi ${i}`);
  return list;
}

function getParentsList(selectedGen) {
  checkSpreadsheetAccess();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];
  const currentGenNum = parseInt(selectedGen.replace(/\D/g, ''));
  if (currentGenNum === 1) return [{ id:"ROOT", name:"— (Root Ancestor)" }];

  const targetGenString = `Generasi ${currentGenNum - 1}`;
  const parents = data.slice(1)
    .filter(row => row[2] === targetGenString)
    .map(row => ({ id: row[0], name: row[4] }));

  return parents.length > 0 ? parents : [{ id:"", name:"No parent data available" }];
}

/**
 * PROCESS FORM — Create or Update a member record
 */
function processForm(formData, token) {
  try {
    const session = validateSession(token);
    if (!session) return { success:false, message:'Session invalid. Please sign in again.' };

    const isEditMode = formData.id && formData.id.length > 0;
    if (session.role === 'user') {
      if (!isEditMode) return { success:false, message:'Access denied. Members cannot add new records.' };
      if (formData.generasi !== session.generasi) {
        return { success:false, message:`Access denied. You may only edit ${session.generasi} records.` };
      }
    }

    checkSpreadsheetAccess();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    let anakString = "-";
    if (formData.anak && Array.isArray(formData.anak) && formData.anak.length > 0) {
      anakString = formData.anak.map(a => a.nama).join(", ");
    }

    let finalPhotoUrl = formData.oldPhotoUrl || "";
    if (formData.newPhotoData && formData.newPhotoData.startsWith("data:")) {
      finalPhotoUrl = uploadPhoto(formData.newPhotoData);
    }

    const finalId = isEditMode ? formData.id : Utilities.getUuid();

    const rowData = [
      finalId,
      new Date(),
      formData.generasi,
      formData.parentId,
      formData.nama,
      formData.status,
      formData.pasangan || "-",
      formData.gender,
      anakString,
      finalPhotoUrl,
      formData.alamat || "",
      formData.noHp ? "'" + formData.noHp : "",
      formData.tglMeninggal || ""
    ];

    if (isEditMode) {
      let found = false;
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == finalId) {
          sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
          found = true; break;
        }
      }
      if (!found) return { success:false, message:"Error: Record ID not found." };
      return { success:true, message:"Record updated successfully!" };
    } else {
      sheet.appendRow(rowData);
      if (formData.anak && Array.isArray(formData.anak) && formData.anak.length > 0) {
        const childGenNum = parseInt(formData.generasi.replace(/\D/g, '')) + 1;
        const childGenString = "Generasi " + childGenNum;
        formData.anak.forEach(anakData => {
          if (anakData.nama && anakData.nama.trim()) {
            sheet.appendRow([
              Utilities.getUuid(), new Date(), childGenString, finalId,
              anakData.nama.trim(), "Hidup", "-", "", "-", "", "", "", ""
            ]);
          }
        });
      }
      return { success:true, message:"Record saved successfully!" };
    }
  } catch (e) {
    return { success:false, message:"Error: " + e.toString() };
  }
}

/**
 * HELPER — Format date value from sheet to yyyy-MM-dd string
 */
function formatTglMeninggal(val) {
  if (!val || val === "") return "";
  try {
    const d = (val instanceof Date) ? val : new Date(val);
    if (isNaN(d.getTime())) return "";
    return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
  } catch(e) { return ""; }
}

/**
 * GET MEMBER BY ID
 */
function getMemberById(id) {
  checkSpreadsheetAccess();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const r = data[i];
      return {
        id: r[0], generasi: r[2], parentId: r[3], nama: r[4],
        status: r[5], pasangan: r[6], gender: r[7], anak: r[8],
        foto: r[9], alamat: r[10]||"", noHp: r[11]||"",
        tglMeninggal: formatTglMeninggal(r[12])
      };
    }
  }
  return null;
}

/**
 * DELETE MEMBER
 */
function deleteMember(id, token) {
  try {
    const session = validateSession(token);
    if (!session) return { success:false, message:"Session invalid. Please sign in again." };

    checkSpreadsheetAccess();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        if (session.role === 'user' && data[i][2] !== session.generasi) {
          return { success:false, message:`Access denied. You may only delete ${session.generasi} records.` };
        }
        sheet.deleteRow(i + 1);
        return { success:true, message:"Record deleted." };
      }
    }
    return { success:false, message:"Record not found." };
  } catch (e) {
    return { success:false, message:"Error: " + e.toString() };
  }
}

/**
 * FAMILY TREE DATA — For D3 visualisation
 */
function getFamilyTreeData() {
  checkSpreadsheetAccess();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return null;

  const rows = data.slice(1);
  const nodes = [];
  const nodeMap = {};

  rows.forEach(r => {
    const node = {
      id: r[0], name: r[4], generation: r[2], parentId: r[3],
      status: r[5], pasangan: r[6], gender: r[7], foto: r[9],
      alamat: r[10]||"", noHp: r[11]||"",
      tglMeninggal: formatTglMeninggal(r[12]),
      children: []
    };
    nodes.push(node);
    if (node.id) nodeMap[node.id] = node;
  });

  const rootNodes = [];
  nodes.forEach(node => {
    if (node.parentId === "ROOT" || !node.parentId || !nodeMap[node.parentId]) {
      rootNodes.push(node);
    } else {
      const parent = nodeMap[node.parentId];
      if (parent) parent.children.push(node);
    }
  });

  if (rootNodes.length === 0) return null;
  if (rootNodes.length === 1) return rootNodes[0];

  return { name:"Family", status:"Root", gender:"L", pasangan:"", generation:"", children: rootNodes };
}

/**
 * SEARCH INDEX — Lightweight data for client-side search
 */
function getSearchIndex() {
  checkSpreadsheetAccess();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  return data.slice(1).map(row => ({
    id: row[0], name: row[4], gen: row[2],
    foto: row[9] ? row[9] : null
  }));
}

/**
 * PASSWORD & SESSION — Single shared password for all roles
 */
function checkPassword(inputPassword, role, generasi) {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('APP_PASSWORD')) props.setProperty('APP_PASSWORD', 'keluarga123');
  const savedPassword = props.getProperty('APP_PASSWORD');

  if (inputPassword !== savedPassword) return { valid:false };

  if (role === 'admin') {
    const token = Utilities.getUuid();
    CacheService.getScriptCache().put('SESSION_'+token, JSON.stringify({ role:'admin', generasi:'' }), 1800);
    return { valid:true, token, role:'admin', generasi:'' };
  } else {
    if (!generasi) return { valid:false };
    const token = Utilities.getUuid();
    CacheService.getScriptCache().put('SESSION_'+token, JSON.stringify({ role:'user', generasi }), 1800);
    return { valid:true, token, role:'user', generasi };
  }
}

function validateSession(token) {
  if (!token) return null;
  const cache = CacheService.getScriptCache();
  const val = cache.get('SESSION_'+token);
  if (val) { cache.put('SESSION_'+token, val, 1800); return JSON.parse(val); }
  return null;
}

function logout(token) {
  if (token) CacheService.getScriptCache().remove('SESSION_'+token);
  return true;
}

function changePassword(token, oldPassword, newPassword) {
  const session = validateSession(token);
  if (!session || session.role !== 'admin') {
    return { success:false, message:'Access denied. Only administrators can change the password.' };
  }
  const props = PropertiesService.getScriptProperties();
  const saved = props.getProperty('APP_PASSWORD') || 'keluarga123';
  if (oldPassword !== saved) return { success:false, message:'Current password is incorrect.' };
  if (!newPassword || newPassword.length < 6) return { success:false, message:'New password must be at least 6 characters.' };
  props.setProperty('APP_PASSWORD', newPassword);
  return { success:true, message:'Password updated successfully. Applies to all users.' };
}

function resetPassword() {
  PropertiesService.getScriptProperties().setProperty('APP_PASSWORD', 'keluarga123');
  Logger.log('Password reset to: keluarga123');
}
