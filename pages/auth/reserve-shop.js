import React, { useState } from "react";
import styles from "../../styles/auth/reserve-shop.module.css";

function ReserveShop() {
	const [subdomain, setSubdomain] = useState("");

	const handleInput = (e) => {
		const { value, name } = e.target;
		setSubdomain(value);
	};

	return (
		<div className={`${styles.shop} ${styles.flex} ${styles.flexCol}`}>
			<h3>BoxCart</h3>
			<div className={`${styles.header}`}>
				<h2>Reserve your shop link.</h2>
				<p>237 out of 500 early applicants accepted.</p>
			</div>
			<div className={`${styles.form_group} ${styles.flex} ${styles.flexCol}`}>
				<label htmlFor="subdomain">Shop name:</label>
				<div className={`${styles.input_group}`}>
					<input
						className={`${styles.input_editable}`}
						type="text"
						onChange={handleInput}
						id="subdomain"
						name="subdomain"
						value={subdomain}
					/>
					<input
						className={`${styles.input_readable}`}
						type="text"
						readOnly
						placeholder=".boxcart.shop"
					/>
				</div>
				<button>Reserve Shop Name</button>
			</div>
			<p>
				Custom domains can be connected later. Reserve shop name now to receive
				early access benefits.
			</p>
		</div>
	);
}

export default ReserveShop;
