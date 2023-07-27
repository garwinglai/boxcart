import React from "react";
import candle_banner_temp from "@/public/images/temp/candle_banner.jpeg";
import candle_logo_temp from "@/public/images/temp/candle_logo_temp.jpeg";
import boxcart_logo from "@/public/images/logos/boxcart_logo_full.png";
import Image from "next/image";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ShareIcon from "@mui/icons-material/Share";
import { useRouter } from "next/router";

function ShopHeader({ isOwner }) {
  const { push } = useRouter();

  // Is Owner
  const handleEditProfile = () => {
    push("/account/my-shop/profile");
  };

  const handleShareStore = () => {
    push("/account/my-shop/share");
  };

  // Is Customer
  const handleSubscribe = () => {};

  const handleMessage = () => {};

  return (
    <React.Fragment>
      <Image
        src={candle_banner_temp}
        alt="business banner image"
        className="w-full object-contain xl:h-[20rem] xl:object-cover border-b"
      />
      <div className="relative">
        <Image
          src={boxcart_logo}
          alt="business logo"
          className="border border-[color:var(--gray-light-med)] bg-white rounded-full w-24 h-24 absolute -top-12 left-4 md:w-32 md:h-32 md:-top-16 md:left-8 "
        />
        <div className="flex h-10 gap-2 absolute right-4 -top-5 md:top-4 md:right-8">
          <button
            onClick={isOwner ? handleEditProfile : handleSubscribe}
            className="text-white font-light text-sm py-1 px-6 bg-[color:var(--black-design-extralight)] active:bg-black"
          >
            {isOwner ? "Edit Profile" : "Subscribe"}
          </button>

          <button
            onClick={isOwner ? handleShareStore : handleMessage}
            className="md:block bg-white font-light text-sm py-2 px-6 border border-[color:var(--black-design-extralight)] active:bg-gray-400"
          >
            {isOwner ? "Share Store" : "Message"}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ShopHeader;
