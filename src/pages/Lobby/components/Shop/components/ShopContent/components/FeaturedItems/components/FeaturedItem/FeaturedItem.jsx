import React from "react";
import styles from "./FeaturedItem.module.scss";
const FeaturedItem = ({ image, title, rarity, description }) => {
  return (
    <main className={styles.featuredItem}>
      <section className={styles.featuredItem__image}>
        <img src={image} alt={title} />
      </section>
      <section className={styles.featuredItem__content}>
        <h3 className={styles.featuredItem__title}>{title}</h3>
        <div className={styles.featuredItem__rarity}>
          <img src={rarity} alt="Rarity" />
        </div>
      </section>
    </main>
  );
};

export default FeaturedItem;
