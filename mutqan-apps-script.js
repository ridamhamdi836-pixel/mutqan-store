/**
 * Mutqan → Google Sheets Webhook (FINAL)
 * Sheet: https://docs.google.com/spreadsheets/d/1eZgzPu1SSONTh7JbE8Dhduv-AsNJobb9k87IHJhYC0c
 *
 * DEPLOY:
 * 1. script.google.com → paste this file → Save
 * 2. Deploy → New deployment → Web app
 * 3. Execute as: Me | Who has access: Anyone
 * 4. Copy URL ending in /exec
 * 5. Set GOOGLE_SHEETS_WEBHOOK_URL in EasyPanel (backend AND frontend)
 */

var SHEET_ID = "1eZgzPu1SSONTh7JbE8Dhduv-AsNJobb9k87IHJhYC0c";

// Maps sheet header (row 1) → JSON field from backend/frontend
var HEADER_TO_FIELD = {
  "Order Date": "date",
  "order date": "date",
  "Order ID": "orderid",
  "order id": "orderid",
  "country": "country",
  "name": "name",
  "phone": "phone",
  "address": "address",
  "url": "url",
  "sku": "sku",
  "Product": "product",
  "product": "product",
  "Quantity": "quantity",
  "quantity": "quantity",
  "Price": "total_price",
  "price": "total_price",
  "Currency": "currency",
  "currency": "currency",
  "Status": "status",
  "status": "status",
  "Note": "note",
  "note": "note",
};

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "empty body" });
    }

    var data = JSON.parse(e.postData.contents);

    // If address empty, put order id there (sheet may not have Order ID column)
    if ((!data.address || data.address === "") && data.orderid) {
      data.address = data.orderid;
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];

    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // If first row empty, write default headers matching your sheet
    if (!headers[0] || headers[0].toString().trim() === "") {
      headers = ["Order Date", "country", "name", "phone", "address", "url", "sku", "Product"];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      SpreadsheetApp.flush();
    }

    if (data.orderid && isDuplicate(sheet, data.orderid, headers)) {
      return jsonResponse({ status: "duplicate", orderid: data.orderid });
    }

    var row = [];
    for (var c = 0; c < headers.length; c++) {
      var h = headers[c] ? headers[c].toString().trim() : "";
      var field = HEADER_TO_FIELD[h];
      if (field && data[field] !== undefined && data[field] !== null) {
        row.push(data[field]);
      } else {
        row.push("");
      }
    }

    sheet.appendRow(row);

    return jsonResponse({
      status: "success",
      orderid: data.orderid || "",
      row: sheet.getLastRow(),
    });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function doGet() {
  return jsonResponse({
    status: "ok",
    message: "Mutqan webhook active",
    sheet_id: SHEET_ID,
  });
}

function isDuplicate(sheet, orderid, headers) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  // Find Order ID or address column
  var colIndex = -1;
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i] ? headers[i].toString().trim() : "";
    if (h === "Order ID" || h === "address") {
      colIndex = i + 1;
      break;
    }
  }
  if (colIndex < 0) return false;

  var checkRows = Math.min(300, lastRow - 1);
  var startRow = Math.max(2, lastRow - checkRows + 1);
  var values = sheet.getRange(startRow, colIndex, checkRows, 1).getValues();

  for (var j = values.length - 1; j >= 0; j--) {
    if (values[j][0] && values[j][0].toString() === orderid) {
      return true;
    }
  }
  return false;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function testLocally() {
  var r = doPost({
    postData: {
      contents: JSON.stringify({
        date: "24/05/2026",
        orderid: "LOCAL-TEST-" + new Date().getTime(),
        country: "KSA",
        name: "اختبار محلي",
        phone: "966501234567",
        address: "LOCAL-TEST",
        url: "",
        product: "منتج تجريبي",
        sku: "MTQ-TEST",
        quantity: "1",
        total_price: 99,
        currency: "SAR",
        status: "",
        note: "testLocally",
      }),
    },
  });
  Logger.log(r.getContent());
}
