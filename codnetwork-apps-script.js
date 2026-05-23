/**
 * Mutqan → Google Sheets Webhook (new)
 *
 * Purpose:
 * - Receive order POSTs from your backend (set the deployed webapp URL in your backend variable `GOOGLE_SHEETS_WEBHOOK_URL`).
 * - Normalize payload to match the sheet columns and append a row.
 *
 * Important: Google Apps Script writes to Google Sheets, not to a local Excel file. To use your
 * `Mutqan Orders.xlsx` (local), upload it to Google Drive and open it with Google Sheets, then
 * copy the sheet ID from the URL and set `SHEET_ID` below.
 *
 * SETUP:
 * 1. Open https://script.google.com and create a new project.
 * 2. Replace the code with this file and save.
 * 3. Set `SHEET_ID` to your Google Sheet ID (from the URL: `/d/THIS_IS_THE_ID/`).
 * 4. Deploy → New deployment → select "Web app" (Execute as: Me, Who has access: Anyone).
 * 6. Copy the deployment URL and set it in your backend as `GOOGLE_SHEETS_WEBHOOK_URL` so orders are posted here.
 *
 * COLUMNS (auto-created in Row 1):
 * Date | Order ID | Country | Name | Phone | Product | SKU | Quantity | Total Price | Currency | Status | Note
 */

// Google Sheet ID from the provided link:
// https://docs.google.com/spreadsheets/d/1eZgzPu1SSONTh7JbE8Dhduv-AsNJobb9k87lHJyYC0c/edit
var SHEET_ID = "1eZgzPu1SSONTh7JbE8Dhduv-AsNJobb9k87lHJyYC0c";

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
    var data = JSON.parse(e.postData.contents || '{}');

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];

    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
    var isEmpty = headerRow.every(function(cell) { return !cell || cell.toString().trim() === ""; });
    if (isEmpty) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      SpreadsheetApp.flush();
    }

    // Normalize and build fields according to requested format
    var orderId = data.orderid && data.orderid.toString().trim() ? data.orderid.toString().trim() : generateOrderId();

    if (isDuplicate(sheet, orderId)) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "duplicate",
        message: "Order already exists",
        orderid: orderId
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var dateStr = data.date && data.date.toString().trim() ? data.date.toString().trim() : formatDateStr(new Date());

    var country = "KSA";

    var name = data.name || data.customer_name || data.customer || "";

    var phoneRaw = data.phone || data.msisdn || data.customer_phone || "";
    var phone = formatPhone(phoneRaw);

    // Items handling: prefer `items` array, otherwise accept product/sku/quantity strings
    var products = [];
    var skus = [];
    var quantities = [];

    if (Array.isArray(data.items) && data.items.length > 0) {
      data.items.forEach(function(it) {
        var title = it.title || it.name || it.product || it.name_ar || "Unnamed";
        products.push(title.toString());
        var sku = it.sku && it.sku.toString().trim() ? it.sku.toString().trim() : generateSku();
        skus.push(sku);
        var qty = (it.quantity || it.qty || it.count || 1).toString();
        quantities.push(qty);
      });
    } else if (data.product) {
      // product can be a single string or already formatted with '/'
      var prodStr = data.product.toString();
      products = prodStr.split("/").map(function(p) { return p.trim(); });

      if (data.sku) {
        skus = data.sku.toString().split("/").map(function(s) { return s.trim(); });
      } else {
        skus = products.map(function() { return generateSku(); });
      }

      if (data.quantity) {
        quantities = data.quantity.toString().split("/").map(function(q) { return q.trim(); });
      } else {
        quantities = products.map(function() { return "1"; });
      }
    } else {
      // fallback single item
      var singleProduct = data.title || data.name || data.product_name || "Unnamed";
      products = [singleProduct.toString()];
      skus = [data.sku && data.sku.toString().trim() ? data.sku.toString().trim() : generateSku()];
      quantities = [data.quantity ? data.quantity.toString() : "1"];
    }

    var productField = products.join("/");
    var skuField = skus.join("/");
    var quantityField = quantities.join("/");

    var totalPrice = (typeof data.total_price !== 'undefined' && data.total_price !== null) ? data.total_price : (computeTotalFromItems(data.items) || "");

    var currency = "SAR";

    var status = ""; // leave empty as requested

    var note = data.note || data.source || data.raw || "";

    var row = [
      dateStr,
      orderId,
      country,
      name,
      phone,
      productField,
      skuField,
      quantityField,
      totalPrice,
      currency,
      status,
      note
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Order added",
      orderid: orderId,
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

// Helpers
function generateOrderId() {
  var now = new Date();
  var ts = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyyMMddHHmmss");
  var rnd = Math.floor(Math.random() * 9000) + 1000;
  return "mutqan-" + ts + "-" + rnd;
}

function formatDateStr(d) {
  try {
    return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), "dd/MM/yyyy");
  } catch (e) {
    return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
  }
}

function formatPhone(raw) {
  if (!raw) return "";
  var s = raw.toString();
  // remove non-digits
  s = s.replace(/[^0-9]/g, "");
  // remove leading 00
  if (s.indexOf('00') === 0) {
    s = s.replace(/^00/, '');
  }
  // if starts with 0 (local), strip and prefix 966
  if (s.indexOf('0') === 0) {
    s = s.replace(/^0+/, '');
    s = '966' + s;
  }
  // if not starting with 966 and length is 9 assume local mobile
  if (s.indexOf('966') !== 0) {
    if (s.length === 9) s = '966' + s;
  }
  return s;
}

function generateSku() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var out = 'MTQ-';
  for (var i = 0; i < 6; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

function computeTotalFromItems(items) {
  if (!Array.isArray(items)) return null;
  try {
    var total = 0;
    items.forEach(function(it) {
      var price = Number(it.price || it.unit_price || 0) || 0;
      var qty = Number(it.quantity || it.qty || it.count || 1) || 1;
      total += price * qty;
    });
    return total || null;
  } catch (e) {
    return null;
  }
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
