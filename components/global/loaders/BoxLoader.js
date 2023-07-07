import React from "react";
import styles from "@/styles/components/loaders/box-loader.module.css";

function BoxLoader() {
  return (
    <div className={styles.spinner}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default BoxLoader;
