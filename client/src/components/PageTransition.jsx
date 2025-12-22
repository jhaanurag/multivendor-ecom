/**
 * Page Transition Wrapper Component
 * Provides smooth page transitions using GSAP
 * Wraps route components for consistent enter/exit animations
 */

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";

// Check for reduced motion preference
const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Page Transition Wrapper
 * Animates page content on route changes
 */
const PageTransition = ({ children }) => {
  const containerRef = useRef(null);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("enter");
  const prevChildren = useRef(children);
  const isReducedMotion = useRef(prefersReducedMotion());

  // Handle children change - use ref comparison to avoid React 19 warnings
  useLayoutEffect(() => {
    if (children !== prevChildren.current) {
      prevChildren.current = children;

      if (isReducedMotion.current) {
        // For reduced motion, update immediately without animation
        setDisplayChildren(children);
        return;
      }

      // Start exit animation
      setTransitionStage("exit");
    }
  }, [children]);

  // Handle transition stage animations
  useLayoutEffect(() => {
    if (isReducedMotion.current || !containerRef.current) return;

    if (transitionStage === "exit") {
      const currentChildren = children;
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setDisplayChildren(currentChildren);
          setTransitionStage("enter");
        },
      });
    } else if (transitionStage === "enter") {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }
  }, [transitionStage, children]);

  return (
    <div ref={containerRef} className="page-transition-wrapper">
      {displayChildren}
    </div>
  );
};

/**
 * Animated Route Component
 * Alternative approach using CSS-based transitions with GSAP enhancement
 */
export const AnimatedOutlet = ({ children }) => {
  const outletRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !outletRef.current) return;

    const ctx = gsap.context(() => {
      // Animate all sections within the outlet
      const sections = outletRef.current.querySelectorAll(
        "section, .animate-section"
      );

      gsap.fromTo(
        sections,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, outletRef);

    return () => ctx.revert();
  }, [children]);

  return (
    <div ref={outletRef} className="animated-outlet">
      {children}
    </div>
  );
};

/**
 * Curtain Transition Effect
 * Full-screen curtain reveal animation
 */
export const CurtainTransition = ({
  isVisible,
  onComplete,
  color = "#000",
}) => {
  const curtainRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      onComplete?.();
      return;
    }

    if (!curtainRef.current) return;

    if (isVisible) {
      // Curtain enter
      gsap.fromTo(
        curtainRef.current,
        { scaleY: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            // Curtain exit
            gsap.to(curtainRef.current, {
              scaleY: 0,
              transformOrigin: "top",
              duration: 0.5,
              ease: "power3.inOut",
              delay: 0.1,
              onComplete,
            });
          },
        }
      );
    }
  }, [isVisible, onComplete]);

  return (
    <div
      ref={curtainRef}
      className="curtain-transition"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: color,
        zIndex: 9999,
        pointerEvents: "none",
        transform: "scaleY(0)",
      }}
    />
  );
};

/**
 * Preloader Component
 * Initial loading animation before app loads
 */
export const Preloader = ({ isLoading, onComplete }) => {
  const preloaderRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || isLoading) {
      if (!isLoading) onComplete?.();
      return;
    }

    // Ensure refs exist before animating
    if (!textRef.current || !progressRef.current || !preloaderRef.current) {
      if (!isLoading) onComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });

      // Animate text out
      tl.to(textRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      })
        // Animate progress bar
        .to(
          progressRef.current,
          {
            scaleX: 0,
            duration: 0.3,
            ease: "power2.in",
          },
          "-=0.2"
        )
        // Slide preloader up
        .to(preloaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
        });
    });

    return () => ctx.revert();
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  return (
    <div
      ref={preloaderRef}
      className="preloader"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <div
        ref={textRef}
        style={{
          color: "#fff",
          fontSize: "1.5rem",
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        MALL_PROTO
      </div>
      <div
        style={{
          width: "200px",
          height: "2px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          ref={progressRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            transformOrigin: "left",
          }}
        />
      </div>
    </div>
  );
};

export default PageTransition;
