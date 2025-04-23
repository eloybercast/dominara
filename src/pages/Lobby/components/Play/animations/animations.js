export const currentGamemodeVariants = {
  initial: {
    opacity: 0,
    y: 150,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.3,
      bounce: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: 150,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const playTransition = {
  type: "spring",
  duration: 0.5,
  bounce: 0.3,
};

export const playVariants = {
  initial: {
    opacity: 0,
    y: 150,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 100,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};
