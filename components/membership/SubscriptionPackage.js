import React from "react";
import Image from "next/image";
import ButtonPrimary from "../global/buttons/ButtonPrimary";
import check_icon from "@/public/images/icons/check_icon.png";
import { useRouter } from "next/router";
import { useMembershipStore } from "@/lib/store";
import ButtonThird from "../global/buttons/ButtonThird";

function SubscriptionPackage({
  product,
  isPaymentByAnnual,
  otherPrice,
  defaultPrice,
  userAccount,
  isPublic,
  hasSubScription,
}) {
  const setMembershipProductStore = useMembershipStore(
    (state) => state.setMembershipProduct
  );
  const setMembershipPriceStore = useMembershipStore(
    (state) => state.setMembershipPrice
  );

  const { id, name, description, images, features } = product;

  const yearlyPrice = defaultPrice.unit_amount / 100;
  const monthlyPrice = otherPrice.unit_amount / 100;

  const { push } = useRouter();

  const handleSelectPackage = (product, isPaymentByAnnual) => () => {
    setMembershipProductStore(product);
    if (isPaymentByAnnual) {
      setMembershipPriceStore(defaultPrice);
    } else {
      setMembershipPriceStore(otherPrice);
    }
    push(`/account/premium/checkout/`);
  };

  const handleSelectCurrentPlan = () => {
    push(`/account/settings`);
  };

  const handleSignup = () => {
    push(`https://app.boxcart.shop/auth/signup`);
  };

  return (
    <div className="rounded-lg border bg-white sm:shadow-lg w-full md:w-fit px-6 py-2 mx-auto">
      <div className="flex flex-col gap-4 border-b pb-4">
        <div className="relative w-16 h-16">
          <Image
            src={images[0]}
            alt="startup icon"
            fill
            className="w-8 h-8"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div>
          <h3>{name}</h3>
          <p className="text-left text-xs font-light text-gray-500">
            {description}
          </p>
        </div>
        <div className="">
          {isPaymentByAnnual ? (
            <div className="flex gap-2 items-center w-full">
              {yearlyPrice && <h2 className="font-medium text-4xl">$108</h2>}
              <span>
                <p className="text-xs font-base text-gray-500">per</p>
                <p className="text-xs font-base text-gray-500">year</p>
              </span>
              <p className="ml-auto text-[color:var(--primary)] text-sm font-light">
                26.5% off
              </p>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              {monthlyPrice && <h2 className="font-medium text-4xl">$12</h2>}
              <span>
                <p className="text-xs font-base text-gray-500">per</p>
                <p className="text-xs font-base text-gray-500">month</p>
              </span>
            </div>
          )}
        </div>
        {isPublic ? (
          <div className="flex flex-col items-center gap-2">
            <ButtonPrimary
              handleClick={handleSignup}
              name="Sign up - 1 month free"
            />
            <p className="font-extralight text-xs text-gray-500">
              No credit card required
            </p>
          </div>
        ) : hasSubScription ? (
          <div>
            <ButtonThird
              handleClick={handleSelectCurrentPlan}
              name="Current plan"
              // disabled={id === 2}
            />
          </div>
        ) : (
          <div>
            <ButtonPrimary
              handleClick={handleSelectPackage(product, isPaymentByAnnual)}
              name="Subscribe"
              // disabled={id === 2}
            />
          </div>
        )}
      </div>

      <ul className="p-4 flex flex-col gap-4">
        {features.map((feature, index) => {
          return (
            <span className="flex items-center gap-2" key={index}>
              <Image src={check_icon} alt="check icon" className="w-4 h-4" />
              <li className="text-sm">{feature.name}</li>
            </span>
          );
        })}
      </ul>
    </div>
  );
}

export default SubscriptionPackage;
