import React, { useState } from "react";
import styles from "@/styles/home/auth/signin.module.css";
import Link from "next/link";
import { Avatar } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { signIn } from "next-auth/react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

const Signin = ({ providers }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [openError, setOpenError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const router = useRouter();

	const handleChangeEmail = (e) => {
		const { value, name } = e.target;
		setEmail(value);
	};

	const handleChangePassword = (e) => {
		const { value, name } = e.target;
		setPassword(value);
	};

	function handleCloseSnackbar() {
		setOpenError(false);
		setErrorMessage("");
	}

	async function handleLogin(e) {
		console.log("login", email, password);
		e.preventDefault();
		setIsLoading(true);

		try {
			const signinResult = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});
			const { status, error } = signinResult;

			if (status == 200) {
				router.push("/account/checklist");
				return;
			}

			if (status == 401) {
				setOpenError(true);
				setErrorMessage("Incorrect email/password.");
			}

			if (status == 403) {
				setOpenError(true);
				setErrorMessage("Access denied.");
			}

			if (status == 500) {
				setOpenError(true);
				setErrorMessage("Network error.");
			}
		} catch (error) {
			console.log("error signing in", error);
			setOpenError(true);
			setErrorMessage("Unknown error. Please contact hello@boxcart.shop");
		}

		setIsLoading(false);
	}

	return (
		<div className={`${styles.signin}`}>
			<Snackbar open={openError} onClose={handleCloseSnackbar}>
				<Alert severity="error">{errorMessage}</Alert>
			</Snackbar>
			<div className={`${styles.outerContainer}`}>
				<div className={`${styles.signinContainer}`}>
					<div className={`${styles.logoContainer} ${styles.flexRow}`}>
						<h2>BoxCart</h2>
					</div>
					<div className={`${styles.descriptContainer}`}>
						<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
							<LockOpenIcon />
						</Avatar>
						<h2 className={`${styles.primaryFont} ${styles.loginHeader}`}>
							Log in
						</h2>
						{/* <p className={`${styles.secondaryFont}`}>Continue to BoxCart</p> */}
					</div>
					<form onSubmit={handleLogin} className={`${styles.flexCol}`}>
						<input
							className={`${styles.inputStyle}`}
							type="email"
							onChange={handleChangeEmail}
							placeholder="Email"
							autoFocus
							value={email}
							required
						/>
						<input
							className={`${styles.inputStyle}`}
							type="password"
							onChange={handleChangePassword}
							placeholder="Password"
							value={password}
							required
						/>
						{isLoading ? (
							<CircularProgress color="secondary" />
						) : (
							<button type="submit" className={`${styles.btn}`}>
								Log In
							</button>
						)}
					</form>

					<div className={`${styles.newUserContainer} ${styles.flexRow}`}>
						<p>New to BoxCart?</p>
						<Link href="/auth/signup" className={`${styles.link}`}>
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
