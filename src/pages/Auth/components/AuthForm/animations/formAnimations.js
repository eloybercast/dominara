export const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 15 : -15,
    z: -70,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: {
      delay: 0.2,
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -500 : 500,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? -15 : 15,
    z: -70,
  }),
};

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
  mass: 0.9,
  velocity: 5,
  duration: 0.35,
};

export const exitBeforeEnter = true;

export const buttonTransition = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};
