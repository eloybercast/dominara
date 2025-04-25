import React from "react";
import styles from "./ShopContent.module.scss";
import FeaturedItems from "./components/FeaturedItems/FeaturedItems";
const ShopContent = ({ category }) => {
  return (
    <main className={styles.shopContent}>
      <section className={styles.shopContent__featuredItems}>
        <FeaturedItems />
      </section>
      <section className={styles.shopContent__items}>
        <h2>{category}</h2>
      </section>
    </main>
  );
};

export default ShopContent;
