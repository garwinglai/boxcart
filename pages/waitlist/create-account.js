import React, { useState, useEffect } from "react";
import styles from "../../styles/waitlist/create-account.module.css";
import { useRouter } from "next/router";
import Router from "next/router";
import Image from "next/image";

function CreateAccount() {
	// * State variables
	const [storedSubdomainSession, setStoredSubdomainSession] =
		useState("{your-shop-name}");
	const [isEmailInUse, setIsEmailInUse] = useState(false);
	const [waitlistCount, setWaitlistCount] = useState(0);
	const [formValues, setFormValues] = useState({
		fName: "",
		lName: "",
		email: "",
	});
	const [errorResponse, setErrorResponse] = useState({
		hasError: false,
		errorMessage: "",
	});

	// * Dob state variables
	const { fName, lName, email } = formValues;
	const { hasError, errorMessage } = errorResponse;

	// * Hooks setup
	const router = useRouter();

	useEffect(() => {
		// * Check session for subdomain storage
		if (typeof window !== "undefined") {
			const storedSessionDomain = sessionStorage.getItem("subdomain");
			const sessionStoredWaitlistCount =
				sessionStorage.getItem("waitlistCount");
			if (!storedSessionDomain) {
				Router.push("/waitlist/reserve-shop");
			} else {
				setStoredSubdomainSession(storedSessionDomain);
				setWaitlistCount(sessionStoredWaitlistCount);
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
		} else {
			setErrorResponse({
				hasError: false,
				errorMessage: "",
			});
		}
		// Return "Email in use." error if email is used.
		if (value) {
			return setIsEmailInUse(true);
		}

		// If email not in use, create user in waitlist db.
		// Create earlyBird code to access benefits upon register.
		const earlyBirdCode = createEarlyBirdCode(lName);
		const finalValues = {
			fName: fNameUpperFirst,
			lName: lNameUpperFirst,
			email,
			name,
			subdomain,
			earlyBirdCode,
			reservationNo: parseInt(waitlistCount),
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
		} else {
			// TODO: send email
			const isEmailSent = await sendEmail(finalValues);
			router.push("/waitlist/reserve-confirm");
		}
	}

	// * API
	async function sendEmail(finalValues) {
		console.log("client, sending email.", finalValues);
		const { fName, email, subdomain, earlyBirdCode, reservationNo } =
			finalValues;
		const body = {
			email,
			earlyBirdCode,
			fName,
			reservationNo,
			subdomain,
		};
		const resSendgrid = await fetch("/api/sendgrid", {
			method: "POST",
			body: JSON.stringify(body),
		});
	}

	async function checkEmailInUse(subdomain, email) {
		const checkEmailUrl = `/api/crud/waitlist/${subdomain}/${email}`;
		const checkEmailResponse = await fetch(checkEmailUrl, {
			method: "GET",
		});
		const responseJSON = await checkEmailResponse.json();

		return responseJSON;
	}

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

	// * Helper Functions
	function firstCharCapitlize(string) {
		const firstCharUpper = string.charAt(0).toUpperCase();
		const stringArr = string.split("");
		stringArr.shift();
		const lowerCaseRestOfName = stringArr.join("").toLowerCase();
		const firstCharUpperString = firstCharUpper + lowerCaseRestOfName;

		return firstCharUpperString;
	}

	function createEarlyBirdCode(lName) {
		const fiveRandomDigits = Math.floor(Math.random() * 90000) + 10000;
		const earlyBirdCode = lName + fiveRandomDigits.toString();
		return earlyBirdCode;
	}

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
						<button type="submit">Lock in</button>
					</form>
				</div>
				<p>{hasError ? errorMessage : isEmailInUse ? "Email in use." : ""}</p>
			</div>
		</div>
	);
}

export default CreateAccount;
