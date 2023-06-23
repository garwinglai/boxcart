import React from "react";
import styles from "../../styles/components/auth/credentialsform.module.css";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import pencil_icon from "@/public/images/icons/pencil_icon.png";

const theme = createTheme();

function CredentialsForm({ signupValues, handleChange }) {
	const { firstName, lastName, email, password } = signupValues;
	return (
		<ThemeProvider theme={theme}>
			<Container component="main">
				<CssBaseline />
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Image
						src={pencil_icon}
						alt="pencil icon to sign up"
						className="w-12 h-12"
					/>
					<h3 className="font-medium">Sign up</h3>

					<Box noValidate sx={{ mt: 2, mb: 4 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="given-name"
									name="firstName"
									value={firstName}
									required
									fullWidth
									size="small"
									color="warning"
									id="firstName"
									label="First Name"
									autoFocus
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									color="warning"
									size="small"
									id="lastName"
									label="Last Name"
									name="lastName"
									value={lastName}
									autoComplete="family-name"
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									color="warning"
									size="small"
									id="email"
									label="Email Address"
									name="email"
									value={email}
									autoComplete="email"
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									color="warning"
									size="small"
									name="password"
									label="Password"
									type="password"
									id="password"
									value={password}
									autoComplete="new-password"
									onChange={handleChange}
								/>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default CredentialsForm;
