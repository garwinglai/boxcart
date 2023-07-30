import React from "react";
import { products } from "@/helper/temp/tempData";
import ShopCard from "./ShopCard";
import Image from "next/image";
import boxes_icon from "@/public/images/icons/boxes_icon.png";

// TODO: Pull Products for Shop Menu

function ShopMenu({
  isOwner,
  products,
  categories,
  accountId,
  updateProductList,
  handleOpenSnackbar,
  getAllProducts,
  currCategory,
}) {
  return (
    <div className="px-4 flex-grow pb-8 ">
      <h3 className="mb-4 font-light">{currCategory}</h3>
      {products.length > 0 ? (
        <div
          className={`grid grid-cols-2 gap-x-2 gap-y-6 ${
            isOwner ? "md:grid-cols-3" : "md:grid-cols-3"
          }  xl:grid-cols-4`}
        >
          {products &&
            products.map((item, idx) => (
              <ShopCard
                key={idx}
                product={item}
                isOwner={isOwner}
                categories={categories}
                accountId={accountId}
                updateProductList={updateProductList}
                handleOpenSnackbar={handleOpenSnackbar}
                getAllProducts={getAllProducts}
              />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            src={boxes_icon}
            alt="boxes icon"
            className="w-16 h-16 mt-12 opacity-80"
          />
          <h4 className="font-light">No products</h4>
        </div>
      )}
    </div>
  );
}

export default ShopMenu;
