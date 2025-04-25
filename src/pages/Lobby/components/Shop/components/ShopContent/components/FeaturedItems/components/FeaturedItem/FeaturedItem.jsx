import React from "react";
import styles from "./FeaturedItem.module.scss";
const FeaturedItem = ({ image, title, rarity, description, price }) => {
  return (
    <main className={styles.featuredItem}>
      <section className={styles.featuredItem__image}>
        <img src={image} alt={title} />
      </section>
      <section className={styles.featuredItem__rarity}>
        <img src={rarity} alt="Rarity" />
      </section>
      <section className={styles.featuredItem__content}>
        <h3 className={styles.featuredItem__title}>{title}</h3>
        <h5 className={styles.featuredItem__price}>{price}</h5>
      </section>
    </main>
  );
};

export default FeaturedItem;
