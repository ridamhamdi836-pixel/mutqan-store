/**
 * Mutqan → Google Sheets Webhook
 * Sheet: "Mutqan Orders" — https://docs.google.com/spreadsheets/d/1eZgzPu1SSONTh7JbE8Dhduv-AsNJobb9k87IHJhYC0c
 *
 * SETUP:
 * 1. Go to https://script.google.com and open this project
 * 2. Save (Ctrl+S)
 * 3. Deploy → Manage deployments → Edit active deployment (pencil icon)
 *    OR Deploy → New deployment
 * 4. Type: Web app
 * 5. Execute as: Me
 * 6. Who has access: Anyone
 * 7. Deploy → copy /exec URL
 * 8. Paste URL as GOOGLE_SHEETS_WEBHOOK_URL in EasyPanel backend environment
 *
 * COLUMNS in Sheet row 1 (must match exactly):
 * Order Date | Order ID | country | name | phone | address | url | sku | Product | Quantity | Price | Currency | Status | Note
 */

var SHEET_ID = "1eZgzPu1SSONTh7JbE8Dhduv-AsNJobb9k87IHJhYC0c";

// These are the columns we will write — order matters, must match sheet header row
var COLUMN_MAP = [
  { header: "Order Date",  field: "date"        },
  { header: "Order ID",    field: "orderid"     },
  { header: "country",     field: "country"     },
  { header: "name",        field: "name"        },
  { header: "phone",       field: "phone"       },
  { header: "address",     field: "address"     },  // optional, may be empty
  { header: "url",         field: "url"         },  // optional, may be empty
  { header: "sku",         field: "sku"         },
  { header: "Product",     field: "product"     },
  { header: "Quantity",    field: "quantity"    },
  { header: "Price",       field: "total_price" },
  { header: "Currency",    field: "currency"    },
  { header: "Status",      field: "status"      },
  { header: "Note",        field: "note"        },
];

function doPost(e) {
  try {
    // Parse body — works with both application/json and text/plain
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(raw);

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];

    // Auto-create headers if row 1 is empty
    ensureHeaders(sheet);

    // Duplicate check using orderid in column B
    if (data.orderid && isDuplicate(sheet, data.orderid)) {
      return jsonResponse({ status: "duplicate", orderid: data.orderid });
    }

    // Build row from COLUMN_MAP
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = [];

    for (var c = 0; c < headers.length; c++) {
      var header = headers[c] ? headers[c].toString().trim() : "";
      var found = false;
      for (var m = 0; m < COLUMN_MAP.length; m++) {
        if (COLUMN_MAP[m].header === header) {
          var val = data[COLUMN_MAP[m].field];
          row.push(val !== undefined && val !== null ? val : "");
          found = true;
          break;
        }
      }
      if (!found) row.push("");
    }

    sheet.appendRow(row);

    return jsonResponse({
      status: "success",
      orderid: data.orderid || "",
      row: sheet.getLastRow()
    });

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function doGet(e) {
  return jsonResponse({ status: "ok", message: "Mutqan webhook is active" });
}

function ensureHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  var isEmpty = lastCol === 0;

  if (!isEmpty) {
    var firstCell = sheet.getRange(1, 1).getValue();
    isEmpty = !firstCell || firstCell.toString().trim() === "";
  }

  if (isEmpty) {
    var headers = COLUMN_MAP.map(function(m) { return m.header; });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#CC0000")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold");
    SpreadsheetApp.flush();
  }
}

function isDuplicate(sheet, orderid) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  var checkRows = Math.min(500, lastRow - 1);
  var startRow = Math.max(2, lastRow - checkRows + 1);

  // Order ID is in column B (index 2)
  var orderIdCol = 2;
  var range = sheet.getRange(startRow, orderIdCol, checkRows, 1).getValues();

  for (var i = range.length - 1; i >= 0; i--) {
    if (range[i][0] && range[i][0].toString() === orderid) {
      return true;
    }
  }
  return false;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this manually in Apps Script editor to test without HTTP
function testLocally() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        date: "24/05/2026",
        orderid: "MQ-TEST-" + Math.floor(Math.random() * 9999),
        country: "KSA",
        name: "سارة محمد",
        phone: "966501234567",
        product: "سخّان المائدة الذكي",
        sku: "MTQ-WRM-006",
        quantity: "1",
        total_price: 249,
        currency: "SAR",
        status: "",
        note: "local test"
      })
    }
  };

  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
