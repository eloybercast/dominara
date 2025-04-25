import React, { useState } from "react";
import styles from "./Shop.module.scss";
import ShopContent from "./components/ShopContent/ShopContent";
import ItemView from "./components/ItemView/ItemView";

const Shop = () => {
  const [isInItemView, setIsInItemView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("character");

  return (
    <main className={styles.shop}>
      <div className={styles.shop__container}>
        {isInItemView ? <ItemView /> : <ShopContent category={selectedCategory} />}
      </div>
    </main>
  );
};

export default Shop;
