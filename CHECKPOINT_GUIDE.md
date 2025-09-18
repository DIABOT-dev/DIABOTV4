# 🔒 DIABOT V4 - CHECKPOINT GUIDE

## 📍 Current Checkpoint

**Tag:** `v4-ui-pass-2025-09-12`  
**Branch:** `release/v4-ui-pass`  
**Status:** ✅ PROVISIONAL PASS - Ready for UI Development

## 🚨 Emergency Procedures

### Quick Rollback (1 minute)
```bash
git fetch --all --tags
git checkout -f release/v4-ui-pass
git reset --hard v4-ui-pass-2025-09-12 && git clean -fd && npm ci
```

### Kill Switch (30 seconds)
```bash
# In .env.local
NEXT_PUBLIC_KILL_SWITCH=true
# Restart server - all non-essential features disabled
```

### Feature-Level Disable
```bash
# In .env.local
NEXT_PUBLIC_AI_AGENT=off
NEXT_PUBLIC_REWARDS=false
NEXT_PUBLIC_BG_SYNC=false
NEXT_PUBLIC_REALTIME=false
```

## 🎯 Development Workflow

### Safe Development
1. **Always branch from checkpoint:**
   ```bash
   git checkout release/v4-ui-pass
   git checkout -b feat/your-feature-name
   ```

2. **Regular safety checks:**
   ```bash
   npm run checkpoint  # typecheck + lint + test
   ```

3. **Merge via PR only:**
   - Never direct push to `release/v4-ui-pass`
   - All PRs must pass CI checks
   - Manual review required

### Testing Levels
- **Unit:** `npm test`
- **Type:** `npm run typecheck`  
- **Lint:** `npm run lint`
- **E2E:** Playwright (3 happy paths)

## 🛡️ Safety Guarantees

### What's Protected
- ✅ Database schema (migrations locked)
- ✅ Core API routes (validated)
- ✅ Authentication flow (tested)
- ✅ Environment template (no secrets)
- ✅ Feature flags (safe defaults)

### What Can Change Safely
- ✅ UI components
- ✅ Styling and layout
- ✅ Client-side logic
- ✅ Non-critical features
- ✅ Documentation

## 📊 Checkpoint Validation

Run this to verify checkpoint integrity:

```bash
# 1. Checkout checkpoint
git checkout v4-ui-pass-2025-09-12

# 2. Clean install
npm ci

# 3. Verify build
npm run build

# 4. Check feature flags
node -e "console.log(require('./config/feature-flags.ts').FLAGS)"

# 5. Verify environment template
test -f .env.example && echo "✅ Template exists"

# 6. Check backup
test -f backups/sb_2025-09-12.sql && echo "✅ Backup exists"
```

Expected output: All ✅ green checks

## 🔄 Recovery Scenarios

### Scenario 1: Build Broken
```bash
git checkout release/v4-ui-pass
npm ci && npm run build  # Should work
```

### Scenario 2: Dependencies Corrupted
```bash
rm -rf node_modules package-lock.json
git checkout release/v4-ui-pass -- package-lock.json
npm ci
```

### Scenario 3: Database Issues
```bash
# Restore from backup
# 1. Go to Supabase Studio
# 2. Upload backups/sb_2025-09-12.sql
# 3. Run SQL file
```

### Scenario 4: Environment Misconfigured
```bash
git checkout release/v4-ui-pass -- .env.example
cp .env.example .env.local
# Fill in your values
```

## 📞 Support Commands

### Status Check
```bash
git describe --tags  # Should show v4-ui-pass-2025-09-12
git branch --show-current  # Current branch
git status  # Working directory status
```

### Health Check
```bash
npm run checkpoint  # Full validation
npm run dev  # Should start without errors
curl http://localhost:3000/api/debug/auth  # Should return auth status
```

---

**Remember:** This checkpoint is your safety net. When in doubt, rollback and restart from here.