/**
 * About Page Component
 * Premium team showcase with GSAP animations
 * Features: Preloader sequence, developer cards, smooth reveals
 */

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  teamMembers,
  cardHoverIn,
  cardHoverOut,
} from "./animations";
import "./AboutPage.css";

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);

  // Wait for component to mount
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Initialize animations after mount
  useLayoutEffect(() => {
    if (!isReady || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Get elements using selectors within container
      const preloader = containerRef.current.querySelector(".about-preloader");
      const loaderBar = containerRef.current.querySelector(".loader-bar");
      const imageWrappers =
        containerRef.current.querySelectorAll(".dev-img-wrapper");
      const images = containerRef.current.querySelectorAll(".dev-img");
      const teamText = containerRef.current.querySelector(".team-text");
      const developersText =
        containerRef.current.querySelector(".developers-text");
      const letters = containerRef.current.querySelectorAll(".dev-letter");
      const logo = containerRef.current.querySelector(".about-logo");
      const hero = containerRef.current.querySelector(".about-hero");
      const cards = containerRef.current.querySelectorAll(".developer-card");
      const names = containerRef.current.querySelectorAll(".card-name");
      const dividers = containerRef.current.querySelectorAll(".card-divider");

      // Master timeline
      const masterTl = gsap.timeline({ delay: 0.3 });

      // ========================================
      // PHASE 1: Team Preloader
      // ========================================

      // 1.1 Progress Bar Animation
      masterTl.to(loaderBar, {
        width: "100%",
        duration: 1.5,
        ease: "power4.inOut",
      });

      // 1.2 Image Reveal Sequence (Vertical clip-path wipe)
      masterTl.to(
        imageWrappers,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          stagger: 0.3,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.8"
      );

      // 1.3 Scale down images from 1.5 to 1
      masterTl.from(
        images,
        {
          scale: 1.5,
          stagger: 0.3,
          duration: 1.8,
          ease: "power4.out",
        },
        "<"
      );

      // 1.4 "THE TEAM" text reveal
      masterTl.to(
        teamText,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      );

      // ========================================
      // PHASE 2: Logo Transition
      // ========================================

      // 2.1 Show DEVELOPERS text
      masterTl.to(
        developersText,
        {
          opacity: 1,
          duration: 0.5,
        },
        "+=0.3"
      );

      // 2.2 Animate individual letters
      masterTl.from(letters, {
        y: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power3.out",
      });

      // 2.3 Hold for a moment
      masterTl.to({}, { duration: 0.5 });

      // 2.4 Exit all letters except D (0) and S (9)
      const exitLetters = Array.from(letters).filter(
        (_, i) => i !== 0 && i !== 9
      );
      masterTl.to(exitLetters, {
        y: -100,
        opacity: 0,
        stagger: 0.03,
        duration: 0.5,
        ease: "power3.in",
      });

      // 2.5 Move D and S to center
      const dLetter = letters[0];
      const sLetter = letters[9];

      if (dLetter && sLetter) {
        masterTl.to(
          dLetter,
          {
            x: "40vw",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.2"
        );

        masterTl.to(
          sLetter,
          {
            x: "-40vw",
            duration: 0.8,
            ease: "power3.out",
          },
          "<"
        );

        // 2.6 Scale down D and S and move to logo position
        masterTl.to([dLetter, sLetter], {
          scale: 0.15,
          y: "-35vh",
          duration: 0.8,
          ease: "power4.inOut",
        });
      }

      // 2.7 Fade out preloader elements
      masterTl.to(
        [imageWrappers, teamText, developersText],
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        },
        "-=0.3"
      );

      // ========================================
      // PHASE 3: Hero Reveal
      // ========================================

      // 3.1 Wipe away preloader overlay
      masterTl.to(
        preloader,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1,
          ease: "power4.inOut",
        },
        "-=0.3"
      );

      // 3.2 Show logo in final position
      masterTl.to(
        logo,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.5"
      );

      // 3.3 Reveal hero section
      masterTl.to(
        hero,
        {
          opacity: 1,
          duration: 0.5,
        },
        "-=0.3"
      );

      // 3.4 Reveal developer cards with stagger
      masterTl.from(
        cards,
        {
          y: 80,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.2"
      );

      // 3.5 Animate names sliding up from mask
      masterTl.from(
        names,
        {
          y: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // 3.6 Scale in divider lines
      masterTl.from(
        dividers,
        {
          scaleX: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  // DEVELOPERS letters
  const developersLetters = "DEVELOPERS".split("");

  return (
    <div className="about-page" ref={containerRef}>
      {/* ========================================
          PRELOADER OVERLAY
          ======================================== */}
      <div className="about-preloader">
        {/* Progress Bar */}
        <div className="loader-bar-container">
          <div className="loader-bar"></div>
        </div>

        {/* Stacked Image Containers */}
        <div className="preloader-images">
          {teamMembers.map((member) => (
            <div key={member.id} className="dev-img-wrapper">
              <img src={member.image} alt={member.name} className="dev-img" />
              <span className="dev-initial">{member.initial}</span>
            </div>
          ))}
        </div>

        {/* THE TEAM Text */}
        <div className="team-text-container">
          <h2 className="team-text">THE TEAM</h2>
        </div>

        {/* DEVELOPERS Text */}
        <div className="developers-text">
          {developersLetters.map((letter, index) => (
            <span key={index} className="dev-letter">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* ========================================
          MAIN CONTENT
          ======================================== */}
      <div className="about-content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-header">
            <h1 className="hero-title">
              <span className="title-line">MEET THE</span>
              <span className="title-line title-accent">DEVELOPERS</span>
            </h1>
            <p className="hero-subtitle">
              A passionate team building the future of e-commerce
            </p>
          </div>

          {/* Developer Cards */}
          <div className="developer-cards">
            {teamMembers.map((member, index) => (
              <article
                key={member.id}
                className="developer-card"
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector(".card-image");
                  cardHoverIn(e.currentTarget, img);
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector(".card-image");
                  cardHoverOut(e.currentTarget, img);
                }}
              >
                <div className="card-image-wrapper">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="card-image"
                  />
                  <div className="card-overlay">
                    <span className="card-number">0{index + 1}</span>
                  </div>
                </div>

                <div className="card-info">
                  <div className="name-mask">
                    <h3 className="card-name">{member.name}</h3>
                  </div>
                  <div className="card-divider"></div>
                  <span className="card-role">{member.role}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bio Section */}
        <section className="about-bio">
          <div className="bio-container">
            <h2 className="bio-title">Our Mission</h2>
            <p className="bio-text">
              We're building a multivendor e-commerce platform that empowers
              sellers and delights customers. Our focus is on creating seamless
              experiences through modern technology and thoughtful design.
            </p>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="about-tech">
          <h2 className="tech-title">Built With</h2>
          <div className="tech-grid">
            {[
              "React",
              "Node.js",
              "MongoDB",
              "Express",
              "GSAP",
              "Vite",
              "JWT",
              "Stripe",
            ].map((tech, index) => (
              <div key={index} className="tech-item">
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="about-footer">
          <div className="footer-content">
            <span className="footer-year">© 2024</span>
            <span className="footer-divider">|</span>
            <span className="footer-text">Multivendor E-Commerce</span>
          </div>
          <div className="footer-links">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
