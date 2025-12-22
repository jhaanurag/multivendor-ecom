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

const LandingPage = ({ isPreloaderFinished }) => {
  const containerRef = useRef(null);
  const heroTextRef = useRef([]);
  const scaleThriveRef = useRef(null);
  const joinSectionRef = useRef(null);
  const statsRef = useRef([]);

  // Master GSAP Context
  useLayoutEffect(() => {
    // Only start hero animation when preloader is finished
    if (!isPreloaderFinished) return;

    const ctx = gsap.context(() => {

      // ===================================
      // 1. HERO TEXT REVEAL (Staggered Chars)
      // ===================================
      const heroTl = gsap.timeline({ delay: 0.2 });

      heroTextRef.current.forEach((el, i) => {
        if (!el) return;

        heroTl.fromTo(el,
          { y: 150, opacity: 0, rotateX: -30 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.4,
            ease: "power4.out",
          },
          i * 0.1 // stagger manually in timeline or use stagger prop
        );
      });

      // Subtext Reveal (Line by Line)
      heroTl.to(".hero-subtext-line", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=0.8"); // Start while headline is still finishing

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

      // ===================================
      // 5. STATS COUNTER ANIMATION
      // ===================================
      statsRef.current.forEach((statEl) => {
        if (!statEl) return;
        const target = parseFloat(statEl.getAttribute('data-target'));
        const suffix = statEl.getAttribute('data-suffix') || "";

        ScrollTrigger.create({
          trigger: statEl,
          start: "top 90%",
          onEnter: () => {
            let obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                statEl.innerText = (target % 1 !== 0 ? obj.val.toFixed(1) : Math.floor(obj.val)) + suffix;
              }
            });
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isPreloaderFinished]);

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

        <div className="hero-content" style={{ zIndex: 10, maxWidth: "1400px", margin: "0 auto", width: "100%", visibility: isPreloaderFinished ? 'visible' : 'hidden' }}>
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
              fontFamily: 'var(--font-display)', // Reverted
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
            marginTop: "6rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%"
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
              <Link to="/shop" onMouseMove={handleBtnHover} onMouseLeave={handleBtnLeave} className="hero-btn hero-btn-primary">
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
        padding: "12rem 0",
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

      {/* ================= MARQUEE SECTION ================= */}
      <section style={{
        padding: "6rem 0",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden"
      }}>
        <div style={{ display: "flex", gap: "4rem", whiteSpace: "nowrap" }}>
          <div className="infinite-marquee" style={{ display: "flex", gap: "4rem", animation: "marquee 30s linear infinite" }}>
            {['SYDNEY', 'PARIS', 'TOKYO', 'LONDON', 'NEW YORK', 'BERLIN', 'MILAN'].map((city, i) => (
              <span key={i} style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                opacity: 0.4
              }}>
                {city}
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {['SYDNEY', 'PARIS', 'TOKYO', 'LONDON', 'NEW YORK', 'BERLIN', 'MILAN'].map((city, i) => (
              <span key={`dup-${i}`} style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                opacity: 0.4
              }}>
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BENTO FEATURES GRID ================= */}
      <section style={{ padding: "12rem var(--space-lg)", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

          <div style={{ marginBottom: "6rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", marginBottom: "1rem", color: "var(--muted)" }}>Everything you need.</p>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontFamily: "var(--font-display)", marginBottom: "1rem", lineHeight: 1 }}>
                Built for the <br /><span style={{ fontStyle: "italic", color: "var(--muted)" }}>Modern</span> Web.
              </h2>
            </div>
            <div style={{ maxWidth: "400px", textAlign: "right" }}>
              <p>We provide the ultimate toolkit for vendors and shoppers who demand excellence in every interaction.</p>
            </div>
          </div>

          <div className="bento-grid" style={{ gridAutoRows: "250px", gap: "2rem" }}>
            <div className="bento-item bento-item--large feature-card">
              <div style={{ position: "absolute", top: 0, right: 0, padding: "2rem", fontSize: "4rem", opacity: 0.1 }}>💳</div>
              <h3 style={{ fontSize: "2rem", marginBottom: "1rem", fontFamily: "var(--font-display)" }}>Global Payments</h3>
              <p style={{ color: "var(--muted)", maxWidth: "80%" }}>Accept payments from anywhere in the world with automated tax handling and conversion at the edge.</p>
            </div>
            <div className="bento-item feature-card">
              <div style={{ fontSize: "2rem", marginBottom: "auto" }}>📊</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>Analytics</h3>
            </div>
            <div className="bento-item feature-card">
              <div style={{ fontSize: "2rem", marginBottom: "auto" }}>🚀</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>Edge Scale</h3>
            </div>
            <div className="bento-item bento-item--wide feature-card">
              <div style={{ position: "absolute", bottom: 0, right: 0, padding: "1rem", fontSize: "3rem", opacity: 0.1 }}>🔒</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontFamily: "var(--font-display)" }}>Enterprise Security</h3>
              <p style={{ color: "var(--muted)" }}>Military-grade encryption for every transaction and user profile.</p>
            </div>

            {/* Perfectly Tiled Bottom Row */}
            <div className="bento-item bento-item--large feature-card">
              <h3 style={{ fontSize: "2rem", marginBottom: "1rem", fontFamily: "var(--font-display)" }}>Vendor <br /> Dashboard</h3>
              <p style={{ color: "var(--muted)" }}>Manage your entire empire from a single, high-performance interface.</p>
              <div style={{ marginTop: "auto", fontSize: "4rem", opacity: 0.2 }}>🏗️</div>
            </div>
            <div className="bento-item bento-item--large feature-card">
              <h3 style={{ fontSize: "2rem", marginBottom: "1rem", fontFamily: "var(--font-display)" }}>Support</h3>
              <p style={{ color: "var(--muted)" }}>Dedicated enterprise support team available 24/7 for all your scaling needs.</p>
              <div style={{ marginTop: "auto", fontSize: "4rem", opacity: 0.2 }}>💎</div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ================= STATS SECTION ================= */}
      <section style={{
        padding: "12rem var(--space-lg)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)"
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
                  fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                  fontFamily: "var(--font-display)", // Reverted to premium Sans-Serif
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--fg)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums"
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

      {/* ================= JOIN SELLERS SECTION ================= */}
      <section ref={el => joinSectionRef.current = el} style={{
        padding: "12rem var(--space-lg)",
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

        <div style={{ position: "relative", zIndex: 2, maxWidth: "1400px", margin: "0 auto" }}>

          <div style={{ marginBottom: "1rem", overflow: "hidden" }}>
            <p className="join-word" style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--muted)",
              fontFamily: "var(--font-display)",
              margin: 0
            }}>
              <span>Ready to transform your business?</span>
            </p>
          </div>

          {/* Main Headline - Split for Animation */}
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 8vw, 6rem)", // Decreased size as requested
            lineHeight: 0.9,
            marginBottom: "4rem",
            color: "var(--fg)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.1em 0.2em",
            letterSpacing: "-0.04em"
          }}>
            {/* Row 1: Join thousands of */}
            <div style={{ display: "flex", gap: "0.2em", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
              {["Join", "thousands", "of"].map((word, i) => (
                <span key={i} className="join-word" style={{ display: "inline-block", overflow: "hidden", margin: "0 -0.15em" }}>
                  <span style={{ display: "inline-block", padding: "0 0.15em" }}>{word}</span>
                </span>
              ))}
            </div>

            <div style={{ width: "100%", marginTop: "0.5rem" }}>
              <span style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.2em",
                fontStyle: "italic",
                fontFamily: "var(--font-serif)"
              }}>
                {["successful", "sellers."].map((word, i) => (
                  <span key={i} className="join-word" style={{ display: "inline-block", overflow: "hidden", margin: "0 -0.15em" }}>
                    <span style={{ display: "inline-block", padding: "0 0.15em" }}>{word}</span>
                  </span>
                ))}
              </span>
            </div>
          </h2>

          <div style={{ marginBottom: "5rem" }}>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", margin: 0 }}>
              Start your journey today. No credit card required.
            </p>
          </div>

          <Link
            to="/register"
            onMouseMove={handleBtnHover}
            onMouseLeave={handleBtnLeave}
            className="hero-btn hero-btn-primary"
            style={{ padding: "1.1rem 2.2rem", fontSize: "0.9rem", borderRadius: "0" }}
          >
            <span className="hero-btn-bubble"></span>
            <span className="hero-btn-text">Get Started Now</span>
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={{
        padding: "12rem var(--space-lg) 6rem",
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
            padding: 1.1rem 2.2rem; /* Slightly more padding to compensate for no border */
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            color: var(--fg);
            border: none; /* Removed border */
            transition: transform 0.4s ease;
        }

        .hero-btn-primary {
            border: none; /* No border for primary either */
        }

        .hero-btn-bubble {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--fg); /* Solid fill on hover */
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 0;
        }

        .hero-btn-text {
            position: relative;
            z-index: 1;
            transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-btn:hover .hero-btn-bubble {
            transform: translateY(0);
        }

        .hero-btn:hover .hero-btn-text {
            color: var(--bg); /* Inverted text color on hover */
        }

      `}</style>

    </div>
  );
};

export default LandingPage;
