#!/bin/bash

# Qema Platform Deployment Script

echo "🚀 Starting Qema Platform Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Ask user which platform to deploy to
echo ""
echo "🌐 Choose deployment platform:"
echo "1) Vercel"
echo "2) Netlify"
echo "3) Manual (just build)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "❌ Vercel CLI not found. Install with: npm i -g vercel"
            exit 1
        fi
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod
        else
            echo "❌ Netlify CLI not found. Install with: npm i -g netlify-cli"
            exit 1
        fi
        ;;
    3)
        echo "📁 Manual deployment selected."
        echo "Upload the 'dist' folder contents to your web server."
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Post-deployment checklist:"
echo "- ✅ Update Supabase Site URL to your production domain"
echo "- ✅ Configure environment variables on your hosting platform"
echo "- ✅ Test admin access: https://your-domain.com/admin-login.html"
echo "- ✅ Verify all functionality works in production"
echo ""
echo "🔗 Admin Access URLs:"
echo "- Direct: https://your-domain.com/admin-login.html"
echo "- Parameter: https://your-domain.com/?admin=true#/login"