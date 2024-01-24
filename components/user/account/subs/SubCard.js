import React, { useState } from "react";
import ButtonFourth from "@/components/global/buttons/ButtonFourth";
import ButtonThird from "@/components/global/buttons/ButtonThird";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import Image from "next/image";
import { useRouter } from "next/router";

function SubCard({ account, setAccountData, subEmail }) {
  const { businessName, fullDomain, logoImage, businessBio, id } = account;

  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();

  const handleNavToShop = () => {
    push(`https://${fullDomain}`);
  };

  const handleRemoveSub = async () => {
    setIsLoading(true);
    const apiRoute = "/api/private/user/subs/disconnect";

    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, email: subEmail }),
    });

    const data = await response.json();

    setAccountData(data.subs.accounts);
    setIsLoading(false);
  };

  return (
    <div className="flex items-start gap-4 shadow rounded p-4 bg-white">
      <div className="relative w-16 h-16 aspect-square">
        <Image
          src={logoImage}
          alt="business logo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full h-full rounded-full"
        />
      </div>
      <div className="w-full">
        <p className="text-medium font-medium">{businessName}</p>
        {/* <p className="text-sm font-normal">{businessBio}</p> */}
        <p className="text-xs font-extralight">https://{fullDomain}</p>
        <div className="flex items-center gap-4 mt-4 justify-end">
          <div className="h-6">
            {isLoading ? (
              <div>
                <BoxLoader />
              </div>
            ) : (
              <ButtonFourth
                type="button"
                handleClick={handleRemoveSub}
                name="Remove"
              />
            )}
          </div>
          <div className="h-6">
            <ButtonThird
              type="button"
              handleClick={handleNavToShop}
              name="Shop"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubCard;
