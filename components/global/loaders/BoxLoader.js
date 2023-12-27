import React from "react";
import styles from "@/styles/components/loaders/box-loader.module.css";
import Image from "next/image";
import beaver_icon from "@/public/images/icons/beaver_icon.png";

function BoxLoader() {
  return (
    <div className="flex justify-center">
      <div className="relative w-6 h-6 animate-bounce">
        <Image
          src={beaver_icon}
          alt="beaver icon"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}

export default BoxLoader;
