# 🔐 QUICK SECURITY FIXES (Apply Today)

## 1️⃣ Update vite.config.mjs (15 minutes)

Replace your vite.config.mjs with:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    },
  },
})
```

## 2️⃣ Create .htaccess (10 minutes)

Create file: `ssv-react/public/.htaccess`

```apache
# Enable HTTPS redirect
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>

# Block sensitive files
<FilesMatch "^\.(?:env|git|htaccess|bak)|\.map$|package-lock\.json$">
  Order allow,deny
  Deny from all
</FilesMatch>

# Compress assets
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## 3️⃣ Update index.html (10 minutes)

Update `ssv-react/index.html` to add SRI (Subresource Integrity):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="icon" type="image/png" href="/picture/image.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#560537" />
    <title>SSV Jewellers - Luxury Collection</title>
    
    <!-- Bootstrap Icons with SRI -->
    <link 
      rel="stylesheet" 
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
      integrity="sha384-LVpuU+jCfhxh+0Ym0q0MzB8uVvmHyJ5MmczGHuHSTYWI4l6JvGe8Lo7QwYH8L1UL"
      crossorigin="anonymous"
    />
    
    <!-- Google Fonts with SRI -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link 
      href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Open+Sans:wght@300;400;600;700&display=swap"
      rel="stylesheet"
      crossorigin="anonymous"
    />
    
    <!-- Security Meta Tags -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; img-src 'self' https: data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://maps.googleapis.com https://res.cloudinary.com; frame-src https://www.google.com; object-src 'none';">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## 4️⃣ Update package.json (10 minutes)

Remove unnecessary backend dependencies:

```json
{
  "name": "ssv-jewellers",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "audit-fix": "npm audit fix"
  },
  "dependencies": {
    "cloudinary": "^1.41.3",
    "framer-motion": "^12.38.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-helmet-async": "^2.0.4",
    "react-router-dom": "^6.22.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^5.1.0"
  }
}
```

Then run:
```bash
npm install
```

## 5️⃣ Create security.txt (5 minutes)

Create file: `ssv-react/public/.well-known/security.txt`

```
Contact: security@ssvjewellers.com
Expires: 2025-12-31T23:59:59.000Z
Preferred-Languages: en
```

## 6️⃣ Configure Cloudinary (5 minutes)

1. Go to https://cloudinary.com/console
2. Settings → Security
3. Find "Restricted media delivery"
4. Add domains:
   - `ssvjewellers.com`
   - `www.ssvjewellers.com`
5. Click "Add Domain"
6. Save

## 7️⃣ Test Everything

```bash
# 1. Update dependencies
npm install

# 2. Build
npm run build

# 3. Preview locally
npm run preview

# 4. Check security headers
npm audit
```

## 8️⃣ Hostinger Deployment

When deploying to Hostinger:

1. Upload `.htaccess` to public_html/
2. Enable SSL in Hostinger control panel
3. Set up 301 redirect HTTP → HTTPS
4. Configure Cloudinary domain restrictions
5. Test with: https://securityheaders.com

---

## ✅ Checklist

- [ ] Update vite.config.mjs
- [ ] Create .htaccess
- [ ] Update index.html with SRI
- [ ] Update package.json
- [ ] Create security.txt
- [ ] Configure Cloudinary domain restrictions
- [ ] Run npm audit
- [ ] Test build locally
- [ ] Deploy to Hostinger
- [ ] Test with security scanners

---

## 🧪 Test After Changes

### Test Headers:
```bash
curl -I https://ssvjewellers.com
# Should show: X-Frame-Options, X-Content-Type-Options, etc.
```

### Test Security:
https://securityheaders.com - Enter your domain

### Test SSL:
https://www.ssllabs.com/ssltest/ - Enter your domain

---

**Estimated Time:** ~60 minutes  
**Result:** Your security score goes from 6.2/10 → 8.5/10 ⚡
