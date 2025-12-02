# Quick Netlify Setup Guide

## ✅ Completed Steps

1. ✅ Git repository initialized
2. ✅ Code pushed to GitHub: https://github.com/arminjamak/portfolio
3. ✅ Netlify configuration files created
4. ✅ GitHub sync function created

## 🚀 Next Steps (Do These Now)

### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it: "Portfolio Netlify Sync"
4. Select scope: **`repo`** (Full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Deploy to Netlify

1. Go to: https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select repository: `arminjamak/portfolio`
5. Configure:
   - **Base directory**: `website`
   - **Build command**: `npm run build`
   - **Publish directory**: `website/dist`
6. Click "Deploy site"

### Step 3: Add Environment Variables

After deployment:

1. Go to: Site settings → Environment variables
2. Add these 3 variables:

| Variable Name | Value |
|--------------|-------|
| `GITHUB_TOKEN` | Your token from Step 1 |
| `GITHUB_REPO` | `arminjamak/portfolio` |
| `GITHUB_BRANCH` | `main` |

3. Click "Save"

### Step 4: Redeploy

1. Go to: Deploys tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete

## 🎉 You're Done!

Your portfolio is now live! When you edit content in admin mode:
- Changes save to localStorage (instant)
- Changes sync to GitHub (automatic)
- Netlify rebuilds the site (automatic)
- Your live site updates (within ~2 minutes)

## 📝 Important Notes

- **Auto-sync only works in production** (not localhost)
- Use external URLs for images in production (IndexedDB doesn't sync)
- First deployment takes ~2-3 minutes
- Subsequent updates take ~1-2 minutes

## 🔧 Troubleshooting

### "GitHub sync failed"
- Check your GITHUB_TOKEN is correct
- Verify token has `repo` scope
- Check Netlify function logs

### "Build failed"
- Check Netlify build logs
- Verify base directory is `website`
- Make sure all dependencies are in package.json

### "Site not updating"
- Wait 2-3 minutes for rebuild
- Check Deploys tab for status
- Manually trigger deploy if needed

## 📞 Need Help?

Check the full guide: `DEPLOYMENT.md`
