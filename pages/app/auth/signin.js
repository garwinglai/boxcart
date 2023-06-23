import React, { useState } from "react";
import styles from "@/styles/app/auth/signin.module.css";
import Link from "next/link";
import { Avatar } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { signIn, useSession } from "next-auth/react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import login_icon from "@/public/images/icons/login_icon.png";
import Image from "next/image";
import logo from "@/public/images/logos/boxcart_logo_full.png";

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
			const { status, error, ok, url } = signinResult;
			// console.log(status, error, ok, url);

			if (status == 200 && ok) {
				const signedInRoute =
					process.env.NODE_ENV && process.env.NODE_ENV === "production"
						? "https://app.boxcart.shop/account/checklist"
						: "http://app.localhost:3000/account/checklist";
				router.push(signedInRoute);
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
		<div className={`${styles.signin} lg:bg-[color:var(--brown-bg)] h-screen`}>
			<Snackbar open={openError} onClose={handleCloseSnackbar}>
				<Alert severity="error">{errorMessage}</Alert>
			</Snackbar>
			<div className={`${styles.outerContainer} lg:shadow p-12`}>
				<div className="relative">
					<Image
						src={logo}
						alt="boxcart logo"
						className=" aspect-video w-40 h-40 object-cover absolute -top-24 -left-14 "
					/>
					<div className="mx-auto text-center pb-4">
						<Image src={login_icon} alt="login icon" className="mx-auto"/>
						<h2 className="">Sign in</h2>
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
						<Link href="/auth/signup" className={`${styles.link} underline text-sm`}>
							Get started
						</Link>
					</div>
				</div>
				<footer className={`${styles.termsContainer} ${styles.flexRow}`}>
					<Link href="/" className={`${styles.link} mt-4 underline font-light text-sm`}>
						Privacy
					</Link>
					<Link href="/" className={`${styles.link} mt-4 underline font-light text-sm`}>
						Terms
					</Link>
				</footer>
			</div>
		</div>
	);
};

export default Signin;
