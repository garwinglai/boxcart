import React from "react";
import IconButton from "@mui/material/IconButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import facebook_icon from "@/public/images/icons/socials/facebook_icon.png";
import instagram_icon from "@/public/images/icons/socials/instagram_icon.png";
import youtube_icon from "@/public/images/icons/socials/youtube_icon.png";
import tiktok_icon from "@/public/images/icons/socials/tiktok_icon.png";
import link_icon from "@/public/images/icons/socials/link_icon.png";

function ShopPreview({
  businessName,
  businessBio,
  city,
  socialLinks,
  bannerImage,
  logoImage,
}) {
  const handleOpenSocialLink = (url) => (value) => {
    // check if url has "https://" if not add it
    const newUrl = url.includes("https://") ? url : `https://${url}`;
    window.open(newUrl, "_blank");
  };

  return (
    <div className="bg-white m-4 relative flex flex-col shadow-lg  rounded md:ml-0 md:shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)]">
      <div className="relative">
        {bannerImage ? (
          <div className="w-full h-36 relative">
            <Image
              src={bannerImage}
              alt="banner image"
              fill
              priority
              className=" object-cover rounded"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="rounded w-full h-36 bg-[color:var(--gray-light)] flex justify-center items-center text-[color:var(--gray-text)] border">
            "Banner image"
          </div>
        )}
      </div>
      <div className="mb-4 flex flex-col items-start gap-2 w-full">
        {logoImage ? (
          <div className="w-24 h-24 relative -mt-12 ml-2">
            <Image
              src={logoImage}
              alt="logo icon"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              priority
              className="object-contain rounded-full border border-gray-300 shadow-md bg-white"
            />
          </div>
        ) : (
          <div className="rounded-full w-24 h-24 bg-[color:var(--gray-light)] flex justify-center items-center border text-[color:var(--gray-text)] text-center">
            "Logo"
          </div>
        )}

        <h5 className="ml-4 mt-2">
          {businessName ? businessName : "Your business name"}
        </h5>

        <div className="px-4 w-full">
          {/* <div className="flex items-end">
            {
              <p className="text-xs font-light">
                <span className=" text-base font-medium">12.2k </span>
                Subscribed
              </p>
            }
          </div> */}
          {businessBio ? (
            <p className=" font-light text-sm text-gray-500 mt-2">
              {businessBio}
            </p>
          ) : (
            <p className="font-extralight text-xs mt-2">No bio added.</p>
          )}
          <div className="flex justify-between flex-wrap items-center mt-2">
            <div className="flex gap-1">
              {socialLinks.length === 0 ? (
                <p className="font-extralight text-xs">No socials added.</p>
              ) : (
                socialLinks.map((link, index) => {
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
              {city ? (
                <p className="font-light text-sm text-[color:var(--black-design-extralight)] ">
                  {city}
                </p>
              ) : (
                <p className="text-xs font-extralight">No location added.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPreview;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    border: 0,
    borderBottom: "1px solid var(--gray-light)",

    "&.Mui-selected": {
      borderBottom: "1px solid var(--gray-light)",
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));
