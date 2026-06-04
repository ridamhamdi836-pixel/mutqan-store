# نشر المتجر على EasyPanel

## خدمة Frontend (mutqan.online)

| الحقل | القيمة |
|--------|--------|
| **Owner** | `ridamhamdi836-pixel` |
| **Repository** | `mutqan-store` |
| **Branch** | `main` |
| **Build Path** | `.` (نقطة فقط = جذر المستودع) |

> لا تستخدم `frontend` كـ Build Path — EasyPanel يرفضه أحياناً.  
> يوجد `Dockerfile` في **جذر** المستودع يبني مجلد `frontend/` تلقائياً.

### متغيرات البيئة (Environment) — مطلوبة للطلبات في Google Sheet

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
NEXT_PUBLIC_SITE_URL=https://mutqan.online
DATABASE_URL=postgresql://... (أو `postgres://` من Easypanel — يُحوَّل تلقائياً)

# Admin /admin — required on FRONTEND (not backend-only)
ADMIN_SESSION_SECRET=long-random-string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
# OR credentials on backend + same secret on frontend:
# NEXT_PUBLIC_API_URL=https://api.mutqan.online
```

Check: `https://mutqan.online/api/health-deploy` → `admin.ready` should be `true`.

**مهم:** بعد تغيير Repository إلى `mutqan-store` أعد إدخال `GOOGLE_SHEETS_WEBHOOK_URL` يدوياً — المتغيرات القديمة لا تنتقل تلقائياً.

### Google Apps Script (مرة واحدة)

1. افتح `google-sheets-webhook.js` من المستودع
2. في السطر `SHEET_ID` ضع معرف الشيت من الرابط:
   `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. Deploy → Web app → Execute as **Me** → Who has access **Anyone**
4. انسخ رابط `/exec` إلى `GOOGLE_SHEETS_WEBHOOK_URL` في EasyPanel
5. **مهم:** بعد تغيير `SHEET_ID` → **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**  
   (الحفظ فقط لا يحدّث الرابط `/exec` الحي!)
6. افتح رابط `/exec` في المتصفح — يجب `"sheet_id_set":true`
7. Redeploy frontend

### تحقق من Sheets

`https://mutqan.online/api/health-deploy`

يجب:
- `sheets_webhook.configured: true`
- `sheets_live_test.ok: true`

إذا `sheets_live_test.error` يحتوي `Set SHEET_ID` → عيّن SHEET_ID في Apps Script وأعد Deploy.

### إذا فشل Deploy (أحمر)

1. **لا تعِد نشر كوميت قديم فاشل** — اضغط Deploy على آخر كوميت في `main` (أو Redeploy بدون cache).
2. افتح **Build logs** — إن ظهر `Property 'iconClass' does not exist` فالمستودع قديم؛ يلزم `7e885a6` أو أحدث.
3. **Build Path** = `.` (جذر المستودع) وليس `frontend`.
4. بعد كل push ناجح: Redeploy **بدون cache**.

### بعد النشر — تحقق

1. `https://mutqan.online/api/health-deploy` → `git_commit_short` يطابق آخر push على `main`
2. `https://mutqan.online/api/product-image/magic-under-sink-organizer` → صورة المنتج
3. Redeploy **بدون cache** بعد كل push على `main`

## خدمة Backend (اختياري)

| الحقل | القيمة |
|--------|--------|
| Repository | `mutqan-store` |
| Build Path | `backend` |
| أو Dockerfile | `backend/Dockerfile` |

Google Sheets يعمل من **Frontend فقط** — لا حاجة لـ `GOOGLE_SHEETS_WEBHOOK_URL` على الـ backend.
