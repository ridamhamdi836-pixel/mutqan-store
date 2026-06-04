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

### Pixels (Meta / TikTok / Snapchat) — FRONTEND فقط

ضع المتغيرات على خدمة **frontend** (ليس backend). احذف الأسطر الفارغة المكررة.

```
NEXT_PUBLIC_META_PIXEL_ID=معرف_ميتا
NEXT_PUBLIC_TIKTOK_PIXEL_ID=D4GVCMBC77UAP3H8QDS0
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=d8f90588-0a07-41a3-87ed-0c829150b41a
NEXT_PUBLIC_ENABLE_PIXELS=true
```

أو بدون `NEXT_PUBLIC_` (يُقرأ وقت التشغيل أيضاً):

```
TIKTOK_PIXEL_CODE=...
SNAPCHAT_PIXEL_ID=...
META_PIXEL_ID=...
```

**Backend** يحتفظ فقط بـ `TIKTOK_ACCESS_TOKEN`, `SNAPCHAT_ACCESS_TOKEN`, `META_ACCESS_TOKEN` لـ CAPI عند إنشاء الطلب — لا يشغّل البكسل في المتصفح.

بعد الحفظ: **Deploy frontend بدون cache** ثم افتح `https://mutqan.online/api/debug/pixels` — يجب `tiktok: true`, `snapchat: true`.

**لا تضع** `NEXT_PUBLIC_*` فارغة فوق نفس المفتاح بقيمة — Easypanel قد يأخذ الأول الفارغ.

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

## خدمة Backend

| الحقل | القيمة |
|--------|--------|
| Repository | `mutqan-store` |
| Branch | `main` |
| Build Path | `backend` |
| Dockerfile | `backend/Dockerfile` |

> **مهم:** الـ push على GitHub يحدّث الكود للجميع، لكن Easypanel يعيد النشر **لكل خدمة على حدة**.  
> بعد أي إصلاح في `backend/` اضغط **Deploy** على خدمة **backend** (ليس frontend فقط).

تحقق: `GET https://YOUR-API-HOST/api/v1/health` → `"db_driver":"postgresql+psycopg"`

Google Sheets يعمل من **Frontend فقط** — لا حاجة لـ `GOOGLE_SHEETS_WEBHOOK_URL` على الـ backend.
