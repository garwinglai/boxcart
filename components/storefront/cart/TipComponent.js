import React, { useState } from "react";
import styles from "../../../styles/components/storefront/cart/subtotal.module.css";
import { useCartStore } from "@/lib/store";
import { useHasHydrated } from "@/utils/useHasHydrated";

function TipComponent() {
  const cartDetails = useCartStore((state) => state.cartDetails);
  const setCartDetails = useCartStore((state) => state.setCartDetails);

  const {
    totalPenny,
    subTotalPenny,
    deliveryFeePenny,
    tipPenny,
    selectedTipIndex,
  } = cartDetails;

  // const [tipIndex, setTipIndex] = useState("");
  const [selectedTip, setSelectedTip] = useState(0);

  //tipType 0 = dollar, 1 = percent
  const { tipValues, tipType } = cartDetails;

  const handleSelectTip = (idx, tipDisplay, tip) => (e) => {
    if (tipType === 0) {
      const newTotal = totalPenny - tipPenny + tip;
      const newTotalDisplay = `$${(newTotal / 100).toFixed(2)}`;

      setCartDetails({
        tipPenny: tip,
        tipDisplay,
        totalPenny: newTotal,
        totalDisplay: newTotalDisplay,
        selectedTipIndex: idx,
      });
    }
    // setTipIndex(idx);
    setSelectedTip(tip);
  };

  const removeTip = (e) => {
    const newTotal = totalPenny - selectedTip;
    const newTotalDisplay = `$${(newTotal / 100).toFixed(2)}`;

    setCartDetails({
      tipPenny: 0,
      tipDisplay: "$0.00",
      totalPenny: newTotal,
      totalDisplay: newTotalDisplay,
      selectedTipIndex: null,
    });

    // setTipIndex("");
    setSelectedTip(0);
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Tips:</h3>
        <button
          className="underline text-sm font-light"
          type="button"
          onClick={removeTip}
        >
          remove tip
        </button>
      </div>
      <div className="flex gap-4 items-center justify-between">
        {tipValues.map((tipGroup, idx) => {
          const { tip, tipDisplay } = tipGroup;

          return (
            <button
              type="button"
              onClick={handleSelectTip(idx, tipDisplay, tip)}
              key={idx}
              className={`w-1/3 border border-[color:var(--black-design-extralight)] rounded text-center py-1 mt-4 ${
                selectedTipIndex === idx
                  ? "bg-[color:var(--black-design-extralight)] text-white"
                  : "bg-white text-[color:var(--black-design-extralight)]"
              }`}
            >
              <p>{tipDisplay}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TipComponent;
