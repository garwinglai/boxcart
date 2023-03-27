import React, { useEffect, useState } from "react";
import styles from "../../styles/waitlist/reserve-confirm.module.css";
import Image from "next/image";
import Router from "next/router";
import PageLoader from "@/components/loaders/PageLoader";

function ReserveConfirm() {
	const [isPageLoading, setIsPageLoading] = useState(true);
	const [subdomain, setSubdomain] = useState("");
	const [waitlistCount, setWaitlistCount] = useState(0);

	useEffect(() => {
		const sessionStoredSubdomain = sessionStorage.getItem("subdomain");
		const sessionStoredWaitlistCount = sessionStorage.getItem("waitlistCount");

		if (!sessionStoredSubdomain) {
			Router.push("/waitlist/reserve-shop");
		} else {
			setSubdomain(sessionStoredSubdomain);
			setWaitlistCount(sessionStoredWaitlistCount);
			setIsPageLoading(false);
		}
	}, []);

	// * Return page loader
	// * Return page loader
	if (isPageLoading)
		return (
			<div className={`${styles.container}`}>
				<div
					className={`${styles.confirm_page} ${styles.flex} ${styles.flexCol}`}
				>
					<div className={`${styles.page_loader}`}>
						<PageLoader />
						<h1>BoxCart</h1>
					</div>
				</div>
			</div>
		);

	// * Return page content
	return (
		<div className={`${styles.container}`}>
			<div
				className={`${styles.confirm_page} ${styles.flex} ${styles.flexCol}`}
			>
				<div className={`${styles.header_group}`}>
					<h1>Success!</h1>
					<p className={`${styles.waitlist}`}>
						You&apos;re #<b>{waitlistCount}</b> on the waitlist.
					</p>
					<p className={`${styles.email}`}>
						Check your <b>email/spam</b> to see what&apos;s next. <br /> We also
						sent some goodies!
					</p>
				</div>
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
			</div>
		</div>
	);
}

export default ReserveConfirm;
