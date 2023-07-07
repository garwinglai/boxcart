import React from "react";
import styles from "@/styles/components/storefront/menus/gallery-card.module.css";
import Image from "next/image";

function GalleryCard({ product, openCard, closeCard }) {
  const { imgDefaultStr, imgDefaultAlt } = product;

  function handleCardClick() {
    // window.alert("click");
    
    openCard(imgDefaultStr, imgDefaultAlt);
  }

  return (
    <button onClick={handleCardClick} className={`${styles.gallery_card_box}`}>
      <Image
        className={`${styles.gallery_image}`}
        src={imgDefaultStr}
        alt={imgDefaultAlt}
      />
    </button>
  );
}

export default GalleryCard;
