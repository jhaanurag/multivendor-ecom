import { useLayoutEffect, useRef, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MovedText = memo(() => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.batch('.moved-hero-text', {
                onEnter: (elements) => {
                    gsap.to(elements, {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.1,
                        ease: "power3.out",
                        overwrite: true
                    });
                },
                start: "top 90%"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} style={{
            padding: "8rem var(--space-lg)",
            background: "var(--bg)",
            display: "flex",
            justifyContent: "center",
            textAlign: "center"
        }}>
            <div style={{ maxWidth: "900px" }}>
                {[
                    "The definitive platform for modern scaling.",
                    "Empowering sellers, delighting customers,",
                    "and redefining possibilities."
                ].map((line, i) => (
                    <div key={i} style={{ overflow: "hidden" }}>
                        <p className="moved-hero-text" style={{
                            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                            color: "var(--fg)",
                            margin: 0,
                            lineHeight: 1.3,
                            fontWeight: 500,
                            fontFamily: "var(--font-display)",
                            transform: "translateY(50px)",
                            opacity: 0
                        }}>
                            {line}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
});

MovedText.displayName = "MovedText";
export default MovedText;
