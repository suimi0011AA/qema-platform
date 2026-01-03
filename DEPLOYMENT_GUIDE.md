# 🚀 Deployment Guide - Qema Platform

## Overview
This guide covers deploying your Qema Platform to production with proper configuration for public hosting.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
**Best for**: Static hosting with serverless functions

### Option 2: Netlify
**Best for**: Static hosting with form handling

### Option 3: Traditional VPS/Server
**Best for**: Full control and custom configurations

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- ✅ Supabase URL configured
- ✅ Supabase Anon Key configured
- ✅ Production domain set in Supabase

### 2. Supabase Configuration
- ✅ Database tables created
- ✅ Row Level Security (RLS) policies set
- ✅ Authentication providers configured
- ✅ Site URL updated for production

### 3. Build Configuration
- ✅ Vite build configuration
- ✅ Static assets optimization
- ✅ Environment variables for production

---

## 🔧 Configuration Files

### 1. Production Environment Variables
Create `.env.production`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_URL=https://your-domain.com
```

### 2. Vite Configuration
Update `vite.config.js` for production:
```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
```

---

## 🌐 Vercel Deployment

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### 3. Vercel Configuration
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## 🌊 Netlify Deployment

### 1. Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 2. Netlify Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🔒 Supabase Production Setup

### 1. Update Site URL
In Supabase Dashboard → Authentication → Settings:
```
Site URL: https://your-domain.com
Additional redirect URLs: 
- https://your-domain.com/admin-login.html
- https://your-domain.com/?admin=true
```

### 2. Update CORS Settings
In Supabase Dashboard → Settings → API:
```
CORS origins: https://your-domain.com
```

### 3. Environment Variables
Update your production environment variables in your hosting platform.

---

## 📁 File Structure for Production

```
dist/
├── index.html
├── admin-login.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

---

## 🔐 Admin Access in Production

### Method 1: Direct URL
```
https://your-domain.com/admin-login.html
```

### Method 2: Query Parameter
```
https://your-domain.com/?admin=true#/login
```

### Method 3: Subdomain (Advanced)
```
https://admin.your-domain.com
```

---

## 🛡️ Security Considerations

### 1. Environment Variables
- Never commit `.env` files to git
- Use platform-specific environment variable settings
- Rotate keys regularly

### 2. Supabase Security
- Enable RLS on all tables
- Review and test all policies
- Use service role key only on server-side (if needed)

### 3. HTTPS
- Always use HTTPS in production
- Update all URLs to use HTTPS
- Configure proper SSL certificates

---

## 📊 Performance Optimization

### 1. Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize images
# Use WebP format for images
# Implement lazy loading
```

### 2. Caching Strategy
```javascript
// In vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})
```

---

## 🔍 Monitoring & Analytics

### 1. Error Tracking
Consider adding:
- Sentry for error tracking
- Google Analytics for usage analytics
- Supabase Analytics for database insights

### 2. Performance Monitoring
- Lighthouse CI for performance monitoring
- Web Vitals tracking
- Uptime monitoring

---

## 🚨 Troubleshooting

### Common Issues:

1. **404 on Refresh**
   - Solution: Configure SPA redirects (see platform configs above)

2. **Environment Variables Not Loading**
   - Solution: Ensure variables start with `VITE_`
   - Check platform-specific environment variable settings

3. **Supabase Connection Issues**
   - Solution: Verify CORS settings and Site URL in Supabase
   - Check network tab for specific error messages

4. **Admin Access Not Working**
   - Solution: Verify router configuration for admin detection
   - Check URL parameters and hash routing

---

## 📝 Deployment Checklist

- [ ] Build project successfully (`npm run build`)
- [ ] Test built files locally (`npm run preview`)
- [ ] Configure environment variables on hosting platform
- [ ] Update Supabase Site URL and CORS
- [ ] Deploy to hosting platform
- [ ] Test admin access with production URL
- [ ] Verify all functionality works
- [ ] Set up monitoring and analytics
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate
- [ ] Test performance and optimize if needed

---

## 🎯 Next Steps

1. Choose your hosting platform
2. Follow the specific deployment guide above
3. Configure your domain and SSL
4. Set up monitoring and analytics
5. Plan for regular updates and maintenance

Your Qema Platform is now ready for production! 🚀