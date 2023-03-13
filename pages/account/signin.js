import React, { useState } from "react";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import {
	setEmail,
	setPassword,
	selectEmail,
	selectPassword,
} from "../../slices/userSlice";
import styles from "@/styles/account/signin.module.css";
import Link from "next/link";
import Image from "next/image";
import appleLogo from "../../public/images/applelogo.png";
import facebookLogo from "../../public/images/facebooklogo.png";
import googleLogo from "../../public/images/googlelogo.png";

export const Signin = (props) => {
	const count = useSelector(selectEmail);
	const dispatch = useDispatch();

	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");

	const handleChange = (e) => {
		dispatch(e.target.value);
	};

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
						/>
						<input
							className={`${styles.inputStyle}`}
							type="password"
							onChange={handleChange}
							placeholder="Password"
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
