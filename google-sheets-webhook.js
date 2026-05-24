/**
 * Mutqan — Google Sheets Webhook (CLEAN v1)
 *
 * Sheet columns (row 1 must match):
 * Order Date | country | name | phone | address | url | sku | Product | quantity | price | currency
 *
 * SETUP:
 * 1. Create/open your Google Sheet
 * 2. Put the headers above in row 1 (exact spelling)
 * 3. Copy Sheet ID from URL:
 *    https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
 * 4. Paste SHEET_ID below
 * 5. script.google.com → New project → paste this file → Save
 * 6. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy URL ending in /exec
 * 8. EasyPanel → frontend → GOOGLE_SHEETS_WEBHOOK_URL = that URL
 */

// ⬇️ REPLACE with your new sheet ID
var SHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";

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
  url: "url",
  sku: "sku",
  Product: "product",
  quantity: "quantity",
  price: "price",
  currency: "currency",
};

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ status: "error", message: "Empty request body" });
    }

    var data = JSON.parse(e.postData.contents);
    Logger.log("doPost orderid=" + (data.orderid || ""));

    if (SHEET_ID === "PASTE_YOUR_SHEET_ID_HERE") {
      return jsonOut({ status: "error", message: "Set SHEET_ID in Apps Script" });
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];

    ensureHeaders(sheet);

    var row = buildRow(sheet, data);

    if (data.orderid && isDuplicate(sheet, data.orderid)) {
      var updated = updateRowByOrderId(sheet, data.orderid, row);
      Logger.log("Row updated: " + data.orderid + " row=" + updated);
      return jsonOut({
        status: "success",
        action: "updated",
        orderid: data.orderid,
        row: updated,
      });
    }

    sheet.appendRow(row);
    Logger.log("Row appended: " + data.orderid);

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
    message: "Mutqan Google Sheets webhook v1",
    sheet_id_set: SHEET_ID !== "PASTE_YOUR_SHEET_ID_HERE",
  });
}

function ensureHeaders(sheet) {
  var colCount = Math.max(sheet.getLastColumn(), HEADERS.length);
  var firstRow = sheet.getRange(1, 1, 1, colCount).getValues()[0];
  var empty = !firstRow[0] || String(firstRow[0]).trim() === "";

  if (empty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    SpreadsheetApp.flush();
  }
}

function buildRow(sheet, data) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = [];

  for (var c = 0; c < headers.length; c++) {
    var h = headers[c] ? String(headers[c]).trim() : "";
    var field = FIELD_BY_HEADER[h];
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
  if (lastRow < 2) return 0;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var addressCol = -1;
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim() === "address") {
      addressCol = i + 1;
      break;
    }
  }
  if (addressCol < 1) return 0;

  for (var r = lastRow; r >= 2; r--) {
    var cell = sheet.getRange(r, addressCol).getValue();
    if (cell && String(cell) === String(orderid)) {
      sheet.getRange(r, 1, 1, row.length).setValues([row]);
      return r;
    }
  }
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function isDuplicate(sheet, orderid) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var addressCol = -1;
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim() === "address") {
      addressCol = i + 1;
      break;
    }
  }
  if (addressCol < 1) return false;

  var start = Math.max(2, lastRow - 299);
  var numRows = lastRow - start + 1;
  var values = sheet.getRange(start, addressCol, numRows, 1).getValues();

  for (var j = 0; j < values.length; j++) {
    if (values[j][0] && String(values[j][0]) === String(orderid)) {
      return true;
    }
  }
  return false;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** Run manually in editor: Run → testLocally */
function testLocally() {
  var event = {
    postData: {
      contents: JSON.stringify({
        date: "01/05/2026",
        orderid: "mutqan-TESTLOCAL",
        country: "KSA",
        name: "اختبار محلي",
        phone: "96650475233",
        address: "mutqan-TESTLOCAL",
        url: "https://mutqan.online/products/smart-table-warmer",
        sku: "MTQ-WRM-006",
        product: "سخّان المائدة الذكي",
        quantity: "1",
        price: 249,
        currency: "SAR",
      }),
    },
  };
  Logger.log(doPost(event).getContent());
}
