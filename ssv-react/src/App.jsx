import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingButtons from './components/FloatingButtons'
import PageLoader from './components/PageLoader'
import { FavoritesProvider } from './context/FavoritesContext'

/* ── Lazy-loaded pages ── */
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Services = lazy(() => import('./pages/Services'))
const Policies = lazy(() => import('./pages/Policies'))
const Launch = lazy(() => import('./pages/Launch'))

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <FavoritesProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Public routes with shared layout ── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/launch" element={<Launch />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/policies" element={<Policies />} />
              </Route>

              {/* ── Fallback ── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </FavoritesProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

/* Shared layout wrapper (Outlet lives inside each page) */

function PublicLayout() {
  const { pathname } = useLocation()
  const hideFloatingButtons = pathname === '/contact'

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!hideFloatingButtons && <FloatingButtons />}
      <Footer />
    </>
  )
}
