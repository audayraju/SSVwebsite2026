# Hostinger deployment

## 1) Static/shared hosting (frontend only)

Use this when you host only the React app on Hostinger.

- Run `npm install` and `npm run build` in `ssv-react`
- Upload the `dist/` contents to `public_html/`
- `public/.htaccess` is already present for React Router SPA rewrites

If your API is hosted on another domain/subdomain:

- Copy `.env.production.example` to `.env.production`
- Set `VITE_API_BASE_URL=https://api.yourdomain.com`
- Rebuild and upload `dist/`

## 2) VPS hosting (frontend + backend)

Use Hostinger VPS when you want to run both frontend and Node API on Hostinger.

- Frontend: build React and serve `dist/` via Nginx/Apache
- Backend: run `api/server.js` with Node and keep it alive using PM2
- Required backend env vars: `PORT`, `CLIENT_ORIGIN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `TOKEN_SECRET`

Suggested URL split:

- `https://yourdomain.com` -> React frontend
- `https://yourdomain.com/api/*` -> Node backend (reverse proxy)

## Notes for this repo

- Frontend API and upload URLs now support `VITE_API_BASE_URL`
- If `VITE_API_BASE_URL` is empty, existing same-origin `/api/...` behavior is unchanged
- Admin login/product CRUD still require the Express backend in `api/server.js`

## Image storage behavior

- Uploaded images are saved as files in `ssv-react/api/uploads/`
- Product metadata is saved in `ssv-react/api/data/products.json`
- The product `image` field stores the uploaded filename
- Backend serves images from `/uploads/<filename>` via Express static middleware
