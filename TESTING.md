# 🚀 Alexa Skill Deployment & Testing Guide

## Quick Start

### 1️⃣ Deploy to Alexa
```powershell
.\deploy-to-alexa.ps1
```
Pushes your code to Alexa-hosted development stage (master branch).

### 2️⃣ Sync Dev Branch
```powershell
.\sync-alexa-branches.ps1
```
Syncs the dev branch with master (needed for Alexa code editor to work).

### 3️⃣ Test Your Skill
```powershell
# Quick local validation
.\test-skill.ps1 quick

# Full test including live deployment
.\test-skill.ps1 full

# Interactive testing (talk to Alexa)
.\test-skill.ps1 dialog
```

---

## 📋 Workflow

### Daily Development
1. Make code changes
2. Commit to git: `git add . && git commit -m "Your changes"`
3. **Test locally**: `.\test-skill.ps1 quick`
4. **Deploy to Alexa**: `.\deploy-to-alexa.ps1`
5. **Test live**: `.\test-skill.ps1 dialog`
6. **Backup to GitHub**: `git push origin master`

### First Time Setup
1. Run `.\sync-alexa-branches.ps1` once to enable the Alexa code editor
2. Make sure your `.env` file has `API_BASE_URL` configured
3. Deploy with `.\deploy-to-alexa.ps1`

---

## 🔍 Testing Methods

### Method 1: Quick Validation (Offline)
```powershell
.\test-skill.ps1 quick
```
✅ Validates JSON files  
✅ Checks Lambda code structure  
⚡ Fast (no network calls)

### Method 2: Full Test Suite
```powershell
.\test-skill.ps1 full
```
✅ Everything from Quick  
✅ Tests backend API connectivity  
✅ Checks live skill deployment status  
🌐 Requires network

### Method 3: Interactive Dialog Test
```powershell
.\test-skill.ps1 dialog
```
💬 Talk to your skill via CLI  
🗣️ Test real utterances  
📝 See intent/slot resolution

**Example dialog session:**
```
User  > öffne schulmanager
Alexa > Willkommen beim Schulmanager...
User  > was habe ich heute
Alexa > Du hast heute...
User  > quit
```

### Method 4: Alexa Developer Console
- **Test Tab**: https://developer.amazon.com/alexa/console/ask
- **CloudWatch Logs**: Check the log URL from deployment status
- **Code Editor**: Only works after running `sync-alexa-branches.ps1`

### Method 5: Real Device Testing
1. Deploy your skill: `.\deploy-to-alexa.ps1`
2. Enable testing in Alexa app
3. Say: "Alexa, öffne Schulmanager"

---

## 🔧 Troubleshooting

### "Deployment failed"
1. Check CloudWatch logs (URL provided in error)
2. Verify `lambda/package.json` has all dependencies
3. Make sure your code compiles: `cd lambda && tsc`
4. Re-deploy: `.\deploy-to-alexa.ps1`

### "Backend API not responding"
1. Check if your backend is running
2. Verify `API_BASE_URL` in `.env` file
3. Test manually: `Invoke-WebRequest -Uri "$apiUrl/health"`

### "Code editor disabled in Alexa Console"
Run: `.\sync-alexa-branches.ps1`

### "Authentication failed"
Make sure ASK CLI is configured: `ask configure`

---

## 📂 Git Setup

This project uses **dual git remotes**:

- **`origin`** → GitHub (schulmanager-skill) - Your backup/collaboration
- **`alexa`** → AWS CodeCommit - Alexa deployment

### Branches
- **`master`** → Development stage (live testing)
- **`dev`** → Alexa code editor branch
- **`prod`** → Production stage (not used yet)

---

## 🎯 Common Commands

```powershell
# Check deployment status
ask smapi get-skill-status -s amzn1.ask.skill.ac0ac7be-22ea-4512-841b-f6a322cf5673

# View skill in console
start https://developer.amazon.com/alexa/console/ask

# Compile TypeScript
cd lambda
tsc

# Check git remotes
git remote -v

# Test an utterance directly
ask dialog -l de-DE -s amzn1.ask.skill.ac0ac7be-22ea-4512-841b-f6a322cf5673
```

---

## 💡 Tips

1. **Always test locally first** (`.\test-skill.ps1 quick`) before deploying
2. **Use dialog mode** to quickly iterate on utterances
3. **Check CloudWatch logs** if Lambda is failing
4. **Commit often** to your GitHub repo for backup
5. **Keep dev and master in sync** with `sync-alexa-branches.ps1`

---

## 📚 Resources

- [ASK CLI Documentation](https://developer.amazon.com/docs/smapi/ask-cli-intro.html)
- [Alexa Skills Kit SDK for Node.js](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs)
- [Skill Testing Guide](https://developer.amazon.com/docs/devconsole/test-your-skill.html)
