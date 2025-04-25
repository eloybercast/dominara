import React from "react";
import styles from "./FeaturedItems.module.scss";
import FeaturedItem from "./components/FeaturedItem/FeaturedItem";
const FeaturedItems = () => {
  const featuredItems = [
    {
      image: "https://placehold.co/1200x800",
      rarity: "https://placehold.co/30x30",
      title: "Featured Item 1",
      price: 100,
    },
  ];

  return (
    <main className={styles.featuredItems}>
      <section className={styles.featuredItems__items}>
        {featuredItems.map((item) => (
          <FeaturedItem key={item.id} {...item} />
        ))}
      </section>
    </main>
  );
};

export default FeaturedItems;
