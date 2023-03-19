import React, { useEffect, useState } from "react";
import styles from "../../styles/waitlist/reserve-confirm.module.css";
import Image from "next/image";

function ReserveConfirm() {
	const [subdomain, setSubdomain] = useState("");

	useEffect(() => {
		const sessionStoredSubdomain = sessionStorage.getItem("subdomain");
		setSubdomain(sessionStoredSubdomain);
	}, []);

	return (
		<div className={`${styles.container}`}>
			<div
				className={`${styles.confirm_page} ${styles.flex} ${styles.flexCol}`}
			>
				<h1>Success!</h1>
				<Image
					src="/images/icons/confetti.png"
					alt="congrats gift box icons"
					height={100}
					width={100}
				/>

				<div className={`${styles.domain_group}`}>
					<div className={`${styles.input_group}`}>
						<h4 htmlFor="domain">{subdomain}</h4>
					</div>
					<h3>You secured your shop name.</h3>
				</div>
				<p>
					Check your <b>email/spam</b> to see what `&apos;` next. <br /> We also
					sent some goodies!
				</p>
			</div>
		</div>
	);
}

export default ReserveConfirm;
