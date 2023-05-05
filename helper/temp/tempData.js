import arts_and_crafts_icon from "../../public/images/icons/business_type/art_and_craft_icon.png";
import bakery_icon from "../../public/images/icons/business_type/bakery_icon.png";
import fashion_icon from "../../public/images/icons/business_type/fashion_icon.png";
import restaurant_icon from "../../public/images/icons/business_type/restaurant_icon.png";
import dessert_icon from "../../public/images/icons/business_type/dessert_icon.png";
import custom_mug from "../../public/images/temp/custom_mug.jpg";
import custom_sweater from "../../public/images/temp/custom_sweater.jpg";

export const businessTypesArr = [
	{
		uniqueId: "1",
		id: "arts and crafts",
		name: "arts and crafts",
		label: "Arts & Crafts",
		imgSrc: arts_and_crafts_icon,
		imgAlt: "arts and crafts icon",
	},
	{
		uniqueId: "2",
		id: "bakery",
		name: "bakery",
		label: "Bakery",
		imgSrc: bakery_icon,
		imgAlt: "bakery icon",
	},
	{
		uniqueId: "3",
		id: "fashion",
		name: "fashion",
		label: "Fashion",
		imgSrc: fashion_icon,
		imgAlt: "Fashion icon",
	},
	{
		uniqueId: "4",
		id: "restaurant",
		name: "restaurant",
		label: "Restaurant",
		imgSrc: restaurant_icon,
		imgAlt: "restaurant icon",
	},
	{
		uniqueId: "5",
		id: "desserts",
		name: "desserts",
		label: "Desserts",
		imgSrc: dessert_icon,
		imgAlt: "desserts icon",
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
