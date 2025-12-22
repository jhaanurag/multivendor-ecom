import { useRef, useLayoutEffect, memo } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const JoinSection = memo(() => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const joinWords = containerRef.current?.querySelectorAll('.join-word span');
            if (joinWords && joinWords.length > 0) {
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
                            trigger: containerRef.current,
                            start: "top 75%",
                        }
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} style={{
            padding: "12rem var(--space-lg)",
            background: "var(--bg)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
        }}>
            <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: "800px", height: "800px",
                background: "radial-gradient(circle, var(--bg-alt) 0%, transparent 60%)",
                opacity: 0.8, pointerEvents: "none"
            }} />

            <div style={{ position: "relative", zIndex: 2, maxWidth: "1400px", margin: "0 auto" }}>
                <p className="join-word" style={{
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "1rem"
                }}>
                    <span>Ready to transform your business?</span>
                </p>

                <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.5rem, 8vw, 6rem)",
                    lineHeight: 0.9,
                    marginBottom: "4rem",
                    color: "var(--fg)",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "0.1em 0.2em",
                }}>
                    <div style={{ display: "flex", gap: "0.2em", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
                        {["Join", "thousands", "of"].map((word, i) => (
                            <span key={i} className="join-word" style={{ display: "inline-block", overflow: "hidden" }}>
                                <span style={{ display: "inline-block" }}>{word}</span>
                            </span>
                        ))}
                    </div>
                    <div style={{ width: "100%", marginTop: "0.5rem" }}>
                        <span style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                            {["successful", "sellers."].map((word, i) => (
                                <span key={i} className="join-word" style={{ display: "inline-block", overflow: "hidden", margin: "0 0.1em" }}>
                                    <span style={{ display: "inline-block" }}>{word}</span>
                                </span>
                            ))}
                        </span>
                    </div>
                </h2>

                <div style={{ marginBottom: "5rem" }}>
                    <Link to="#" className="cta-btn">Start Your Store</Link>
                </div>
            </div>
        </section>
    );
});

JoinSection.displayName = "JoinSection";
export default JoinSection;
