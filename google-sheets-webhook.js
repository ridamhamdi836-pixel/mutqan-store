/**
 * Mutqan — Google Sheets Webhook (CLEAN v1)
 *
 * Sheet columns (row 1):
 * Order Date | country | name | phone | address | url | sku | Product | quantity | price | currency
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
  address: "address",
  "Order Number": "orderid",
  orderid: "orderid",
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
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ status: "error", message: "Empty request body" });
    }

    if (!isSheetConfigured()) {
      return jsonOut({ status: "error", message: "Set SHEET_ID in Apps Script" });
    }

    var data = JSON.parse(e.postData.contents);
    Logger.log("doPost orderid=" + (data.orderid || ""));

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    ensureHeaders(sheet);

    var row = buildRow(sheet, data);

    if (data.orderid && isDuplicate(sheet, data.orderid)) {
      var updatedRow = updateRowByOrderId(sheet, data.orderid, row);
      formatQuantityCellAsText(sheet, updatedRow);
    formatOrderNumberCellAsText(sheet, updatedRow);
      return jsonOut({
        status: "success",
        action: "updated",
        orderid: data.orderid,
        row: updatedRow,
      });
    }

    sheet.appendRow(row);
    formatQuantityCellAsText(sheet, sheet.getLastRow());
    formatOrderNumberCellAsText(sheet, sheet.getLastRow());
    SpreadsheetApp.flush();

    return jsonOut({
      status: "success",
      action: "appended",
      orderid: data.orderid || "",
      row: sheet.getLastRow(),
    });
  } catch (err) {
    Logger.log("doPost error: " + err);
    return jsonOut({ status: "error", message: String(err) });
  }
}

function doGet() {
  return jsonOut({
    status: "ok",
    message: "Mutqan Google Sheets webhook working",
    sheet_id_set: isSheetConfigured(),
    sheet_id_preview: isSheetConfigured()
      ? SHEET_ID.slice(0, 6) + "..."
      : "not_set",
  });
}

function ensureHeaders(sheet) {
  var current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var empty = !current[0] || String(current[0]).trim() === "";

  if (empty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    SpreadsheetApp.flush();
  }
}

/** Prevent Sheets from auto-formatting quantity as a date (e.g. old 1/1/1 payloads) */
function formatQuantityCellAsText(sheet, rowNum) {
  var qtyCol = HEADERS.indexOf("quantity") + 1;
  if (qtyCol > 0 && rowNum >= 2) {
    sheet.getRange(rowNum, qtyCol).setNumberFormat("@");
  }
}

/** Keep mutqan-0001 readable (not parsed as date) */
function formatOrderNumberCellAsText(sheet, rowNum) {
  var col = getOrderIdColumn(sheet);
  if (col > 0 && rowNum >= 2) {
    sheet.getRange(rowNum, col).setNumberFormat("@");
  }
}

function buildRow(sheet, data) {
  var headers = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var row = [];

  for (var i = 0; i < headers.length; i++) {
    var header = String(headers[i]).trim();
    var field = FIELD_BY_HEADER[header];
    if (field && data[field] !== undefined && data[field] !== null) {
      row.push(data[field]);
    } else {
      row.push("");
    }
  }

  return row;
}

function updateRowByOrderId(sheet, orderid, row) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    sheet.appendRow(row);
    return sheet.getLastRow();
  }

  var orderCol = getOrderIdColumn(sheet);
  if (orderCol < 1) {
    sheet.appendRow(row);
    return sheet.getLastRow();
  }

  for (var r = lastRow; r >= 2; r--) {
    var cell = sheet.getRange(r, orderCol).getValue();
    if (cell && String(cell) === String(orderid)) {
      sheet.getRange(r, 1, r, row.length).setValues([row]);
      return r;
    }
  }

  sheet.appendRow(row);
  return sheet.getLastRow();
}

function isDuplicate(sheet, orderid) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var orderCol = getOrderIdColumn(sheet);
  if (orderCol < 1) return false;

  var start = Math.max(2, lastRow - 299);
  var numRows = lastRow - start + 1;
  var values = sheet.getRange(start, orderCol, numRows, 1).getValues();

  for (var j = 0; j < values.length; j++) {
    if (values[j][0] && String(values[j][0]) === String(orderid)) {
      return true;
    }
  }
  return false;
}

function getOrderIdColumn(sheet) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i]).trim();
    if (h === "Order Number" || h === "orderid" || h === "address") {
      return i + 1;
    }
  }
  return -1;
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
        orderid: "mutqan-TEST1234",
        country: "KSA",
        name: "عميل تجريبي",
        phone: "96650475233",
        address: "mutqan-TEST1234",
        url: "https://mutqan.online/products/smart-table-warmer",
        sku: "MTQ-WRM-006",
        product: "منتج تجريبي",
        quantity: "1",
        price: 249,
        currency: "SAR",
      }),
    },
  };
  Logger.log(doPost(event).getContent());
}
