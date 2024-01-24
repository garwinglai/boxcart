import React from "react";
import Image from "next/image";
import { businessIdentityArr } from "@/helper/temp/tempData";

function Pill({ name }) {
  const imageSrc = businessIdentityArr.filter(
    (identity) => identity.name === name
  )[0].imgSrc;

  const imageAlt = businessIdentityArr.filter(
    (identity) => identity.name === name
  )[0].imgAlt;

  return (
    <div className="flex items-center gap-1 bg-gray-50 shadow text-gray-900 rounded-full px-2 py-1 border border-gray-400">
      <div className="w-4 h-4 relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <p className="text-xs font-extralight">{name}</p>
    </div>
  );
}

export default Pill;
