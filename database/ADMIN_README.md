# Admin dashboard setup

## 1. Run migration

```bash
psql "$DATABASE_URL" -f database/migration_admin_analytics.sql
```

## 2. Environment (Easypanel → **frontend** service)

```env
ADMIN_USERNAME=your_admin_user
ADMIN_PASSWORD=your_strong_password
ADMIN_SESSION_SECRET=openssl rand -hex 32

MAXMIND_ACCOUNT_ID=123456
MAXMIND_LICENSE_KEY=your_license_key

DATABASE_URL=postgresql://...
```

## 3. Open dashboard

https://mutqan.online/admin

Metrics count only **valid KSA** visitors (country SA, not VPN/proxy/hosting per MaxMind, with ip-api.com fallback).
