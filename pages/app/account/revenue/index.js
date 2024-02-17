import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
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
import { isAuth } from "@/helper/server/auth/isAuth";
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
import Drawer from "@mui/material/Drawer";
import PayoutDetails from "@/components/app/revenue/PayoutDetails";
import revenue_icon from "@/public/images/icons/account/revenue_icon.png";
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
  const [pendingBalancePenny, setPendingBalancePenny] = useState(0);
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
  const [drawerOpen, setDrawerOpen] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [payoutDetail, setPayoutDetail] = useState("");

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen({ ...drawerOpen, [anchor]: open });
  };

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
  }, [stripeAccId, availBalancePenny]);

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

    if (!acceptedPayments) {
      setIsLoadingStripeBalance(false);
      return;
    }

    const getStripeBalance = async () => {
      let paymentTypes = acceptedPayments.find(
        (payment) => payment.paymentMethod === "stripe"
      );

      if (!paymentTypes) {
        setIsLoadingStripeBalance(false);
        return;
      }

      const { stripeAccountId } = paymentTypes;

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

        const stripeAvailBalance = available[0].amount / 100;
        const stripePendingBalance = pending[0].amount / 100;

        const availBalance = stripeAvailBalance.toFixed(2);
        const pendingBalance = stripePendingBalance.toFixed(2);

        setStripeAccId(stripeAccountId);
        setAvailBalancePenny(available[0].amount);
        setPendingBalancePenny(pending[0].amount);
        setAvailableStripeBalance(availBalance);
        setPendingStripeBalance(pendingBalance);
      }

      setIsLoadingStripeBalance(false);
    };

    getStripeBalance();
  }, []);

  const handleViewDetails = (payout) => (e) => {
    e.preventDefault();

    toggleDrawer("right", true)(e);

    setPayoutDetail(payout);
  };

  const closeViewDetails = (e) => {
    toggleDrawer("right", false)(e);
    setPayoutDetail({});
  };

  const closeAlert = () => {
    setAlert({ showAlert: false, alertMsg: "" });
  };

  const handleOpenAlert = (msg) => {
    setAlert({ showAlert: true, alertMsg: msg });
  };

  const handleViewOrders = () => {
    push("/app/account/orders/live");
  };

  const handleWithdraw = async () => {
    setIsCashingOut(true);

    // Pull payout to see when was last payout, collect $3 if new month
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
      const currentYear = new Date().getFullYear();
      const lastPayoutMonth = new Date(createdAt).getMonth();
      const lastPayoutYear = new Date(createdAt).getFullYear();

      if (currentMonth !== lastPayoutMonth || currentYear !== lastPayoutYear) {
        hasMonthylFee = true;
      }
    } else {
      hasMonthylFee = true;
    }

    const transferAmountInPennies = calculateStripePayoutFee(
      availBalancePenny,
      hasMonthylFee
    );

    const transferData = {
      amount: transferAmountInPennies,
      stripeAccId,
    };

    // Transfer payout fees
    const stripeTransfer = await transferPayoutFees(transferData);

    if (!stripeTransfer.success || stripeTransfer.error) {
      handleOpenAlert("Transfer payout error.");
      setIsCashingOut(false);
      return;
    }

    const netBalancePenny = availBalancePenny - transferAmountInPennies;
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

    const { amount, arrival_date, id: stripePayoutId } = stripePayout.payout;
    const arrival = new Date(arrival_date * 1000).toLocaleDateString();

    const balanceDisplay = `$${(availBalancePenny / 100).toFixed(2)}`;
    const feesDisplay = `$${(transferAmountInPennies / 100).toFixed(2)}`;
    const netDisplay = `$${(amount / 100).toFixed(2)}`;

    // Save data to payouts
    const savePayoutData = {
      stripeAccountId: stripeAccId,
      stripePayoutId,
      stripeTransferId: stripeTransfer.transfer.id,
      balance: availBalancePenny,
      balanceDisplay,
      fees: transferAmountInPennies,
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
    handleOpenAlert(`Payout will arrive on ${arrival}`);
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
    const api = `/api/private/payout/get-last-payout/${accountId}`;
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
    const transferApi = `/api/private/stripe/transfer-fee-to-platform`;

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
              ) : availBalancePenny === 0 ? (
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
              ) : pendingBalancePenny === 0 ? (
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
                    <div>
                      <h4 className="font-bold text-xs">Payout info:</h4>
                      <ul className="pl-4">
                        <li className="list-disc">
                          Click withdraw to initiate a payout if there is
                          available balance.
                        </li>
                        <li className="list-disc">
                          Pending balance will become available after 7 days of
                          cleared customer payment, 14 days for certain
                          industries, and 30 days if you&apos;re in Brazil.
                        </li>
                        <li className="list-disc">
                          Payout balance is your available balance minus card
                          and boxcart fees.
                        </li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-bold text-xs">Payout fees:</h4>
                      <ul className="pl-4">
                        <li className="list-disc">
                          0.25% + $0.25 per payout volume.
                        </li>
                        <li className="list-disc">
                          $3 monthly active fee. This fee occurs once a month,
                          only if there were payouts initiated that month. If no
                          payouts were initiated on a certain month, there will
                          be no fee for that month.
                        </li>
                        <li className="list-disc">
                          We handle all refunds and disputes on your behalf.
                        </li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-bold text-xs">Recommendation:</h4>
                      <ul className="pl-4">
                        <li className="list-disc">
                          Due to card fees, we recommend initiating payouts as
                          little as possible so you don't incur the $3 monthly
                          active fee often, and also save on the $0.25 per
                          payout.
                        </li>
                        <li className="list-disc">
                          If you initiated a payout in a certain month, it may
                          be worth initiating another payout at the end of the
                          same month, to take advantage of the $3 fee that was
                          charged.
                        </li>
                      </ul>
                    </div>
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
              ) : availBalancePenny === 0 ? (
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
      {/* <div className="my-4">
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
      </div> */}
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
          <PayoutGrid payouts={payouts} handleViewDetails={handleViewDetails} />
        </div>
      )}

      <Drawer
        anchor={"right"}
        open={drawerOpen["right"]}
        onClose={toggleDrawer("right", false)}
      >
        <PayoutDetails
          payoutDetail={payoutDetail}
          closeViewDetails={closeViewDetails}
          stripeAccId={stripeAccId}
        />
      </Drawer>
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

      if (!userAccount) {
        return {
          redirect: {
            destination:
              process.env.NODE_ENV && process.env.NODE_ENV === "production"
                ? "/app/auth/signin"
                : "http://localhost:3000/app/auth/signin",
            permanent: false,
          },
        };
      }

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
Revenue.pageIcon = (
  <div className="relative w-8 h-8">
    <Image
      src={revenue_icon}
      alt="orders icon"
      fill
      className=""
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
Revenue.pageRoute = "revenue";
Revenue.mobilePageRoute = "revenue";
