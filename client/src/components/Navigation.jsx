/**
 * Editorial Navigation Component
 * Award-winning, sharp-edged design with GSAP animations
 * Features: Magnetic hover, text reveal, hamburger menu transformation
 */

import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useScrollDirection } from "../context/LenisContext";

// Check for reduced motion preference
const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const Navigation = ({ user, logout, isPreloaderFinished }) => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const menuRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { direction, isScrolled } = useScrollDirection();
  const location = useLocation();
  const prevLocation = useRef(location.pathname);

  // Initial navigation animation on mount
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !isPreloaderFinished) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 }); // Minimal delay after preloader clears

      // Animate logo
      tl.fromTo(
        logoRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Animate nav links
      tl.fromTo(
        linksRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
        "-=0.4"
      );
    }, navRef);

    return () => ctx.revert();
  }, [isPreloaderFinished]);

  // Sticky Nav Logic (Simplified - No Hiding)
  useEffect(() => {
    if (!navRef.current) return;

    // Always transparent throughout
    gsap.to(navRef.current, {
      y: 0,
      backgroundColor: "transparent",
      backdropFilter: "none",
      borderBottom: "none",
      duration: 0.3,
      ease: "power2.out"
    });
  }, [isScrolled]);

  // Menu open/close animation
  useLayoutEffect(() => {
    if (!menuOverlayRef.current) return;

    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        // Open menu
        gsap.set(menuOverlayRef.current, { display: "flex" });

        const tl = gsap.timeline();

        tl.fromTo(
          menuOverlayRef.current,
          { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 0.8,
            ease: "power4.inOut",
          }
        );

        tl.fromTo(
          menuItemsRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
          "-=0.3"
        );
      } else {
        // Close menu
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(menuOverlayRef.current, { display: "none" });
          },
        });

        tl.to(menuItemsRef.current, {
          y: -40,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.in",
        });

        tl.to(
          menuOverlayRef.current,
          {
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            duration: 0.6,
            ease: "power4.inOut",
          },
          "-=0.1"
        );
      }
    });

    return () => ctx.revert();
  }, [isMenuOpen]);

  // Close menu on route change - using callback to handle state update safely
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      prevLocation.current = location.pathname;
      // Schedule the state update outside the effect
      if (isMenuOpen) {
        requestAnimationFrame(closeMenu);
      }
    }
  }, [location.pathname, isMenuOpen, closeMenu]);

  // Magnetic link effect
  const handleLinkMouseMove = (e, index) => {
    if (prefersReducedMotion()) return;

    const link = linksRef.current[index];
    if (!link) return;

    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(link, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLinkMouseLeave = (index) => {
    if (prefersReducedMotion()) return;

    gsap.to(linksRef.current[index], {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  // Navigation links configuration
  const filteredLinks = [];

  return (
    <>
      <nav
        ref={navRef}
        className={`nav ${isScrolled ? "nav--scrolled" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "transparent",
          backdropFilter: "none",
          borderBottom: "none",
          transition: "background-color 0.3s, backdrop-filter 0.3s",
          visibility: isPreloaderFinished ? "visible" : "hidden",
        }}
      >
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          padding: "1.5rem var(--space-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          {/* Logo */}
          <Link
            to="/"
            ref={logoRef}
            className="nav__logo"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                fontFamily: 'var(--font-display)',
                textTransform: "uppercase",
              }}
            >
              MALL
              <span style={{ fontWeight: 300 }}>_PROTO</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div
            className="nav__links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {filteredLinks.map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                ref={(el) => (linksRef.current[index] = el)}
                onMouseMove={(e) => handleLinkMouseMove(e, index)}
                onMouseLeave={() => handleLinkMouseLeave(index)}
                className="nav__link"
                style={{
                  textDecoration: "none",
                  color: "var(--fg)",
                  padding: "1rem 1.75rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "0",
                }}
              >
                {/* Rectangular Hover Bubble - No Shadow */}
                <span
                  className="nav__link-bubble"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "var(--fg)",
                    transform: "translateY(100%)", // Start from bottom
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)", // Expert-like snappy easing
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />
                <span
                  className="nav__link-text"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    transition: "color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {link.label}
                </span>
              </Link>
            ))}

            {/* Removed Auth Links */}

            {/* Mobile Menu Button */}
            <button
              ref={menuRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav__menu-btn"
              aria-label="Toggle menu"
              style={{
                display: "none",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "48px",
                height: "48px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                gap: "6px",
                marginLeft: "1rem",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "var(--fg)",
                  transition: "transform 0.3s, opacity 0.3s",
                  transform: isMenuOpen
                    ? "rotate(45deg) translateY(4px)"
                    : "none",
                }}
              />
              <span
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "var(--fg)",
                  transition: "transform 0.3s, opacity 0.3s",
                  opacity: isMenuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "var(--fg)",
                  transition: "transform 0.3s, opacity 0.3s",
                  transform: isMenuOpen
                    ? "rotate(-45deg) translateY(-4px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu Overlay */}
      <div
        ref={menuOverlayRef}
        className="nav__overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "var(--bg)",
          zIndex: 999,
          display: "none",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {/* Mobile menu items removed */}
      </div>

      <style>{`
        /* Nav Link Hover Effects */
        .nav__link:hover .nav__link-bubble {
          transform: translateY(0) !important;
        }

        .nav__link:hover .nav__link-text,
        .nav__link:hover > span:last-child {
          color: var(--bg) !important;
        }

        /* Logic for Register (Inverted) */
        /* Logic for Register */
        .nav__link--register:hover .nav__link-bubble {
          transform: translateY(0) !important;
        }
        
        .nav__link--register:hover > span:last-child {
          color: var(--bg) !important;
        }

        @media (max-width: 968px) {
          .nav__links > a,
          .nav__links > div:not(:last-child) {
            display: none !important;
          }
          .nav__menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;
