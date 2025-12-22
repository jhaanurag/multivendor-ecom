import { memo } from "react";

const Marquee = memo(() => {
    const cities = ['SYDNEY', 'PARIS', 'TOKYO', 'LONDON', 'NEW YORK', 'BERLIN', 'MILAN'];

    return (
        <section style={{
            padding: "6rem 0",
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
            overflow: "hidden"
        }}>
            <div style={{ display: "flex", gap: "4rem", whiteSpace: "nowrap" }}>
                <div className="infinite-marquee" style={{ display: "flex", gap: "4rem", animation: "marquee 30s linear infinite" }}>
                    {cities.map((city, i) => (
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
                    {cities.map((city, i) => (
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
    );
});

Marquee.displayName = "Marquee";
export default Marquee;
