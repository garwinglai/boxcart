import arts_and_crafts_icon from "../../public/images/icons/business_type/art_and_craft_icon.png";
import fashion_icon from "../../public/images/icons/business_type/fashion_icon.png";
import restaurant_icon from "../../public/images/icons/business_type/restaurant_icon.png";
import custom_mug from "../../public/images/temp/custom_mug.jpg";
import custom_sweater from "../../public/images/temp/custom_sweater.jpg";
import launch_icon from "@/public/images/icons/launch_icon.png";
import digital_icon from "@/public/images/icons/business_type/digital_icon.png";
import jewelry_icon from "@/public/images/icons/business_type/jewelry_icon.png";
import service_icon from "@/public/images/icons/business_type/service_icon.png";
import gift_icon from "@/public/images/icons/business_type/gift_icon.png";
import home_icon from "@/public/images/icons/business_type/home_icon.png";
import beverage_icon from "@/public/images/icons/business_type/beverage_icon.png";
import beauty_icon from "@/public/images/icons/business_type/beauty_icon.png";
import a_icon from "@/public/images/icons/business_identity/a_icon.png";
import american_flag_icon from "@/public/images/icons/business_identity/american_flag_icon.png";
import b_icon from "@/public/images/icons/business_identity/b_icon.png";
import bcorp_icon from "@/public/images/icons/business_identity/bcorp_icon.png";
import family_icon from "@/public/images/icons/business_identity/family_icon.png";
import i_icon from "@/public/images/icons/business_identity/i_icon.png";
import l_icon from "@/public/images/icons/business_identity/l_icon.png";
import lgbtqia_icon from "@/public/images/icons/business_identity/lgbtqia_icon.png";
import recycle_icon from "@/public/images/icons/business_identity/recycle_icon.png";
import vegan_icon from "@/public/images/icons/business_identity/vegan_icon.png";
import vegetarian_icon from "@/public/images/icons/business_identity/vegetarian_icon.png";
import veteran_icon from "@/public/images/icons/business_identity/veteran_icon.png";
import x_icon from "@/public/images/icons/business_identity/x_icon.png";
import heart_icon from "@/public/images/icons/business_type/heart_icon.png";
import book_icon from "@/public/images/icons/business_type/book_icon.png";
import music_icon from "@/public/images/icons/business_type/music_icon.png";
import dog_icon from "@/public/images/icons/business_type/dog_icon.png";
import football_icon from "@/public/images/icons/business_type/football_icon.png";
import pokeball_icon from "@/public/images/icons/business_type/pokeball_icon.png";
import old_photo_icon from "@/public/images/icons/business_type/old_photo_icon.png";
import baby_stroller_icon from "@/public/images/icons/business_type/baby_stroller_icon.png";
import electronics_icon from "@/public/images/icons/business_type/electronics_icon.png";
import furniture_icon from "@/public/images/icons/business_type/furniture_icon.png";
import candle_icon from "@/public/images/icons/business_type/candle_icon.png";
import version_icon from "@/public/images/icons/version_update_icon.png";

export const sellerVersion = {
  icon: version_icon,
  value: "version 0.0.2",
  updates: [
    "Minor bug fixes.",
    "Digital & media products are now available.",
    "Import products from Shopify & Etsy.",
    "Chrome plugin enabled - your products will now be promoted to online customers for free! More information: www.boxcart.shop",
    // "Tax automations are now available.",
  ],
  coming: [],
};

export const shopperVersion = {
  icon: version_icon,
  value: "version 0.0.2",
  updates: ["Minor bug fixes.", "Digital & media products are now available."],
  coming: [],
};

export const storeVersion = {
  value: "version 0.0.2",
};

export const membershipPackages = [
  // {
  //   id: 1,
  //   icon: crowd_funding_icon,
  //   planName: "Entrepreneur Plan",
  //   description: "Perfect for businesses who are looking to grow.",
  //   priceMonth: 0,
  //   priceYear: 0,
  //   pricePerMonthDisplay: "coming soon",
  //   pricePerYearDisplay: "coming soon",
  //   features: [
  //     "Everything in Starter Plan",
  //     "Email suppport",
  //     "Automated email marketing",
  //     "Abandon cart emails",
  //     "Automated social media posts",
  //     "Chat",
  //     "Customer list",
  //     "Advanced analytics",
  //     "Gift cards",
  //     "Discount codes",
  //     "Loyalty program",
  //     "Customer review",
  //     "Team accounts",
  //     "Delivery integration",
  //     "Bookkeeping",
  //     "Custom shop themes",
  //   ],
  // },
  {
    id: 2,
    icon: launch_icon,
    planName: "Starter Plan",
    description:
      "Perfect for new and small businesses looking to easily sell online.",
    priceMonth: 1200,
    priceYear: 900,
    pricePerMonthDisplay: "$12 / month",
    pricePerYearDisplay: "$9 / month",
    features: [
      "Help center support",
      "Storefront",
      "Order management",
      "Order invoice",
      "Set availabilities",
      "Custom orders",
      "Bulk product uploads",
      "Automated payments",
      "Cash, PayPal, Zelle, Venmo",
    ],
  },
];

export const businessIdentityArr = [
  {
    id: "aapi",
    name: "AAPI",
    label: "AAPI",
    imgSrc: a_icon,
    imgAlt: "aapi icon",
  },
  {
    id: "b-corp-certified",
    name: "B-Corp",
    label: "B corp certified",
    imgSrc: bcorp_icon,
    imgAlt: "b corp icon",
  },
  {
    id: "black-owned",
    name: "Black owned",
    label: "Black owned",
    imgSrc: b_icon,
    imgAlt: "black avatar icon",
  },
  {
    id: "family-owned",
    name: "Family owned",
    label: "Family owned",
    imgSrc: family_icon,
    imgAlt: "family icon",
  },
  {
    id: "indigenous-owned",
    name: "Indigenous owned",
    label: "Indigenous owned",
    imgSrc: i_icon,
    imgAlt: "indigenous avatar icon",
  },
  {
    id: "latina-owned",
    name: "Latina owned",
    label: "Latina owned",
    imgSrc: l_icon,
    imgAlt: "latina avatar icon",
  },
  {
    id: "lgbtqia-owned",
    name: "LGBTQIA+ owned",
    label: "LGBTQIA+ owned",
    imgSrc: lgbtqia_icon,
    imgAlt: "lgbtqia icon",
  },
  {
    id: "made-in-america",
    name: "Made in america",
    label: "Made in america",
    imgSrc: american_flag_icon,
    imgAlt: "american flag icon",
  },
  {
    id: "sustainable",
    name: "Sustainable",
    label: "Sustainable",
    imgSrc: recycle_icon,
    imgAlt: "sustainability icon",
  },
  {
    id: "vegan",
    name: "Vegan",
    label: "Vegan",
    imgSrc: vegan_icon,
    imgAlt: "vegan icon",
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    label: "Vegetarian",
    imgSrc: vegetarian_icon,
    imgAlt: "vegetarian icon",
  },
  {
    id: "veteran-owned",
    name: "Veteran owned",
    label: "Veteran owned",
    imgSrc: veteran_icon,
    imgAlt: "veteran icon",
  },
  {
    id: "none",
    name: "None",
    label: "None",
    imgSrc: x_icon,
    imgAlt: "x icon",
  },
];

export const businessTypesArr = [
  {
    id: "arts-crafts-hobby",
    name: "arts crafts hobby",
    label: "Arts, Crafts, & Hobby",
    imgSrc: arts_and_crafts_icon,
    imgAlt: "arts and crafts icon",
  },
  {
    id: "baby-and-todler",
    name: "baby and todler",
    label: "Baby & Todler",
    imgSrc: baby_stroller_icon,
    imgAlt: "baby stroller icon",
  },
  {
    id: "beauty-and-skincare",
    name: "beauty and skincare",
    label: "Beauty & Skincare",
    imgSrc: beauty_icon,
    imgAlt: "beauty icon",
  },
  {
    id: "beverage",
    name: "beverage",
    label: "Beverage",
    imgSrc: beverage_icon,
    imgAlt: "beverage icon",
  },
  {
    id: "digital-products-and-media",
    name: "digital-media-products",
    label: "Digital & Media Products",
    imgSrc: digital_icon,
    imgAlt: "digital product icon",
  },
  {
    id: "electronics",
    name: "electronics",
    label: "Electronics",
    imgSrc: electronics_icon,
    imgAlt: "electronics icon",
  },
  {
    id: "fashion-and-apparel",
    name: "fashion and apparel",
    label: "Fashion & Apparel",
    imgSrc: fashion_icon,
    imgAlt: "Fashion icon",
  },
  {
    id: "food",
    name: "food",
    label: "Food",
    imgSrc: restaurant_icon,
    imgAlt: "food icon",
  },
  {
    id: "fragrance-and-candles",
    name: "fragrance and candles",
    label: "Fragrance & Candles",
    imgSrc: candle_icon,
    imgAlt: "candle icon",
  },
  {
    id: "furniture",
    name: "furiture",
    label: "Furniture",
    imgSrc: furniture_icon,
    imgAlt: "furniture icon",
  },
  {
    id: "gifts",
    name: "gifts",
    label: "Gifts",
    imgSrc: gift_icon,
    imgAlt: "gifts icon",
  },
  {
    id: "health-and-wellness",
    name: "health-and-wellness",
    label: "Health & Wellness",
    imgSrc: heart_icon,
    imgAlt: "gifts icon",
  },
  {
    id: "home-and-garden",
    name: "home and garden",
    label: "Home & Garden",
    imgSrc: home_icon,
    imgAlt: "home icon",
  },
  {
    id: "jewelry-and-accessories",
    name: "jewelry and accessories",
    label: "Jewelry & Accessories",
    imgSrc: jewelry_icon,
    imgAlt: "jewelry icon",
  },
  {
    id: "literature",
    name: "literature",
    label: "Literature",
    imgSrc: book_icon,
    imgAlt: "book icon",
  },
  {
    id: "music",
    name: "music",
    label: "Music",
    imgSrc: music_icon,
    imgAlt: "music icon",
  },
  {
    id: "pet-and-animal",
    name: "pet and animal",
    label: "Pet & Animal",
    imgSrc: dog_icon,
    imgAlt: "dpg icon",
  },
  {
    id: "service",
    name: "service",
    label: "Service",
    imgSrc: service_icon,
    imgAlt: "service icon",
  },
  {
    id: "sporting-goods",
    name: "sporting goods",
    label: "Sporting Goods",
    imgSrc: football_icon,
    imgAlt: "footbal icon",
  },
  {
    id: "toys-and-games",
    name: "toys and games",
    label: "Toys & Games",
    imgSrc: pokeball_icon,
    imgAlt: "pokemon icon",
  },
  {
    id: "vintage-antique-and-collectibles",
    name: "vintage antique and collectibles",
    label: "Vintage, Antique, & Collectibles",
    imgSrc: old_photo_icon,
    imgAlt: "old photo icon",
  },
  // {
  //   id: "other",
  //   name: "vintage antique and collectibles",
  //   label: "Vintage, Antique, & Collectibles",
  //   imgSrc: service_icon,
  //   imgAlt: "service icon",
  // },
];

export const products = [
  {
    id: 1,
    name: "Custom mug",
    description: "Customize your a memorable mug for your favorite person.",
    priceStr: "$12.99",
    priceDouble: 12.0,
    reviewStr: "4.67",
    reviewDouble: 4.67,
    reviewCountStr: "231",
    reviewCountDouble: 231,
    quantity: 0,
    category: "mugs",
    hasOptions: true,
    options: [
      {
        option1: {
          optionName: "Size",
          selectOne: true,
          selectMany: false,
          variations: [
            {
              id: 1,
              item: "small",
              priceStr: "$0.00",
              priceDouble: 0.0,
            },
            {
              id: 2,
              item: "medium",
              priceStr: "$1.00",
              priceDouble: 1.0,
            },
            {
              id: 3,
              item: "large",
              priceStr: "$2.00",
              priceDouble: 2.0,
            },
          ],
        },
      },
      {
        option2: {
          optionName: "Freebies",
          selectOne: false,
          selectMany: true,
          variations: [
            {
              id: 4,
              item: "cup",
              priceStr: "$0.00",
              priceDouble: 0.0,
            },
            {
              id: 5,
              item: "t-shirt",
              priceStr: "$0.00",
              priceDouble: 0.0,
            },
          ],
        },
      },
    ],
    enableNote: true,
    notePlaceHOlder: "Please share any links or images as an example.",
    imgDefaultStr: custom_mug,
    imgDefaultAlt: "Mug image",
    imgArr: [
      {
        imgStr: custom_mug,
        imgAlt: "Mug image",
        isDefault: false,
      },
      {
        imgStr: custom_sweater,
        imgAlt: "Mug image",
        isDefault: true,
      },
      {
        imgStr: custom_mug,
        imgAlt: "Mug image",
        isDefault: false,
      },
    ],
  },
  {
    id: 2,
    name: "Custom mug",
    description: "Customize your a memorable mug for your favorite person.",
    priceStr: "$12.99",
    priceDouble: 12.0,
    reviewStr: "4.67",
    reviewDouble: 4.67,
    reviewCountStr: "231",
    reviewCountDouble: 231,
    quantity: 23,
    category: "mugs",
    hasOptions: true,
    options: {
      size: {
        smallStr: "$0.00",
        smallDouble: 0.0,
        mediumStr: "$0.50",
        mediumDouble: 0.5,
        largeStr: "$1.00",
        largeDouble: 1.0,
      },
    },
    enableNote: true,
    imgDefaultStr: custom_sweater,
    imgDefaultAlt: "Mug image",
    imgArr: [
      {
        imgStr: custom_sweater,
        imgAlt: "Mug image",
        isDefault: false,
      },
      {
        imgStr: custom_mug,
        imgAlt: "Mug image",
        isDefault: false,
      },
      {
        imgStr: custom_mug,
        imgAlt: "Mug image",
        isDefault: true,
      },
    ],
  },
  {
    id: 4,
    name: "Custom mug",
    description: "Customize your a memorable mug for your favorite person.",
    priceStr: "$12.99",
    priceDouble: 12.0,
    reviewStr: "4.67",
    reviewDouble: 4.67,
    reviewCountStr: "231",
    reviewCountDouble: 231,
    quantity: 23,
    category: "mugs",
    hasOptions: true,
    options: {
      size: {
        smallStr: "$0.00",
        smallDouble: 0.0,
        mediumStr: "$0.50",
        mediumDouble: 0.5,
        largeStr: "$1.00",
        largeDouble: 1.0,
      },
    },
    enableNote: true,
    imgDefaultStr: custom_sweater,
    imgDefaultAlt: "Mug image",
    imgArr: [
      {
        imgStr: custom_mug,
        imgAlt: "Mug image",
        isDefault: false,
      },
      {
        imgStr: custom_sweater,
        imgAlt: "Mug image",
        isDefault: true,
      },
      {
        imgStr: custom_mug,
        imgAlt: "Mug image",
        isDefault: false,
      },
    ],
  },
  {
    id: 3,
    name: "Custom mug",
    description: "Customize your a memorable mug for your favorite person.",
    priceStr: "$12.99",
    priceDouble: 12.0,
    reviewStr: "4.67",
    reviewDouble: 4.67,
    reviewCountStr: "231",
    reviewCountDouble: 231,
    quantity: 23,
    category: "mugs",
    hasOptions: true,
    options: {
      size: {
        smallStr: "$0.00",
        smallDouble: 0.0,
        mediumStr: "$0.50",
        mediumDouble: 0.5,
        largeStr: "$1.00",
        largeDouble: 1.0,
      },
    },
    enableNote: true,
    imgDefaultStr: custom_mug,
    imgDefaultAlt: "Mug image",
    imgArr: [
      {
        imgStr: custom_mug,
        imgAlt: "Mug image",
        isDefault: true,
      },
      {
        imgStr: custom_mug,
        imgAlt: "Mug image",
        isDefault: false,
      },
      {
        imgStr: custom_mug,
        imgAlt: "Mug image",
        isDefault: false,
      },
    ],
  },
];

export const csvProductTemplate = {
  productName: "",
  description: "",
  price: "",
  quantity: "",
  category1: "",
  category2: "",
  category3: "",
  question1: "",
  question2: "",
  question3: "",
  question4: "",
  question5: "",
  customNote: "",
  customerUploads: "",
};

export const csvSampleProductTemplate = {
  productName: "Necklace",
  description: "Sterling silver necklace",
  price: "$12.99",
  quantity: "unlimited",
  category1: "jewelry",
  category2: "",
  category3: "",
  question1: "Are you allergic to silver?",
  question2: "",
  question3: "",
  question4: "",
  question5: "",
  customNote: "yes",
  customerUploads: "no",
};
