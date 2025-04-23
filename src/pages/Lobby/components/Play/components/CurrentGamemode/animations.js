/**
 * Animation variants for the CurrentGamemode component
 */

export const headingVariants = {
  initial: {
    opacity: 0,
    x: -30,
    scale: 0.9,
    rotateY: -5,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      duration: 0.2,
      bounce: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: 30,
    scale: 0.9,
    rotateY: 5,
    transition: {
      duration: 0.2,
    },
  },
};
