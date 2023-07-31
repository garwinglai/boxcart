import React from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { IconButton } from "@mui/material";
import facebook_icon from "@/public/images/icons/socials/facebook_icon.png";
import instagram_icon from "@/public/images/icons/socials/instagram_icon.png";
import youtube_icon from "@/public/images/icons/socials/youtube_icon.png";
import tiktok_icon from "@/public/images/icons/socials/tiktok_icon.png";
import link_icon from "@/public/images/icons/socials/link_icon.png";
import Image from "next/image";

function ShopBio({ isOwner, businessData }) {
  const { businessName, businessBio, city, socials } = businessData || {};

  const handleOpenSocialLink = (url) => (value) => {
    // check if url has "https://" if not add it
    const newUrl = url.includes("https://") ? url : `https://${url}`;
    window.open(newUrl, "_blank");
  };

  return (
    <div className="mt-16 px-4 md:mt-20 md:px-8 md:mb-4">
      <h4 className="mb-2">{businessName}</h4>
      {/* <p className="text-xs font-light">
        <span className=" text-base font-medium">12.2k </span>
        Subscribed
      </p> */}
      <p className="font-light text-sm my-2 text-[color:var(--black-design-extralight)] ">
        {businessBio}
      </p>
      <div className="flex justify-between flex-wrap items-center mt-2">
        <div className="flex gap-1">
          {socials && socials.length === 0 ? (
            <p className="font-extralight text-xs">No socials added.</p>
          ) : (
            socials &&
            socials.map((link, index) => {
              const { platform, socialLink } = link;

              const platformIcon = (platform) => {
                switch (platform) {
                  case "facebook":
                    return facebook_icon;
                  case "instagram":
                    return instagram_icon;
                  case "youtube":
                    return youtube_icon;
                  case "tiktok":
                    return tiktok_icon;
                  default:
                    return link_icon;
                }
              };

              return (
                <div
                  key={index}
                  className="rounded-full bg-[color:var(--white-design)]"
                >
                  <IconButton onClick={handleOpenSocialLink(socialLink)}>
                    <Image
                      src={platformIcon(platform)}
                      alt="instagram icon"
                      className="w-6 opacity-70"
                    />
                  </IconButton>
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-1">
          <LocationOnOutlinedIcon
            fontSize="small"
            sx={{ color: "var(--gray-text)" }}
          />
          <p className="font-light text-sm text-[color:var(--black-design-extralight)] ">
            los angeles
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShopBio;
