# 🚧 Maintenance Mode Instructions

## Overview

Your website now has a maintenance mode feature that allows you to temporarily close the site with a professional message. This is completely **FREE** and doesn't require any paid Vercel plan.

---

## 🎯 How to Enable Maintenance Mode

### Step 1: Add Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your `yecars-s3y9` project

2. **Open Settings**
   - Click on **"Settings"** tab (top menu)
   - Click on **"Environment Variables"** (left sidebar)

3. **Add the Variable**
   - Click **"Add New"** button
   - **Key**: `NEXT_PUBLIC_MAINTENANCE_MODE`
   - **Value**: `true`
   - **Environments**: Select all (Production, Preview, Development)
   - Click **"Save"**

### Step 2: Redeploy Your Site

After adding the environment variable, you need to trigger a redeploy:

**Option A: Redeploy from Dashboard**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..." menu** → **"Redeploy"**
4. Wait 1-2 minutes for deployment to complete

**Option B: Push a Commit (Automatic)**
- Just push any commit to your GitHub repository
- Vercel will automatically redeploy with the new environment variable

### Step 3: Verify

Visit your website: `https://yecars.autos`

You should now see the maintenance page! ✅

---

## 🔓 How to Disable Maintenance Mode (Re-open Site)

### Step 1: Update Environment Variable

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_MAINTENANCE_MODE`
3. Click **"Edit"**
4. Change value from `true` to `false`
5. Click **"Save"**

### Step 2: Redeploy

Trigger a redeploy (same as above)

### Step 3: Verify

Visit your website - it should be back to normal! 🎉

---

## 🎨 Customize the Maintenance Message

If you want to change the message, date, or contact info:

1. Open the file: `lib/maintenance.ts`
2. Edit these values:
   ```typescript
   export const maintenanceConfig = {
       title: "Site en maintenance",
       message: "Your custom message here",
       returnDate: "Retour prévu : [Your Date]",
       contactEmail: "contact@yecars.autos",
       contactPhone: "+225 XX XX XX XX XX",
   };
   ```
3. Commit and push the changes
4. Vercel will automatically redeploy

---

## 📋 Quick Reference

### Enable Maintenance:
```
NEXT_PUBLIC_MAINTENANCE_MODE = true
→ Redeploy
```

### Disable Maintenance:
```
NEXT_PUBLIC_MAINTENANCE_MODE = false
→ Redeploy
```

---

## ⚠️ Important Notes

1. **Admin Access**: When maintenance mode is ON, **NO ONE** can access the site (including you). If you need admin access during maintenance, you'll need to use a different approach.

2. **Environment Variables Are Free**: This feature uses Vercel's free environment variables - no paid plan required!

3. **Takes 1-2 Minutes**: After changing the variable and redeploying, wait 1-2 minutes for changes to take effect.

4. **Don't Forget to Disable**: After your 2-week maintenance, remember to set the variable back to `false` and redeploy!

---

## 🆘 Troubleshooting

**Q: I changed the variable but the site still works normally**
- A: Make sure you redeployed after changing the variable

**Q: I want to access admin panel during maintenance**
- A: Current setup doesn't allow this. You would need to add IP whitelisting (advanced)

**Q: How do I change the return date?**
- A: Edit `lib/maintenance.ts` → change `returnDate` → commit and push

**Q: Can I test this before going live?**
- A: Yes! Set the variable only for "Preview" environment first, then test on a preview deployment

---

## 📞 Need Help?

If you have questions about enabling/disabling maintenance mode, just ask!

---

**Files Created:**
- `lib/maintenance.ts` - Configuration
- `components/MaintenancePage.tsx` - Maintenance page design
- `app/layout.tsx` - Updated to check for maintenance mode
