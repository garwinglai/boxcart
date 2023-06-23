import React, { useState, useRef } from "react";
import styles from "../../../styles/home/waitlist/reserve-shop.module.css";
import { useRouter } from "next/router";
import prisma from "@/lib/prisma";
import ButtonLoader from "@/components/common/loaders/ButtonLoader";
import { checkSubdomainAvail } from "@/helper/client/api/waitlist/waitlist";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

function ReserveShop({ waitlistCount }) {
	// * check session for subdomain storage
	const defaultCount = 139;
	let storedSessionDomain;
	if (typeof window !== "undefined") {
		const getSessionDomain = sessionStorage.getItem("subdomain");
		if (getSessionDomain) storedSessionDomain = getSessionDomain.split(".")[0];

		// * clear previous session memory if user signs up again without leaving current session.
		// sessionStorage.clear("waitlistCount");
		const isShopConfirmedSession = sessionStorage.getItem("isShopConfirmed");
		if (isShopConfirmedSession) sessionStorage.clear();
	}

	// * state variables
	const [isButtonLoading, setIsButtonLoading] = useState(false);
	const [subdomain, setSubdomain] = useState(
		storedSessionDomain ? storedSessionDomain : ""
	);
	const [isDomainAvailable, setIsDomainAvailable] = useState(true);
	const [errorResponse, setErrorResponse] = useState({
		hasError: false,
		errorMessage: "",
	});

	// * Dob
	const { hasError, errorMessage } = errorResponse;

	// * Hooks setup
	const router = useRouter();
	const subdomainInputRef = useRef(null);

	// * Handlers
	function handleInput(e) {
		const { value } = e.target;
		setSubdomain(value);
		e.target.setCustomValidity("");
	}

	function handleBack() {
		router.back();
	}

	function handleInputFocus() {
		subdomainInputRef.current.focus();
	}

	function handleInvalidSubDomain(e) {
		e.target.setCustomValidity("Please enter a valid domain name");
	}

	async function handleReserveShop(e) {
		e.preventDefault();
		console.log("clicked");
		setIsButtonLoading(true);
		const domain = ".boxcart.shop";
		const selectedSubdomain = subdomain + domain;

		const user = await checkSubdomainAvail(selectedSubdomain);
		const { value, error } = user;

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

		// If domain not available...
		if (value) {
			setIsButtonLoading(false);
			setIsDomainAvailable(false);
			return;
		}

		// If domain available...
		const toLowerCaseSubdomain = selectedSubdomain.toLocaleLowerCase();
		const totalCount = waitlistCount + defaultCount;

		sessionStorage.setItem("subdomain", toLowerCaseSubdomain);
		sessionStorage.setItem("waitlistCount", totalCount);
		router.push("/waitlist/create-account");
	}

	return (
		<div className={`${styles.container}`}>
			<div className={`${styles.shop} ${styles.flex} ${styles.flexCol}`}>
				<div>
					<h3>BoxCart</h3>
					<button onClick={handleBack} className={`${styles.back_button}`}>
						<KeyboardBackspaceIcon />
					</button>
				</div>
				<div className={`${styles.header}`}>
					<h2>Reserve your shop link.</h2>
					<p>
						You&apos;ll be #{waitlistCount + defaultCount} out of 500 early
						applicants.
					</p>
				</div>
				<form
					onSubmit={handleReserveShop}
					className={`${styles.form_group} ${styles.flex} ${styles.flexCol}`}
				>
					<div className={`${styles.flex} ${styles.label_group}`}>
						<span htmlFor="subdomain">Shop name:</span>
						{hasError && <p>{errorMessage}</p>}
						{!isDomainAvailable && <p>Shop name taken.</p>}
					</div>
					<div className={`${styles.input_pair} ${styles.flex}`}>
						<div className={`${styles.input_group}`}>
							<input
								required
								className={`${styles.input_editable}`}
								type="text"
								onChange={handleInput}
								id="subdomain"
								name="subdomain"
								value={subdomain}
								ref={subdomainInputRef}
								pattern="[A-Za-z0-9]+([-][A-Za-z0-9]+)*"
								minLength="1"
								maxLength="63"
								onInvalid={handleInvalidSubDomain}
							/>
							<label
								htmlFor="subdomain"
								className={`${styles.input_editable_label}`}
							>
								{`{your-shop-name}`}
							</label>
						</div>
						<div className={`${styles.input_group}`} onClick={handleInputFocus}>
							<input
								id="domain"
								className={`${styles.input_readable}`}
								type="text"
								readOnly
							/>
							<label htmlFor="domain">.boxcart.shop</label>
						</div>
					</div>
					{isButtonLoading ? (
						<div className={`${styles.button_container}`}>
							{/* <button style={{ visibility: "hidden" }}></button> */}
							<ButtonLoader />
						</div>
					) : (
						<div className={`${styles.button_container}`}>
							<button
								type="submit"
								// disabled={!subdomain}
								// style={{ visibility: !subdomain && "hidden" }}
							>
								Reserve Shop Name
							</button>
						</div>
					)}
				</form>
				<p>Custom domains can be connected in your account.</p>
			</div>
		</div>
	);
}
export default ReserveShop;

export async function getServerSideProps() {
	const waitlistCount = await prisma.waitlist.count();

	return {
		props: {
			waitlistCount,
		},
	};
}
