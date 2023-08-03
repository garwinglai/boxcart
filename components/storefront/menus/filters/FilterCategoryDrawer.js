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
  getProductsByCategory,
  getAllProducts,
  allProducts,
}) {
  const allProductsLength = allProducts.length;

  const handleCategoryClick = (categoryId, categoryName) => (e) => {
    getProductsByCategory(categoryId, categoryName);
    toggleDrawer("bottom", false)(e);
  };

  const handleGetAllProductsClick = (e) => {
    getAllProducts();
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
          className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light)] active:bg-[color:var(--third-light)]"
        >
          <span className="flex items-center gap-4 justify-between">
            <p className="font-light text-left">All Products</p>
            <p className="font-extralight">{allProductsLength}</p>
          </span>
        </button>
        {/* <Divider /> */}
        {categories &&
          categories.map((category, idx) => {
            const { categoryName, id, products } = category;
            const productCount = products.length;

            return (
              <button
                key={id}
                onClick={handleCategoryClick(id, categoryName)}
                className="text-sm py-2 px-4 rounded hover:bg-[color:var(--third-light)] active:bg-[color:var(--third-light)]"
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
