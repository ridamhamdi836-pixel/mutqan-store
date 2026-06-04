/**
 * Mutqan — Google Sheets Webhook (CLEAN v2)
 *
 * Sheet columns (row 1):
 * Order Date | country | name | phone | Order Number | address | url | sku | Product | quantity | price | currency
 *
 * SETUP:
 * 1. Set SHEET_ID below (from sheet URL)
 * 2. Save → Deploy → Manage deployments → Edit → Version: New version → Deploy
 *    (Saving code alone does NOT update the live /exec URL!)
 * 3. Test: open /exec URL in browser → sheet_id_set must be true
 * 4. EasyPanel frontend → GOOGLE_SHEETS_WEBHOOK_URL = that /exec URL
 */

// ⬇️ Sheet ID from: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
var SHEET_ID = "1F8Vh78CtbfWtKe-vrGjdSYseO_JSxJVOZLaclrKaqgY";

var PLACEHOLDER_SHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";

var HEADERS = [
  "Order Date",
  "country",
  "name",
  "phone",
  "Order Number",
  "address",
  "url",
  "sku",
  "Product",
  "quantity",
  "price",
  "currency",
];

var FIELD_BY_HEADER = {
  "Order Date": "date",
  country: "country",
  name: "name",
  phone: "phone",
  "Order Number": "orderid",
  "رقم الطلب": "orderid",
  orderid: "orderid",
  order_number: "orderid",
  address: "address",
  url: "url",
  sku: "sku",
  Product: "product",
  quantity: "quantity",
  price: "price",
  currency: "currency",
};

function isSheetConfigured() {
  return SHEET_ID && SHEET_ID !== PLACEHOLDER_SHEET_ID && SHEET_ID.length > 10;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ status: "error", message: "Empty request body" });
    }

    if (!isSheetConfigured()) {
      return jsonOut({ status: "error", message: "Set SHEET_ID in Apps Script" });
    }

    lock.waitLock(25000);
    locked = true;

    var data = JSON.parse(e.postData.contents);
    var orderId = String(data.orderid || data.order_number || "").trim();
    var isMerge = String(data.action || "").toLowerCase() === "merge";
    Logger.log("doPost orderid=" + orderId + " action=" + (data.action || "create"));

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    ensureHeaders(sheet);

    var row = buildRow(sheet, data);
    var targetRow = resolveRowForOrder(sheet, orderId, data, isMerge);

    if (targetRow > 0) {
      sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
      applyOrderNumberToRow(sheet, targetRow, orderId);
      formatQuantityCellAsText(sheet, targetRow);
      SpreadsheetApp.flush();
      return jsonOut({
        status: "success",
        action: "updated",
        orderid: orderId,
        row: targetRow,
      });
    }

    sheet.appendRow(row);
    var newRow = sheet.getLastRow();
    applyOrderNumberToRow(sheet, newRow, orderId);
    formatQuantityCellAsText(sheet, newRow);
    SpreadsheetApp.flush();

    return jsonOut({
      status: "success",
      action: "appended",
      orderid: orderId,
      row: newRow,
    });
  } catch (err) {
    Logger.log("doPost error: " + err);
    return jsonOut({ status: "error", message: String(err) });
  } finally {
    if (locked) {
      try {
        lock.releaseLock();
      } catch (releaseErr) {
        Logger.log("lock release: " + releaseErr);
      }
    }
  }
}

/** Find row to update: by order id, or (merge only) latest row for same phone within 45 min */
function resolveRowForOrder(sheet, orderid, data, isMerge) {
  if (orderid) {
    var byId = findRowByOrderId(sheet, orderid);
    if (byId > 0) return byId;
  }

  if (isMerge && data.phone) {
    var byPhone = findLatestRowByPhone(sheet, data.phone, 45);
    if (byPhone > 0) {
      if (orderid) {
        var ordCol = getOrderNumberColumn(sheet);
        if (ordCol > 0) {
          sheet.getRange(byPhone, ordCol).setValue(orderid);
        }
      }
      return byPhone;
    }
  }

  if (orderid && isDuplicate(sheet, orderid)) {
    return findRowByOrderId(sheet, orderid);
  }

  return -1;
}

function normalizePhoneDigits(phone) {
  var digits = String(phone || "").replace(/\D/g, "");
  if (digits.indexOf("966") === 0) return digits;
  if (digits.indexOf("0") === 0) return "966" + digits.slice(1);
  return digits ? "966" + digits : "";
}

function findLatestRowByPhone(sheet, phone, maxAgeMinutes) {
  var target = normalizePhoneDigits(phone);
  if (!target) return -1;

  var phoneCol = findColumnByHeader(sheet, "phone");
  if (phoneCol < 1) return -1;

  var dateCol = findColumnByHeader(sheet, "Order Date");
  if (dateCol < 0) dateCol = findColumnByHeader(sheet, "order date");

  var lastRow = sheet.getLastRow();
  var cutoff = new Date().getTime() - maxAgeMinutes * 60 * 1000;
  var bestRow = -1;
  var bestTime = 0;

  for (var r = lastRow; r >= 2; r--) {
    var cellPhone = normalizePhoneDigits(sheet.getRange(r, phoneCol).getValue());
    if (cellPhone !== target) continue;

    var rowTime = cutoff;
    if (dateCol > 0) {
      var dateVal = sheet.getRange(r, dateCol).getValue();
      if (dateVal instanceof Date) {
        rowTime = dateVal.getTime();
      }
    }

    if (rowTime >= cutoff && rowTime >= bestTime) {
      bestTime = rowTime;
      bestRow = r;
    }
  }

  return bestRow;
}

function doGet() {
  return jsonOut({
    status: "ok",
    message: "Mutqan Google Sheets webhook working",
    version: "order-number-visible-v5",
    sheet_id_set: isSheetConfigured(),
    sheet_id_preview: isSheetConfigured()
      ? SHEET_ID.slice(0, 6) + "..."
      : "not_set",
  });
}

function ensureHeaders(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var empty = !current[0] || String(current[0]).trim() === "";

  if (empty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    SpreadsheetApp.flush();
    return;
  }

  ensureOrderNumberHeader(sheet);
  formatOrderNumberHeaderAsText(sheet);
}

/** Add Order Number column on existing sheets that only have the old header row */
function ensureOrderNumberHeader(sheet) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i]).trim().toLowerCase();
    if (
      h === "order number" ||
      h === "orderid" ||
      h === "order_number" ||
      h === "رقم الطلب"
    ) {
      return;
    }
  }

  var phoneCol = -1;
  for (var j = 0; j < headers.length; j++) {
    if (String(headers[j]).trim().toLowerCase() === "phone") {
      phoneCol = j + 1;
      break;
    }
  }

  var insertAt = phoneCol > 0 ? phoneCol + 1 : 5;
  sheet.insertColumnAfter(insertAt - 1);
  sheet.getRange(1, insertAt).setValue("Order Number");
  sheet.getRange(1, insertAt).setFontWeight("bold");
  SpreadsheetApp.flush();
}

/** Prevent Sheets from auto-formatting quantity as a date (e.g. old 1/1/1 payloads) */
function formatQuantityCellAsText(sheet, rowNum) {
  var qtyCol = findColumnByHeader(sheet, "quantity");
  if (qtyCol > 0 && rowNum >= 2) {
    sheet.getRange(rowNum, qtyCol).setNumberFormat("@");
  }
}

/** Force order id into the Order Number column (mutqan-0001) on every write */
function applyOrderNumberToRow(sheet, rowNum, orderId) {
  if (!orderId || rowNum < 2) return;

  ensureOrderNumberHeader(sheet);
  var col = getOrderNumberColumn(sheet);
  if (col < 1) return;

  sheet.getRange(rowNum, col).setValue(String(orderId));
  sheet.getRange(rowNum, col).setNumberFormat("@");
}

function formatOrderNumberHeaderAsText(sheet) {
  var col = getOrderNumberColumn(sheet);
  if (col > 0) {
    sheet.getRange(1, col).setNumberFormat("@");
  }
}

function headerToField(header) {
  if (!header) return null;
  var key = String(header).trim();
  if (FIELD_BY_HEADER[key]) return FIELD_BY_HEADER[key];
  var lower = key.toLowerCase();
  var lowerMap = {
    "order date": "date",
    country: "country",
    name: "name",
    phone: "phone",
    "order number": "orderid",
    "رقم الطلب": "orderid",
    orderid: "orderid",
    order_number: "orderid",
    address: "address",
    url: "url",
    sku: "sku",
    product: "product",
    quantity: "quantity",
    price: "price",
    currency: "currency",
  };
  return lowerMap[lower] || null;
}

function findColumnByHeader(sheet, headerName) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var target = String(headerName).trim().toLowerCase();
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim().toLowerCase() === target) {
      return i + 1;
    }
  }
  return -1;
}

function getOrderNumberColumn(sheet) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i]).trim().toLowerCase();
    if (
      h === "order number" ||
      h === "orderid" ||
      h === "order_number" ||
      h === "رقم الطلب"
    ) {
      return i + 1;
    }
  }
  return -1;
}

function buildRow(sheet, data) {
  var orderId = String(data.orderid || data.order_number || "").trim();
  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = [];

  var fields = {
    date: data.date,
    country: data.country,
    name: data.name,
    phone: data.phone,
    orderid: orderId,
    address: data.address != null ? data.address : "",
    url: data.url,
    sku: data.sku,
    product: data.product,
    quantity: data.quantity,
    price: data.price,
    currency: data.currency,
  };

  for (var i = 0; i < headers.length; i++) {
    var field = headerToField(String(headers[i]).trim());
    if (!field) {
      row.push("");
      continue;
    }
    var value = fields[field];
    if (field === "orderid" && orderId) {
      row.push(orderId);
      continue;
    }
    if (value === undefined || value === null || value === "") {
      row.push("");
      continue;
    }
    row.push(value);
  }

  if (orderId) {
    var ordCol = getOrderNumberColumn(sheet);
    if (ordCol > 0) {
      while (row.length < ordCol) {
        row.push("");
      }
      row[ordCol - 1] = orderId;
    }
  }

  var sheetCols = Math.max(sheet.getLastColumn(), row.length);
  while (row.length < sheetCols) {
    row.push("");
  }

  return row;
}

function findRowByOrderId(sheet, orderid) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var orderCol = getOrderNumberColumn(sheet);
  if (orderCol > 0) {
    for (var r = lastRow; r >= 2; r--) {
      if (String(sheet.getRange(r, orderCol).getValue()).trim() === String(orderid)) {
        return r;
      }
    }
  }

  var lastCol = sheet.getLastColumn();
  for (var r2 = lastRow; r2 >= 2; r2--) {
    var values = sheet.getRange(r2, 1, 1, lastCol).getValues()[0];
    for (var c = 0; c < values.length; c++) {
      if (String(values[c]).trim() === String(orderid)) {
        return r2;
      }
    }
  }
  return -1;
}

function findLegacyOrderIdInRow(sheet, rowNum) {
  var lastCol = sheet.getLastColumn();
  var values = sheet.getRange(rowNum, 1, 1, lastCol).getValues()[0];
  for (var c = 0; c < values.length; c++) {
    var v = String(values[c]).trim();
    if (/^mutqan-\d+$/i.test(v)) {
      return v;
    }
  }
  return "";
}

function updateRowByOrderId(sheet, orderid, row) {
  var existing = findRowByOrderId(sheet, orderid);
  if (existing > 0) {
    sheet.getRange(existing, 1, 1, row.length).setValues([row]);
    return existing;
  }
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function isDuplicate(sheet, orderid) {
  return findRowByOrderId(sheet, orderid) > 0;
}

/** Run once in Apps Script editor to fill empty Order Number cells from mutqan-XXXX elsewhere in row */
function backfillOrderNumbersInSheet() {
  if (!isSheetConfigured()) {
    Logger.log("Set SHEET_ID first");
    return;
  }
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  ensureOrderNumberHeader(sheet);
  var orderCol = getOrderNumberColumn(sheet);
  if (orderCol < 1) return;

  var lastRow = sheet.getLastRow();
  var fixed = 0;
  for (var r = 2; r <= lastRow; r++) {
    var current = String(sheet.getRange(r, orderCol).getValue()).trim();
    if (current) continue;
    var legacy = findLegacyOrderIdInRow(sheet, r);
    if (legacy) {
      sheet.getRange(r, orderCol).setValue(legacy);
      applyOrderNumberToRow(sheet, r, legacy);
      fixed++;
    }
  }
  SpreadsheetApp.flush();
  Logger.log("backfillOrderNumbersInSheet fixed " + fixed + " rows");
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** Run: testLocally in Apps Script editor */
function testLocally() {
  var event = {
    postData: {
      contents: JSON.stringify({
        date: "01/05/2026",
        orderid: "mutqan-0003",
        order_number: "mutqan-0003",
        country: "KSA",
        name: "عميل تجريبي",
        phone: "96650475233",
        address: "",
        url: "https://mutqan.online/products/smart-table-warmer",
        sku: "MTQ-WRM-006",
        product: "منتج تجريبي",
        quantity: "سخّان المائدة الذكي 1",
        price: 249,
        currency: "SAR",
      }),
    },
  };
  Logger.log(doPost(event).getContent());
}
