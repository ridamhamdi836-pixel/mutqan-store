# متقن / Mutqan

**Premium GCC Home Lifestyle Ecommerce Store**

Domain: `mutqan.online` | API: `api.mutqan.online`

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | FastAPI, PostgreSQL, Alembic migrations |
| Deployment | Docker, Easypanel |

---

## Quick Start (Local Development)

### Prerequisites
- Docker and Docker Compose
- Node.js 22+ (for local frontend dev)
- Python 3.12+ (for local backend dev)

### 1. Clone and Setup

```bash
git clone <your-repo>
cd mutqan
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Edit `.env` files with your actual values.

### 3. Run with Docker Compose

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend Docs: http://localhost:8000/docs
- Database: localhost:5432

### 4. Run Database Migrations

```bash
docker compose exec backend alembic upgrade head
```

### 5. Seed Products

```bash
docker compose exec backend python -m scripts.seed_products
```

---

## Project Structure

```
mutqan/
├── frontend/          # Next.js App Router store
│   ├── app/
│   │   ├── (store)/   # All public store pages
│   │   └── api/       # Next.js API routes
│   ├── components/    # Reusable UI components
│   ├── config/        # Brand, products, collections config
│   ├── lib/           # Utilities (analytics, phone, API client)
│   └── providers/     # Cart, Analytics providers
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── api/       # API routes (v1)
│   │   ├── core/      # Config, logging, security
│   │   ├── db/        # Database session
│   │   ├── integrations/ # Google Sheets, Meta CAPI, etc.
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic request/response schemas
│   │   └── services/  # Business logic
│   ├── alembic/       # Database migrations
│   └── scripts/       # Seed scripts
└── docker-compose.yml
```

---

## Key Features

- **Arabic-first RTL** UI with IBM Plex Sans Arabic font
- **Mobile-first** premium GCC design
- **COD-only** checkout with Saudi phone validation
- **Add-to-cart → Cart drawer → Checkout → Upsell → Thank you** flow
- **Post-order upsell** popup (10-15 second timer)
- **Google Sheets** webhook with retry logic
- **Meta/TikTok/Snapchat** pixel + CAPI with deduplication
- **Backend price recalculation** (never trusts frontend totals)
- **PostgreSQL** with Alembic migrations
- **Easypanel-ready** Docker configuration

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/products` | List all products |
| GET | `/api/v1/products/{slug}` | Get product by slug |
| POST | `/api/v1/orders` | Create COD order |
| POST | `/api/v1/orders/{id}/upsell/accept` | Accept upsell |
| POST | `/api/v1/orders/{id}/upsell/decline` | Decline upsell |
| POST | `/api/v1/orders/track` | Track order by number + phone |
| PATCH | `/api/v1/orders/{id}/status` | Update order status (admin) |
| POST | `/api/v1/webhooks/retry` | Retry failed webhooks (admin) |

---

## Easypanel Deployment

1. Push to GitHub
2. Create PostgreSQL service: `mutqan_database`
3. Deploy backend from `backend/` with domain `api.mutqan.online`
4. Run: `alembic upgrade head` then `python -m scripts.seed_products`
5. Deploy frontend from `frontend/` with domain `mutqan.online`
6. Configure DNS and enable HTTPS

---

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgresql+psycopg://mutqan:mutqan@mutqan_database:5432/mutqan
CORS_ORIGINS=https://mutqan.online
SECRET_KEY=<strong-random-key>
ADMIN_API_KEY=<strong-admin-key>
GOOGLE_SHEETS_WEBHOOK_URL=<your-apps-script-url>
GOOGLE_SHEETS_WEBHOOK_SECRET=<webhook-secret>
META_PIXEL_ID=<pixel-id>
META_ACCESS_TOKEN=<capi-token>
TIKTOK_PIXEL_CODE=<pixel-code>
TIKTOK_ACCESS_TOKEN=<events-api-token>
SNAPCHAT_PIXEL_ID=<pixel-id>
SNAPCHAT_ACCESS_TOKEN=<capi-token>
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_SITE_URL=https://mutqan.online
NEXT_PUBLIC_API_URL=https://api.mutqan.online
NEXT_PUBLIC_META_PIXEL_ID=<pixel-id>
NEXT_PUBLIC_TIKTOK_PIXEL_ID=<pixel-id>
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=<pixel-id>
NEXT_PUBLIC_WHATSAPP_NUMBER=966500000000
NEXT_PUBLIC_SUPPORT_PHONE=0500000000
```

---

## Google Apps Script Webhook

Deploy this as a Google Apps Script web app, then set the URL as `GOOGLE_SHEETS_WEBHOOK_URL`:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  const payload = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), payload.event_type, payload.order_number, payload.created_at,
    payload.status, payload.customer_name, payload.phone_e164, payload.phone_local,
    payload.city, payload.address, payload.items_summary, payload.item_slugs,
    payload.main_product_slug, payload.subtotal_sar, payload.discount_sar,
    payload.shipping_sar, payload.total_sar, payload.payment_method,
    payload.utm_source, payload.utm_medium, payload.utm_campaign,
    payload.utm_content, payload.landing_page, payload.referrer,
    payload.client_event_id, payload.notes
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## License

Private - All rights reserved.
