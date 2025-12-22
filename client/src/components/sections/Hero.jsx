import { useRef, useLayoutEffect, memo } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const Hero = memo(({ isPreloaderFinished }) => {
    const containerRef = useRef(null);
    const heroTextRef = useRef([]);

    useLayoutEffect(() => {
        if (!isPreloaderFinished) return;

        const ctx = gsap.context(() => {
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
                    i * 0.1
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [isPreloaderFinished]);

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
        <section
            ref={containerRef}
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "0 var(--space-lg)",
                position: "relative"
            }}
        >
            <div className="hero-content" style={{ zIndex: 10, maxWidth: "1400px", margin: "0 auto", width: "100%", visibility: isPreloaderFinished ? 'visible' : 'hidden' }}>
                <div style={{ overflow: "hidden", lineHeight: 0.9, textAlign: "center" }}>
                    <h1 ref={el => heroTextRef.current[0] = el} style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: "clamp(4rem, 15vw, 12rem)",
                        letterSpacing: "-0.04em",
                        color: "var(--fg)",
                        margin: 0,
                        textShadow: "0 10px 30px rgba(0,0,0,0.15)"
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
                        fontStyle: "italic",
                        textShadow: "0 10px 30px rgba(0,0,0,0.15)"
                    }}>
                        REIMAGINED
                    </h1>
                </div>

                <div ref={el => heroTextRef.current[3] = el} style={{
                    marginTop: "3rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "2rem",
                    width: "100%"
                }}>
                    <Link to="#" onMouseMove={handleBtnHover} onMouseLeave={handleBtnLeave} className="hero-btn hero-btn-primary">
                        <span className="hero-btn-bubble"></span>
                        <span className="hero-btn-text">Start Selling</span>
                    </Link>
                    <Link to="#" onMouseMove={handleBtnHover} onMouseLeave={handleBtnLeave} className="hero-btn hero-btn-primary">
                        <span className="hero-btn-bubble"></span>
                        <span className="hero-btn-text">Explore Shop</span>
                    </Link>
                </div>
            </div>
        </section>
    );
});

Hero.displayName = "Hero";
export default Hero;
