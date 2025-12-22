/**
 * Main Application Component
 * Integrates GSAP animations, Lenis smooth scroll, and page transitions
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Context Providers
import { LenisProvider } from "./context/LenisContext";

// Components
import Navigation from "./components/Navigation";
import PageTransition, { Preloader } from "./components/PageTransition";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import VendorDashboard from "./components/VendorDashboard";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";
import OrderHistory from "./components/OrderHistory";

// Styles
import "./App.css";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Main content wrapper with page transitions
 */
const AppContent = ({ user, setUser, logout }) => {
  const location = useLocation();
  const mainRef = useRef(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);

    // Refresh ScrollTrigger on route change
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
      <Navigation user={user} logout={logout} />
      <main ref={mainRef} style={{ flex: 1, paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ProductCatalog user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path="/orders" element={<OrderHistory user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/vendor" element={<VendorDashboard user={user} />} />
        </Routes>
      </main>
    </>
  );
};

/**
 * Root App Component
 */
function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <LenisProvider>
        {/* Preloader */}
        <Preloader
          isLoading={isLoading}
          onComplete={() => setIsLoading(false)}
        />

        {/* Main App */}
        {!isLoading && (
          <div className="app">
            <AppContent user={user} setUser={setUser} logout={logout} />
          </div>
        )}
      </LenisProvider>
    </Router>
  );
}

export default App;
