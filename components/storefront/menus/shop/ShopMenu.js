import React, { use, useEffect, useState } from "react";
import ShopCard from "./ShopCard";
import Image from "next/image";
import boxes_icon from "@/public/images/icons/boxes_icon.png";
import { useCartStore } from "@/lib/store";
import DigitalShopCard from "./DigitalShopCard";
import { Divider } from "@mui/material";

function ShopMenu({
  isOwner,
  products,
  digitalProducts,
  categories,
  accountId,
  updateProductList,
  handleOpenSnackbar,
  getAllProducts,
  setIsDuplicatingProduct,
  userAccount,
  getAllDigitalProducts,
  getProductsByCategory,
  currCategoryId,
  currCategory,
  handleRemoveProductFromInitialProduct,
  handleAddProductToInitialProduct,
  handleRemoveDigitalProductFromInitialProduct,
  handleAddDigitalProductToInitialProduct,
}) {
  const { subdomain } = userAccount;

  const cartStore = useCartStore((state) => {
    return state.store.find((store) => store.storeName === subdomain);
  });
  const { cart } = cartStore || {};
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (cart) {
      setCartItems(cart);
    }
  }, [cart]);

  return (
    <div className="px-4 flex-grow w-full pb-8">
      <h3 className="mb-4 font-light">{currCategory}</h3>
      {products.length > 0 || digitalProducts.length > 0 ? (
        <React.Fragment>
          {products && products.length > 0 && (
            <div>
              {currCategory === "All Products" && (
                <h4 className="mb-2">Items</h4>
              )}
              <div
                className={`w-full grid grid-cols-2 gap-x-2 gap-y-6 ${
                  isOwner
                    ? "min-[640px]:grid-cols-3"
                    : "min-[640px]:grid-cols-3"
                } lg:grid-cols-4  2xl:grid-cols-5`}
              >
                {products.map((product, idx) => {
                  const { isEnabled } = product;
                  const productsInCart = cartItems.filter(
                    (cartItem) => cartItem.productId == product.id
                  );
                  const numProductInCart = productsInCart.length;

                  if (isEnabled) {
                    return (
                      <ShopCard
                        key={idx}
                        product={product}
                        isOwner={isOwner}
                        categories={categories}
                        accountId={accountId}
                        setIsDuplicatingProduct={setIsDuplicatingProduct}
                        updateProductList={updateProductList}
                        handleOpenSnackbar={handleOpenSnackbar}
                        getAllProducts={getAllProducts}
                        userAccount={userAccount}
                        numProductInCart={numProductInCart}
                        getProductsByCategory={getProductsByCategory}
                        currCategory={currCategory}
                        currCategoryId={currCategoryId}
                        handleRemoveProductFromInitialProduct={
                          handleRemoveProductFromInitialProduct
                        }
                        handleAddProductToInitialProduct={
                          handleAddProductToInitialProduct
                        }
                      />
                    );
                  }
                })}
              </div>
            </div>
          )}
          {digitalProducts &&
            products &&
            products.length > 0 &&
            digitalProducts.length > 0 && (
              <div className="my-4">
                <Divider />
              </div>
            )}
          {digitalProducts && digitalProducts.length > 0 && (
            <div>
              {currCategory === "All Products" && (
                <h4 className="mb-2">Digital items</h4>
              )}
              <div
                className={`w-full grid grid-cols-2 gap-x-2 gap-y-6 ${
                  isOwner
                    ? "min-[640px]:grid-cols-3"
                    : "min-[640px]:grid-cols-3"
                } lg:grid-cols-4  2xl:grid-cols-5`}
              >
                {digitalProducts.map((product, idx) => {
                  const { isEnabled } = product;
                  const productsInCart = cartItems.filter(
                    (cartItem) => cartItem.productId == product.id
                  );
                  const numProductInCart = productsInCart.length;

                  if (isEnabled) {
                    return (
                      <DigitalShopCard
                        key={idx}
                        product={product}
                        isOwner={isOwner}
                        categories={categories}
                        accountId={accountId}
                        setIsDuplicatingProduct={setIsDuplicatingProduct}
                        updateProductList={updateProductList}
                        handleOpenSnackbar={handleOpenSnackbar}
                        getAllProducts={getAllProducts}
                        getAllDigitalProducts={getAllDigitalProducts}
                        userAccount={userAccount}
                        numProductInCart={numProductInCart}
                        getProductsByCategory={getProductsByCategory}
                        currCategory={currCategory}
                        currCategoryId={currCategoryId}
                        handleRemoveDigitalProductFromInitialProduct={
                          handleRemoveDigitalProductFromInitialProduct
                        }
                        handleAddDigitalProductToInitialProduct={
                          handleAddDigitalProductToInitialProduct
                        }
                      />
                    );
                  }
                })}
              </div>
            </div>
          )}
        </React.Fragment>
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
