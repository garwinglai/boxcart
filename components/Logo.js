import React from "react";
import box_logo from "@/public/images/logos/profilelogo.png";
import Image from "next/image";

function Logo() {
  return (
    <Image
      src={box_logo}
      alt="Profile Logo"
      fill
      className="w-full h-full object-cover"
    />
  );
}

export default Logo;
