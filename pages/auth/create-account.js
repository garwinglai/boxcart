import React, { useState } from "react";
import styles from "../../styles/auth/create-account.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import {
	getProviders,
	signIn,
	getSession,
	getCsrfToken,
} from "next-auth/react";

function CreateAccount({ providers }) {
	const [formValues, setFormValues] = useState({
		fName: "",
		lName: "",
		email: "",
		password: "",
	});

	const { fName, lName, email, password } = formValues;

	const router = useRouter();

	function handleBack() {
		router.back();
	}

	function handleInput(e) {
		const { name, value } = e.target;

		setFormValues((prev) => ({ ...prev, [name]: value }));
	}

	function handleCreateAccount(e) {
		e.preventDefault();

		const fNameUpperFirst = firstCharCapitlize(fName);
		const lNameUpperFirst = firstCharCapitlize(lName);

		const finalValues = {
			fName: fNameUpperFirst,
			lName: lNameUpperFirst,
			email,
			password,
		};

		console.log("create account:", finalValues);
	}

	function firstCharCapitlize(string) {
		const firstCharUpper = string.charAt(0).toUpperCase();
		const stringArr = string.split("");
		stringArr.shift();
		const firstCharUpperString = firstCharUpper + stringArr.join("");

		return firstCharUpperString;
	}

	async function handleOAuthLogin(e, provider) {
		const { id } = provider;
		const signInDestinationCallback = "/";
		const res = signIn(
			id,
			{ callbackUrl: signInDestinationCallback }
			// { redirect: false } //Do not redirect if error. Handle error on same page.
		);

		// if signIn failed, returns res
		// const { error, status, ok, url } = res;
		// console.log("res signin", res);
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
							src={"/images/back_arrow.png"}
							width={20}
							height={20}
							alt="back arrow"
							className={`${styles.back_button}`}
							onClick={handleBack}
						/>
					</div>
					<div className={`${styles.header}`}>
						<p>You have reserved the shop name:</p>
						<h4>testshop.boxcart.shop</h4>
						<h3>Create an account to lock in your shop name.</h3>
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
								id="password"
								name="password"
								value={password}
								type="password"
								onChange={handleInput}
							/>
							<label htmlFor="password">Password:</label>
						</div>
						<button type="submit">Create Account</button>
					</form>
				</div>
				<div className={`${styles.divider}`}>
					<h4>OR</h4>
				</div>
				<div
					className={`${styles.oauth_group} ${styles.flex} ${styles.flexCol}`}
				>
					{Object.values(providers).map((provider) => {
						return (
							<div key={provider.name}>
								<button onClick={(e) => handleOAuthLogin(e, provider)}>
									<div className={`${styles.flex}`}>
										<Image
											alg="google loco"
											src="/images/googlelogo.png"
											width={20}
											height={20}
										/>
										<p>Sign in with {provider.name}</p>
									</div>
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default CreateAccount;

export async function getServerSideProps(context) {
	// console.log("context", context);
	const providers = await getProviders();
	console.log("providers", providers);
	return {
		props: {
			providers: providers,
		},
	};
}
