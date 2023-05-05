import React, { useEffect } from "react";
import email_icon from "../../../../public/images/icons/email_icon.svg";
import Image from "next/image";
import styles from "../../../../styles/home/account/verify-email.module.css";
import { useRouter } from "next/router";
import {
	updateEmailIsVerified,
	updateUserIsActive,
} from "@/helper/client/api/user";

function VerifyEmail() {
	const router = useRouter();

	function handleClick() {
		router.push("/account/checklist");
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
	updateEmailIsVerified(id);
	updateUserIsActive(id);

	return {
		props: {}, // will be passed to the page component as props
	};
}
