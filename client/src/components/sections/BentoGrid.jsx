import { useRef, useLayoutEffect, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BentoGrid = memo(() => {
    const containerRef = useRef(null);
    const iconRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Batch Reveal Features
            ScrollTrigger.batch('.feature-card', {
                onEnter: (elements) => {
                    gsap.fromTo(elements,
                        { y: 60, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            stagger: 0.15,
                            ease: "power3.out",
                            overwrite: true
                        }
                    );
                },
                start: "top 90%"
            });

            // 2. SVG Animations
            // Global Payments
            if (iconRefs.current[0]) {
                const card = iconRefs.current[0].querySelector('.svg-card-body');
                const coins = iconRefs.current[0].querySelectorAll('.svg-coin');
                if (card) gsap.to(card, { y: -4, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });
                gsap.to(coins, { scale: 1.15, duration: 1.2, yoyo: true, repeat: -1, stagger: 0.3, ease: "power1.inOut", transformOrigin: "center" });
            }

            // Analytics
            if (iconRefs.current[1]) {
                const bars = iconRefs.current[1].querySelectorAll('.svg-bar');
                const trendLine = iconRefs.current[1].querySelector('.svg-trend');
                gsap.to(bars, { scaleY: 1.3, transformOrigin: "bottom center", duration: 1, stagger: { each: 0.15, yoyo: true, repeat: -1 }, ease: "power1.inOut" });
                if (trendLine) {
                    const length = trendLine.getTotalLength ? trendLine.getTotalLength() : 100;
                    gsap.set(trendLine, { strokeDasharray: length, strokeDashoffset: length });
                    gsap.to(trendLine, { strokeDashoffset: 0, duration: 1.5, repeat: -1, repeatDelay: 1.5, ease: "power2.out" });
                }
            }

            // Edge Scale
            if (iconRefs.current[2]) {
                const server = iconRefs.current[2].querySelector('.svg-server');
                const rings = iconRefs.current[2].querySelectorAll('.svg-ring');
                const satellites = iconRefs.current[2].querySelectorAll('.svg-satellite');
                if (server) gsap.to(server, { scale: 1.08, duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "center" });
                gsap.to(rings, { scale: 2.5, opacity: 0, duration: 2, stagger: { each: 1, repeat: -1 }, ease: "power1.out", transformOrigin: "center" });
                gsap.to(satellites, { scale: 1.2, duration: 1, yoyo: true, repeat: -1, stagger: 0.25, ease: "power1.inOut", transformOrigin: "center" });
            }

            // Security
            if (iconRefs.current[3]) {
                const shield = iconRefs.current[3].querySelector('.svg-shield');
                const scanLine = iconRefs.current[3].querySelector('.svg-scan');
                if (shield) gsap.to(shield, { scale: 1.02, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "center 70%" });
                if (scanLine) gsap.to(scanLine, { y: 50, duration: 1.2, repeat: -1, ease: "power1.inOut", yoyo: true });
            }

            // Vendor Dashboard
            if (iconRefs.current[4]) {
                const shimmer = iconRefs.current[4].querySelector('.svg-shimmer');
                const elements = iconRefs.current[4].querySelectorAll('.svg-ui-el');
                if (shimmer) gsap.to(shimmer, { x: 260, duration: 2.5, repeat: -1, repeatDelay: 1, ease: "power1.inOut" });
                gsap.to(elements, { opacity: 0.7, duration: 0.8, stagger: { each: 0.1, yoyo: true, repeat: -1 }, ease: "power1.inOut" });
            }

            // Support
            if (iconRefs.current[5]) {
                const dots = iconRefs.current[5].querySelectorAll('.svg-typing-dot');
                gsap.to(dots, { y: -4, duration: 0.4, stagger: { each: 0.12, yoyo: true, repeat: -1 }, ease: "power1.inOut" });
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="bento-section" style={{
            padding: "12rem var(--space-lg)",
            background: "var(--bg)",
            contentVisibility: "auto",
            containIntrinsicSize: "1px 1000px"
        }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <div style={{ marginBottom: "6rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", marginBottom: "1rem", color: "var(--muted)", fontSize: "1.5rem" }}>Everything you need.</p>
                        <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontFamily: "var(--font-display)", marginBottom: "1rem", lineHeight: 1 }}>
                            Built for the <br /><span style={{ fontStyle: "italic", color: "var(--muted)" }}>Modern</span> Web.
                        </h2>
                    </div>
                    <div style={{ maxWidth: "400px", textAlign: "right" }}>
                        <p>We provide the ultimate toolkit for vendors and shoppers who demand excellence in every interaction.</p>
                    </div>
                </div>

                <div className="bento-grid" style={{ gridAutoRows: "250px", gap: "2rem" }}>
                    {/* GLOBAL PAYMENTS */}
                    <div className="bento-item bento-item--large feature-card" style={{ display: "flex", flexDirection: "row", padding: 0 }}>
                        <div style={{ flex: "1 1 50%", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                            <h3 style={{ fontSize: "2rem", marginBottom: "1rem", fontFamily: "var(--font-display)" }}>Global Payments</h3>
                            <p style={{ color: "var(--muted)" }}>Accept payments from anywhere in the world with automated tax handling.</p>
                        </div>
                        <div ref={el => iconRefs.current[0] = el} style={{ flex: "1 1 50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-alt)", padding: "2rem" }}>
                            <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: "200px", height: "auto" }}>
                                <g className="svg-card-body">
                                    <rect x="10" y="15" width="80" height="50" rx="6" fill="var(--fg)" />
                                    <rect className="svg-chip" x="18" y="28" width="16" height="12" rx="2" fill="var(--bg)" opacity="0.6" />
                                    <rect className="svg-stripe" x="10" y="48" width="80" height="8" fill="var(--muted)" opacity="0.3" />
                                </g>
                                <circle className="svg-coin" cx="100" cy="25" r="10" fill="var(--muted)" stroke="var(--bg)" strokeWidth="2" />
                                <circle className="svg-coin" cx="105" cy="55" r="8" fill="var(--muted)" stroke="var(--bg)" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    {/* ANALYTICS */}
                    <div className="bento-item feature-card" style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                        <div ref={el => iconRefs.current[1] = el} style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-alt)", padding: "1.5rem" }}>
                            <svg viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: "120px", height: "auto" }}>
                                <rect className="svg-bar" x="10" y="45" width="15" height="20" fill="var(--fg)" />
                                <rect className="svg-bar" x="32" y="30" width="15" height="35" fill="var(--fg)" />
                                <rect className="svg-bar" x="54" y="18" width="15" height="47" fill="var(--fg)" />
                                <rect className="svg-bar" x="76" y="5" width="15" height="60" fill="var(--muted)" />
                                <path className="svg-trend" d="M17 42 L39 27 L61 15 L83 3" stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div style={{ padding: "1rem 1.5rem" }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem", fontFamily: "var(--font-display)" }}>Analytics</h3>
                            <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: 0 }}>Real-time insights.</p>
                        </div>
                    </div>

                    {/* EDGE SCALE */}
                    <div className="bento-item feature-card" style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                        <div ref={el => iconRefs.current[2] = el} style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-alt)", padding: "1.5rem" }}>
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: "100px", height: "auto" }}>
                                <circle className="svg-ring" cx="50" cy="50" r="15" stroke="var(--muted)" strokeWidth="1" fill="none" opacity="0.5" />
                                <rect className="svg-server" x="40" y="40" width="20" height="20" rx="3" fill="var(--fg)" />
                                <circle className="svg-satellite" cx="50" cy="12" r="6" fill="var(--muted)" />
                                <circle className="svg-satellite" cx="88" cy="50" r="5" fill="var(--muted)" />
                                <circle className="svg-satellite" cx="12" cy="50" r="5" fill="var(--muted)" />
                                <circle className="svg-satellite" cx="50" cy="88" r="5" fill="var(--muted)" />
                            </svg>
                        </div>
                        <div style={{ padding: "1rem 1.5rem" }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem", fontFamily: "var(--font-display)" }}>Edge Scale</h3>
                            <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: 0 }}>Global distribution.</p>
                        </div>
                    </div>

                    {/* SECURITY */}
                    <div className="bento-item bento-item--wide feature-card" style={{ display: "flex", flexDirection: "row", padding: 0 }}>
                        <div style={{ flex: "1 1 55%", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontFamily: "var(--font-display)" }}>Enterprise Security</h3>
                            <p style={{ color: "var(--muted)" }}>Military-grade encryption for every transaction.</p>
                        </div>
                        <div ref={el => iconRefs.current[3] = el} style={{ flex: "1 1 45%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-alt)", padding: "2rem" }}>
                            <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: "80px", height: "auto" }}>
                                <path className="svg-shield" d="M40 95 C40 95 75 75 75 40 L75 15 L40 5 L5 15 L5 40 C5 75 40 95 40 95 Z" fill="var(--fg)" />
                                <rect className="svg-scan" x="10" y="20" width="60" height="2" fill="var(--accent)" opacity="0.8" />
                                <path className="svg-check" d="M28 50 L36 58 L54 40" stroke="var(--bg)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                        </div>
                    </div>

                    {/* VENDOR DASHBOARD */}
                    <div className="bento-item bento-item--large feature-card" style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                        <div style={{ padding: "2rem" }}>
                            <h3 style={{ fontSize: "2rem", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>Vendor Dashboard</h3>
                            <p style={{ color: "var(--muted)", margin: 0 }}>Manage your entire empire from a single interface.</p>
                        </div>
                        <div ref={el => iconRefs.current[4] = el} style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-alt)", padding: "2rem" }}>
                            <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: "350px", height: "auto" }}>
                                <rect x="0" y="0" width="200" height="100" rx="6" fill="var(--bg)" stroke="var(--border)" strokeWidth="1" />
                                <rect className="svg-ui-el" x="0" y="0" width="200" height="16" fill="var(--fg)" opacity="0.08" />
                                <rect className="svg-shimmer" x="-60" y="0" width="60" height="100" fill="url(#shimmerGrad)" />
                            </svg>
                        </div>
                    </div>

                    {/* SUPPORT */}
                    <div className="bento-item bento-item--large feature-card" style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                        <div style={{ padding: "2rem" }}>
                            <h3 style={{ fontSize: "2rem", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>Support</h3>
                            <p style={{ color: "var(--muted)", margin: 0 }}>Dedicated enterprise support available 24/7.</p>
                        </div>
                        <div ref={el => iconRefs.current[5] = el} style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-alt)", padding: "2rem" }}>
                            <svg viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: "200px", height: "auto" }}>
                                <g className="svg-bubble">
                                    <rect x="5" y="50" width="60" height="40" rx="8" fill="var(--muted)" opacity="0.25" />
                                </g>
                                <circle className="svg-typing-dot" cx="22" cy="70" r="4" fill="var(--fg)" opacity="0.6" />
                                <circle className="svg-typing-dot" cx="35" cy="70" r="4" fill="var(--fg)" opacity="0.6" />
                                <circle className="svg-typing-dot" cx="48" cy="70" r="4" fill="var(--fg)" opacity="0.6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

BentoGrid.displayName = "BentoGrid";
export default BentoGrid;
