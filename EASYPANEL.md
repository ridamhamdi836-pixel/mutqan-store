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

### متغيرات البيئة (Environment)

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
NEXT_PUBLIC_SITE_URL=https://mutqan.online
DATABASE_URL=postgresql://...
DEBUG_SECRET=optional-secret
```

### بعد النشر — تحقق

1. `https://mutqan.online/api/health-deploy` → `"build": "mutqan-store-v3-images"`
2. `https://mutqan.online/api/product-image/magic-under-sink-organizer` → صورة المنتج
3. Redeploy **بدون cache** بعد كل push على `main`

## خدمة Backend (اختياري)

| الحقل | القيمة |
|--------|--------|
| Repository | `mutqan-store` |
| Build Path | `backend` |
| أو Dockerfile | `backend/Dockerfile` |

Google Sheets يعمل من **Frontend فقط** — لا حاجة لـ `GOOGLE_SHEETS_WEBHOOK_URL` على الـ backend.
