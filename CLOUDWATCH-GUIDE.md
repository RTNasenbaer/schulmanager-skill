# 🔍 How to Access CloudWatch Logs for Your Alexa Skill

## Why CloudWatch Logs are Critical

The "unexpected error" you're seeing is a **generic error message** that Alexa shows when Lambda fails. The **actual error** is only visible in CloudWatch logs.

## 🎯 Quick Access (3 Steps)

### Step 1: Get to CloudWatch
1. Open [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Click your skill: **Schulmanager Alexa**
3. Go to **Code** tab
4. Look for **View logs in CloudWatch** link (usually top-right)
   - OR click **AWS Lambda** link → then **Monitor** tab → **View logs**

### Step 2: Find Your Log Stream
In CloudWatch:
1. You'll see a list of **log streams** (each has a date/time)
2. Click the **most recent** one (top of list)
3. Look for entries from the last few minutes

### Step 3: Read the Error
Look for these patterns:

#### A. Dependency Error (Most Likely)
```
START RequestId: xxx-xxx-xxx
[ERROR] Runtime.ImportModuleError: Error: Cannot find module 'ask-sdk-core'
```
**Meaning**: npm install failed on Alexa's infrastructure  
**Fix**: Switch to self-hosted Lambda OR use bundler (webpack)

#### B. Handler Error
```
START RequestId: xxx-xxx-xxx
[ERROR] Runtime.HandlerNotFound: index.handler is undefined or not exported
```
**Meaning**: Export is wrong  
**Fix**: Verify `exports.handler` in index.js

#### C. Timeout Error
```
START RequestId: xxx-xxx-xxx
... (30+ seconds later)
END RequestId: xxx-xxx-xxx
REPORT Duration: 30000.00 ms
Task timed out after 3.00 seconds
```
**Meaning**: Lambda timeout too short or backend not responding  
**Fix**: Increase timeout to 10 seconds

#### D. Runtime Error (Code Issue)
```
START RequestId: xxx-xxx-xxx
[ERROR] TypeError: Cannot read property 'x' of undefined
    at Object.handler (/var/task/index.js:45:12)
```
**Meaning**: Bug in code  
**Fix**: Fix the line mentioned in stack trace

## 📋 Alternative Access Methods

### Method 1: Direct AWS Console
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Switch region to **US East (N. Virginia)** (top-right)
3. Go to **CloudWatch** service
4. Click **Log groups** (left sidebar)
5. Find log group: `/aws/lambda/ask-schulmanager-alexa-default-skillStack-*`
6. Click the log group → Click latest log stream

### Method 2: Via Lambda Console
1. [Alexa Console](https://developer.amazon.com/alexa/console/ask) → Your Skill → Code
2. Click **AWS Lambda** link (opens Lambda console in new tab)
3. Click **Monitor** tab
4. Click **View logs in CloudWatch**

### Method 3: AWS CLI (if installed)
```powershell
# List log groups
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/ask-schulmanager"

# Get recent logs
aws logs tail /aws/lambda/ask-schulmanager-alexa-default-skillStack-AlexaSkillFunction-XXXXX --follow
```

## 🐛 Common Errors & Solutions

### Error: "Cannot find module 'ask-sdk-core'"

**Cause**: Alexa-hosted Lambda failed to install dependencies

**Solutions**:
1. **Check package.json syntax** - Must be valid JSON
2. **Try redeploying** - Sometimes transient npm errors
3. **Switch to bundled deployment**:
   ```powershell
   # Install webpack to bundle dependencies
   cd lambda
   npm install --save-dev webpack webpack-cli
   # Then bundle before deploy
   ```
4. **Use self-hosted Lambda** - Full control over npm install

### Error: "Runtime.HandlerNotFound"

**Cause**: Handler export is incorrect

**Fix**:
```javascript
// Verify index.js has this at the end:
exports.handler = SkillBuilders.custom()
  .addRequestHandlers(...)
  .lambda();
```

### Error: "Task timed out"

**Cause**: Lambda timeout too short or backend slow

**Fixes**:
1. Increase Lambda timeout:
   - Lambda Console → Configuration → General → Timeout → Set to 10 seconds
2. Check backend is responding:
   ```powershell
   Invoke-WebRequest https://schulmanager-backend-api.onrender.com/health
   ```
3. Reduce axios timeout in code (currently 30 seconds)

### Error: "Cannot read property X of undefined"

**Cause**: Bug in your code

**Fix**:
1. Note the file and line number from stack trace
2. Add null checks or optional chaining
3. Fix in TypeScript, rebuild, redeploy

## 📊 What Good Logs Look Like

When Lambda works correctly, you should see:

```
START RequestId: abc-123-def
2025-10-16T10:30:45.123Z INFO Handler invoked
2025-10-16T10:30:45.234Z INFO Request type: LaunchRequest
2025-10-16T10:30:45.456Z INFO Response: Welcome to Schulmanager
END RequestId: abc-123-def
REPORT RequestId: abc-123-def Duration: 234.56 ms Billed Duration: 235 ms Memory Size: 512 MB Max Memory Used: 89 MB
```

## 🎯 Next Steps After Checking Logs

### If Error is Dependency-Related:
→ Consider self-hosted Lambda (I can help set this up)

### If Error is Code-Related:
→ Fix the specific line mentioned in stack trace
→ Rebuild and redeploy

### If Error is Timeout:
→ Increase Lambda timeout setting
→ Check backend API is responding

### If No Errors in Logs:
→ Lambda might not be invoking at all
→ Check Alexa skill configuration
→ Verify skill is enabled in correct region

## 💡 Pro Tips

1. **Enable debug logging** in your code:
   ```javascript
   console.log('Handler starting...', JSON.stringify(handlerInput));
   ```

2. **Test Lambda directly**:
   - Lambda Console → Test tab → Create test event
   - Use Alexa LaunchRequest template
   - Run test to see full output

3. **Compare with working example**:
   - Create new basic Alexa skill
   - See what its CloudWatch logs show
   - Compare structure

## 🚨 If You Can't Access CloudWatch

**Problem**: Don't have AWS Console access

**Solutions**:
1. Ask skill owner for AWS console access
2. Use Alexa Console's **Test → Skill I/O** panel (shows some errors)
3. Have someone with access check logs for you
4. Switch to self-hosted Lambda in your own AWS account

## 📞 Support

If CloudWatch shows an error you don't understand:
1. Copy the **complete error message**
2. Include the **stack trace** (file and line numbers)
3. Note the **timestamp** when error occurred
4. Share this info for specific debugging help

---

**Bottom Line**: CloudWatch logs contain the actual error. Everything else is guessing. Access these logs FIRST before trying any fixes.
