import React, { useState, useEffect } from "react";
import styles from "../../styles/waitlist/create-account.module.css";
import { useRouter } from "next/router";
import Router from "next/router";
import Image from "next/image";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import PageLoader from "@/components/loaders/PageLoader";
import firstCharCapitlize from "@/utils/string-manipulate";
import { createEarlyBirdCode, createPersonalCode } from "@/utils/promo-codes";
import {
	sendWaitlistConfirmedEmail,
	checkEmailInUse,
	sendEmailReferUsed,
} from "@/helper/api/client/email";
import {
	checkReferralCode,
	logReferUsed,
} from "@/helper/api/client/promo-codes";

function CreateAccount() {
	// * State variables
	const [isPageLoading, setIsPageLoading] = useState(true);
	const [isButtonLoading, setIsButtonLoading] = useState(false);
	const [storedSubdomainSession, setStoredSubdomainSession] =
		useState("{your-shop-name}");
	const [isEmailInUse, setIsEmailInUse] = useState(false);
	const [waitlistCount, setWaitlistCount] = useState(0);
	const [formValues, setFormValues] = useState({
		fName: "",
		lName: "",
		email: "",
		password: "",
		codeUsed: "",
	});
	const [errorResponse, setErrorResponse] = useState({
		hasError: false,
		errorMessage: "",
	});

	// * Dob state variables
	const { fName, lName, email, codeUsed } = formValues;
	const { hasError, errorMessage } = errorResponse;

	// * Hooks setup
	const router = useRouter();

	useEffect(() => {
		// * Check session for subdomain storage
		if (typeof window !== "undefined") {
			const storedSessionDomain = sessionStorage.getItem("subdomain");
			const sessionStoredWaitlistCount =
				sessionStorage.getItem("waitlistCount");
			const isShopConfirmed = sessionStorage.getItem("isShopConfirmed");

			if (!storedSessionDomain) {
				Router.push("/waitlist/reserve-shop");
			} else {
				if (isShopConfirmed) {
					sessionStorage.clear();
					Router.push("/waitlist/reserve-shop");
				}
				setStoredSubdomainSession(storedSessionDomain);
				setWaitlistCount(sessionStoredWaitlistCount);
				setIsPageLoading(false);
			}
		}
	}, []);

	// * Handlers
	function handleBack() {
		router.back();
	}

	function handleInput(e) {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
	}

	async function handleCreateAccount(e) {
		e.preventDefault();
		setIsButtonLoading(true);

		// codeUsed 1 is default code. If user enters a different code, must check if it is a valid code.
		if (codeUsed != 1) {
			console.log("check referral code");
			const resCheckReferral = await checkReferralCode(codeUsed);
			const { success, value } = resCheckReferral;

			console.log(resCheckReferral);

			// status 200 && value = false, no referral code found.
			if (success && !value) {
				setIsButtonLoading(false);
				setErrorResponse({
					hasError: true,
					errorMessage: "Invalid referral code.",
				});
				return;
			}

			// status != 200
			if (!success) {
				setIsButtonLoading(false);
				setErrorResponse({
					hasError: true,
					errorMessage: "Something went wrong. Contact us.",
				});
				return;
			}
		}

		const fNameUpperFirst = firstCharCapitlize(fName);
		const lNameUpperFirst = firstCharCapitlize(lName);
		const name = fNameUpperFirst + " " + lNameUpperFirst;
		const subdomain = storedSubdomainSession;

		const emailInUse = await checkEmailInUse(subdomain, email);
		const { value, error } = emailInUse;
		if (error) {
			setErrorResponse({
				hasError: true,
				errorMessage: "Unknown error: contact us.",
			});
			setIsButtonLoading(false);
		} else {
			setErrorResponse({
				hasError: false,
				errorMessage: "",
			});
		}
		// Return "Email in use." error if email is used.
		if (value) {
			setIsButtonLoading(false);
			return setIsEmailInUse(true);
		}

		// If email not in use, create user in waitlist db.
		// Create earlyBird code to access benefits upon register.
		const earlyBirdCode = createEarlyBirdCode(lName);
		const referralCode = createPersonalCode(fName, lName, waitlistCount);

		const finalValues = {
			fName: fNameUpperFirst,
			lName: lNameUpperFirst,
			email: email.toLocaleLowerCase(),
			name,
			subdomain,
			earlyBirdCode,
			reservationNo: parseInt(waitlistCount),
			referralCode,
			codeUsed,
		};

		const createWaitlistResponse = await createNewWaitlistUser(
			subdomain,
			finalValues
		);
		const { success, error2 } = createWaitlistResponse;
		if (error2) {
			setErrorResponse({
				hasError: true,
				errorMessage: "Unknown error: contact us.",
			});
			setIsButtonLoading(false);
		} else {
			sendWaitlistConfirmedEmail(finalValues);

			if (codeUsed != 1) {
				const referrer = await logReferUsed(codeUsed);
				// finalValues = referred user
				sendEmailReferUsed(referrer, finalValues);
			}
			// Create session key of confirmed to prevent user from accessing page when nav -> back();
			sessionStorage.setItem("isShopConfirmed", true);
			router.push("/waitlist/reserve-confirm");
		}
	}

	// * API
	async function createNewWaitlistUser(subdomain, finalValues) {
		const postURL = `/api/crud/waitlist/${subdomain}`;
		const waitlistResponse = await fetch(postURL, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(finalValues),
		});
		const waitlistResopnseJSON = await waitlistResponse.json();
		const { success, error } = waitlistResopnseJSON;
		return { success, error2: error };
	}

	// * Return page loader
	if (isPageLoading)
		return (
			<div className={`${styles.outmost_container}`}>
				<div className={`${styles.container} ${styles.flex} ${styles.flexCol}`}>
					<div className={`${styles.page_loader}`}>
						<PageLoader />
						<h1>BoxCart</h1>
					</div>
				</div>
			</div>
		);

	// * Return page content
	return (
		<div className={`${styles.outmost_container} ${styles.flex}`}>
			<div className={`${styles.container} ${styles.flex} ${styles.flexCol}`}>
				<div
					className={`${styles.create_account} ${styles.flex} ${styles.flexCol}`}
				>
					<div className={`${styles.header_form_group}`}>
						<h3>BoxCart</h3>
						<Image
							src={"/images/icons/back_arrow.png"}
							width={20}
							height={20}
							alt="back arrow"
							className={`${styles.back_button}`}
							onClick={handleBack}
						/>
					</div>
					<div className={`${styles.header}`}>
						<p>Selected shop name:</p>
						<p className={`${styles.subdomain}`}>
							<b>{storedSubdomainSession}</b>
						</p>
						<h2>Lock in your shop name.</h2>
						<p style={{ color: "var(--gray)", marginTop: "1rem" }}>
							{`{Referral code = 1, if you do not have one}`}
						</p>
					</div>
					<form
						onSubmit={handleCreateAccount}
						className={`${styles.form_group} ${styles.flex} ${styles.flexCol}`}
					>
						<div className={`${styles.flex} ${styles.form_group_name}`}>
							<div className={`${styles.input_group}`}>
								<input
									required
									id="firstName"
									name="fName"
									value={fName}
									type="text"
									onChange={handleInput}
								/>
								<label htmlFor="firstName">First name:</label>
							</div>
							<div className={`${styles.input_group}`}>
								<input
									required
									id="lastName"
									name="lName"
									value={lName}
									type="text"
									onChange={handleInput}
								/>
								<label htmlFor="lastName">Last name:</label>
							</div>
						</div>
						<div className={`${styles.input_group}`}>
							<input
								required
								id="email"
								name="email"
								value={email}
								type="email"
								onChange={handleInput}
							/>
							<label htmlFor="email">Email:</label>
						</div>
						<div className={`${styles.input_group}`}>
							<input
								required
								id="codeUsed"
								name="codeUsed"
								value={codeUsed}
								type="codeUsed"
								onChange={handleInput}
							/>
							<label htmlFor="email">Refferal code:</label>
						</div>
						{isButtonLoading ? (
							<div className={`${styles.button_container}`}>
								<ButtonLoader />
							</div>
						) : (
							<div className={`${styles.button_container}`}>
								<button type="submit">Lock in</button>
							</div>
						)}
					</form>
				</div>
				<p>{hasError ? errorMessage : isEmailInUse ? "Email in use." : ""}</p>
			</div>
		</div>
	);
}

export default CreateAccount;
