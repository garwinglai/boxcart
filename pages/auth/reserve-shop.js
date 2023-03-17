import React, { useState, useRef } from "react";
import styles from "../../styles/auth/reserve-shop.module.css";
import { useRouter } from "next/router";
import Image from "next/image";

function ReserveShop() {
	const [subdomain, setSubdomain] = useState("");

	const router = useRouter();
	const subdomainInputRef = useRef(null);

	function handleInput(e) {
		const { value, name } = e.target;
		setSubdomain(value);
	}

	function handleReserveShop(e) {
		e.preventDefault();
		const domain = ".boxcart.shop";
		const userSubDomain = subdomain + domain;

		// * 1. check if subdomain is taken
		// * 2. if yes, return error
		// * 3. if not, save to session storage and navigate to next page
		console.log("sub", userSubDomain);
		router.push("/auth/create-account");
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
							src={"/images/back_arrow.png"}
							width={20}
							height={20}
							alt="back arrow"
						/>
					</button>
				</div>
				<div className={`${styles.header}`}>
					<h2>Reserve your shop link.</h2>
					<p>237 out of 500 early applicants accepted.</p>
				</div>
				<form
					onSubmit={handleReserveShop}
					className={`${styles.form_group} ${styles.flex} ${styles.flexCol}`}
				>
					<div className={`${styles.flex} ${styles.label_group}`}>
						<span htmlFor="subdomain">Shop name:</span>
						{/* <p>Shop name has been taken.</p> */}
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
