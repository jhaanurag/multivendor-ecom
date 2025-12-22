/**
 * Landing Page Component
 * "Awwwards" quality design with premium GSAP animations.
 * Features: High-contrast typography, shader background, fluid interactions.
 */

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StripeGradientBackground from "./StripeGradientBackground";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const containerRef = useRef(null);
  const heroTextRef = useRef([]);
  const scaleThriveRef = useRef(null);
  const marqueeRef = useRef(null);
  
  // Master GSAP Context
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // ===================================
      // 1. HERO TEXT REVEAL (Staggered Chars)
      // ===================================
      const heroTl = gsap.timeline({ delay: 0.5 });
      
      heroTextRef.current.forEach((el, i) => {
        if (!el) return;
        // Split text logic would go here, but for simplicity/performance in React 
        // without a library like SplitType, we animate the block or lines.
        // For "Unique Best Ever" feel, we simply slide them up with precision.
        
        gsap.fromTo(el, 
          { y: 150, opacity: 0, rotateX: -20 },
          { 
            y: 0, 
            opacity: 1, 
            rotateX: 0, 
            duration: 1.2, 
            ease: "power2.out", // Smooth elegant ease
            delay: i * 0.15 
          }
        );
      });

      // ===================================
      // 2. SCALE / THRIVE (Parallax Marquee)
      // ===================================
      // This fixes the "wrong alignment" by forcing a rigid structure 
      // controlled entirely by GSAP scroll scrubbing.
      
      const scaleTrack = scaleThriveRef.current.querySelector('.scale-track');
      const thriveTrack = scaleThriveRef.current.querySelector('.thrive-track');
      
      ScrollTrigger.create({
        trigger: scaleThriveRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          // Move Scale Left, Thrive Right
          gsap.set(scaleTrack, { xPercent: -20 + (self.progress * -30) }); // Moves left
          gsap.set(thriveTrack, { xPercent: -50 + (self.progress * 30) }); // Moves right
        }
      });

      // ===================================
      // 3. FEATURE CARDS (Magnetic & Fade)
      // ===================================
      const cards = gsap.utils.toArray('.feature-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Hover Effect for Buttons (Magnetic)
  const handleBtnHover = (e) => {
    const btn = e.currentTarget;
    const x = (e.clientX - btn.getBoundingClientRect().left - btn.clientWidth / 2) * 0.4;
    const y = (e.clientY - btn.getBoundingClientRect().top - btn.clientHeight / 2) * 0.4;
    gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
  };
  
  const handleBtnLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <div ref={containerRef} className="landing-page" style={{ overflow: "hidden" }}>
      
      {/* BACKGROUND: Premium Shader */}
      <StripeGradientBackground 
        intensity={0.4} 
        speed={0.15} 
        overlayOpacity={0.1} // Darker overlay for contrast
        blur={true} 
      />

      {/* ================= HERO SECTION ================= */}
      <section style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        padding: "0 var(--space-lg)",
        position: "relative"
      }}>
        
        {/* Brand Tag */}
        <div style={{ 
          position: "absolute", top: "8rem", left: "50%", transform: "translateX(-50%)",
          textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.75rem", fontWeight: 600, opacity: 0.6
        }}>
          Multi-Vendor Platform © 2025
        </div>

        <div className="hero-content" style={{ textAlign: "center", zIndex: 10 }}>
          {/* Main Headline - Broken into lines for animation */}
          <div style={{ overflow: "hidden", lineHeight: 0.9 }}>
            <h1 ref={el => heroTextRef.current[0] = el} style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: "clamp(4rem, 15vw, 12rem)", 
              letterSpacing: "-0.04em",
              color: "var(--fg)",
              margin: 0
            }}>
              COMMERCE
            </h1>
          </div>
          
          <div style={{ overflow: "hidden", lineHeight: 0.9 }}>
            <h1 ref={el => heroTextRef.current[1] = el} style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: "clamp(4rem, 15vw, 12rem)", 
              letterSpacing: "-0.04em",
              color: "var(--fg)",
              margin: 0,
              fontStyle: "italic" // Stylistic choice
            }}>
              REIMAGINED
            </h1>
          </div>

          {/* Subtext */}
          <div style={{ overflow: "hidden", marginTop: "2rem" }}>
             <p ref={el => heroTextRef.current[2] = el} style={{
               fontSize: "clamp(1rem, 2vw, 1.5rem)",
               maxWidth: "600px",
               margin: "0 auto",
               color: "var(--muted)",
               lineHeight: 1.6
             }}>
               The definitive platform for modern scaling. Empowering sellers, delighting customers, and redefining possibilities.
             </p>
          </div>

          {/* CTA Group */}
          <div ref={el => heroTextRef.current[3] = el} style={{ marginTop: "6rem", display: "flex", gap: "1.5rem", justifyContent: "center" }}>
            <Link to="/register" onMouseMove={handleBtnHover} onMouseLeave={handleBtnLeave} className="btn-primary" style={{
              padding: "1.2rem 3rem",
              backgroundColor: "var(--fg)",
              color: "var(--bg)",
              borderRadius: "50px",
              fontSize: "0.9rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              border: "1px solid var(--fg)"
            }}>
              Start Selling
            </Link>
            <Link to="/shop" onMouseMove={handleBtnHover} onMouseLeave={handleBtnLeave} className="btn-outline" style={{
              padding: "1.2rem 3rem",
              backgroundColor: "transparent",
              color: "var(--fg)",
              borderRadius: "50px",
              fontSize: "0.9rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              border: "1px solid var(--border)"
            }}>
              Explore Shop
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SCALE / THRIVE SECTION (FIXED) ================= */}
      {/* This section uses huge text moving in opposing directions for maximum impact */}
      <section ref={scaleThriveRef} style={{ 
        padding: "10rem 0", 
        background: "var(--bg)", 
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        position: "relative"
      }}>
        
        {/* ROW 1: SCALE */}
        <div className="scale-track" style={{ 
          whiteSpace: "nowrap", 
          display: "flex", 
          gap: "4rem", 
          marginBottom: "2rem",
          willChange: "transform"
        }}>
          {[...Array(8)].map((_, i) => (
             <span key={i} style={{ 
               fontSize: "clamp(6rem, 20vw, 20rem)", 
               fontFamily: "var(--font-display)", 
               fontWeight: 800, 
               lineHeight: 0.8,
               color: i % 2 === 0 ? "var(--fg)" : "transparent",
               WebkitTextStroke: i % 2 === 0 ? "none" : "1px var(--fg)", // Outline effect
               opacity: 0.9
             }}>
               SCALE
             </span>
          ))}
        </div>

        {/* ROW 2: THRIVE */}
        <div className="thrive-track" style={{ 
          whiteSpace: "nowrap", 
          display: "flex", 
          gap: "4rem",
          willChange: "transform"
        }}>
          {[...Array(8)].map((_, i) => (
             <span key={i} style={{ 
               fontSize: "clamp(6rem, 20vw, 20rem)", 
               fontFamily: "var(--font-display)", 
               fontWeight: 800, 
               fontStyle: "italic",
               lineHeight: 0.8,
               color: i % 2 !== 0 ? "var(--fg)" : "transparent",
               WebkitTextStroke: i % 2 !== 0 ? "none" : "1px var(--fg)",
               opacity: 0.9
             }}>
               THRIVE
             </span>
          ))}
        </div>
        
        {/* Overlay Label */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          background: "var(--bg)", padding: "1rem 2rem", border: "1px solid var(--border)",
          borderRadius: "100px", zIndex: 5
        }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Unlock Global Potential
          </span>
        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <section style={{ padding: "8rem var(--space-lg)", background: "var(--bg-alt)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "6rem" }}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontFamily: "var(--font-display)", marginBottom: "1rem" }}>
              Everything you need. <br/> Nothing you don't.
            </h2>
            <div style={{ height: "2px", width: "100px", background: "var(--fg)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[
              { title: "Global Payments", icon: "💳", desc: "Accept payments from anywhere with automated tax handling." },
              { title: "Seller Dashboards", icon: "📊", desc: "Empower vendors with granular analytics and inventory tools." },
              { title: "High Scale", icon: "🚀", desc: "Built on edge infrastructure to handle millions of requests." },
            ].map((feature, i) => (
              <div key={i} className="feature-card" style={{
                padding: "3rem",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "4px", // Editorial sharp corners
                transition: "transform 0.3s ease"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontFamily: "var(--font-display)" }}>{feature.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ================= VERTICAL FOOTER (HUGE TEXT) ================= */}
      <footer style={{ 
        padding: "8rem var(--space-lg) 4rem", 
        background: "var(--fg)", 
        color: "var(--bg)",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          
          {/* Huge Vertical Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "8rem" }}>
            {['Instagram', 'Twitter', 'LinkedIn', 'Github'].map((text, i) => (
               <div key={text} className="footer-link-wrapper" style={{ overflow: "hidden", lineHeight: 0.85 }}>
                 <a href="#" className="footer-huge-link" style={{
                   display: "block",
                   fontSize: "clamp(4rem, 12vw, 10rem)",
                   fontFamily: "var(--font-display)",
                   fontWeight: 700,
                   color: "var(--bg)", // Default filled
                   textDecoration: "none",
                   textTransform: "uppercase",
                   transition: "color 0.3s ease, transform 0.3s ease",
                   transformOrigin: "left center"
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.color = "transparent";
                   e.currentTarget.style.WebkitTextStroke = "1px var(--bg)";
                   e.currentTarget.style.transform = "translateX(20px)";
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.color = "var(--bg)";
                   e.currentTarget.style.WebkitTextStroke = "none";
                   e.currentTarget.style.transform = "translateX(0)";
                 }}
                 >
                   {text}
                 </a>
               </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.2)" }}>
             <div>
               <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--bg)", margin: 0 }}>MALL_PROTO</h2>
               <p style={{ opacity: 0.5, marginTop: "0.5rem", fontSize: "0.9rem" }}>© 2025 All Rights Reserved.</p>
             </div>
             
             <div style={{ display: "flex", gap: "2rem" }}>
               {['Legal', 'Privacy', 'Terms'].map(link => (
                 <a key={link} href="#" style={{ color: "var(--bg)", textDecoration: "none", fontSize: "0.9rem", opacity: 0.6 }}>{link}</a>
               ))}
             </div>
          </div>
        </div>
        
        {/* Footer Animation Script */}
        <script dangerouslySetInnerHTML={{__html: `
          // This would ideally be in the useEffect but for simplicity in this structure:
          // The hover effects are handled inline for immediate visual feedback.
          // Entrance animations for footer links would be handled by ScrollTrigger in main useEffect.
        `}} />
      </footer>

    </div>
  );
};

export default LandingPage;
