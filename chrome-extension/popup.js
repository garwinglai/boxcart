import React from "react";
import ReactDOM from "react-dom";
import ProductCard from "@/components/extension/ProductCard";

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("popup-content");
  ReactDOM.render(<ProductCard />, container);
});

// popup.js
// document.addEventListener("DOMContentLoaded", function () {
//   // Your popup logic goes here
//   console.log("Popup loaded yessir!");
// });
