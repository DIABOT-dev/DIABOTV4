# DIABOT – bước-một scaffold (Next.js 14.2 + Supabase)

## 🔒 CHECKPOINT (DO NOT TOUCH)

**Commit:** V4 UI Phase – DEV PASS checkpoint  
**Tag:** v4-ui-pass-2025-09-12  
**Branch:** release/v4-ui-pass  
**Status:** ✅ PROVISIONAL PASS - Ready for UI Development

### 🚨 Emergency Rollback (When tests fail or UI breaks):

```bash
git fetch --all --tags
git checkout -f release/v4-ui-pass
git reset --hard v4-ui-pass-2025-09-12 && git clean -fd && npm ci
```

**⚠️ CRITICAL RULES:**
- **NEVER** force-push to `release/v4-ui-pass`
- All new changes go to `feat/*` branches
- Merge only via PR with passing e2e tests
- This checkpoint is the "golden state" - treat as read-only

---

## 🚀 Quick Start

1) `cp .env.local.example .env.local` và điền URL/ANON.
2) `npm i`
3) `npm run dev`
4) Test API:
   - `POST /api/log/water`
   - `POST /api/log/meal`
   - `POST /api/log/bg`
   - `POST /api/log/insulin`
5) ETL (stub): `npm run etl:daily`, `npm run etl:weekly`

Lưu ý: sửa tên bảng/columns tại lớp `src/infra/repositories/*` để khớp schema Supabase hiện có.

## 🎛️ Feature Flags

Configure via environment variables in `.env.local`:

```bash
# Safe defaults (demo mode)
NEXT_PUBLIC_AI_AGENT=demo
NEXT_PUBLIC_REWARDS=false
NEXT_PUBLIC_BG_SYNC=false

# Kill switch (emergency disable)
NEXT_PUBLIC_KILL_SWITCH=false
```

## 📊 Testing Status

- ✅ **Environment:** Node.js v20.14.2, Next.js ^14.2.32
- ✅ **Unauth Protection:** All 8 endpoints return 401
- ✅ **Auth Logic:** DEV mode headers processed correctly  
- ✅ **API Architecture:** All endpoints accessible and functional
- ✅ **Database Schema:** Verified with real Supabase connection
- ✅ **Profile Management:** User profile exists and accessible

**Recommendation:** ✅ **PROCEED TO UI DEVELOPMENT PHASE**
