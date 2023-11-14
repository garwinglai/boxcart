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
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import HelpIcon from "@mui/icons-material/Help";
import money_withdraw from "@/public/images/icons/money-withdraw.png";
import PayoutGrid from "@/components/app/income/PayoutGrid";
import { calculateStripePayoutFee } from "@/utils/stripe-fees";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const paymentsAvail = ["stripe", "venmo", "paypal", "zelle", "cash"];

function Revenue({ userAccount }) {
  const {
    acceptedPayments,
    revenue,
    payout,
    id: accountId,
  } = userAccount || {};

  const [availBalancePenny, setAvailBalancePenny] = useState(0);
  const [availableStripeBalance, setAvailableStripeBalance] = useState(0);
  const [pendingStripeBalance, setPendingStripeBalance] = useState(0);
  const [stripeAccId, setStripeAccId] = useState("");
  const [isCashingOut, setIsCashingOut] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    alertMsg: "",
  });
  const [cashRevenue, setCashRevenue] = useState("0.00");
  const [venmoRevenue, setVenmoRevenue] = useState("0.00");
  const [paypalRevenue, setPaypalRevenue] = useState("0.00");
  const [zelleRevenue, setZelleRevenue] = useState("0.00");
  const [stripeRevenue, setStripeRevenue] = useState("0.00");
  const [totalRevenue, setTotalRevenue] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStripeBalance, setIsLoadingStripeBalance] = useState(false);
  const [payouts, setPayouts] = useState([]);

  const { showAlert, alertMsg } = alert;

  const { push } = useRouter();

  useEffect(() => {
    let ignore = false;
    if (!stripeAccId) return;
    setIsLoading(true);
    const retrievePayouts = async () => {
      const retrievePayoutsApi = `/api/private/stripe/retrieve-payouts/${stripeAccId}`;

      const res = await fetch(retrievePayoutsApi, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success, error, payouts } = await res.json();

      if (success) {
        const { data } = payouts;
        if (!ignore) {
          setPayouts(data);
        }
      }

      if (error) {
        handleOpenAlert("Error retrieving payouts.");
      }

      setIsLoading(false);
    };

    retrievePayouts();

    return () => (ignore = true);
  }, [stripeAccId]);

  useEffect(() => {
    let ignore = false;
    if (!revenue) return;

    setIsLoading(true);

    const fetchRevenue = async () => {
      const fetchRevenueApi = `/api/private/revenue/get-revenue/${accountId}`;

      const res = await fetch(fetchRevenueApi, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, error, revenue } = await res.json();

      if (error) {
        // TODO: show snackbar
      }

      if (success) {
        const {
          totalBalancePenny,
          cardRevenuePenny,
          cashRevenuePenny,
          paypalRevenuePenny,
          venmoRevenuePenny,
          zelleRevenuePenny,
        } = revenue;

        const totalRevenue = (totalBalancePenny / 100).toFixed(2);
        const card = (cardRevenuePenny / 100).toFixed(2);
        const cash = (cashRevenuePenny / 100).toFixed(2);
        const paypal = (paypalRevenuePenny / 100).toFixed(2);
        const venmo = (venmoRevenuePenny / 100).toFixed(2);
        const zelle = (zelleRevenuePenny / 100).toFixed(2);

        setTotalRevenue(totalRevenue);
        setStripeRevenue(card);
        setCashRevenue(cash);
        setPaypalRevenue(paypal);
        setVenmoRevenue(venmo);
        setZelleRevenue(zelle);
      }
      setIsLoading(false);
    };

    fetchRevenue();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setIsLoadingStripeBalance(true);

    if (!acceptedPayments) return;

    const getStripeBalance = async () => {
      let { stripeAccountId } = acceptedPayments.find(
        (payment) => payment.paymentMethod === "stripe"
      );
      console.log("stripeAccountId", stripeAccountId);

      const getBalanceApi = `/api/private/stripe/get-balance/${stripeAccountId}`;

      const res = await fetch(getBalanceApi, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, error, balance } = await res.json();

      if (error) {
        // TODO: show snackbar
        console.log("error", error);
      }

      if (success) {
        const { available, pending } = balance;
        const availBalance = available[0].amount / 100;
        const pendingBalance = pending[0].amount / 100;

        setStripeAccId(stripeAccountId);
        setAvailBalancePenny(available[0].amount);
        setAvailableStripeBalance(availBalance);
        setPendingStripeBalance(pendingBalance);
      }
      console.log("here");
      setIsLoadingStripeBalance(false);
    };

    getStripeBalance();
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

  const handleWithdraw = async () => {
    setIsCashingOut(true);

    // Pull payout to see when was last payout, collect $2 if new mont
    const recentPayout = await fetchMostRecentPayout(accountId);

    if (!recentPayout.success || recentPayout.error) {
      handleOpenAlert("Error retrieving payout.");
      setIsCashingOut(false);
      return;
    }

    let hasMonthylFee = false;

    // First payout
    if (recentPayout.payout) {
      const { createdAt } = recentPayout.payout;
      const currentMonth = new Date().getMonth();
      const lastPayoutMonth = new Date(createdAt).getMonth();
      if (currentMonth !== lastPayoutMonth) {
        hasMonthylFee = true;
      }
    }

    const transferAmountPenny = calculateStripePayoutFee(
      availBalancePenny,
      hasMonthylFee
    );

    const transferData = {
      amount: transferAmountPenny,
      stripeAccId,
    };

    // Transfer payout fees
    const transfer = await transferPayoutFees(transferData);

    if (!transfer.success || transfer.error) {
      handleOpenAlert("Transfer payout error.");
      setIsCashingOut(false);
      return;
    }

    const netBalancePenny = availBalancePenny - transferAmountPenny;
    const stripePayoutData = {
      amount: netBalancePenny,
      stripeAccId,
    };

    // Create payout
    const stripePayout = await createStripePayout(stripePayoutData);

    if (stripePayout.error || !stripePayout.success) {
      handleOpenAlert("Payout error.");
      setIsCashingOut(false);
      return;
    }

    const { amount, arrival_date, id: stripePayoutId } = payout;
    const arrival = new Date(arrival_date * 1000).toLocaleDateString();

    const balanceDisplay = `$${(availBalancePenny / 100).toFixed(2)}`;
    const feesDisplay = `$${(transferAmountPenny / 100).toFixed(2)}`;
    const netDisplay = `$${(amount / 100).toFixed(2)}`;

    // Save data to payouts
    const savePayoutData = {
      stripeAccountId: stripeAccId,
      stripePayoutId,
      balance: availBalancePenny,
      balanceDisplay,
      fees: transferAmountPenny,
      feesDisplay,
      net: amount,
      netDisplay,
    };

    const createdPayout = await createPayoutPrisma(savePayoutData, accountId);

    if (!createdPayout.success || createdPayout.error) {
      // TODO: log error of payout
    }

    setAvailBalancePenny(0);
    setAvailableStripeBalance(0);
    handleOpenAlert(`Payout ${amount / 100} will arrive on ${arrival}`);
    setIsCashingOut(false);
  };

  const createPayoutPrisma = async (payoutData, accountId) => {
    const createPayoutApi = `/api/private/payout/create-payout`;
    const data = {
      accountId,
      payoutData,
    };

    const res = await fetch(createPayoutApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const createdPayout = await res.json();
    return createdPayout;
  };

  const fetchMostRecentPayout = async (accountId) => {
    const api = `/api/private/payout/get-payout/${accountId}`;
    const res = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    return data;
  };

  const transferPayoutFees = async (transferData) => {
    const transferApi = `/api/private/stripe/transfer-payout-fee`;

    const res = await fetch(transferApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transferData),
    });
    const transfer = await res.json();

    return transfer;
  };

  const createStripePayout = async (stripePayoutData) => {
    const cashOutApi = `/api/private/stripe/create-payout`;

    const res = await fetch(cashOutApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stripePayoutData),
    });

    const data = await res.json();
    return data;
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
        <div className="flex flex-col justify-between p-4 shadow-md border rounded-lg w-full">
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
              <h3 className="text-sm md:text-base">Total amount</h3>
            </div>
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <p className="text-base text-[color:var(--money)]">
                + {totalRevenue} $
              </p>
            )}
          </div>
          <div className="w-fit ml-auto mb-1">
            <ButtonFourth name="View orders" handleClick={handleViewOrders} />
          </div>
        </div>
        <div className="p-4 shadow-md border rounded-lg w-full">
          <h4 className="mb-2">Payout balance</h4>

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
                <h3 className="text-sm ">Available</h3>
                <Divider />
                <h3 className="text-sm ">Pending</h3>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {isLoadingStripeBalance ? (
                <CircularProgress size={20} sx={{ marginBottom: "2px" }} />
              ) : availableStripeBalance === 0 ? (
                <p className="text-gray-500 text-base">
                  {availableStripeBalance} $
                </p>
              ) : (
                <p className="text-[color:var(--money)] text-base">
                  + {availableStripeBalance} $
                </p>
              )}
              <Divider style={{ width: "100%" }} />
              {isLoadingStripeBalance ? (
                <CircularProgress size={20} sx={{ marginTop: "2px" }} />
              ) : pendingStripeBalance === 0 ? (
                <p className="text-gray-500 text-base">
                  {pendingStripeBalance} $
                </p>
              ) : (
                <p className="text-[color:var(--money)] text-base">
                  + {pendingStripeBalance} $
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center mr-4 ">
              <p className="font-light text-xs md:text-sm">*Card payments </p>
              <HtmlTooltip
                leaveTouchDelay={20000}
                enterTouchDelay={0}
                title={
                  <div className="px-4 py-2">
                    <h4 className="font-bold text-xs">Payout info:</h4>
                    <ul className="pl-4">
                      <li className="list-disc">
                        Payouts are manual. If you have an available balance,
                        there will be a cash out button.
                      </li>
                      <li className="list-disc">
                        First payout will be available after 7 days, 14 days for
                        certain industries, and 30 days if you&apos;re in
                        Brazil.
                      </li>
                    </ul>
                    <h4 className="font-bold text-xs mt-4">Payout fees:</h4>
                    <ul className="pl-4">
                      <li className="list-disc">
                        Payout fees will be deducted from available amount.
                      </li>
                      <li className="list-disc">
                        0.25% + 25c per payout initiated.
                      </li>
                      <li className="list-disc">
                        $2 active fee for the month a payout is initiated.
                      </li>
                      <li className="list-disc">
                        These fees are not BoxCart fees. These fees belong to
                        the credit card company, Stripe.
                      </li>
                    </ul>
                    <h4 className="font-bold text-xs mt-4">Recommended:</h4>
                    <ul className="pl-4">
                      <li className="list-disc">
                        To incur the least amount of fees, we recommend to cash
                        out only when needed.
                      </li>
                      <li className="list-disc">
                        If you have already cashed out for a certain month, any
                        additional payout will not incur the $2 active fee for
                        that month.
                      </li>
                    </ul>
                  </div>
                }
              >
                <IconButton>
                  <HelpIcon fontSize="small" />
                </IconButton>
              </HtmlTooltip>
            </div>

            <div className="w-fit ml-auto">
              {isCashingOut ? (
                <CircularProgress size={20} />
              ) : availableStripeBalance !== 0 ? (
                <p className="text-xs md:text-sm font-extralight text-gray-400 border rounded-full px-2 py-1">
                  No payout balance
                </p>
              ) : (
                <ButtonPrimary
                  handleClick={handleWithdraw}
                  name="Withdraw"
                  disabled={availableStripeBalance == 0}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <Divider textAlign="left">
          <p className="font-light text-sm text-[color:var(--black-design-extralight)]">
            Income by payment type
          </p>
        </Divider>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        {paymentsAvail.map((payment) => {
          const paymentData = acceptedPayments.find(
            (acceptedPayment) => acceptedPayment.paymentMethod === payment
          );

          let data = {
            payment,
            isEnabled: false,
            image: "",
            revenue: 0,
          };

          switch (payment) {
            case "stripe":
              data.image = credit_card;
              data.payment = "Card";
              if (paymentData) {
                data.isEnabled = paymentData.isEnabled;
              }
              data.revenue = stripeRevenue;
              break;
            case "venmo":
              data.image = venmo;
              data.payment = "Venmo";
              if (paymentData) {
                data.isEnabled = paymentData.isEnabled;
              }
              data.revenue = venmoRevenue;
              break;
            case "paypal":
              data.image = paypal;
              data.payment = "PayPal";
              if (paymentData) {
                data.isEnabled = paymentData.isEnabled;
              }
              data.revenue = paypalRevenue;
              break;
            case "zelle":
              data.image = zelle;
              data.payment = "Zelle";
              if (paymentData) {
                data.isEnabled = paymentData.isEnabled;
              }
              data.revenue = zelleRevenue;
              break;
            case "cash":
              data.image = cash;
              data.payment = "Cash";
              if (paymentData) {
                data.isEnabled = paymentData.isEnabled;
              }
              data.revenue = cashRevenue;
              break;
            default:
              break;
          }

          return (
            <PaymentCard
              key={payment}
              paymentData={data}
              isLoading={isLoading}
            />
          );
        })}
      </div>
      <div className="my-4">
        <Divider textAlign="left">
          <p className="font-light text-sm ">Payout history</p>
        </Divider>
      </div>
      {payouts.length === 0 ? (
        <div className="opacity-50 flex flex-col items-center mt-6">
          <div className="w-12 h-12 aspect-square relative ">
            <Image
              src={money_withdraw}
              alt="cash out"
              className="w-full h-full "
              fill
              // priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <p className="mx-auto">No payouts yet</p>
        </div>
      ) : (
        <div className="border rounded-lg shadow-md">
          <PayoutGrid payouts={payouts} />
        </div>
      )}
    </div>
  );
}

export default Revenue;

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
          revenue: true,
          payout: true,
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

Revenue.getLayout = function getLayout(
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

Revenue.pageTitle = "Revenue";
Revenue.pageIcon = <SavingsOutlinedIcon />;
Revenue.pageRoute = "revenue";
Revenue.mobilePageRoute = "revenue";
