import { ChevronLeft } from "@mui/icons-material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import payout_icon from "@/public/images/icons/payout_icon.png";
import Link from "next/link";

function PayoutDetails({ payoutDetail, closeViewDetails, stripeAccId }) {
  const {
    id,
    amount,
    arrival_date,
    created,
    status,
    destination,
    balance_transaction,
  } = payoutDetail;

  const createdDate = new Date(created * 1000).toLocaleDateString();
  const arrivalDate = new Date(arrival_date * 1000).toLocaleDateString();

  const [payout, setPayout] = useState({
    createdAt: "",
    stripePayoutId: "",
    balanceDisplay: "",
    // feesDisplay: "",
    // netDisplay: "",
  });
  const [balanceTransactions, setBalanceTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // destructure payout
  const { balanceDisplay, feesDisplay, netDisplay } = payout;

  // Fetch transactions for current payout
  useEffect(() => {
    setIsLoading(true);
    setErrorMessage("");

    const retrievePayouts = async () => {
      const retrievePayoutsApi = `/api/private/stripe/retrieve-transactions/${stripeAccId}/${id}`;

      const res = await fetch(retrievePayoutsApi, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!data.success || data.error) {
        setErrorMessage("Problem loading payout details.");
        setIsLoading(false);
        return;
      }

      if (data) {
        setBalanceTransactions(data.balanceTransactions);
      }
      setIsLoading(false);
    };

    retrievePayouts();
  }, [id]);

  // Fetch payout
  useEffect(() => {
    setIsLoading(true);
    setErrorMessage("");

    const fetchPayout = async () => {
      const api = `/api/private/payout/get-payout/${id}`;
      const res = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!data.success || data.error) {
        setErrorMessage("Problem loading payout details.");
        setIsLoading(false);
        return;
      }

      if (data) {
        setPayout(data.payout);
      }
      setIsLoading(false);
    };

    fetchPayout();
  }, []);

  return (
    <div className="w-screen bg-[color:var(--gray-light)] min-h-screen p-4 flex flex-col gap-4 overflow-y-scroll pb-28 md:w-[60vw] lg:w-[45vw] xl:w-[35vw]">
      <div className="flex justify-between items-center">
        <span className="flex gap-4 items-center">
          <Image src={payout_icon} alt="payout icon" className="w-12 h-12" />
          <h3>Payout detail:</h3>
        </span>

        <button
          className="flex text-[color:var(--secondary)] "
          onClick={closeViewDetails}
        >
          <ChevronLeft />
          <p>close</p>
        </button>
      </div>
      <div className="rounded p-4 w-full shadow-[0_1px_2px_0_rgba(0,0,0,0.24),0_1px_3px_0_rgba(0,0,0,0.12)] bg-white relative">
        <div className="flex justify-between items-start px-4">
          <div className="flex flex-col gap-2">
            <p className="text-base font-medium">Initiated</p>
            <p className="text-base font-medium">Arrival</p>
            <p className="text-base font-medium">Status</p>
            <p className="text-base font-medium">Balance before fees</p>
            <p className="text-base font-medium">Stripe payout fees</p>
            <p className="text-base font-medium">Net payout amount</p>
          </div>
          <div className="flex flex-col text-right gap-2">
            <p className="text-base">{createdDate}</p>
            <p className="text-base">{arrivalDate}</p>
            <p className="text-base">{status}</p>
            <p className="text-base">{balanceDisplay}</p>
            <p className="text-base">{feesDisplay}</p>
            <p className="text-base">{netDisplay}</p>
          </div>
        </div>
      </div>
      <div>
        <h2>Stripe payout fees:</h2>

        <p className="mt-4">
          Stripe is our online payment processor. When you initiate a payout,
          these are the following fees:
        </p>
        <ol className="ml-8 mt-4">
          <li className="list-disc text-sm">.25% + $0.25 per payout volume.</li>
          <li className="list-disc text-sm mt-2">
            $2 monthly active fee. This fee occurs once a month, only if there
            were payouts initiated that month. If no payouts were initiated on a
            certain month, there will be no fee for that month.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default PayoutDetails;
