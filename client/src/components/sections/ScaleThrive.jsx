import { useRef, useLayoutEffect, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ScaleThrive = memo(() => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const scaleTrack = sectionRef.current?.querySelector('.scale-track');
            const thriveTrack = sectionRef.current?.querySelector('.thrive-track');

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    if (scaleTrack) gsap.set(scaleTrack, { xPercent: -20 + (self.progress * -30) });
                    if (thriveTrack) gsap.set(thriveTrack, { xPercent: -50 + (self.progress * 30) });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} style={{
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
                        WebkitTextStroke: i % 2 === 0 ? "none" : "1px var(--fg)",
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
    );
});

ScaleThrive.displayName = "ScaleThrive";
export default ScaleThrive;
