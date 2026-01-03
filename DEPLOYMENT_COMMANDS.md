# 🚀 Quick Deployment Commands

## Step 1: Push to GitHub

Run these commands in your terminal:

```bash
# Add all files
git add .

# Commit with message
git commit -m "Production ready: Complete Qema Platform with logo integration

✅ Full event management system
✅ Admin-only access controls
✅ Qimmah logo integration (10 pages)
✅ Brand color system implementation
✅ Production deployment configurations
✅ AWS Amplify optimization
✅ Comprehensive documentation"

# Push to GitHub
git push origin main
```

## Step 2: Deploy on AWS Amplify

### Quick Setup:
1. **Go to**: https://console.aws.amazon.com/amplify/
2. **Click**: "Get Started" under Amplify Hosting
3. **Select**: GitHub as your Git provider
4. **Choose**: Your repository and main branch
5. **Build Settings**: Use the auto-detected settings or paste:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Environment Variables:
Add these in Amplify Console → Environment Variables:

```
VITE_SUPABASE_URL=https://yzgyiygzpyzvoyaieohh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Z3lpeWd6cHl6dm95YWllb2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTIzNTksImV4cCI6MjA4MTgyODM1OX0.5r3KZXp3hPtFpHwVd0p1NLcrhL9jtDhG8dlT1LuUaNk
```

## Step 3: Verify Deployment

After deployment completes:
- ✅ Test your live URL
- ✅ Verify admin login works
- ✅ Check all pages load correctly
- ✅ Confirm logo appears on all pages

**Your platform will be live in 5-10 minutes! 🎉**