import { ChevronLeft } from "@mui/icons-material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import payout_icon from "@/public/images/icons/payout_icon.png";

function PayoutDetails({ payoutDetail, closeViewDetails }) {
  const { id, amount, arrival_date, created, status, destination } =
    payoutDetail;

  const createdDate = new Date(created * 1000).toLocaleDateString();
  const arrivalDate = new Date(arrival_date * 1000).toLocaleDateString();

  const [payout, setPayout] = useState({
    createdAt: "",
    stripePayoutId: "",
    balanceDisplay: "",
    // feesDisplay: "",
    // netDisplay: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // destructure payout
  const { balanceDisplay, feesDisplay, netDisplay } = payout;

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
            <p className="text-sm font-medium">Payout initiated</p>
            <p className="text-sm font-medium">Arrival date</p>
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm font-medium">Amount</p>
          </div>
          <div className="flex flex-col text-right gap-2">
            <p className="text-sm">{createdDate}</p>
            <p className="text-sm">{arrivalDate}</p>
            <p className="text-sm">{status}</p>
            <p className="text-sm">{amount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayoutDetails;
