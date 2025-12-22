import { useState, useEffect, useRef, memo } from "react";

const LazySection = memo(({ children, threshold = 0.1, rootMargin = "200px" }) => {
    const [isIntersecting, setIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIntersecting(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold, rootMargin }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [threshold, rootMargin]);

    return (
        <div ref={ref} style={{ minHeight: isIntersecting ? "auto" : "50vh" }}>
            {isIntersecting ? children : null}
        </div>
    );
});

LazySection.displayName = "LazySection";
export default LazySection;
