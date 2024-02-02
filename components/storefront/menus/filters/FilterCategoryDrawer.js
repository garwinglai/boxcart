import React from "react";
import Drawer from "@mui/material/Drawer";
import DrawerHeader from "@/components/global/drawers/DrawerHeader";
import CategoryIcon from "@mui/icons-material/Category";
import Divider from "@mui/material/Divider";

function FilterCategoryDrawer({
  toggleDrawer,
  anchor,
  state,
  categories,
  currCategory,
  getProductsByCategory,
  getAllProducts,
  allInitialProducts,
  getAllDigitalProducts,
  allInitialDigitalProducts,
}) {
  const handleCategoryClick = (categoryId, categoryName) => (e) => {
    getProductsByCategory(categoryId, categoryName);
    toggleDrawer("bottom", false)(e);
  };

  const handleGetAllProductsClick = (e) => {
    getAllProducts();
    toggleDrawer("bottom", false)(e);
  };

  const handleGetAllDigitalProductsClick = (e) => {
    getAllDigitalProducts();
    toggleDrawer("bottom", false)(e);
  };

  return (
    <Drawer
      anchor={anchor}
      open={state[anchor]}
      onClose={toggleDrawer(anchor, false)}
    >
      <DrawerHeader
        title="Category"
        icon={<CategoryIcon />}
        toggleDrawer={toggleDrawer}
      />
      <div className="flex flex-col p-4 gap-2">
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
        <button
          onClick={handleGetAllDigitalProductsClick}
          className={`text-sm py-2 px-2 rounded hover:bg-[color:var(--third-light-soft)] ${
            currCategory == "All Digital" &&
            "bg-[color:var(--third-light-soft)]"
          }`}
        >
          <span className="flex items-center gap-4 justify-between">
            <p className="font-light text-left">All Digital</p>
            <p className="font-extralight">
              {allInitialDigitalProducts.length}
            </p>
          </span>
        </button>
        {categories &&
          categories.map((category, idx) => {
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
                <span className="flex items-center gap-4 justify-between">
                  <p className="font-light text-left">{categoryName}</p>
                  <p className="font-extralight">{productCount}</p>
                </span>
              </button>
            );
          })}
      </div>
    </Drawer>
  );
}

export default FilterCategoryDrawer;
