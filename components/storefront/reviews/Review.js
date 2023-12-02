import { Avatar, Rating } from "@mui/material";
import React from "react";
import VerifiedIcon from "@mui/icons-material/Verified";

function Review({ review }) {
  const { rating, title, review: reviewText, createdAt, name } = review;

  const firstLetterOfName = name.split(" ")[0][0].toUpperCase();

  const today = new Date();
  const createdAtDate = new Date(createdAt);
  const daysAgo = Math.floor((today - createdAtDate) / (1000 * 60 * 60 * 24));

  const firstName = name.split(" ")[0];

  return (
    <div className="border-y py-4 mx-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem" }}>
            {firstLetterOfName}
          </Avatar>
          <div>
            <p className="text-xs font-light">{firstName}</p>
            <span className="flex items-center gap-1">
              <VerifiedIcon sx={{ fontSize: "0.75rem" }} />
              <p className="text-xs font-extralight text-gray-500">
                Verified buyer
              </p>
            </span>
          </div>
        </div>
        <p className="text-xs font-extralight text-gray-500">
          {daysAgo} days ago
        </p>
      </div>
      <div className="flex items-center gap-2 mt-2 mb-1">
        <Rating
          name="read-only"
          value={parseInt(rating)}
          readOnly
          sx={{ fontSize: "0.75rem" }}
        />
      </div>
      <h3 className="text-base">{title}</h3>
      <p className="text-sm font-light">{reviewText}</p>
    </div>
  );
}

export default Review;
