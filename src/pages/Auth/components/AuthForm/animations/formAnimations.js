export const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? 5 : -5,
    z: -30,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: {
      delay: 0.1,
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? -5 : 5,
    z: -30,
  }),
};

export const springTransition = {
  type: "spring",
  stiffness: 350,
  damping: 30,
  mass: 0.8,
  velocity: 2,
  duration: 0.3,
};

export const exitBeforeEnter = true;

export const buttonTransition = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
};
