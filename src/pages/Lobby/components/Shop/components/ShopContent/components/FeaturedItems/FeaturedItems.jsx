import React, { useState, useEffect, useRef } from "react";
import styles from "./FeaturedItems.module.scss";
import FeaturedItem from "./components/FeaturedItem/FeaturedItem";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const FeaturedItems = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const featuredItems = [
    {
      id: 1,
      image: "https://placehold.co/1200x800/gold/gold",
      rarity: "https://placehold.co/30x30/red/white",
      title: "Item 1",
      price: 1500,
    },
    {
      id: 2,
      image: "https://placehold.co/1200x800/purple/purple",
      rarity: "https://placehold.co/30x30/blue/white",
      title: "Item 2",
      price: 1200,
    },
    {
      id: 3,
      image: "https://placehold.co/1200x800/blue/blue",
      rarity: "https://placehold.co/30x30/green/white",
      title: "Item 3",
      price: 950,
    },
    {
      id: 4,
      image: "https://placehold.co/1200x800/green/green",
      rarity: "https://placehold.co/30x30/gold/white",
      title: "Item 4",
      price: 2000,
    },
  ];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        handleNext();
      }
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  return (
    <main
      className={styles.featuredItems}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <section className={styles.featuredItems__items}>
        {featuredItems.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.featuredItems__itemWrapper} ${index === selectedIndex ? styles.selected : ""}`}
          >
            <FeaturedItem {...item} />
          </div>
        ))}
      </section>

      <button
        className={`${styles.navigationButton} ${styles.prevButton}`}
        onClick={handlePrev}
        aria-label="Previous item"
        style={{ cursor: "pointer" }}
      >
        <HiChevronLeft />
      </button>

      <button
        className={`${styles.navigationButton} ${styles.nextButton}`}
        onClick={handleNext}
        aria-label="Next item"
        style={{ cursor: "pointer" }}
      >
        <HiChevronRight />
      </button>

      <div className={styles.indicators}>
        {featuredItems.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${index === selectedIndex ? styles.activeIndicator : ""}`}
            onClick={() => setSelectedIndex(index)}
            role="button"
            aria-label={`Go to item ${index + 1}`}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
    </main>
  );
};

export default FeaturedItems;
