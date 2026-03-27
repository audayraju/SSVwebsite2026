<div align="center">
  <img src="./ssv-react/public/slides/pictures/logo-removebg-preview.png" alt="SSV Jewellers Logo" width="120" />
  <h1>SSV Jewellers – Modern Web Application</h1>
  <p>A luxurious, responsive, full-stack web application built for a premium jewellery brand.</p>
</div>

---

## 📖 Project Overview

**SSV Jewellers** is a modern e-commerce and catalog web application designed to showcase premium Gold, Silver, and Diamond jewellery collections. Built using a robust **MERN Stack** (MongoDB, Express, React, Node.js) paired with **Vite** for blazing-fast frontend tooling, the application features an ultra-responsive, dynamic interface with "glassmorphism" design paradigms.

## ✨ Key Features

- **Fluid Auto-Scaling Layouts:** Employs advanced CSS Grid (`auto-fit`/`minmax`) and CSS `clamp()` functions to ensure immaculate responsive design from small mobile devices all the way up to 4K ultra-wide desktop monitors without hardcoded breakpoints.
- **Premium UI & Animations:** Utilizes **Framer Motion** for smooth scroll animations, staggered product reveals, and elegant page transitions. Features a modern glassmorphism design system for components and modals.
- **Full-Stack Architecture:** Backed by an **Express.js** and **MongoDB** API for product management, with **Cloudinary** integration via **Multer** for seamless, optimized image uploading and hosting.
- **SEO Optimized:** Implements `react-helmet-async` for dynamic meta tags and titles, ensuring distinct, indexable pages across product categories.
- **Performant Frontend:** Bundled locally via Vite, capitalizing on React's lazy-loading (`Suspense`) to deliver lightning-fast initial load times and smooth routing.

## 🛠️ Technology Stack

### Frontend
- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [React Router DOM](https://reactrouter.com/) (Routing)
- Vanilla CSS Modules (Scoped, precise styling)

### Backend
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & Mongoose (Database & ORM)
- [Cloudinary](https://cloudinary.com/) (Image CDN)
- [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) (Authentication security)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) installed. You will also need a MongoDB URI and a Cloudinary account if you wish to run the backend features.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/SSVwebsite2026.git
   cd SSVwebsite2026/ssv-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the appropriate directory to store your `MONGO_URI`, `CLOUDINARY_URL`, and other necessary secrets.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## 📂 Project Structure

```text
📦 SSVwebsite2026
 ┣ 📂 api/                # Express backend, routes, database models & controllers
 ┣ 📂 ssv-react/          # React frontend application
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 components/     # Reusable UI elements (Navbar, Cards, Modals, Loaders)
 ┃ ┃ ┣ 📂 pages/          # Primary route views (Home, Products, About, etc.)
 ┃ ┃ ┣ 📂 context/        # React context providers (e.g., Favorites)
 ┃ ┃ ┣ 📜 index.css       # Global design variables (fonts, colors, scaling variables)
 ┃ ┃ ┗ 📜 App.jsx         # App routing and layout structure
 ┗ 📜 README.md           # This file
```

## 🌐 Live Deployment
Deployment scripts are included (`deploy-hostinger.ps1`) for generating the production build (`npm run build`) and packaging it easily for cPanel or Hostinger file managers.

*(Add your live URL here once deployed, e.g., `https://ssvjewellers.com`)*