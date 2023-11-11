import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import money_bag from "@/public/images/icons/money-bag.png";
import cash_out from "@/public/images/icons/cash-out.png";
import venmo from "@/public/images/icons/venmo.png";
import paypal from "@/public/images/icons/paypal.png";
import zelle from "@/public/images/icons/zelle.png";
import cash from "@/public/images/icons/cash.png";
import credit_card from "@/public/images/icons/credit-card.png";
import Image from "next/image";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import { Divider } from "@mui/material";
import prisma from "@/lib/prisma";
import { isAuth } from "@/helper/client/auth/isAuth";
import PaymentCard from "@/components/app/income/PaymentCard";
import { useRouter } from "next/router";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";

const paymentsAvail = ["stripe", "venmo", "paypal", "zelle", "cash"];

function Income({ userAccount }) {
  const { acceptedPayments } = userAccount || {};

  const [availBalancePenny, setAvailBalancePenny] = useState(0);
  const [availableStripeBalance, setAvailableStripeBalance] = useState(0);
  const [pendingStripeBalance, setPendingStripeBalance] = useState(0);
  const [stripeAccId, setStripeAccId] = useState("");
  const [isCashingOut, setIsCashingOut] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    alertMsg: "",
  });

  const { showAlert, alertMsg } = alert;

  const { push } = useRouter();

  useEffect(() => {
    const getBalance = async () => {
      let { stripeAccountId } = acceptedPayments.find(
        (payment) => payment.paymentMethod === "stripe"
      );

      const getBalanceApi = `/api/private/stripe/get-balance/${stripeAccountId}`;

      const res = await fetch(getBalanceApi, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        const { balance } = data;
        const { available, pending } = balance;
        const availBalance = available[0].amount / 100;
        const pendingBalance = pending[0].amount / 100;

        setStripeAccId(stripeAccountId);
        setAvailBalancePenny(available[0].amount);
        setAvailableStripeBalance(availBalance);
        setPendingStripeBalance(pendingBalance);
      }
    };

    getBalance();
  }, []);

  const closeAlert = () => {
    setAlert({ showAlert: false, alertMsg: "" });
  };

  const handleOpenAlert = (msg) => {
    setAlert({ showAlert: true, alertMsg: msg });
  };

  const handleViewOrders = () => {
    push("/account/orders/live");
  };

  const handleCashOut = async () => {
    setIsCashingOut(true);
    const cashOutApi = `/api/private/stripe/payout`;

    const body = {
      amount: availBalancePenny,
      stripeAccId,
    };

    const res = await fetch(cashOutApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    const { success, error, payout } = data;

    if (error) {
      handleOpenAlert("Payout error.");
    }

    if (success) {
      const { amount, arrival_date, status } = payout;
      const arrival = new Date(arrival_date * 1000);
      setAvailBalancePenny(0);
      setAvailableStripeBalance(0);
      handleOpenAlert(`Payout ${amount / 100} will arrive on ${arrival}`);
    }

    setIsCashingOut(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeAlert}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className="p-6 flex flex-col gap-4 pb-36">
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={closeAlert}
        message={alertMsg}
        action={action}
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="p-4 shadow-md border rounded-lg w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 aspect-square relative ">
                <Image
                  src={money_bag}
                  alt="money bag"
                  className="w-full h-full"
                  fill
                  // priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3>Total income</h3>
            </div>
            <p className="text-[color:var(--money)]">
              + {availableStripeBalance} $
            </p>
          </div>
          <div className="w-fit ml-auto mt-2">
            <ButtonFourth name="View orders" handleClick={handleViewOrders} />
          </div>
        </div>
        <div className="p-4 shadow-md border rounded-lg w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 aspect-square relative ">
                <Image
                  src={cash_out}
                  alt="cash out"
                  className="w-full h-full"
                  fill
                  // priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-col">
                <h3>Amount available:</h3>
                <h3>Amount pending:</h3>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {availableStripeBalance === 0 ? (
                <p className="text-gray-500">{availableStripeBalance} $</p>
              ) : (
                <p className="text-[color:var(--money)]">
                  + {availableStripeBalance} $
                </p>
              )}
              {pendingStripeBalance === 0 ? (
                <p className="text-gray-500">{pendingStripeBalance} $</p>
              ) : (
                <p className="text-[color:var(--money)]">
                  + {pendingStripeBalance} $
                </p>
              )}
            </div>
          </div>
          <div className="w-fit ml-auto mt-2">
            {isCashingOut ? (
              <CircularProgress size={20} />
            ) : (
              <ButtonPrimary
                handleClick={handleCashOut}
                name={
                  availableStripeBalance == 0 ? "Empty balance" : "Withdraw"
                }
                disabled={availableStripeBalance == 0}
              />
            )}
          </div>
        </div>
      </div>
      <div className="my-4">
        <Divider>
          <p className="font-light text-sm">Income by payment type</p>
        </Divider>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        {paymentsAvail.map((payment) => {
          const paymentData = acceptedPayments.find(
            (acceptedPayment) => acceptedPayment.paymentMethod === payment
          );

          let data = {
            payment,
            isEnabled: paymentData.isEnabled,
            image: "",
          };

          switch (payment) {
            case "stripe":
              data.image = credit_card;
              data.payment = "Card";
              break;
            case "venmo":
              data.image = venmo;
              data.payment = "Venmo";
              break;
            case "paypal":
              data.image = paypal;
              data.payment = "PayPal";
              break;
            case "zelle":
              data.image = zelle;
              data.payment = "Zelle";
              break;
            case "cash":
              data.image = cash;
              data.payment = "Cash";
              break;
            default:
              break;
          }

          return <PaymentCard key={payment} paymentData={data} />;
        })}
      </div>
    </div>
  );
}

export default Income;

export async function getServerSideProps(context) {
  return isAuth(context, async (userSession) => {
    const { user, expires } = userSession;
    const { name, email, id } = user;
    let serializedAccount;

    try {
      const userAccount = await prisma.account.findUnique({
        where: {
          email,
        },
        include: {
          acceptedPayments: true,
        },
      });

      serializedAccount = JSON.parse(JSON.stringify(userAccount));
    } catch (error) {
      console.log("serversideprops checklist error:", error);
      serializedAccount = null;
    }

    return {
      props: {
        userSession,
        userAccount: serializedAccount,
      },
    };
  });
}

Income.getLayout = function getLayout(
  page,
  pageTitle,
  pageIcon,
  pageRoute,
  mobilePageRoute
) {
  return (
    <AppLayout
      pageTitle={pageTitle}
      pageIcon={pageIcon}
      pageRoute={pageRoute}
      mobilePageRoute={mobilePageRoute}
    >
      {page}
    </AppLayout>
  );
};

Income.pageTitle = "Income";
Income.pageIcon = <SavingsOutlinedIcon />;
Income.pageRoute = "income";
Income.mobilePageRoute = "income";
