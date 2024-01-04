import React, { useEffect } from "react";

function Extension() {
  useEffect(() => {
    console.log("Popup script loaded.");

    document.addEventListener("DOMContentLoaded", function () {
      // Your popup script logic goes here
    });
  }, []);

  return <div>Extension</div>;
}

export default Extension;
