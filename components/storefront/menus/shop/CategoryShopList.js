import React from "react";
import Divider from "@mui/material/Divider";

function CategoryShopList({
  isOwner,
  categories,
  allProducts,
  getProductsByCategory,
  getAllProducts,
}) {
  const allProductsLength = allProducts.length;

  const handleCategoryClick = (categoryId, categoryName) => (e) => {
    getProductsByCategory(categoryId, categoryName);
  };

  const handleGetAllProductsClick = (e) => {
    getAllProducts();
  };

  return (
    <div className="hidden xl:block xl:px-4 xl:w-1/5 xl:border-r xl:border-[color:var(--gray-light-med)]">
      <h4>Categories</h4>
      <div className="flex flex-col justify-between items-between pt-4 pr-4 gap-2">
        <button
          onClick={handleGetAllProductsClick}
          className="text-sm py-2 px-2 rounded hover:bg-[color:var(--third-light-soft)] active:bg-[color:var(--third-light)]"
        >
          <span className="flex items-center gap-4 justify-between">
            <p className="font-light text-left">All Products</p>
            <p className="font-extralight">{allProductsLength}</p>
          </span>
        </button>
        {categories.map((category, idx) => {
          const { categoryName, id, products } = category;
          const productCount = products.length;

          return (
            <button
              key={id}
              onClick={handleCategoryClick(id, categoryName)}
              className="text-sm py-2 px-2 rounded hover:bg-[color:var(--third-light-soft)] active:bg-[color:var(--third-light)]"
            >
              <span className="flex items-center gap-4 justify-between">
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
