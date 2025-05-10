export const sidebarVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

export const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      delay: 0.2
    }
  },
  open: {
    opacity: 1
  }
};
