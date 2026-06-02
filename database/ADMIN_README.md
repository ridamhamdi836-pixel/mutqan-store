# Admin dashboard setup

## 1. Run migration

```bash
psql "$DATABASE_URL" -f database/migration_admin_analytics.sql
```

## 2. Environment

### Option A — all on **frontend** (Easypanel frontend service)

```env
ADMIN_USERNAME=your_admin_user
ADMIN_PASSWORD=your_strong_password
ADMIN_SESSION_SECRET=openssl rand -hex 32
DATABASE_URL=postgresql://...
```

### Option B — credentials on **backend**, session on both

**Backend:**
```env
ADMIN_USERNAME=your_admin_user
ADMIN_PASSWORD=your_strong_password
ADMIN_SESSION_SECRET=same-secret-as-frontend
```

**Frontend** (required):
```env
ADMIN_SESSION_SECRET=same-secret-as-frontend
NEXT_PUBLIC_API_URL=https://api.mutqan.online
DATABASE_URL=postgresql://...
```

`ADMIN_SESSION_SECRET` must be **identical** on frontend and backend when using Option B.

## 3. Open dashboard

https://mutqan.online/admin

Metrics count only **valid KSA** visitors (country SA, not VPN/proxy/hosting per MaxMind, with ip-api.com fallback).
