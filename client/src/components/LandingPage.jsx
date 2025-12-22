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
  const joinSectionRef = useRef(null);
  const statsRef = useRef([]);
  
  // Master GSAP Context
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // ===================================
      // 1. HERO TEXT REVEAL (Staggered Chars)
      // ===================================
      const heroTl = gsap.timeline({ delay: 0.5 });
      
      heroTextRef.current.forEach((el, i) => {
        if (!el) return;
        
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

      // Subtext Reveal (Line by Line)
      gsap.to(".hero-subtext-line", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        delay: 1.2
      });

      // ===================================
      // 2. SCALE / THRIVE (Parallax Marquee)
      // ===================================
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

      // ===================================
      // 4. JOIN TEXT SPLIT REVEAL
      // ===================================
      const joinWords = joinSectionRef.current.querySelectorAll('.join-word span');
      gsap.fromTo(joinWords, 
        { y: 100, opacity: 0, rotateX: -45 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: joinSectionRef.current,
            start: "top 75%",
          }
        }
      );

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
        
        <div className="hero-content" style={{ zIndex: 10, maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
          {/* Main Headline - Broken into lines for animation */}
          <div style={{ overflow: "hidden", lineHeight: 0.9, textAlign: "center" }}>
            <h1 ref={el => heroTextRef.current[0] = el} style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: "clamp(4rem, 15vw, 12rem)", 
              letterSpacing: "-0.04em",
              color: "var(--fg)",
              margin: 0,
              textShadow: "0 10px 30px rgba(0,0,0,0.15)" // Better visibility
            }}>
              COMMERCE
            </h1>
          </div>
          
          <div style={{ overflow: "hidden", lineHeight: 0.9, textAlign: "center" }}>
            <h1 ref={el => heroTextRef.current[1] = el} style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: "clamp(4rem, 15vw, 12rem)", 
              letterSpacing: "-0.04em",
              color: "var(--fg)",
              margin: 0,
              fontStyle: "italic", // Stylistic choice
              textShadow: "0 10px 30px rgba(0,0,0,0.15)"
            }}>
              REIMAGINED
            </h1>
          </div>

           {/* Bottom Row: Buttons (Left) & Text (Right) */}
           <div style={{ 
              marginTop: "5rem", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-end",
              width: "100%",
              padding: "0 2vw"
           }}>
              
              {/* CTA Group - LEFT */}
              <div ref={el => heroTextRef.current[3] = el} style={{ 
                  display: "flex", 
                  gap: "1rem"
              }}>
                <Link to="/register" onMouseMove={handleBtnHover} onMouseLeave={handleBtnLeave} className="hero-btn hero-btn-primary">
                  <span className="hero-btn-bubble"></span>
                  <span className="hero-btn-text">Start Selling</span>
                </Link>
                <Link to="/shop" onMouseMove={handleBtnHover} onMouseLeave={handleBtnLeave} className="hero-btn hero-btn-outline">
                  <span className="hero-btn-bubble"></span>
                  <span className="hero-btn-text">Explore Shop</span>
                </Link>
              </div>

              {/* Subtext - RIGHT - Line by Line Animation */}
              <div style={{ textAlign: "right" }}>
                {[
                  "The definitive platform for modern scaling.",
                  "Empowering sellers, delighting customers,",
                  "and redefining possibilities."
                ].map((line, i) => (
                  <div key={i} style={{ overflow: "hidden" }}>
                    <p className="hero-subtext-line" style={{
                      fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                      color: "rgba(255, 255, 255, 0.9)",
                      margin: 0,
                      lineHeight: 1.4,
                      fontWeight: 500,
                      fontFamily: "var(--font-display)",
                      transform: "translateY(100%)", // Start hidden down
                      opacity: 0
                    }}>
                      {line}
                    </p>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* ================= SCALE / THRIVE SECTION ================= */}
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
        
        {/* Overlay Label - Clean Text */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 5
        }}>
          <span style={{ 
            fontSize: "1rem", 
            fontWeight: 700, 
            letterSpacing: "0.2em", 
            textTransform: "uppercase",
            color: "var(--fg)",
            textShadow: "0 0 20px var(--bg)" 
          }}>
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

      {/* ================= STATS SECTION (RESTORED) ================= */}
      <section style={{ 
        padding: "6rem var(--space-lg)", 
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)" // Dark background
      }}>
        <div style={{ 
          maxWidth: "1400px", 
          margin: "0 auto", 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "2rem"
        }}>
          {[
            { number: 49632, suffix: "+", label: "Active Users" },
            { number: 1191, suffix: "+", label: "Vendors" },
            { number: 99, suffix: "%", label: "Uptime" },
            { number: 4.9, suffix: "", label: "Rating" }
          ].map((stat, i) => (
             <div key={i} style={{ 
               textAlign: "center", 
               borderRight: i !== 3 ? "1px solid var(--border)" : "none",
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               justifyContent: "center"
             }}>
               <h3 
                 ref={el => statsRef.current[i] = el}
                 data-target={stat.number}
                 data-suffix={stat.suffix}
                 style={{ 
                 fontSize: "clamp(2.5rem, 4vw, 3.5rem)", 
                 fontFamily: "var(--font-serif)", // Serif for numbers
                 fontWeight: 400,
                 margin: 0,
                 color: "var(--fg)",
                 fontStyle: "italic",
                 lineHeight: 1,
                 fontVariantNumeric: "tabular-nums" // Prevent jumping
               }}>
                 0{stat.suffix}
               </h3>
               <p style={{ 
                 fontSize: "0.8rem", 
                 fontWeight: 600, 
                 textTransform: "uppercase", 
                 letterSpacing: "0.15em", 
                 color: "var(--muted)", 
                 marginTop: "0.5rem" 
               }}>
                 {stat.label}
               </p>
             </div>
          ))}
        </div>
      </section>

      {/* ================= JOIN SELLERS SECTION (RESTORED) ================= */}
      <section ref={el => joinSectionRef.current = el} style={{ 
        padding: "10rem var(--space-lg)", 
        background: "var(--bg)", 
        textAlign: "center",
        position: "relative",
        overflow: "hidden" 
      }}>
        {/* Decorative Blur */}
        <div style={{
           position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
           width: "600px", height: "600px", background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
           opacity: 0.5, pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "2rem", color: "var(--muted)" }}>
            Ready to transform your business?
          </p>
          
          {/* Main Headline - Split for Animation */}
          <h2 style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(3rem, 7vw, 6rem)", 
            lineHeight: 0.9,
            marginBottom: "3rem",
            color: "var(--fg)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.2em 0.3em" /* Gap between words */
          }}>
            {/* Row 1: Join thousands of */}
            <div style={{ display: "flex", gap: "0.3em", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
              {["Join", "thousands", "of"].map((word, i) => (
                <span key={i} className="join-word" style={{ display: "inline-block", overflow: "hidden" }}>
                  <span style={{ display: "inline-block" }}>{word}</span>
                </span>
              ))}
            </div>

            {/* Row 2: successful sellers */}
            <div style={{ width: "100%", marginTop: "1rem" }}>
               <span style={{ 
                 fontSize: "0.6em", 
                 display: "flex", 
                 justifyContent: "center", 
                 gap: "0.3em",
                 fontStyle: "italic", 
                 fontFamily: "var(--font-serif)", 
                 color: "var(--muted)" 
               }}>
                  {["successful", "sellers."].map((word, i) => (
                    <span key={i} className="join-word" style={{ display: "inline-block", overflow: "hidden" }}>
                      <span style={{ display: "inline-block" }}>{word}</span>
                    </span>
                  ))}
               </span>
            </div>
          </h2>
          
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginBottom: "4rem" }}>
            Start your journey today. No credit card required.
          </p>

          <Link to="/register" className="btn-primary" style={{
              display: "inline-block",
              padding: "1.2rem 3rem",
              backgroundColor: "var(--fg)",
              color: "var(--bg)",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              textDecoration: "none",
              transition: "transform 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Get Started Now
          </Link>
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
      </footer>

      {/* Scoped Styles for Hero Buttons */}
      <style>{`
        .hero-btn {
            position: relative;
            padding: 1rem 2rem;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
            overflow: hidden;
            border-radius: 0; /* Square */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid transparent; /* Invisible border initially */
            background: transparent;
            color: var(--fg);
            transition: border-color 0.4s ease;
        }

        .hero-btn-bubble {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 0;
        }

        .hero-btn-primary .hero-btn-bubble {
            background-color: var(--fg); /* Black fill on hover */
        }

        .hero-btn-outline .hero-btn-bubble {
             background-color: var(--bg); /* White fill on hover */
             border: 1px solid var(--fg); /* Add border to bubble/box */
        }

        .hero-btn-text {
            position: relative;
            z-index: 1;
            transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-btn:hover .hero-btn-bubble {
            transform: translateY(0);
        }

        /* Primary Button: Text turns White on Black */
        .hero-btn-primary:hover .hero-btn-text {
            color: var(--bg); 
        }

        /* Outline Button: Text stays Main, but box appears */
        .hero-btn-outline:hover .hero-btn-text {
            color: var(--fg); 
        }

      `}</style>

    </div>
  );
};

export default LandingPage;
