import React, { useState, useRef } from "react";
import styles from "../../styles/waitlist/reserve-shop.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import prisma from "@/lib/prisma";

function ReserveShop({ waitlistCount }) {
	// * check session for subdomain storage
	let storedSessionDomain;
	if (typeof window !== "undefined") {
		const getSessionDomain = sessionStorage.getItem("subdomain");
		if (getSessionDomain) storedSessionDomain = getSessionDomain.split(".")[0];
	}

	// * state variables
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
	}

	async function handleReserveShop(e) {
		e.preventDefault();
		const domain = ".boxcart.shop";
		const selectedSubdomain = subdomain + domain;

		const fetchWaitlistUrl = `/api/crud/waitlist/${selectedSubdomain}`;

		const waitlistResponse = await fetch(fetchWaitlistUrl, { method: "GET" });
		const responseJSON = await waitlistResponse.json();

		const { value, error } = responseJSON;

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

		// If domain not available...
		if (value) return setIsDomainAvailable(false);

		// If domain available...
		sessionStorage.setItem("subdomain", selectedSubdomain);
		router.push("/waitlist/create-account");
	}

	function handleBack() {
		router.back();
	}

	function handleInputFocus() {
		subdomainInputRef.current.focus();
	}

	return (
		<div className={`${styles.container}`}>
			<div className={`${styles.shop} ${styles.flex} ${styles.flexCol}`}>
				<div>
					<h3>BoxCart</h3>
					<button onClick={handleBack} className={`${styles.back_button}`}>
						<Image
							src={"/images/icons/back_arrow.png"}
							width={20}
							height={20}
							alt="back arrow"
						/>
					</button>
				</div>
				<div className={`${styles.header}`}>
					<h2>Reserve your shop link.</h2>
					<p>{waitlistCount + 136} out of 500 early applicants accepted.</p>
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
					<button
						type="submit"
						// disabled={!subdomain}
						// style={{ visibility: !subdomain && "hidden" }}
					>
						Reserve Shop Name
					</button>
				</form>
				<p>
					Custom domains can be connected later. Reserve shop name now to
					receive early access benefits.
				</p>
			</div>
		</div>
	);
}
export default ReserveShop;

export async function getServerSideProps() {
	// const stuff = await prisma.waitlist.findMany();
	// const waitlist = JSON.parse(JSON.stringify(stuff));

	const waitlistCount = await prisma.waitlist.count();

	console.log("waitlistCount SSR", waitlistCount);
	console.log("db url", process.env.DATABASE_URL);

	return {
		props: {
			waitlistCount,
		},
	};
}
