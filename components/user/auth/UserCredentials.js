import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import pencil_icon from "@/public/images/icons/pencil_icon.png";
import login_icon from "@/public/images/icons/login_icon.png";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

const theme = createTheme();

function UserCredentials({
  formValues,
  handleChange,
  isSignIn,
  isSignUp,
  isLoading,
  hasBizAccont,
}) {
  const { firstName, lastName, email, password } = formValues;

  const {
    query: { site },
  } = useRouter();

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
          {isSignUp && !hasBizAccont ? (
            <Image
              src={pencil_icon}
              alt="pencil icon to sign up"
              className="w-12 h-12"
            />
          ) : (
            <Image
              src={login_icon}
              alt="login icon to sign in"
              className="w-16 h-16"
            />
          )}
          <h3 className="font-medium">
            {isSignUp && !hasBizAccont
              ? "Sign up"
              : hasBizAccont
              ? "Connect account"
              : "Sign in"}
          </h3>

          <Box noValidate sx={{ mt: 2, mb: 4 }}>
            <Grid container spacing={2}>
              {isSignUp && !hasBizAccont && (
                <React.Fragment>
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
                      InputProps={{ sx: { borderRadius: "45px" } }}
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
                      InputProps={{ sx: { borderRadius: "45px" } }}
                    />
                  </Grid>
                </React.Fragment>
              )}
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
                  InputProps={{ sx: { borderRadius: "45px" } }}
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
                  InputProps={{ sx: { borderRadius: "45px" } }}
                />
              </Grid>
            </Grid>
            {isSignIn && (
              <div className="text-right ">
                <Link
                  href={`/user/auth/forgot-password?site=${site}`}
                  className="text-right text-xs text-blue-500"
                >
                  Forgot password
                </Link>
              </div>
            )}
            <div className="h-10 mt-4 text-center">
              {isLoading ? (
                <CircularProgress color="secondary" size="2rem" />
              ) : (
                <ButtonPrimary
                  name={
                    isSignUp && !hasBizAccont
                      ? "Sign up"
                      : hasBizAccont
                      ? "Connect"
                      : "Sign in"
                  }
                  type="submit"
                />
              )}
            </div>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default UserCredentials;
