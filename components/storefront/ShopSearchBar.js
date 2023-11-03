import React, { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import FilterCategory from "./menus/filters/FilterCategoryDrawer";
import FilterCategoryDrawer from "./menus/filters/FilterCategoryDrawer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ButtonPrimaryStorefront from "../global/buttons/ButtonPrimaryStorefront";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

function ShopSearchBar({
  isOwner,
  categories,
  getProductsByCategory,
  getAllProducts,
  allProducts,
  handleSortSearchResults,
}) {
  const [state, setState] = React.useState({
    bottom: false,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [sortByMethod, setSortByMethod] = useState("Newest");

  const handleChangeSort = (event) => {
    const { value } = event.target;
    setSortByMethod(value);
  };

  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleSort = () => {
    handleSortSearchResults(sortByMethod);
    setAnchorEl(null);
  };

  return (
    <div className="flex py-2 px-4 gap-2 items-center justify-between lg:justify-start">
      <div className="relative flex-grow py-2 lg:flex-grow-0 lg:w-2/4 lg:pr-4">
        <label
          htmlFor="search"
          className="absolute flex items-center gap-2 top-[18px] left-4 text-[color:var(--gray-text)] font-light text-sm"
        >
          <SearchOutlinedIcon />
        </label>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search all products"
          className="bg-[color:var(--gray-light)] w-full py-3 rounded-full font-light text-sm indent-12 lg:rounded lg:border lg:border-[color:var(--gray-light-med)]"
        />
      </div>
      <div className="lg:hidden">
        <button
          onClick={toggleDrawer("bottom", true)}
          className="bg-[color:var(--gray-light)] text-white rounded-full py-2 px-3 "
        >
          <FilterListOutlinedIcon
            fontSize="small"
            sx={{ color: "var(--black-design-extralight)" }}
          />
        </button>
        <FilterCategoryDrawer
          getAllProducts={getAllProducts}
          allProducts={allProducts}
          getProductsByCategory={getProductsByCategory}
          categories={categories}
          toggleDrawer={toggleDrawer}
          anchor="bottom"
          state={state}
        />
      </div>
      <div className="lg:hidden">
        <button
          onClick={handleOpenSortMenu}
          className="bg-[color:var(--gray-light)] text-white rounded-full py-2 px-3 "
        >
          <SortOutlinedIcon
            fontSize="small"
            sx={{ color: "var(--black-design-extralight)" }}
          />
        </button>
      </div>
      <div className="hidden lg:block">
        <button
          onClick={handleOpenSortMenu}
          className="flex gap-2 items-center bg-[color:var(--black-design-extralight)] text-white text-xs rounded-full font-extralight px-4 py-2"
        >
          <p>Sort by Newest</p>
          <KeyboardArrowDownIcon fontSize="small" />
        </button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseSortMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <FormControl sx={{ padding: "0.5rem 1rem" }}>
            <FormLabel id="sortBy" sx={{ marginBottom: "0.5rem" }}>
              Sort by:
            </FormLabel>
            <RadioGroup
              aria-labelledby="sort-by-radio-group"
              name="sortBy"
              value={sortByMethod}
              onChange={handleChangeSort}
            >
              <FormControlLabel
                value="Newest"
                control={<Radio color="secondary" size="small" />}
                label="Newest"
              />
              <FormControlLabel
                value="Lowest Price"
                control={<Radio color="secondary" size="small" />}
                label="Lowest Price"
              />
              <FormControlLabel
                value="Highest Price"
                control={<Radio color="secondary" size="small" />}
                label="Highest Price"
              />
            </RadioGroup>
          </FormControl>
          <div className="px-3 pb-1 pt-3 border-t border-[color:var(--gray-light-med)] h-12 font-extralight text-sm">
            <ButtonPrimaryStorefront handleClick={handleSort} name="Apply" />
          </div>
        </Menu>
      </div>
    </div>
  );
}

export default ShopSearchBar;
