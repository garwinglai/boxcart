import arts_and_crafts_icon from "../../public/images/icons/business_type/art_and_craft_icon.png";
import bakery_icon from "../../public/images/icons/business_type/bakery_icon.png";
import fashion_icon from "../../public/images/icons/business_type/fashion_icon.png";
import restaurant_icon from "../../public/images/icons/business_type/restaurant_icon.png";
import dessert_icon from "../../public/images/icons/business_type/dessert_icon.png";
import custom_mug from "../../public/images/temp/custom_mug.jpg";
import custom_sweater from "../../public/images/temp/custom_sweater.jpg";
import launch_icon from "@/public/images/icons/launch_icon.png";
import crowd_funding_icon from "@/public/images/icons/crowd_funding_icon.png";
import ecomm_icon from "@/public/images/icons/business_type/ecomm_icon.png";
import digital_icon from "@/public/images/icons/business_type/digital_icon.png";
import jewelry_icon from "@/public/images/icons/business_type/jewelry_icon.png";
import service_icon from "@/public/images/icons/business_type/service_icon.png";
import gift_icon from "@/public/images/icons/business_type/gift_icon.png";
import home_icon from "@/public/images/icons/business_type/home_icon.png";
import beverage_icon from "@/public/images/icons/business_type/beverage_icon.png";
import beauty_icon from "@/public/images/icons/business_type/beauty_icon.png";
import flower_icon from "@/public/images/icons/business_type/flower_icon.png";
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
    id: "arts-and-crafts",
    name: "arts and crafts",
    label: "Arts & Crafts",
    imgSrc: arts_and_crafts_icon,
    imgAlt: "arts and crafts icon",
  },
  {
    id: "beauty",
    name: "beauty",
    label: "Beauty",
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
    id: "digital-products",
    name: "digital-products",
    label: "Digital Products",
    imgSrc: digital_icon,
    imgAlt: "digital product icon",
  },
  {
    id: "e-commerce",
    name: "e-commerce",
    label: "E-commerce",
    imgSrc: ecomm_icon,
    imgAlt: "ecommerce icon",
  },
  {
    id: "fashion",
    name: "fashion",
    label: "Fashion",
    imgSrc: fashion_icon,
    imgAlt: "Fashion icon",
  },
  {
    id: "florist",
    name: "florist",
    label: "Florist",
    imgSrc: flower_icon,
    imgAlt: "Flower icon",
  },
  {
    id: "food",
    name: "food",
    label: "Food",
    imgSrc: restaurant_icon,
    imgAlt: "food icon",
  },
  {
    id: "gifts",
    name: "gifts",
    label: "Gifts",
    imgSrc: gift_icon,
    imgAlt: "gifts icon",
  },
  {
    id: "home",
    name: "home",
    label: "Home decor",
    imgSrc: home_icon,
    imgAlt: "home icon",
  },
  {
    id: "jewelry",
    name: "jewelry",
    label: "Jewelry",
    imgSrc: jewelry_icon,
    imgAlt: "jewelry icon",
  },
  {
    id: "service",
    name: "service",
    label: "Service",
    imgSrc: service_icon,
    imgAlt: "service icon",
  },
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
