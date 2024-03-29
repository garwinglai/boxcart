import React, { useEffect, useState } from "react";
import styles from "../../../styles/home/waitlist/reserve-confirm.module.css";
import Image from "next/image";
import Router from "next/router";
import PageLoader from "@/components/global/loaders/PageLoader";
import confetti_icon from "../../../public/images/icons/confetti.png";

function ReserveConfirm() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [subdomain, setSubdomain] = useState("");
  const [fullDomain, setFullDomain] = useState("");

  useEffect(() => {
    const sessionStoredSubdomain = sessionStorage.getItem("subdomain");
    const storedSessionFullDomain = sessionStorage.getItem("fullDomain");

    if (!sessionStoredSubdomain) {
      Router.push("/waitlist/reserve-shop");
    } else {
      // const domain = sessionStoredSubdomain + ".boxcart.shop";
      setSubdomain(sessionStoredSubdomain);
      setFullDomain(storedSessionFullDomain);
      setIsPageLoading(false);
    }
  }, []);

  // * Return page loader
  // * Return page loader
  if (isPageLoading)
    return (
      <div className={`${styles.container}`}>
        <div
          className={`${styles.confirm_page} ${styles.flex} ${styles.flexCol}`}
        >
          <div className={`${styles.page_loader}`}>
            <PageLoader />
            <h1>BoxCart</h1>
          </div>
        </div>
      </div>
    );

  // * Return page content
  return (
    <div className={`${styles.container}`}>
      <div
        className={`${styles.confirm_page} ${styles.flex} ${styles.flexCol}`}
      >
        <div className={`${styles.header_group}`}>
          <h1>Success!</h1>

          <p className={`${styles.email}`}>
            Check your <b>email</b> to see what&apos;s next.
          </p>
        </div>
        <Image
          src={confetti_icon}
          alt="congrats gift box icons"
          height={100}
          width={100}
        />

        <div className={`${styles.domain_group}`}>
          <div className={`${styles.input_group}`}>
            <h4 htmlFor="domain">{fullDomain}</h4>
          </div>
          {/* <h3>You secured your shop name.</h3> */}
        </div>
      </div>
    </div>
  );
}

export default ReserveConfirm;
