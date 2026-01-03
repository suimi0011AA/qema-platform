# 🚀 Production Deployment Checklist

## Pre-Deployment

### 🔧 Configuration
- [ ] Update `.env.production` with your production Supabase credentials
- [ ] Verify `vite.config.js` is configured for production
- [ ] Test build locally: `npm run build && npm run preview`

### 🗄️ Database Setup
- [ ] Run database migration in Supabase (copy from `setup-database.sql`)
- [ ] Verify all tables are created
- [ ] Test RLS policies are working
- [ ] Create at least one admin user for testing

### 🔐 Supabase Configuration
- [ ] Update Site URL in Supabase Dashboard → Authentication → Settings
- [ ] Add production domain to redirect URLs
- [ ] Configure CORS settings for production domain
- [ ] Test authentication flow

## Deployment

### 🌐 Platform Setup
Choose one:

#### Vercel
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Run: `./deploy.sh` and select option 1
- [ ] Configure environment variables in Vercel dashboard

#### Netlify
- [ ] Install Netlify CLI: `npm i -g netlify-cli`
- [ ] Run: `./deploy.sh` and select option 2
- [ ] Configure environment variables in Netlify dashboard

#### Manual/VPS
- [ ] Run: `npm run build`
- [ ] Upload `dist/` folder contents to your web server
- [ ] Configure web server for SPA routing

## Post-Deployment

### ✅ Testing
- [ ] Visit your production URL
- [ ] Test public event browsing
- [ ] Test admin access: `https://your-domain.com/admin-login.html`
- [ ] Test admin login/registration
- [ ] Test event creation, editing, and deletion
- [ ] Test all navigation and routing
- [ ] Verify responsive design on mobile

### 🔒 Security
- [ ] Verify HTTPS is working
- [ ] Test that admin routes are protected
- [ ] Verify environment variables are not exposed
- [ ] Check browser console for any errors

### 📊 Performance
- [ ] Run Lighthouse audit
- [ ] Check page load speeds
- [ ] Verify images and assets are optimized
- [ ] Test on different devices and browsers

## Admin Access Methods

### Method 1: Admin Portal (Recommended)
```
https://your-domain.com/admin-login.html
```

### Method 2: URL Parameter
```
https://your-domain.com/?admin=true#/login
```

### Method 3: Direct Login (if already have account)
```
https://your-domain.com/?admin=true#/login
```

## Environment Variables

### Required for Production
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_URL=https://your-domain.com
```

## Supabase Settings

### Authentication → Settings
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: 
  - `https://your-domain.com/admin-login.html`
  - `https://your-domain.com/?admin=true`

### API Settings
- **CORS Origins**: `https://your-domain.com`

## Troubleshooting

### Common Issues

1. **404 on Page Refresh**
   - ✅ Ensure SPA redirects are configured (vercel.json/netlify.toml)

2. **Admin Login Not Working**
   - ✅ Check Supabase Site URL configuration
   - ✅ Verify environment variables are set correctly
   - ✅ Test with `?admin=true` parameter

3. **Database Connection Issues**
   - ✅ Verify Supabase URL and key are correct
   - ✅ Check CORS settings in Supabase
   - ✅ Ensure database tables exist

4. **Build Errors**
   - ✅ Run `npm install` to ensure all dependencies
   - ✅ Check for TypeScript/JavaScript errors
   - ✅ Verify all imports are correct

## Monitoring

### Set Up (Optional)
- [ ] Google Analytics for usage tracking
- [ ] Sentry for error monitoring
- [ ] Uptime monitoring service
- [ ] Performance monitoring

## Maintenance

### Regular Tasks
- [ ] Monitor Supabase usage and limits
- [ ] Update dependencies regularly
- [ ] Backup database regularly
- [ ] Review and rotate API keys
- [ ] Monitor performance metrics

---

## 🎉 Success!

Once all items are checked, your Qema Platform is live and ready for users!

**Public URL**: https://your-domain.com
**Admin Portal**: https://your-domain.com/admin-login.html

Remember to share the admin portal URL only with authorized administrators.