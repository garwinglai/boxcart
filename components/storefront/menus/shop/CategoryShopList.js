import React, { useState } from "react";
import Divider from "@mui/material/Divider";

function CategoryShopList({
  categories,
  getProductsByCategory,
  getAllProducts,
  currCategory,
  allInitialProducts,
}) {
  const handleCategoryClick = (categoryId, categoryName) => (e) => {
    getProductsByCategory(categoryId, categoryName);
  };

  const handleGetAllProductsClick = (e) => {
    getAllProducts();
  };

  return (
    <div className="lg:px-4  lg:border-r lg:h-full lg:border-[color:var(--gray-light-med)]">
      <h4>Categories</h4>
      <div className="flex flex-col justify-between items-between pt-4 pr-4 gap-2">
        <button
          onClick={handleGetAllProductsClick}
          className={`text-sm py-2 px-2 rounded hover:bg-[color:var(--third-light-soft)] ${
            currCategory == "All Products" &&
            "bg-[color:var(--third-light-soft)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-between">
            <p className="font-light text-left">All Products</p>
            <p className="font-extralight">{allInitialProducts.length}</p>
          </span>
        </button>
        {categories.map((category, idx) => {
          const { categoryName, id, products, digitalProducts } = category;
          const productCount = products.length + digitalProducts.length;

          return (
            <button
              key={id}
              onClick={handleCategoryClick(id, categoryName)}
              className={`text-sm py-2 px-2 rounded hover:bg-[color:var(--third-light-soft)] ${
                currCategory == categoryName &&
                "bg-[color:var(--third-light-soft)]"
              }`}
            >
              <span className="flex items-center gap-12 justify-between">
                <p className="font-light text-left">{categoryName}</p>
                <p className="font-extralight">{productCount}</p>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryShopList;
