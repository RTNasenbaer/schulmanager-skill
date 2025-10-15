# 🎉 FREE Alexa-Hosted Deployment Guide

Your Alexa Skill is now configured for **Alexa-hosted deployment** - completely FREE!

## ✅ What Changed

1. **skill.json** - Changed endpoint from AWS Lambda ARN to `sourceDir: lambda`
2. **ask-resources.json** - Created with Alexa-hosted configuration
3. **lambda/package.json** - Added for dependency management

## 🆓 Why Alexa-Hosted?

| Feature | Cost | Benefits |
|---------|------|----------|
| **Hosting** | FREE | Amazon hosts everything |
| **Storage** | 1GB FREE | Enough for your skill |
| **Requests** | 1M/month FREE | More than enough |
| **HTTPS** | FREE | Automatic secure endpoint |
| **Monitoring** | FREE | Built-in logs and analytics |

**No AWS account needed! No credit card required!**

## 🚀 Quick Deploy

### One-Command Deploy (PowerShell)

```powershell
cd alexa-skill
.\deploy.ps1
```

This script will:
1. Install dependencies
2. Build TypeScript
3. Copy files to lambda folder
4. Deploy to Alexa

### Manual Deploy

```bash
# 1. Install and build
cd alexa-skill
yarn install
yarn build

# 2. Copy compiled files
cp dist/*.js lambda/
cp -r dist/handlers lambda/
cp -r dist/services lambda/
cp -r dist/utils lambda/

# 3. Deploy
ask deploy
```

## ⚙️ Configuration

✅ **Already configured!** No changes needed to the code!

Backend URL and API key are set:
```typescript
const BACKEND_API_URL = 'https://schulmanager-backend-api.onrender.com/api';
const API_KEY = 'nVDlr2QzHS7qZN4sjo8mfBGpEXxvIyKP';
```

**Important:** Add the API key to Render Dashboard before deploying!

See `API_KEY_SETUP.md` for instructions. �

## 🧪 Testing

After deployment:

1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Find your "Schulmanager" skill
3. Click **Test** tab
4. Enable testing: **Development**
5. Type or say: **"Alexa, öffne Schulmanager"**

## 📊 Monitoring

View logs and metrics in Developer Console:
- **Code** tab → View logs
- **Analytics** tab → Usage statistics
- **Test** tab → Test your skill

## 💰 Cost Breakdown

| Service | Monthly Cost |
|---------|--------------|
| Backend (Render Free) | $0 |
| Alexa Skill (Alexa-hosted) | $0 |
| Web Dashboard (Vercel Free) | $0 |
| **TOTAL** | **$0** 🎉 |

## ⚠️ Limitations

Alexa-hosted free tier limits:
- 1GB total storage
- 1M requests/month
- Code package max 50MB

For your skill, this is **more than enough**!

## 🔄 Updates

To update your skill:

```powershell
# Make changes to your code
# Then run:
.\deploy.ps1
```

## 📚 More Info

- [Alexa-Hosted Skills Documentation](https://developer.amazon.com/docs/hosted-skills/build-a-skill-end-to-end-using-an-alexa-hosted-skill.html)
- [ASK CLI Guide](https://developer.amazon.com/docs/smapi/ask-cli-intro.html)

---

**Your entire stack is now 100% FREE!** 🎉🎊
