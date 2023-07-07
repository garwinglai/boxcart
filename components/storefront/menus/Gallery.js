import React, { useState } from "react";
import { products } from "@/helper/temp/tempData";
import GalleryCard from "./GalleryCard";
import styles from "@/styles/components/storefront/menus/gallery-menu.module.css";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton } from "@mui/material";

// TODO: Fetch gallery images

function Gallery() {
  const [open, setOpen] = useState(false);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState("");
  const [enlargedImageAlt, setEnlargedImageAlt] = useState("");

  const handleOpen = (imageUrl, imageAlt) => {
    setOpen(true);

    setEnlargedImageUrl(imageUrl);
    setEnlargedImageAlt(imageAlt);
  };
  const handleClose = () => {
    setOpen(false);
    setEnlargedImageUrl("");
    setEnlargedImageAlt("");
  };

  return (
    <div className={`${styles.grid} ${styles.gallery_menu_box}`}>
      {products.map((item, idx) => (
        <GalleryCard
          key={idx}
          product={item}
          openCard={handleOpen}
          closeCard={handleClose}
        />
      ))}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="gallery product image"
        aria-describedby="gallery product image"
      >
        <div className={`${styles.image_full_size}`}>
          <Image
            className={`${styles.enlarged_image} rounded-t-lg`}
            src={enlargedImageUrl}
            alt={enlargedImageAlt}
          />
          <div className={`${styles.flex} ${styles.image_link_box}`}>
            <p>Copy image link.</p>
            <IconButton>
              <ContentCopyIcon />
            </IconButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Gallery;
