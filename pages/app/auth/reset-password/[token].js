import BoxLoader from "@/components/global/loaders/BoxLoader";
import { getCookie } from "@/utils/clientStorage";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

function ResetPassword() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [isDifferentAccessPoint, setIsDifferentAccessPoint] = useState(false);

  const { query } = useRouter();
  const { token } = query;

  useEffect(() => {
    const resetPasswordToken = getCookie("resetPasswordToken");
    if (!resetPasswordToken) {
      setIsTokenExpired(true);

      setIsLoading(false);
      return;
    }

    const cookieToken = resetPasswordToken.split("=")[1];

    console.log("cookieToken", cookieToken);

    if (token != cookieToken) {
      isDifferentAccessPoint(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, []);

  return isLoading ? (
    <div>
      <BoxLoader />
    </div>
  ) : isTokenExpired ? (
    <div className="flex flex-col items-center justify-center mt-36">
      <p>Your rest password page has expired.</p>
      <Link href="/auth/forgot-password" className="text-blue-500 text-sm mt-4">
        Forgot password
      </Link>
    </div>
  ) : (
    <div>ResetPassword</div>
  );
}

export default ResetPassword;
