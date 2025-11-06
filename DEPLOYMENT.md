# Portfolio Deployment Guide

This guide will help you deploy your portfolio to Netlify with automatic GitHub syncing.

## Prerequisites

1. GitHub account
2. Netlify account
3. GitHub Personal Access Token

## Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Portfolio Netlify"
4. Select scopes:
   - `repo` (Full control of private repositories)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately (you won't be able to see it again)

## Step 2: Push to GitHub

```bash
cd /Users/arminjamak/portfolio/website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/arminjamak/portfolio.git
git push -u origin main
```

## Step 3: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select the `arminjamak/portfolio` repository
5. Configure build settings:
   - **Base directory**: `website`
   - **Build command**: `npm run build`
   - **Publish directory**: `website/dist`
6. Click "Deploy site"

## Step 4: Configure Environment Variables

In your Netlify site settings:

1. Go to Site settings → Environment variables
2. Add the following variables:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: Your GitHub Personal Access Token from Step 1
   - **Key**: `GITHUB_REPO`
   - **Value**: `arminjamak/portfolio`
   - **Key**: `GITHUB_BRANCH`
   - **Value**: `main`
3. Click "Save"

## Step 5: Redeploy

After adding environment variables:
1. Go to Deploys tab
2. Click "Trigger deploy" → "Deploy site"

## How Auto-Sync Works

When you edit content in admin mode and save:
1. Content is saved to localStorage (for immediate updates)
2. A request is sent to the Netlify function `/.netlify/functions/update-content`
3. The function commits the changes to GitHub
4. Netlify detects the commit and automatically rebuilds/redeploys the site
5. Your changes are now live!

## Important Notes

- Auto-sync only works in production (not in local development)
- Make sure your GitHub token has the correct permissions
- IndexedDB images are stored locally and won't sync to GitHub (use external URLs for production)
- The first deployment may take a few minutes

## Troubleshooting

### Changes not syncing to GitHub
- Check that the GITHUB_TOKEN environment variable is set correctly
- Verify the token has `repo` scope
- Check Netlify function logs for errors

### Build failures
- Check that all dependencies are installed
- Verify the build command and publish directory are correct
- Check Netlify build logs for specific errors

### Site not updating after GitHub push
- Netlify should auto-deploy on push
- Check Deploy settings → Build hooks
- Manually trigger a deploy if needed
