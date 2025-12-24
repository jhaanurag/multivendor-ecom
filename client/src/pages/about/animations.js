/**
 * About Page Animations
 * Premium GSAP animations for team showcase
 * Features: Preloader sequence, letter transitions, card reveals
 */

import gsap from "gsap";

// Custom "hop" ease using power curve (similar to CustomEase "hop")
// This creates a similar bounce effect without requiring CustomEase plugin
const hopEase = "power3.out";

// Team data
export const teamMembers = [
  {
    id: 1,
    name: "Nilanshu Kumar Singh",
    role: "Full Stack Developer",
    image: "https://i.pravatar.cc/400?img=11",
    initial: "N",
  },
  {
    id: 2,
    name: "Anurag Jha",
    role: "Frontend Developer",
    image: "https://i.pravatar.cc/400?img=12",
    initial: "A",
  },
  {
    id: 3,
    name: "Abhay Vajapye",
    role: "Backend Developer",
    image: "https://i.pravatar.cc/400?img=13",
    initial: "A",
  },
];

/**
 * Initialize the main About page animation sequence
 * @param {Object} refs - Object containing DOM refs
 * @param {Function} onComplete - Callback when animation completes
 */
export const initAboutAnimation = (refs, onComplete) => {
  const {
    preloaderRef,
    loaderBarRef,
    imageWrappers,
    images,
    teamTextRef,
    developersRef,
    letterRefs,
    logoRef,
    heroRef,
    cardRefs,
    nameRefs,
    dividerRefs,
  } = refs;

  // Master timeline
  const masterTl = gsap.timeline({
    delay: 0.3,
    onComplete: () => {
      if (onComplete) onComplete();
    },
  });

  // ========================================
  // PHASE 1: Team Preloader
  // ========================================

  // 1.1 Progress Bar Animation
  masterTl.to(loaderBarRef, {
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
      ease: hopEase,
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
    teamTextRef,
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: hopEase,
    },
    "-=0.6"
  );

  // ========================================
  // PHASE 2: Logo Transition
  // ========================================

  // 2.1 Show DEVELOPERS text
  masterTl.to(
    developersRef,
    {
      opacity: 1,
      duration: 0.5,
    },
    "+=0.3"
  );

  // 2.2 Animate individual letters (D-E-V-E-L-O-P-E-R-S)
  masterTl.from(letterRefs, {
    y: 100,
    opacity: 0,
    stagger: 0.05,
    duration: 0.6,
    ease: hopEase,
  });

  // 2.3 Hold for a moment
  masterTl.to({}, { duration: 0.5 });

  // 2.4 Exit all letters except D and S (indices 0 and 9)
  const exitLetters = letterRefs.filter((_, i) => i !== 0 && i !== 9);
  masterTl.to(exitLetters, {
    y: -100,
    opacity: 0,
    stagger: 0.03,
    duration: 0.5,
    ease: "power3.in",
  });

  // 2.5 Move D and S to center
  const dLetter = letterRefs[0];
  const sLetter = letterRefs[9];

  masterTl.to(
    dLetter,
    {
      x: "40vw",
      duration: 0.8,
      ease: hopEase,
    },
    "-=0.2"
  );

  masterTl.to(
    sLetter,
    {
      x: "-40vw",
      duration: 0.8,
      ease: hopEase,
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

  // 2.7 Fade out preloader elements
  masterTl.to(
    [imageWrappers, teamTextRef, developersRef],
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
    preloaderRef,
    {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1,
      ease: "power4.inOut",
    },
    "-=0.3"
  );

  // 3.2 Show logo in final position
  masterTl.to(
    logoRef,
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: hopEase,
    },
    "-=0.5"
  );

  // 3.3 Reveal hero section
  masterTl.to(
    heroRef,
    {
      opacity: 1,
      duration: 0.5,
    },
    "-=0.3"
  );

  // 3.4 Reveal developer cards with stagger
  masterTl.from(
    cardRefs,
    {
      y: 80,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: hopEase,
    },
    "-=0.2"
  );

  // 3.5 Animate names sliding up from mask
  masterTl.from(
    nameRefs,
    {
      y: 60,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: hopEase,
    },
    "-=0.4"
  );

  // 3.6 Scale in divider lines
  masterTl.from(
    dividerRefs,
    {
      scaleX: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out",
    },
    "-=0.3"
  );

  return masterTl;
};

/**
 * Card hover animation
 */
export const cardHoverIn = (card, image) => {
  gsap.to(card, {
    y: -10,
    duration: 0.4,
    ease: "power3.out",
  });
  gsap.to(image, {
    scale: 1.05,
    duration: 0.6,
    ease: "power2.out",
  });
};

export const cardHoverOut = (card, image) => {
  gsap.to(card, {
    y: 0,
    duration: 0.4,
    ease: "power3.out",
  });
  gsap.to(image, {
    scale: 1,
    duration: 0.6,
    ease: "power2.out",
  });
};

/**
 * Scroll-triggered animations for About page sections
 */
export const initScrollAnimations = (ScrollTrigger, refs) => {
  const { bioSectionRef, skillsRefs } = refs;

  // Bio section parallax
  if (bioSectionRef) {
    gsap.from(bioSectionRef, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: bioSectionRef,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }

  // Skills reveal
  if (skillsRefs && skillsRefs.length > 0) {
    gsap.from(skillsRefs, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: hopEase,
      scrollTrigger: {
        trigger: skillsRefs[0],
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  }
};

/**
 * Cleanup function for animations
 */
export const cleanupAboutAnimations = () => {
  gsap.killTweensOf("*");
};
