# SSV Jewellers — React Website

A full React.js + Vite front-end with a separate Node.js/Express API back-end for the SSV Jewellers website.

---

## Project structure

```
ssv-react/
├── api/                   # Node.js Express REST API
│   ├── server.js
│   ├── package.json
│   ├── .env.example       # Copy to .env and fill in your values
│   ├── data/              # Auto-created — products.json flat-file database
│   └── uploads/           # Auto-created — uploaded product images
│
├── public/
│   ├── .htaccess          # Apache SPA rewrite rules (Hostinger)
│   ├── robots.txt
│   └── sitemap.xml
│
└── src/
    ├── admin/             # Admin-only pages (require login)
    │   ├── AdminLogin.jsx
    │   ├── AdminDashboard.jsx
    │   ├── UploadProduct.jsx
    │   ├── ProductList.jsx
    │   └── Admin.module.css
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── FloatingButtons.jsx
    │   ├── PageLoader.jsx
    │   ├── ProductCard.jsx / .module.css
    │   ├── ImageGallery.jsx / .module.css
    │   └── ProductModal.jsx / .module.css
    ├── pages/
    │   ├── Home.jsx / .module.css
    │   ├── Products.jsx / .module.css
    │   ├── ProductDetails.jsx / .module.css
    │   ├── About.jsx / .module.css
    │   ├── Contact.jsx / .module.css
    │   ├── Services.jsx / .module.css
    │   └── Policies.jsx / .module.css
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

---

## Local development

### 1. Front-end

```bash
cd ssv-react
npm install
npm run dev          # http://localhost:5173
```

### 2. Back-end API

```bash
cd ssv-react/api
npm install

# Copy the example env file and edit it
copy .env.example .env
# (on Mac/Linux: cp .env.example .env)

npm run dev          # http://localhost:3001
```

The Vite dev-server proxies all `/api` requests to `http://localhost:3001`, so the front-end and back-end work together seamlessly without any CORS issues during development.

---

## Admin panel

1. With both servers running, open `http://localhost:5173/admin`
2. Log in with the credentials set in `api/.env` (default: `ssvadmin` / `SSV@Admin2025`)
3. **Change these credentials before going live!**

---

## Production build

```bash
cd ssv-react
npm run build        # output → dist/
```

### Deploy to Hostinger (shared hosting)

1. Run `npm run build` to generate the `dist/` folder.
2. Upload everything inside `dist/` to your Hostinger **public_html** directory.
   - The `.htaccess` file (copied from `public/.htaccess`) handles SPA routing — make sure it is uploaded too.
3. For the API, you need a Node.js hosting plan or run it on a separate VPS. Update the `vite.config.js` proxy target to your live API URL before building.

### Update front-end API URL for production

In `vite.config.js`, the proxy points to `http://localhost:3001` for development. For production, update `src/` code to use your live API base URL (e.g. `https://api.ssvjewellers.com`) or configure it via an environment variable:

```js
// src/api.js  (create this helper)
const BASE = import.meta.env.VITE_API_URL ?? ''
```

Then set `VITE_API_URL=https://api.ssvjewellers.com` in a `.env.production` file.

---

## Tech stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Front-end  | React 18, Vite 5, React Router 6 |
| Styling    | CSS Modules + global CSS      |
| SEO        | React Helmet Async            |
| HTTP       | Axios                         |
| Back-end   | Node.js 18+, Express 4        |
| File upload| Multer                        |
| Auth       | HMAC token (no JWT lib needed) |
| Database   | JSON flat-file (no DB setup)  |

---

## Customisation

| Thing to change | File |
|-----------------|------|
| Brand colours   | `src/index.css` → `--gold`, `--navbar-bg`, `--footer-bg` |
| WhatsApp number | `src/components/Footer.jsx`, `src/components/FloatingButtons.jsx` |
| Phone number    | `src/components/Footer.jsx`, `src/components/FloatingButtons.jsx` |
| Google Maps embed | `src/pages/Contact.jsx` |
| Slide images    | `src/pages/Home.jsx` + add images to `public/slides/pictures/` |
| Admin password  | `api/.env` |
| Live domain     | `public/sitemap.xml`, `public/robots.txt` |
