# Alexa Skill Deployment & Troubleshooting Guide

## 🚀 Quick Deployment

```powershell
# From alexa-skill folder:
.\deploy-to-alexa.ps1
```

This will:
1. ✅ Compile TypeScript → JavaScript
2. ✅ Verify build output
3. ✅ Push to Alexa CodeCommit

## 🔧 Manual Build (if needed)

```powershell
# From alexa-skill folder:
.\build-lambda.ps1

# Or from lambda folder:
cd lambda
npm run build
```

## 📋 Pre-Deployment Checklist

### ✅ Before Every Deployment:
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] All handler .js files exist
- [ ] package-lock.json exists (not yarn.lock)
- [ ] No .ts files in git (only .js and .d.ts)
- [ ] Environment variables set in AWS Console (if needed)

### 🔍 Verify Files:
```powershell
# Check what will be deployed:
cd lambda
git ls-files | Select-String -NotMatch "node_modules"
```

Should include:
- ✅ `index.js` (NOT index.ts)
- ✅ All handler `.js` files
- ✅ `package.json` and `package-lock.json`
- ✅ `.d.ts` type definition files
- ❌ NO `.ts` source files
- ❌ NO `yarn.lock`
- ❌ NO `.map` files

## 🐛 Troubleshooting Alexa-Hosted Lambda

### Problem: "Unexpected error" when testing skill

**Causes:**
1. **Lambda initialization failure** - Check CloudWatch Logs
2. **Missing dependencies** - Alexa can't install packages
3. **Runtime error in handler** - Syntax or import errors
4. **Wrong Node.js version** - Must be 18.x

**Solutions:**

#### 1️⃣ Check CloudWatch Logs (Critical!)
```
AWS Console → CloudWatch → Log Groups → 
/aws/lambda/ask-schulmanager-alexa-default-skillStack-AlexaSkillFunction-XXXXX
```

Look for:
- Import errors (`Cannot find module`)
- Syntax errors
- Runtime crashes
- Timeout errors

#### 2️⃣ Verify Lambda Configuration
```
Alexa Developer Console → Code Tab → Lambda Settings:
- Runtime: Node.js 18.x ✅
- Handler: index.handler ✅
- Timeout: 10 seconds minimum
```

#### 3️⃣ Test Locally First
```powershell
cd lambda
npm install
node -e "const handler = require('./index'); console.log(handler);"
```

Should output: `{ handler: [Function (anonymous)] }`

#### 4️⃣ Verify Dependencies Install
```powershell
cd lambda
rm -rf node_modules package-lock.json
npm install --production
```

All 3 dependencies should install without errors:
- ask-sdk-core
- ask-sdk-model
- axios

### Problem: package-lock.json conflicts

**Solution:**
```powershell
cd lambda
rm yarn.lock  # Alexa uses npm, not yarn
npm install --package-lock-only
git add package-lock.json
git commit -m "Use npm instead of yarn"
```

### Problem: TypeScript files being deployed

**Solution:**
```powershell
cd lambda
git rm --cached index.ts handlers/*.ts
git commit -m "Remove TypeScript source files from tracking"
```

### Problem: Stale .js files from old .ts code

**Solution:**
```powershell
cd lambda
npm run clean  # Deletes all .js and .map files
npm run build  # Recompiles from .ts
```

## 🔐 Environment Variables

Alexa-hosted Lambda **does NOT use .env files**!

### Current Hardcoded Values:
```typescript
// In apiClient.service.ts
const BACKEND_API_URL = 'https://schulmanager-backend-api.onrender.com/api';
const API_KEY = process.env.API_KEY || 'nVDlr2QzHS7qZN4sjo8mfBGpEXxvIyKP';
```

### To Use Lambda Environment Variables:
1. Go to AWS Lambda Console (via Alexa Console → Code → AWS Lambda)
2. Configuration → Environment variables
3. Add:
   - `API_KEY` = your-api-key
   - `API_BASE_URL` = https://schulmanager-backend-api.onrender.com/api

Then remove hardcoded fallback from code.

## 📊 Deployment Status Check

After deployment, check:

1. **Alexa Console → Code Tab**
   - Should show "Last deployment: X minutes ago"
   - Status should be green

2. **Test in Simulator**
   - Type: "öffne schulmanager"
   - Should respond (not "unexpected error")

3. **CloudWatch Logs**
   - Should see initialization logs
   - Should see handler invocation logs

## 🚨 Common Errors

### Error: "Cannot find module 'ask-sdk-core'"
**Cause:** npm install failed on Lambda  
**Fix:** 
- Verify package.json is valid JSON
- Check package-lock.json exists
- Try deploying with --force

### Error: "Runtime.ImportModuleError"
**Cause:** Handler export is wrong or file missing  
**Fix:**
- Verify `index.js` exists
- Check `exports.handler` is exported
- Run: `npm run build` before deploy

### Error: "Task timed out after 3.00 seconds"
**Cause:** Backend API not responding (Render cold start)  
**Fix:**
- Increase Lambda timeout to 10s
- Reduce axios timeout in code
- Check backend is deployed

## 📦 File Structure (What Gets Deployed)

```
lambda/
├── index.js ✅
├── package.json ✅
├── package-lock.json ✅
├── handlers/
│   ├── *.js ✅
│   └── *.d.ts ✅ (type hints only)
├── services/
│   ├── *.js ✅
│   └── *.d.ts ✅
└── utils/
    ├── *.js ✅
    └── *.d.ts ✅

NOT deployed:
├── *.ts ❌ (source files)
├── *.map ❌ (source maps)
├── yarn.lock ❌ (use npm)
└── tsconfig.json ❌ (dev only)
```

## 🔄 Recovery Steps

If skill is completely broken:

1. **Reset to last working version:**
   ```powershell
   git log --oneline  # Find last good commit
   git reset --hard <commit-hash>
   .\deploy-to-alexa.ps1
   ```

2. **Fresh build and deploy:**
   ```powershell
   cd lambda
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   cd ..
   .\deploy-to-alexa.ps1
   ```

3. **Contact Alexa Support:**
   - Provide Skill ID: `amzn1.ask.skill.ac0ac7be-22ea-4512-841b-f6a322cf5673`
   - Include CloudWatch logs
   - Mention it's Alexa-hosted

## 📞 Getting Help

1. **CloudWatch Logs** (most important!)
2. **Alexa Developer Console → Test → View Skill I/O**
3. **Check backend is up:** https://schulmanager-backend-api.onrender.com/health
4. **Test locally before deploying**

---

**Next Steps After This Fix:**
1. ✅ Commit changes (remove .ts files, add package-lock.json)
2. ✅ Build: `.\build-lambda.ps1`
3. ✅ Deploy: `.\deploy-to-alexa.ps1`
4. ✅ Check CloudWatch logs for actual error
5. ✅ Test skill in Alexa simulator
