/**
 * Main Application Component
 * Integrates GSAP animations, Lenis smooth scroll, and page transitions
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Context Providers
import { LenisProvider } from "./context/LenisContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import Navigation from "./components/Navigation";
import BottomBlur from "./components/BottomBlur";
import PageTransition, { Preloader } from "./components/PageTransition";

// Pages
import LandingPage from "./components/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import VendorDashboard from "./pages/VendorDashboard";
import VendorProducts from "./pages/VendorProducts";
import VendorOrders from "./pages/VendorOrders";

// Styles
import "./App.css";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Protected Route Wrapper
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Vendor Route Wrapper
 */
const VendorRoute = ({ children }) => {
  const { isAuthenticated, isVendor, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isVendor) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Main content wrapper with page transitions
 */
const AppContent = ({ isPreloaderFinished }) => {
  const location = useLocation();
  const mainRef = useRef(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [location.pathname]);

  // Page enter animation
  useLayoutEffect(() => {
    if (!mainRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <>
      <Navigation isPreloaderFinished={isPreloaderFinished} />
      <main ref={mainRef} style={{ flex: 1, paddingTop: location.pathname === "/" ? "0" : "120px" }}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<LandingPage isPreloaderFinished={isPreloaderFinished} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Protected Routes (Any authenticated user) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Vendor Routes */}
          <Route
            path="/vendor/dashboard"
            element={
              <VendorRoute>
                <VendorDashboard />
              </VendorRoute>
            }
          />
          <Route
            path="/vendor/products"
            element={
              <VendorRoute>
                <VendorProducts />
              </VendorRoute>
            }
          />
          <Route
            path="/vendor/orders"
            element={
              <VendorRoute>
                <VendorOrders />
              </VendorRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomBlur />
    </>
  );
};

/**
 * Root App Component
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPreloaderFinished, setIsPreloaderFinished] = useState(false);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <LenisProvider>
          {/* Preloader */}
          <Preloader
            isLoading={isLoading}
            onComplete={() => setIsPreloaderFinished(true)}
          />

          {/* Main App */}
          <div className="app">
            <AppContent isPreloaderFinished={isPreloaderFinished} />
          </div>
        </LenisProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
