# Pre-SQL Smoke

- ❌ unauth POST /api/log/bg — FAIL · status=500
- ❌ unauth POST /api/log/water — FAIL · status=500
- ❌ unauth POST /api/log/meal — FAIL · status=500
- ❌ unauth POST /api/log/insulin — FAIL · status=500
- ❌ unauth POST /api/log/weight — FAIL · status=500
- ❌ unauth POST /api/log/bp — FAIL · status=500
- ❌ unauth GET /api/chart/bg_avg?range=7d — FAIL · status=500
- 🟡 auth POST /api/log/bg — DB_NOT_READY · pre-SQL
- 🟡 auth POST /api/log/water — DB_NOT_READY · pre-SQL
- 🟡 auth POST /api/log/meal — DB_NOT_READY · pre-SQL
- 🟡 auth POST /api/log/insulin — DB_NOT_READY · pre-SQL
- 🟡 auth POST /api/log/weight — DB_NOT_READY · pre-SQL
- 🟡 auth POST /api/log/bp — DB_NOT_READY · pre-SQL
- 🟡 auth GET /api/chart/bg_avg?range=7d — DB_NOT_READY · pre-SQL
- 🟡 profile self — DB_NOT_READY · status=500
- ❌ profile wrongId — FAIL · status=500