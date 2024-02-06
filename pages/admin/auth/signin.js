import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PasswordField } from "@/components/admin/auth/PasswordField";
import Logo from "@/components/Logo";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import { useRouter } from "next/router";
import { auth } from "@/firebase/fireConfig";
import { ChakraProvider } from "@chakra-ui/react";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { push } = useRouter();

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    if (name === "email") {
      setEmail(value);
    }

    if (name === "password") {
      setPassword(value);
    }
  };

  const signIn = (email, password) => async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        if (user) {
          setErrorMessage("");
          push("/admin");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  };

  return (
    <ChakraProvider>
      <Container
        maxW="lg"
        py={{
          base: "12",
          md: "24",
        }}
        px={{
          base: "0",
          sm: "8",
        }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <div className="w-12 h-12 relative mx-auto">
              <Logo />
            </div>
          </Stack>
          <Box
            py={{
              base: "0",
              sm: "8",
            }}
            px={{
              base: "4",
              sm: "10",
            }}
            bg={{
              base: "transparent",
              sm: "bg.surface",
            }}
            boxShadow={{
              base: "none",
              sm: "md",
            }}
            borderRadius={{
              base: "none",
              sm: "xl",
            }}
          >
            <form onSubmit={signIn(email, password)}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <h2 className="text-center">Admin Log In</h2>
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      onChange={handleInputChange}
                      name="email"
                      value={email}
                      required
                    />
                  </FormControl>
                  <PasswordField
                    onChange={handleInputChange}
                    password={password}
                  />
                </Stack>
                <HStack justify="space-between">
                  <Button variant="text" size="sm">
                    Forgot password?
                  </Button>
                </HStack>
                <Stack spacing="6">
                  {isLoading ? (
                    <BoxLoader />
                  ) : (
                    <Button type="submit">Sign in</Button>
                  )}
                </Stack>
              </Stack>
              {errorMessage && (
                <Text color="red.500" textAlign="center" className="mt-4">
                  {errorMessage}
                </Text>
              )}
            </form>
          </Box>
        </Stack>
        <Stack
          spacing={{
            base: "2",
            md: "3",
          }}
          className="mt-4"
          textAlign="center"
        >
          <Text color="fg.muted">
            Need an account?{" "}
            <Link href="/admin/auth/signup" className="text-blue-700">
              Sign up
            </Link>
          </Text>
        </Stack>
      </Container>
    </ChakraProvider>
  );
}

export default Signin;
