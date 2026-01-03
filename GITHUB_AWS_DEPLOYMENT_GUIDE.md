# GitHub & AWS Amplify Deployment Guide

## 🚀 Complete Deployment Instructions for Qema Platform

This guide will walk you through pushing your Qema Platform to GitHub and deploying it on AWS Amplify for production use.

---

## Part 1: Push to GitHub

### Step 1: Prepare Your Repository

First, let's add all your changes and commit them:

```bash
# Add all files to git
git add .

# Commit with a descriptive message
git commit -m "Complete Qema Platform with logo integration and brand system

- Implemented full event management system
- Added admin-only access controls  
- Integrated Qimmah logo across all 10 pages
- Enhanced UI with comprehensive brand colors
- Added production deployment configurations
- Created comprehensive documentation"

# Push to GitHub
git push origin main
```

### Step 2: Verify GitHub Repository

1. Go to your GitHub repository in the browser
2. Verify all files have been uploaded
3. Check that the latest commit shows your changes
4. Ensure the repository is public (required for AWS Amplify free tier)

---

## Part 2: AWS Amplify Deployment

### Step 1: Access AWS Amplify

1. **Login to AWS Console**: https://console.aws.amazon.com/
2. **Navigate to AWS Amplify**: Search for "Amplify" in the services
3. **Click "Get Started"** under "Amplify Hosting"

### Step 2: Connect Your Repository

1. **Choose Git Provider**: Select "GitHub"
2. **Authorize AWS Amplify**: Grant permissions to access your repositories
3. **Select Repository**: Choose your Qema Platform repository
4. **Select Branch**: Choose "main" branch
5. **Click "Next"**

### Step 3: Configure Build Settings

AWS Amplify should auto-detect your Vite configuration. Use these build settings:

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

**Important Configuration:**
- **Build Command**: `npm run build`
- **Base Directory**: Leave empty
- **Build Output Directory**: `dist`

### Step 4: Environment Variables

Add your Supabase environment variables in AWS Amplify:

1. **In Amplify Console**: Go to "Environment Variables" section
2. **Add Variables**:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

**To find your Supabase credentials:**
1. Go to your Supabase project dashboard
2. Go to Settings → API
3. Copy the Project URL and anon/public key

### Step 5: Deploy

1. **Review Settings**: Verify all configurations are correct
2. **Click "Save and Deploy"**
3. **Wait for Build**: First deployment takes 5-10 minutes
4. **Get Your URL**: AWS will provide a live URL like `https://main.d1234567890.amplifyapp.com`

---

## Part 3: Custom Domain Setup (Optional)

### Step 1: Add Custom Domain

1. **In Amplify Console**: Go to "Domain Management"
2. **Add Domain**: Enter your custom domain (e.g., qema.com)
3. **Configure DNS**: Follow AWS instructions to update your DNS records
4. **SSL Certificate**: AWS automatically provides SSL certificate

### Step 2: DNS Configuration

If you own a domain, add these DNS records:
- **Type**: CNAME
- **Name**: www (or your subdomain)
- **Value**: Your Amplify domain

---

## Part 4: Production Environment Setup

### Step 1: Environment-Specific Configuration

Create environment-specific configurations:

```javascript
// src/config/environment.js
const config = {
  development: {
    supabaseUrl: 'your-dev-supabase-url',
    supabaseKey: 'your-dev-supabase-key'
  },
  production: {
    supabaseUrl: 'your-prod-supabase-url', 
    supabaseKey: 'your-prod-supabase-key'
  }
};

export default config[import.meta.env.MODE] || config.development;
```

### Step 2: Production Database Setup

1. **Supabase Production Project**: Create a separate Supabase project for production
2. **Run Database Setup**: Execute your `setup-database.sql` in production
3. **Update Environment Variables**: Use production Supabase credentials in Amplify

---

## Part 5: Monitoring & Maintenance

### Step 1: Set Up Monitoring

1. **AWS CloudWatch**: Automatically monitors your application
2. **Amplify Analytics**: Track user behavior and performance
3. **Error Tracking**: Monitor application errors and issues

### Step 2: Automatic Deployments

AWS Amplify automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push origin main

# AWS Amplify automatically detects and deploys changes
```

### Step 3: Branch-Based Deployments

Set up staging environment:

1. **Create staging branch**: `git checkout -b staging`
2. **In Amplify**: Connect staging branch for testing
3. **Production workflow**: Test on staging → merge to main → auto-deploy

---

## Part 6: Performance Optimization

### Step 1: Build Optimization

Your `vite.config.js` is already optimized with:
- Asset optimization
- Code splitting
- Compression
- Cache headers

### Step 2: CDN Configuration

AWS Amplify automatically provides:
- Global CDN distribution
- Image optimization
- Gzip compression
- Browser caching

---

## Part 7: Security Configuration

### Step 1: HTTPS Enforcement

AWS Amplify automatically:
- Provides SSL certificates
- Enforces HTTPS redirects
- Handles security headers

### Step 2: Access Controls

Configure access controls in Amplify:
1. **Password Protection**: For staging environments
2. **IP Restrictions**: If needed for admin access
3. **Custom Headers**: Security headers configuration

---

## Part 8: Backup & Recovery

### Step 1: Code Backup

Your code is backed up in:
- GitHub repository (primary)
- AWS Amplify build artifacts
- Local development environment

### Step 2: Database Backup

Set up Supabase backups:
1. **Automatic Backups**: Enabled by default in Supabase
2. **Manual Backups**: Export data regularly
3. **Point-in-time Recovery**: Available in Supabase Pro

---

## Quick Deployment Checklist

### ✅ Pre-Deployment
- [ ] All code committed to GitHub
- [ ] Environment variables documented
- [ ] Database schema ready
- [ ] Build process tested locally

### ✅ AWS Amplify Setup
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] First deployment successful

### ✅ Post-Deployment
- [ ] Application loads correctly
- [ ] All pages accessible
- [ ] Admin login working
- [ ] Database connections active
- [ ] Logo and branding correct

### ✅ Production Ready
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Performance monitoring enabled
- [ ] Backup procedures in place

---

## Troubleshooting Common Issues

### Build Failures
```bash
# If build fails, check:
1. Node.js version compatibility
2. Environment variables set correctly
3. Dependencies installed properly
4. Build command matches package.json
```

### Environment Variables
```bash
# Verify variables are set:
1. Check Amplify console environment variables
2. Ensure VITE_ prefix for Vite variables
3. No trailing spaces in values
4. Correct Supabase URL format
```

### Database Connection Issues
```bash
# Check Supabase connection:
1. Verify URL and key are correct
2. Check Supabase project is active
3. Ensure database tables exist
4. Verify RLS policies are set
```

---

## Support & Resources

### AWS Amplify Documentation
- **Official Docs**: https://docs.amplify.aws/
- **Pricing**: https://aws.amazon.com/amplify/pricing/
- **Support**: AWS Support Center

### Supabase Resources
- **Documentation**: https://supabase.com/docs
- **Dashboard**: https://app.supabase.com/
- **Community**: https://github.com/supabase/supabase/discussions

### GitHub Resources
- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Repository Settings**: Manage access and settings

---

## Next Steps After Deployment

1. **Test Production Environment**: Verify all functionality works
2. **Set Up Analytics**: Monitor user behavior and performance
3. **Configure Alerts**: Set up notifications for issues
4. **Plan Updates**: Establish deployment workflow for updates
5. **User Onboarding**: Begin user acquisition and onboarding

**Your Qema Platform will be live and accessible worldwide! 🌍**