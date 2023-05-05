import React, { useState, useRef, useEffect } from "react";
import LinearProgressWithLabel from "@/components/loaders/LinearProgressWithLabel";
import styles from "../../../styles/home/auth/signup.module.css";
import NextBackButtons from "@/components/signup/NextBackButtons";
import BusinessTypeCheckbox from "@/components/signup/BusinessTypeCheckbox";
import instagram_icon from "../../../public/images/icons/socials/instagram_icon.png";
import facebook_icon from "../../../public/images/icons/socials/facebook_icon.png";
import tiktok_icon from "../../../public/images/icons/socials/tiktok_icon.png";
import youtube_icon from "../../../public/images/icons/socials/youtube_icon.png";
import { Avatar } from "@mui/material";
import Image from "next/image";
import FulfillmentRadioGroup from "@/components/signup/SignupFormRadioGroup";
import pickup_pin_point_icon from "../../../public/images/icons/fulfillment/pickup_pin_point_icon.png";
import skooter_icon from "../../../public/images/icons/fulfillment/skooter_icon.png";
import package_icon from "../../../public/images/icons/fulfillment/package_icon.png";
import delivery_icon from "../../../public/images/icons/fulfillment/delivery_truck_icon.png";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { businessTypesArr } from "@/helper/temp/tempData";
import SignupFormAddress from "@/components/signup/SignupFormAddress";
import SignupFormDistance from "@/components/signup/SignupFormDistance";
import SignupFormEnableTips from "@/components/signup/SignupFormEnableTips";
import CredentialsForm from "@/components/auth/CredentialsForm";
import SignupFormSetTip from "@/components/signup/SignupFormSetTip";
import { checkAccessCode } from "@/helper/client/api/account/early-bird-code";
import { checkSubdomainTakenUser } from "@/helper/client/api/account/subdomain";
import { checkSubdomainAvail } from "@/helper/client/api/waitlist/waitlist";
import { checkEmailAvailable } from "@/helper/client/api/account/email";
import { newUserSignup } from "@/helper/client/api/auth/registration";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { sendVerificationEmail } from "@/helper/client/api/sendgrid/email";

// steps:
// 0: accessCode
// 1: business name
// 2: subdomain
// 3: business type
// 4: logo image
// 5: business bio
// 6: socials
// 7: fulfillment type - 0: delivery, 1: pickup, 2: both
// 8: a. if (delivery) = delivery type - 0: outsource, 1: in house    		b. if (pickup) = custom note		c. if(both) = same as a
// 9: a. if (outsource) = address, 			if(in house) = distance     			b. if(custom note) = address		c.1 if(outsource) = custom note  						c.2 if(in-house) = distance
// 10: a.1 if (address) = enable tips   a.2 if(distance) = address    		b. (follow rest of a.1.)				c. if(custom note) = follow reset of b			c.2 if(distance) = custom note, follow rest of c.1
// 11: a.1 if(enable tips) = set tips else (creds)  a.2 if (address) = enable tips
// 12: a.1 if (set tips) =  creds		a.2 if (enable tips) = set tips else (creds)
// 13:																	a.2 if (set tips) = creds

function Signup() {
	const [waitListEmail, setWaitListEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState(0);
	const [maxSteps, setMaxSteps] = useState(12);
	const [isLastStep, setIsLastStep] = useState(false);
	const [canSkip, setCanSkip] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	const [openError, setOpenError] = useState(false);
	const [signupValues, setSignupValues] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		accessCode: "",
		businessName: "",
		subdomain: "",
		businessTypes: [],
		otherBusinessType: "",
		logoImgStr: "",
		businessBio: "",
		socialLinks: {
			facebookUrl: "",
			instagramUrl: "",
			tiktokUrl: "",
			youtubeUrl: "",
		},
		fulfillmentMethodInt: null,
		fulfillmentMethods: [],
		deliveryTypeInt: null,
		deliveryTypeStr: "",
		localDeliveryDistanceStr: "",
		localDeliveryDistanceMi: null,
		localDeliveryDistanceKm: null,
		pickupNote: "",
		address_1: "",
		address_2: "",
		city: "",
		state: "",
		zip: "",
		fullAddress: "",
		enableTips: true,
		typeOfTip: "percentage",
		tipValues: {
			tip1: {
				tipStr: "",
				tipInt: null,
			},
			tip2: {
				tipStr: "",
				tipInt: null,
			},
			tip3: {
				tipStr: "",
				tipInt: null,
			},
		},
		email: "",
		password: "",
	});

	const {
		firstName,
		lastName,
		email,
		password,
		accessCode,
		businessName,
		subdomain,
		businessTypes,
		otherBusinessType,
		logoImgStr,
		businessBio,
		socialLinks,
		fulfillmentMethodInt,
		fulfillmentMethods,
		deliveryTypeInt,
		deliveryTypeStr,
		localDeliveryDistanceStr,
		localDeliveryDistanceMi,
		localDeliveryDistanceKm,
		pickupNote,
		address_1,
		address_2,
		city,
		state,
		zip,
		fullAddress,
		enableTips,
		typeOfTip,
		tipValues,
	} = signupValues;

	const { facebookUrl, instagramUrl, tiktokUrl, youtubeUrl } = socialLinks;
	const { tip1, tip2, tip3 } = tipValues;

	const subdomainInputRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		console.log("curr step", step);
		setIsLoading(false);
		setIsLastStep(false);
		isStepSkipped(step);

		// fulfillmentMethod: 0: delivery, 1: pickup, 2: both.
		// deliverymethod: 0. outsource, 1: in-house
		if (fulfillmentMethodInt == 0) {
			if (deliveryTypeInt == 0) {
				if (enableTips) {
					setMaxSteps(13);
					if (step == 12) {
						setIsLastStep(true);
					}
				} else {
					setMaxSteps(12);
					if (step == 11) {
						setIsLastStep(true);
					}
				}
			}
			if (deliveryTypeInt == 1) {
				if (enableTips) {
					setMaxSteps(14);
					if (step == 13) {
						setIsLastStep(true);
					}
				} else {
					setMaxSteps(13);
					if (step == 12) {
						setIsLastStep(true);
					}
				}
			}
		}

		if (fulfillmentMethodInt == 1) {
			if (enableTips) {
				setMaxSteps(13);
				if (step == 12) {
					setIsLastStep(true);
				}
			} else {
				setMaxSteps(12);
				if (step == 11) {
					setIsLastStep(true);
				}
			}
		}

		if (fulfillmentMethodInt == 2) {
			if (deliveryTypeInt == 0) {
				if (enableTips) {
					setMaxSteps(14);
					if (step == 13) {
						setIsLastStep(true);
					}
				} else {
					setMaxSteps(13);
					if (step == 12) {
						setIsLastStep(true);
					}
				}
			}

			if (deliveryTypeInt == 1) {
				if (enableTips) {
					setMaxSteps(15);
					if (step == 14) {
						setIsLastStep(true);
					}
				} else {
					setMaxSteps(14);
					if (step == 13) {
						setIsLastStep(true);
					}
				}
			}
		}
	}, [
		step,
		accessCode,
		logoImgStr,
		businessBio,
		facebookUrl,
		instagramUrl,
		youtubeUrl,
		tiktokUrl,
		pickupNote,
		fulfillmentMethodInt,
		deliveryTypeInt,
		enableTips,
	]);

	//* Next, Skip, Back buttons.
	function isStepSkipped(step) {
		let skipSteps = [0, 4, 5, 6];

		// Access code step.
		if (step == 0) {
			if (accessCode !== "") {
				setCanSkip(false);
			} else {
				setCanSkip(true);
			}
			return;
		}

		// Upload logo step
		if (step == 4) {
			if (logoImgStr !== "") {
				setCanSkip(false);
			} else {
				setCanSkip(true);
			}
			return;
		}

		// Bio step
		if (step == 5) {
			if (businessBio !== "") {
				setCanSkip(false);
			} else {
				setCanSkip(true);
			}
			return;
		}

		// Socials step
		if (step == 6) {
			let hasLinks = false;
			for (const [key, value] of Object.entries(socialLinks)) {
				if (value !== "") {
					hasLinks = true;
					continue;
				}
			}

			if (hasLinks) {
				setCanSkip(false);
			} else {
				setCanSkip(true);
			}
			return;
		}

		// pickup note
		if (
			(step == 8 && fulfillmentMethodInt == 1) ||
			(step == 9 && fulfillmentMethodInt == 2 && deliveryTypeInt == 0) ||
			(step == 11 && fulfillmentMethodInt == 2 && deliveryTypeInt == 1)
		) {
			if (pickupNote !== "") {
				setCanSkip(false);
			} else {
				setCanSkip(true);
			}
			return;
		}

		// Fulfillment - 0: delivery, 1: pickup, 2: both.
		if (fulfillmentMethodInt == 1) {
			skipSteps.push(8);
		}

		if (fulfillmentMethodInt == 2) {
			// DeliveryInt - 0: outsource, 1: in-house

			if (deliveryTypeInt == 0) {
				skipSteps.push(9);
			}

			if (deliveryTypeInt == 1) {
				skipSteps.push(11);
			}
		}

		if (skipSteps.includes(step)) {
			setCanSkip(true);
		} else {
			setCanSkip(false);
		}
	}

	function handleBackStep() {
		setStep((prev) => prev - 1);
	}

	async function handleNextStep() {
		//* If access code entered, check if it exists.
		if (step == 0) {
			if (accessCode !== "") {
				setIsLoading(true);
				const { success, value, error } = await checkAccessCode(accessCode);
				// value == user
				if (success) {
					if (!value) {
						setOpenError(true);
						setErrorMessage(
							"Access code not found. Please leave empty if you do not have a code."
						);
						setIsLoading(false);
						return;
					}

					if (value) {
						const { fName, lName, email, subdomain } = value;
						const shortenedSubdomain = subdomain.replace(".boxcart.shop", "");
						setSignupValues((prev) => ({
							...prev,
							firstName: fName,
							lastName: lName,
							email,
							subdomain: shortenedSubdomain,
						}));
						setWaitListEmail(email);
					}
				}

				if (!success) {
					setOpenError(true);
					setErrorMessage(
						"Unknown error. Please contact hello@boxcart.shop with your access code."
					);
					setIsLoading(false);
					return;
				}
			}
		}

		//* Test regex for subdomain.
		if (step == 2) {
			// Subdomain is valid && not taken.
			if (subdomain !== "") {
				const isValid = checkSubdomainValidEntry(subdomain);
				if (!isValid) return;

				const fullSubdomain = subdomain + ".boxcart.shop";

				setIsLoading(true);
				const { success, value, error } = await checkSubdomainAvail(
					fullSubdomain
				);
				const checkUserSubdomainResult = await checkSubdomainTakenUser(
					fullSubdomain
				);
				console.log(checkUserSubdomainResult);

				if (success || checkUserSubdomainResult.success) {
					if (value || checkUserSubdomainResult.value) {
						if (accessCode == "") {
							setOpenError(true);
							setErrorMessage(
								"The subdomain you have entered has been taken. If you reserved this domain, enter your access code in the previous steps."
							);
							setIsLoading(false);
							return;
						}
					}
				}

				if (!success || !checkUserSubdomainResult.success) {
					setOpenError(true);
					setErrorMessage(
						"Unknown error. Please contact hello@boxcart.shop with the subdomain of interest."
					);
					setIsLoading(false);
					return;
				}
			}
		}

		//* Test regex for social Urls.
		if (step == 6) {
			const isValid = checkSocialMediaUrlValidEntry();
			if (!isValid) return;
		}

		//* Advanced to next step.
		setStep((prev) => prev + 1);
	}

	//* Disable next button if input is null for required info.
	function disableNextButton() {
		if (step == 0) {
			if (accessCode == "") return true;
		}

		if (step == 1) {
			if (businessName == "") return true;
		}

		if (step == 2) {
			if (subdomain == "") return true;
		}

		if (step == 3) {
			if (businessTypes.length === 0 && otherBusinessType == "") return true;
		}

		if (step == 4) {
			if (logoImgStr == "") return true;
		}

		if (step == 5) {
			if (businessBio == "") return true;
		}

		if (step == 6) {
			let hasSocialLinks = false;
			for (const [key, value] of Object.entries(socialLinks)) {
				if (value !== "") {
					hasSocialLinks = true;
				}
			}
			if (!hasSocialLinks) return true;
		}

		if (step == 7) {
			if (fulfillmentMethodInt == null) return true;
		}

		if (step == 8) {
			if (fulfillmentMethodInt == 0 || fulfillmentMethodInt == 2) {
				if (deliveryTypeInt == null) return true;
			}

			if (fulfillmentMethodInt == 1) {
				if (pickupNote == "") return true;
			}
		}

		if (step == 9) {
			if (fulfillmentMethodInt == 2 && deliveryTypeInt == 0) {
				if (pickupNote == "") return true;
			}

			if (
				deliveryTypeInt == 1 ||
				(fulfillmentMethodInt == 2 && deliveryTypeInt == 1)
			) {
				if (localDeliveryDistanceStr == "") {
					return true;
				}
			}

			// if address.
			if (
				(fulfillmentMethodInt == 0 && deliveryTypeInt == 0) ||
				fulfillmentMethodInt == 1
			) {
				if (address_1 === "" || city === "" || state === "" || zip === "") {
					return true;
				}
			}
		}

		if (step == 10) {
			if (address_1 === "" || city === "" || state === "" || zip === "") {
				return true;
			}
		}

		if (step == 11) {
			// Tip settings: % || $.
			if (
				((fulfillmentMethodInt == 0 && deliveryTypeInt == 0) ||
					fulfillmentMethodInt == 1) &&
				enableTips
			) {
				if (tip1.tipStr == "" || tip2.tipStr == "" || tip3.tipStr == "")
					return true;
			}

			if (fulfillmentMethodInt == 2 && deliveryTypeInt == 1) {
				if (pickupNote == "") return true;
			}
		}

		if (step == 12) {
			if (fulfillmentMethodInt == 0 && deliveryTypeInt == 1 && enableTips) {
				if (tip1.tipStr == "" || tip2.tipStr == "" || tip3.tipStr == "")
					return true;
			}
		}

		if (step == 13) {
			if (fulfillmentMethodInt == 2 && deliveryTypeInt == 1 && enableTips) {
				if (tip1.tipStr == "" || tip2.tipStr == "" || tip3.tipStr == "")
					return true;
			}
		}

		return false;
	}

	// * Form management
	function handleChange(e) {
		const { name, value, type, checked } = e.target;

		// Step 3 is for business checkbox
		if (step == 3) {
			if (type === "checkbox") {
				handleBusinessType(checked, name);
				return;
			}
		}

		// Business bio
		if (step == 5) {
			if (value.length > 150) {
				setErrorMessage("You have reached your character limit.");
				setOpenError(true);
				return;
			}
		}

		// Social links array
		if (step == 6) {
			handleSocialLinks(name, value);
			return;
		}

		// Fulfillment
		if (step == 7) {
			handleFulfillment(name);
			return;
		}
		// Delivery type
		if (step == 8) {
			if (fulfillmentMethodInt !== 1) {
				// Delivery
				handleDeliveryTypeChange(name);
				return;
			} else {
				// Pickup
				if (value.length > 150) {
					setErrorMessage("You have reached your character limit.");
					setOpenError(true);
					return;
				}
			}
		}

		// distance for in-house delivery.
		if (step == 9) {
			if (
				fulfillmentMethodInt !== 2 ||
				(fulfillmentMethodInt == 2 && deliveryTypeInt == 1)
			) {
				handleDistance(name);
				return;
			}

			// pickup note
			if (fulfillmentMethodInt == 2 && deliveryTypeInt == 0) {
				if (value.length > 150) {
					setErrorMessage("You have reached your character limit.");
					setOpenError(true);
					return;
				}
			}
		}

		if (step == 11) {
			// Set tip values for outsource delivery.
			if (
				(fulfillmentMethodInt == 0 && deliveryTypeInt == 0 && enableTips) ||
				(fulfillmentMethodInt == 1 && enableTips)
			) {
				setCorrectTipValues(name, value);
				return;
			}

			// pickup note
			if (fulfillmentMethodInt == 2 && deliveryTypeInt == 1) {
				if (value.length > 150) {
					setErrorMessage("You have reached your character limit.");
					setOpenError(true);
					return;
				}
			}
		}

		if (step == 12) {
			// Set tip values for in-house delivery.
			if (
				(fulfillmentMethodInt == 0 && deliveryTypeInt == 1 && enableTips) ||
				(fulfillmentMethodInt == 2 && enableTips)
			) {
				setCorrectTipValues(name, value);
				return;
			}
		}

		if (step == 13) {
			if (fulfillmentMethodInt == 2 && deliveryTypeInt == 1 && enableTips) {
				setCorrectTipValues(name, value);
				return;
			}
		}

		// Set state values for step 0,1,2,3-(input for other business type)
		setSignupValues((prev) => ({ ...prev, [name]: value }));
	}

	function setCorrectTipValues(name, value) {
		const tipInt = value ? parseInt(value) : null;
		const tipStr = value;

		setSignupValues((prev) => ({
			...prev,
			tipValues: {
				...prev.tipValues,
				[name]: { tipInt: tipInt, tipStr: tipStr },
			},
		}));
	}

	function handleAddressChange(e) {
		const { name, value } = e.target;
		setSignupValues((prev) => ({ ...prev, [name]: value }));
	}

	function handleEnableTipsChange(e) {
		const { name, checked } = e.target;

		if (name === "yesTips") {
			if (checked) setSignupValues((prev) => ({ ...prev, enableTips: true }));
			if (!checked) setSignupValues((prev) => ({ ...prev, enableTips: false }));
		}

		if (name === "noTips" && checked) {
			setSignupValues((prev) => ({ ...prev, enableTips: false }));
		}
	}

	function handleChangeSetTips(e) {
		const { name, checked } = e.target;

		if (checked) setSignupValues((prev) => ({ ...prev, typeOfTip: name }));
	}

	function isTipTypeChecked(name) {
		if (name === typeOfTip) return true;
		return false;
	}

	function isTipsChecked(name) {
		if (name === "yesTips") {
			if (enableTips) return true;
			if (!enableTips) return false;
		}

		if (name === "noTips") {
			if (enableTips) return false;
			if (!enableTips) return true;
		}
	}

	function isBusinessTypeChecked(name) {
		if (businessTypes.length !== 0) {
			const isChecked = businessTypes.includes(name);

			if (isChecked) {
				return true;
			}
			return false;
		}
		return false;
	}

	function isFulfillmentTypeChecked(name) {
		if (name === "delivery" || name === "pickup") {
			if (fulfillmentMethods.length > 1) {
				return false;
			}

			if (fulfillmentMethods.includes(name)) return true;
		}

		if (fulfillmentMethods.length > 1) return true;
		return false;
	}

	function isDeliveryTypeChecked(name) {
		if (name == "inHouse") {
			if (deliveryTypeInt == 1) return true;
		}

		if (name == "outsource") {
			if (deliveryTypeInt == 0) return true;
		}

		return false;
	}

	function isLocalDistanceChecked(name) {
		if (localDeliveryDistanceStr === name) return true;
		return false;
	}

	function handleImageUpload(e) {
		const selectedImage = e.target.files[0];
		const imgUrl = URL.createObjectURL(selectedImage);
		setSignupValues((prev) => ({ ...prev, logoImgStr: imgUrl }));
	}

	async function handleSignup(e) {
		e.preventDefault();
		setIsLoading(true);

		if (email == "" || firstName == "" || lastName == "" || password == "") {
			setOpenError(true);
			setErrorMessage("Missing information.");
			setIsLoading(false);
			return;
		}

		if (password.length < 8) {
			setOpenError(true);
			setErrorMessage("Password must be at least 8 characters long.");
			setIsLoading(false);
			return;
		}

		const isEmailValid = checkEmailRegex(email);
		if (!isEmailValid) return;

		if (waitListEmail !== email) {
			const { success, value, error } = await checkEmailAvailable(email);
			// value == user

			if (!success) {
				setOpenError(true);
				setErrorMessage(
					"Error checking if email is available. Please contact hello@boxcart.shop"
				);
				setIsLoading(false);
				return;
			}

			if (success) {
				if (value) {
					setOpenError(true);
					setErrorMessage("Email already exists.");
					setIsLoading(false);
					return;
				}
			}
		}

		const newUserData = structureUserData(signupValues);
		const signupResponse = await newUserSignup(newUserData);
		const { success, user, error } = signupResponse;

		if (success) {
			if (user) {
				try {
					const signinResult = await signIn("credentials", {
						email,
						password,
						redirect: false,
					});
					const { status, error } = signinResult;

					if (status == 200) {
						const id = user.id;
						console.log("client send", id, email);
						sendVerificationEmail(id, email);

						router.push("/account/checklist");
						return;
					}

					if (status == 401) {
						setOpenError(true);
						setErrorMessage("Incorrect email/password.");
					}

					if (status == 403) {
						setOpenError(true);
						setErrorMessage("Access denied.");
					}

					if (status == 500) {
						setOpenError(true);
						setErrorMessage("Network error.");
					}
				} catch (error) {
					console.log("error signing in", error);
					setOpenError(true);
					setErrorMessage("Unknown error. Please contact hello@boxcart.shop");
				}
			}
		}

		if (!success || (success && !user)) {
			setOpenError(true);
			setErrorMessage(
				"Failed to create account. Reach out to hello@boxcart.shop for more assistance."
			);
		}

		console.log("final return", success, user, error);
		setIsLoading(false);
	}

	// * Helpers

	function structureUserData(signupValues) {
		const name = firstName + " " + lastName;
		let fullAddress;

		if (address_2 !== "") {
			fullAddress =
				address_1 + " " + address_2 + " " + city + " " + state + " " + zip;
		} else {
			fullAddress = address_1 + " " + city + " " + state + " " + zip;
		}

		const date = new Date();
		date.setMonth(date.getMonth() + 2);
		const endToday = date.setHours(23, 59, 59, 999);
		const freePeriodEndDateStr = new Date(endToday);
		const freePeriodEndDateEpoch = Date.parse(freePeriodEndDateStr);

		const userData = {
			firstName,
			lastName,
			name,
			email,
			password,
			freePeriodEndDateStr,
			freePeriodEndDateEpoch,
		};

		const accountData = {
			email,
			password,
			name,
			firstName,
			lastName,
			accessCode,
			businessName,
			subdomain: subdomain + ".boxcart.shop",
			logoImgStr,
			businessBio,
			fulfillmentMethodInt,
			deliveryTypeInt,
			deliveryTypeStr,
			localDeliveryDistanceStr,
			localDeliveryDistanceKm,
			localDeliveryDistanceMi,
			pickupNote,
			address_1,
			address_2,
			city,
			state,
			zip,
			fullAddress,
			enableTips,
			typeOfTip,
		};

		const businessTypeData = [...businessTypes, ...otherBusinessType];
		const socialsData = socialLinks;
		const fulfillmentData = fulfillmentMethods;
		const tipsData = tipValues;

		const newUserData = {
			userData,
			accountData,
			businessTypeData,
			socialsData,
			fulfillmentData,
			tipsData,
		};

		return newUserData;
	}

	function checkEmailRegex(email) {
		const emailRegex =
			/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		const emailMatchRegex = emailRegex.test(email);
		if (!emailMatchRegex) {
			setErrorMessage("Please enter a valid email address.");
			setOpenError(true);
			return false;
		}
		return true;
	}

	function checkSubdomainValidEntry(subdomain) {
		const subdomainRegex = /^[A-Za-z0-9]+([-][A-Za-z0-9]+)*$/;
		const subdomainMatchRegex = subdomainRegex.test(subdomain);
		if (!subdomainMatchRegex) {
			setErrorMessage("Please enter a proper subdomain.");
			setOpenError(true);
			return false;
		}
		return true;
	}

	function checkSocialMediaUrlValidEntry() {
		const socialMediaRegex =
			/^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|instagram\.com|youtube\.com|tiktok\.com)\/(?:[a-zA-Z0-9_\-]+\/?)$/;

		let allSocialUrlsMatchedRegex = [];
		if (instagramUrl !== "") {
			const matched = checkSocialMediaRegex(socialMediaRegex, instagramUrl);
			allSocialUrlsMatchedRegex.push(matched);
		}

		if (facebookUrl !== "") {
			const matched = checkSocialMediaRegex(socialMediaRegex, facebookUrl);
			allSocialUrlsMatchedRegex.push(matched);
		}

		if (tiktokUrl !== "") {
			const matched = checkSocialMediaRegex(socialMediaRegex, tiktokUrl);
			allSocialUrlsMatchedRegex.push(matched);
		}

		if (youtubeUrl !== "") {
			const matched = checkSocialMediaRegex(socialMediaRegex, youtubeUrl);
			allSocialUrlsMatchedRegex.push(matched);
		}

		for (let i = 0; i < allSocialUrlsMatchedRegex.length; i++) {
			const currMatch = allSocialUrlsMatchedRegex[i];
			if (!currMatch) return false;
		}

		return true;
	}

	function checkSocialMediaRegex(socialMediaRegex, url) {
		const socialMediaMatchRegex = socialMediaRegex.test(url);
		if (!socialMediaMatchRegex) {
			setErrorMessage(
				`Please enter a valid url or leave empty. (https://www.facebook.com/accountname)`
			);
			setOpenError(true);
			return false;
		}
		return true;
	}

	function handleInputFocus() {
		subdomainInputRef.current.focus();
	}

	// function handleInvalidSubDomain(e) {
	// 	e.target.setCustomValidity("Subdomain name must be one word only.");
	// }

	function handleCloseSnackbar() {
		setOpenError(false);
		setErrorMessage("");
	}

	function handleBusinessType(checked, name) {
		if (checked) {
			setSignupValues((prev) => ({
				...prev,
				businessTypes: [...prev.businessTypes, name],
			}));
		} else {
			const removedBusinessType = businessTypes.filter((type) => type !== name);
			setSignupValues((prev) => ({
				...prev,
				businessTypes: removedBusinessType,
			}));
		}
	}

	function handleSocialLinks(name, value) {
		setSignupValues((prev) => ({
			...prev,
			socialLinks: { ...prev.socialLinks, [name]: value },
		}));
	}

	function handleFulfillment(name) {
		let value = [name];

		if (name === "delivery") {
			setSignupValues((prev) => ({ ...prev, fulfillmentMethodInt: 0 }));
		}

		if (name === "pickup") {
			setSignupValues((prev) => ({ ...prev, fulfillmentMethodInt: 1 }));
		}

		if (name === "both") {
			value = ["delivery", "pickup"];
			setSignupValues((prev) => ({ ...prev, fulfillmentMethodInt: 2 }));
		}

		setSignupValues((prev) => ({
			...prev,
			fulfillmentMethods: [...value],
		}));
	}

	function handleDeliveryTypeChange(deliveryType) {
		if (deliveryType == "outsource") {
			setSignupValues((prev) => ({
				...prev,
				deliveryTypeInt: 0,
				deliveryTypeStr: deliveryType,
			}));
		}

		if (deliveryType == "inHouse") {
			setSignupValues((prev) => ({
				...prev,
				deliveryTypeInt: 1,
				deliveryTypeStr: "in house",
			}));
		}
	}

	function handleDistance(name) {
		let miles;
		let kilometers;

		switch (name) {
			case "5mi/8km":
				miles = 5;
				kilometers = 8;
				break;
			case "10mi/16km":
				miles = 10;
				kilometers = 16;
				break;
			case "30mi/48km":
				miles = 30;
				kilometers = 48;
				break;
			case "50mi/80km":
				miles = 50;
				kilometers = 80;
				break;

			default:
				break;
		}

		setSignupValues((prev) => ({
			...prev,
			localDeliveryDistanceStr: name,
			localDeliveryDistanceMi: miles,
			localDeliveryDistanceKm: kilometers,
		}));
	}

	return (
		<div className={`${styles.signup}`}>
			<Snackbar open={openError} onClose={handleCloseSnackbar}>
				<Alert severity="error">{errorMessage}</Alert>
			</Snackbar>
			<h2 className={`${styles.boxcart_logo}`}>BoxCart</h2>
			<LinearProgressWithLabel value={(step / maxSteps) * 100} />
			<form onSubmit={handleSignup} className={`${styles.form_box}`}>
				{/* Access code */}
				{step == 0 && (
					<div
						className={`${styles.access_code_group} ${styles.form_section_group}`}
					>
						<label htmlFor="access_input" className={`${styles.title}`}>
							Enter access code:
						</label>
						<input
							id="accessCode"
							name="accessCode"
							value={accessCode}
							type="text"
							placeholder="Enter"
							className={`${styles.signup_input}`}
							onChange={handleChange}
						/>

						<p>
							Access code was emailed to those who joined our waitlist early.
							Please check email.
							<br />
							<br />
							Skip if you don&apos;t have an access code.
						</p>
					</div>
				)}

				{/* Business name */}
				{step == 1 && (
					<div
						className={`${styles.biz_name_group} ${styles.form_section_group}`}
					>
						<label htmlFor="biz_name_input" className={`${styles.title}`}>
							What&apos;s your business name?
						</label>
						<input
							id="biz_name_input"
							required
							name="businessName"
							value={businessName}
							type="text"
							placeholder="Enter"
							className={`${styles.signup_input}`}
							onChange={handleChange}
						/>
					</div>
				)}

				{/* Subdomain */}
				{step == 2 && (
					<div
						className={`${styles.domain_group} ${styles.form_section_group}`}
					>
						<label htmlFor="subdomain" className={`${styles.title}`}>
							Select your business sub-domain:
						</label>
						<div className={`${styles.input_pair}`}>
							<div className={`${styles.input_group}`}>
								<input
									className={`${styles.input_editable}`}
									type="text"
									id="subdomain"
									name="subdomain"
									value={subdomain}
									ref={subdomainInputRef}
									minLength="1"
									maxLength="63"
									// onInvalid={handleInvalidSubDomain}
									placeholder="{shop-name}"
									onChange={handleChange}
								/>
							</div>
							<div
								className={`${styles.input_group}`}
								onClick={handleInputFocus}
							>
								<input
									id="domain"
									className={`${styles.input_readable}`}
									type="text"
									readOnly
									placeholder=".boxcart.shop"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Business type */}
				{step == 3 && (
					<div
						className={`${styles.form_section_group} ${styles.business_type}`}
					>
						<label htmlFor="select business type" className={`${styles.title}`}>
							What&apos;s your business type?
						</label>
						{businessTypesArr.map((type) => {
							const { uniqueId, id, name, label, imgSrc, imgAlt } = type;
							return (
								<BusinessTypeCheckbox
									key={uniqueId}
									id={id}
									name={name}
									onChange={handleChange}
									checked={isBusinessTypeChecked}
									label={label}
									imgSrc={imgSrc}
									imgAlt={imgAlt}
								/>
							);
						})}

						<div className={`${styles.business_type_other}`}>
							<input
								id="other"
								type="text"
								placeholder="Other:"
								name="otherBusinessType"
								value={otherBusinessType}
								onChange={handleChange}
							/>
						</div>
					</div>
				)}

				{/* Logo */}
				{step == 4 && (
					<div className={`${styles.form_section_group}`}>
						<h1 className={`${styles.title}`}>Upload your logo.</h1>

						{logoImgStr === "" ? (
							<Avatar
								sx={{ width: 100, height: 100 }}
								variant="rounded"
								className={`${styles.logo_placeholder_image}`}
							>
								Logo
							</Avatar>
						) : (
							<Image
								src={logoImgStr}
								alt="business logo"
								width={200}
								height={200}
								className={`${styles.logo_image}`}
								style={{ objectFit: "cover" }}
							/>
						)}
						<label
							htmlFor="logo_file"
							className={`${styles.upload_logo_button}`}
						>
							Upload file:
						</label>
						<input
							id="logo_file"
							type="file"
							accept="image/"
							className={`${styles.upload_logo_input}`}
							onChange={handleImageUpload}
						/>
					</div>
				)}

				{/* Business bio */}
				{step == 5 && (
					<div className={`${styles.form_section_group} ${styles.bio_group}`}>
						<label htmlFor="business-bio" className={`${styles.title}`}>
							Enter a description of your business.
						</label>
						<textarea
							type="text"
							id="business-bio"
							name="businessBio"
							value={businessBio}
							placeholder="Enter..."
							rows="10"
							onChange={handleChange}
						/>
						<p>{businessBio.length} / 150</p>
						<p></p>
					</div>
				)}

				{/* Socials */}
				{step == 6 && (
					<div className={`${styles.form_section_group}`}>
						<h1 className={`${styles.title}`}>Link your socials.</h1>
						<div className={`${styles.socials_group}`}>
							<Image src={instagram_icon} alt="instagram logo" width={70} />
							<input
								type="text"
								name="instagramUrl"
								value={instagramUrl}
								onChange={handleChange}
								className={`${styles.signup_input}`}
								placeholder="url:"
							/>
						</div>
						<div className={`${styles.socials_group}`}>
							<Image src={facebook_icon} alt="facebook logo" width={70} />
							<input
								type="text"
								name="facebookUrl"
								value={facebookUrl}
								onChange={handleChange}
								className={`${styles.signup_input}`}
								placeholder="url:"
							/>
						</div>
						<div className={`${styles.socials_group}`}>
							<Image src={tiktok_icon} alt="tiktok logo" width={70} />
							<input
								type="text"
								name="tiktokUrl"
								value={tiktokUrl}
								onChange={handleChange}
								className={`${styles.signup_input}`}
								placeholder="url:"
							/>
						</div>
						<div className={`${styles.socials_group}`}>
							<Image src={youtube_icon} alt="youtube logo" width={70} />
							<input
								type="text"
								name="youtubeUrl"
								value={youtubeUrl}
								onChange={handleChange}
								className={`${styles.signup_input}`}
								placeholder="url:"
							/>
						</div>
					</div>
				)}

				{/* Fulfill orders */}
				{step == 7 && (
					<div className={`${styles.form_section_group} ${styles.fulfillment}`}>
						<h1 className={`${styles.title}`}>
							How do you fulfill your orders?
						</h1>
						<FulfillmentRadioGroup
							id="delivery"
							name="delivery"
							label="Delivery"
							hasImage={true}
							imgSrc={delivery_icon}
							imgAlt="delivery icon"
							isChecked={isFulfillmentTypeChecked}
							onChange={handleChange}
						/>
						<FulfillmentRadioGroup
							id="pickup"
							name="pickup"
							label="Pickup"
							hasImage={true}
							imgSrc={pickup_pin_point_icon}
							imgAlt="pickup icon"
							isChecked={isFulfillmentTypeChecked}
							onChange={handleChange}
						/>
						<FulfillmentRadioGroup
							id="both"
							name="both"
							label="Both"
							hasImage={false}
							isChecked={isFulfillmentTypeChecked}
							onChange={handleChange}
						/>
					</div>
				)}

				{step == 8 && fulfillmentMethodInt != 1 && (
					<div className={`${styles.form_section_group} ${styles.fulfillment}`}>
						<h1 className={`${styles.title}`}>How do you deliver?</h1>
						<FulfillmentRadioGroup
							id="outsource"
							name="outsource"
							label="Use a carrier"
							hasImage={true}
							imgSrc={package_icon}
							imgAlt="package icon"
							isChecked={isDeliveryTypeChecked}
							onChange={handleChange}
						/>
						<FulfillmentRadioGroup
							id="in-house"
							name="inHouse"
							label="Ship it yourself"
							hasImage={true}
							imgSrc={skooter_icon}
							imgAlt="skooter icon"
							isChecked={isDeliveryTypeChecked}
							onChange={handleChange}
						/>
					</div>
				)}

				{((step == 9 && fulfillmentMethodInt == 0 && deliveryTypeInt == 1) ||
					(step == 9 && fulfillmentMethodInt == 2 && deliveryTypeInt == 1)) && (
					<div className={`${styles.form_section_group} ${styles.fulfillment}`}>
						<SignupFormDistance
							handleChange={handleChange}
							isLocalDistanceChecked={isLocalDistanceChecked}
						/>
					</div>
				)}

				{((step == 9 && fulfillmentMethodInt == 0 && deliveryTypeInt == 0) ||
					(step == 9 && fulfillmentMethodInt == 1) ||
					(step == 10 && fulfillmentMethodInt == 2) ||
					(step == 10 &&
						fulfillmentMethodInt == 0 &&
						deliveryTypeInt == 1)) && (
					<div className={`${styles.form_section_group}`}>
						<SignupFormAddress
							handleChange={handleAddressChange}
							signupValues={signupValues}
						/>
					</div>
				)}

				{((step == 8 && fulfillmentMethodInt == 1) ||
					(step == 9 && fulfillmentMethodInt == 2 && deliveryTypeInt == 0) ||
					(step == 11 &&
						fulfillmentMethodInt == 2 &&
						deliveryTypeInt == 1)) && (
					<div
						className={`${styles.form_section_group} ${styles.pickup_note_group}`}
					>
						<label htmlFor="pickup_note" className={`${styles.title}`}>
							Leave a note for pickup orders.
						</label>
						<textarea
							type="text"
							id="pickup_note"
							name="pickupNote"
							value={pickupNote}
							placeholder="e.g. Please give us a call/text 10 minutes before arrival. "
							rows="10"
							onChange={handleChange}
						/>
						<p>{pickupNote.length} / 150</p>
					</div>
				)}

				{((step == 10 && fulfillmentMethodInt == 0 && deliveryTypeInt == 0) ||
					(step == 10 && fulfillmentMethodInt == 1) ||
					(step == 11 && fulfillmentMethodInt == 0 && deliveryTypeInt == 1) ||
					(step == 11 && fulfillmentMethodInt == 2 && deliveryTypeInt == 0) ||
					(step == 12 &&
						fulfillmentMethodInt == 2 &&
						deliveryTypeInt == 1)) && (
					<div className={`${styles.form_section_group}`}>
						<SignupFormEnableTips
							isChecked={isTipsChecked}
							onChange={handleEnableTipsChange}
						/>
					</div>
				)}

				{((step == 11 &&
					fulfillmentMethodInt == 0 &&
					deliveryTypeInt == 0 &&
					enableTips) ||
					(step == 11 && fulfillmentMethodInt == 1 && enableTips) ||
					(step == 12 &&
						fulfillmentMethodInt == 0 &&
						deliveryTypeInt == 1 &&
						enableTips) ||
					(step == 12 &&
						fulfillmentMethodInt == 2 &&
						deliveryTypeInt == 0 &&
						enableTips) ||
					(step == 13 &&
						fulfillmentMethodInt == 2 &&
						deliveryTypeInt == 1 &&
						enableTips)) && (
					<div className={`${styles.form_section_group}`}>
						<SignupFormSetTip
							signupValues={signupValues}
							onChangeTipType={handleChangeSetTips}
							isChecked={isTipTypeChecked}
							onChangeTipValues={handleChange}
						/>
					</div>
				)}

				{((step == 11 &&
					fulfillmentMethodInt == 0 &&
					deliveryTypeInt == 0 &&
					!enableTips) ||
					(step == 11 && fulfillmentMethodInt == 1 && !enableTips) ||
					(step == 12 &&
						fulfillmentMethodInt == 0 &&
						deliveryTypeInt == 0 &&
						enableTips) ||
					(step == 12 && fulfillmentMethodInt == 1) ||
					(step == 12 &&
						fulfillmentMethodInt == 0 &&
						deliveryTypeInt == 1 &&
						!enableTips) ||
					(step == 12 &&
						fulfillmentMethodInt == 2 &&
						deliveryTypeInt == 0 &&
						!enableTips) ||
					(step == 13 &&
						fulfillmentMethodInt == 0 &&
						deliveryTypeInt == 1 &&
						enableTips) ||
					(step == 13 &&
						fulfillmentMethodInt == 2 &&
						deliveryTypeInt == 0 &&
						enableTips) ||
					(step == 13 &&
						fulfillmentMethodInt == 2 &&
						deliveryTypeInt == 1 &&
						!enableTips) ||
					(step == 14 &&
						fulfillmentMethodInt == 2 &&
						deliveryTypeInt == 1 &&
						enableTips)) && (
					<div className={`${styles.form_section_group}`}>
						<CredentialsForm
							signupValues={signupValues}
							handleChange={handleChange}
						/>
					</div>
				)}

				<NextBackButtons
					step={step}
					disableNext={disableNextButton}
					nextStep={handleNextStep}
					backStep={handleBackStep}
					signup={handleSignup}
					canSkip={canSkip}
					isLastStep={isLastStep}
					isLoading={isLoading}
				/>
			</form>
		</div>
	);
}

export default Signup;
