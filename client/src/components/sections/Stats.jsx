import { useRef, useLayoutEffect, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Stats = memo(() => {
    const statsRef = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
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
        }, statsRef);

        return () => ctx.revert();
    }, []);

    const stats = [
        { number: 49632, suffix: "+", label: "Active Users" },
        { number: 1191, suffix: "+", label: "Vendors" },
        { number: 99, suffix: "%", label: "Uptime" },
        { number: 4.9, suffix: "", label: "Rating" }
    ];

    return (
        <section style={{
            padding: "12rem var(--space-lg)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg)",
            contentVisibility: "auto",
            containIntrinsicSize: "1px 400px"
        }}>
            <div style={{
                maxWidth: "1400px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "2rem"
            }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{
                        textAlign: "center",
                        borderRight: i !== 3 ? "1px solid var(--border)" : "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem 1rem",
                    }}>
                        <h3
                            ref={el => statsRef.current[i] = el}
                            data-target={stat.number}
                            data-suffix={stat.suffix}
                            style={{
                                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                                fontFamily: "var(--font-display)",
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
                            marginTop: "0.75rem"
                        }}>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
});

Stats.displayName = "Stats";
export default Stats;
