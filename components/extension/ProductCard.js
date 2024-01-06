import React from "react";

function ProductCard({ product }) {
  const {
    defaultImage,
    defaultImageAlt,
    productName,
    salePriceStr,
    priceStr,
    account: { fullDomain },
  } = product;

  return (
    <div className="flex items-center gap-4">
      <p>{productName}</p>
    </div>
  );
}

export default ProductCard;
