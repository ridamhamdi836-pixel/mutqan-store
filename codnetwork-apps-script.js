/**
 * Mutqan → CodNetwork Google Sheet Webhook
 *
 * SETUP:
 * 1. Go to https://script.google.com/home
 * 2. Click "New project"
 * 3. Delete any existing code and paste this entire file
 * 4. Click Save (Ctrl+S)
 * 5. Click Deploy → New deployment
 * 6. Click the gear icon (⚙️) → select "Web app"
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click Deploy and copy the URL
 * 10. Set that URL as CODNETWORK_WEBHOOK_URL in EasyPanel
 *
 * COLUMNS (auto-created in Row 1):
 * Date | Order ID | Country | Name | Phone | Product | SKU | Quantity | Total Price | Currency | Status | Note
 */

var SHEET_ID = "10k0-cYoHbgjwYAaZ23gwxoiwNYgbWA0izRh5u22wl2M";

var HEADERS = [
  "Date",
  "Order ID",
  "Country",
  "Name",
  "Phone",
  "Product",
  "SKU",
  "Quantity",
  "Total Price",
  "Currency",
  "Status",
  "Note"
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];

    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
    var isEmpty = headerRow.every(function(cell) { return !cell || cell.toString().trim() === ""; });
    if (isEmpty) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      SpreadsheetApp.flush();
    }

    if (data.orderid && isDuplicate(sheet, data.orderid)) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "duplicate",
        message: "Order already exists",
        orderid: data.orderid
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var row = [
      data.date || "",
      data.orderid || "",
      data.country || "KSA",
      data.name || "",
      data.phone || "",
      data.product || "",
      data.sku || "",
      data.quantity || "",
      data.total_price || "",
      data.currency || "SAR",
      data.status || "",
      data.note || ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Order added",
      orderid: data.orderid,
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Mutqan CodNetwork webhook is active"
  })).setMimeType(ContentService.MimeType.JSON);
}

function isDuplicate(sheet, orderid) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  var checkRows = Math.min(500, lastRow - 1);
  var startRow = Math.max(2, lastRow - checkRows + 1);

  var orderIdCol = 2;
  var range = sheet.getRange(startRow, orderIdCol, checkRows, 1).getValues();

  for (var i = range.length - 1; i >= 0; i--) {
    if (range[i][0] && range[i][0].toString() === orderid) {
      return true;
    }
  }

  return false;
}

function testWebhook() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        date: "23/05/2026",
        orderid: "mutqan-test-001",
        country: "KSA",
        name: "سارة محمد (اختبار)",
        phone: "966504752330",
        product: "سخّان المائدة الذكي/فلتر الصنبور النقي",
        sku: "MTQ-WRM-006/MTQ-FLT-005",
        quantity: "2/1",
        total_price: 648,
        currency: "SAR",
        status: "",
        note: "source: snapchat | medium: paid | campaign: ramadan_2026 | طلب تجريبي - يرجى الحذف"
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
