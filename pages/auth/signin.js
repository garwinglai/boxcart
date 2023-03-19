import React, { useState } from "react";
import styles from "@/styles/auth/signin.module.css";
import Link from "next/link";
import Image from "next/image";
import appleLogo from "../../public/images/applelogo.png";
import facebookLogo from "../../public/images/facebooklogo.png";
import googleLogo from "../../public/images/googlelogo.png";
import {
	getProviders,
	signIn,
	getSession,
	getCsrfToken,
} from "next-auth/react";

const Signin = ({ providers }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleChange = (e) => {};

	return (
		<div className={`${styles.signin}`}>
			<div className={`${styles.outerContainer}`}>
				<div className={`${styles.signinContainer}`}>
					<div className={`${styles.logoContainer} ${styles.flexRow}`}>
						<h4>Logo.</h4>
						<h2>BoxCart</h2>
					</div>
					<div className={`${styles.descriptContainer}`}>
						<h2 className={`${styles.primaryFont} ${styles.loginHeader}`}>
							Log in
						</h2>
						<p className={`${styles.secondaryFont}`}>Continue to BoxCart</p>
					</div>
					<div className={`${styles.flexCol}`}>
						<input
							className={`${styles.inputStyle}`}
							type="email"
							onChange={handleChange}
							placeholder="Email"
							autoFocus
							value={email}
						/>
						<input
							className={`${styles.inputStyle}`}
							type="password"
							onChange={handleChange}
							placeholder="Password"
							value={password}
						/>

						<button className={`${styles.btn} ${styles.loginBtn}`}>
							Log In
						</button>
					</div>
					<div
						className={`${styles.separator} ${styles.flexRow} ${styles.secondaryFont}`}
					>
						<p>----</p>
						<p>or</p>
						<p>----</p>
					</div>
					<div className={`${styles.flexCol}`}>
						{Object.values(providers).map((provider) => {
							console.log("provider_2", provider);
							return (
								<div key={provider.name}>
									<button
										className={`${styles.btn}`}
										onClick={() => signIn(provider.id)}
									>
										{" "}
										<div
											className={`${styles.flexRow} ${styles.loginOthersBtn}`}
										>
											<Image
												src={googleLogo}
												alt="Google Logo"
												width={15}
												height={15}
											/>
											<p>Login with {provider.name}</p>
										</div>
									</button>
								</div>
							);
						})}

						<button className={`${styles.btn}`}>
							<div className={`${styles.flexRow} ${styles.loginOthersBtn}`}>
								<Image
									src={appleLogo}
									alt="Apple Logo"
									width={15}
									height={15}
								/>
								<p>Login with Apple</p>
							</div>
						</button>
						<button className={`${styles.btn}`}>
							<div className={`${styles.flexRow} ${styles.loginOthersBtn}`}>
								<Image
									src={facebookLogo}
									alt="Facebook Logo"
									width={15}
									height={15}
								/>
								<p>Login with Facebook</p>
							</div>
						</button>
						<button className={`${styles.btn}`}>
							<div className={`${styles.flexRow} ${styles.loginOthersBtn}`}>
								<Image
									src={googleLogo}
									alt="Google Logo"
									width={15}
									height={15}
								/>
								<p>Login with Google</p>
							</div>
						</button>
					</div>
					<div className={`${styles.newUserContainer} ${styles.flexRow}`}>
						<p>New to BoxCart?</p>
						<Link href="/" className={`${styles.link}`}>
							Get started
						</Link>
					</div>
				</div>
				<footer className={`${styles.termsContainer} ${styles.flexRow}`}>
					<Link href="/" className={`${styles.link}`}>
						Privacy
					</Link>
					<Link href="/" className={`${styles.link}`}>
						Terms
					</Link>
				</footer>
			</div>
		</div>
	);
};

export default Signin;

export const getServerSideProps = async (ctx) => {
	const providers = await getProviders(ctx);
	const { req } = ctx;
	const session = await getSession({ req });

	console.log("providers", providers);

	if (session) {
		return {
			redirect: { destination: "/auth/signin" },
		};
	}

	return {
		props: {
			providers: providers,
		},
	};
};

// * OAuth

{
	/* <div className={`${styles.divider}`}>
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
											alt="google logo"
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
				</div> */
}
