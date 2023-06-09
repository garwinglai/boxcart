import React from "react";
import email_icon from "../../../../public/images/icons/email_icon.svg";
import Image from "next/image";
import styles from "../../../../styles/app/auth/verify-email.module.css";
import { useRouter } from "next/router";
import {
	updateEmailIsVerifiedUser,
	updateEmailIsVerifiedAccount,
	updateUserIsActive,
} from "@/helper/client/api/user";

// TODO: this page needs to be proetcted

function VerifyEmail() {
	const router = useRouter();

	function handleClick() {
		const signedInRoute =
			process.env.NODE_ENV && process.env.NODE_ENV === "production"
				? "app.boxcart.shop/account/checklist"
				: "http://app.localhost:3000/account/checklist";

		router.push(signedInRoute);
	}

	return (
		<div className={`${styles.verify_email_box}`}>
			<h3>BoxCart</h3>
			<Image src={email_icon} alt="email icon" />
			<h2>Your email has been verified.</h2>
			<button onClick={handleClick}>Go to Account</button>
		</div>
	);
}

export default VerifyEmail;

export async function getServerSideProps(context) {
	const { id } = context.query;
	console.log("verify=email id", id);
	updateEmailIsVerifiedUser(id);
	updateEmailIsVerifiedAccount(id);
	// updateUserIsActive(id);

	return {
		props: {}, // will be passed to the page component as props
	};
}
