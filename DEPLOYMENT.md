# Deploying to Vercel

This guide will help you deploy your portfolio project to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [Supabase account](https://supabase.com) with your database set up
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

1. Ensure all changes are committed to your Git repository
2. Push your code to your remote repository (GitHub/GitLab/Bitbucket)

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will automatically detect it's a Next.js project

## Step 3: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

### Backend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | Your Supabase project URL (required in production) |
| `SUPABASE_KEY` | `your-supabase-anon-key` | Your Supabase anon/public key (required in production) |
| `CORS_ORIGINS` | `https://your-domain.com` | Optional: comma-separated list of allowed origins (custom domain) |

### Frontend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `/api` | API endpoint (relative path for production) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | Canonical site URL for metadata, Open Graph, sitemap (no trailing slash) |

**How to add environment variables:**
1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add each variable with its corresponding value
3. Select all environments (Production, Preview, Development)

**Where to find Supabase credentials:**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

## Step 4: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, Vercel will provide you with a URL (e.g., `https://your-project.vercel.app`)

## Step 5: Verify Deployment

After deployment, verify everything works:

1. **Frontend**: Visit your Vercel URL and check if the site loads
2. **API Health**: Visit `https://your-project.vercel.app/api` - should return `{"message": "Portfolio Backend is running"}`
3. **Database Connection**: Try logging in or fetching data to verify Supabase connection

## Local Development

To run the project locally:

### Frontend (Next.js)
```bash
npm install
npm run dev
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Note:** For local development, update `.env` to use `http://localhost:8000/api` for `NEXT_PUBLIC_API_URL`

## Troubleshooting

### Build Fails

**Issue**: Build fails with TypeScript errors
- **Solution**: Run `npm run build` locally to identify and fix errors before deploying

**Issue**: Python dependencies fail to install
- **Solution**: Check `backend/requirements.txt` for compatibility issues

### API Not Working

**Issue**: API returns 404 or CORS errors
- **Solution**: Verify environment variables are set correctly in Vercel
- **Solution**: Check that `vercel.json` rewrites are configured properly

**Issue**: Database connection fails
- **Solution**: Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- **Solution**: Check Supabase project is active and accessible

### Images Not Loading

**Issue**: Remote images fail to load
- **Solution**: Verify image domains are listed in `next.config.ts` under `remotePatterns`

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to your `main` branch
- **Preview**: Every push to other branches or pull requests

## Custom Domain (Optional)

To add a custom domain:
1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set in Vercel (Production + Preview)
- [ ] `NEXT_PUBLIC_SITE_URL` matches your live domain (for SEO and Open Graph)
- [ ] `CORS_ORIGINS` includes your custom domain if you use one
- [ ] Run `npm run build` locally to catch TypeScript/build errors
- [ ] Test API health at `https://your-domain.com/api` after deploy
- [ ] Verify `/robots.txt` and `/sitemap.xml` resolve correctly

## Security Notes

> **Important**: Never commit `.env` files with real credentials to Git. Always use environment variables in Vercel for sensitive data.

The following files are excluded from Git (via `.gitignore`):
- `.env`
- `.env.local`
- `.env.production`
- `backend/.env`

## Support

If you encounter issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Check [Supabase Documentation](https://supabase.com/docs)
