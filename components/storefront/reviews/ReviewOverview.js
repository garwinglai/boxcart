import React from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Rating } from "@mui/material";

function ReviewOverview({ product }) {
  const {
    rating,
    reviewCount,
    fiveStarCount,
    fourStarCount,
    threeStarCount,
    twoStarCount,
    oneStarCount,
  } = product;

  const fiveStar =
    fiveStarCount === 0 ? 0 : (fiveStarCount / reviewCount) * 100;
  const fourStar =
    fourStarCount === 0 ? 0 : (fourStarCount / reviewCount) * 100;
  const threeStar =
    threeStarCount === 0 ? 0 : (threeStarCount / reviewCount) * 100;
  const twoStar = twoStarCount === 0 ? 0 : (twoStarCount / reviewCount) * 100;
  const oneStar = oneStarCount === 0 ? 0 : (oneStarCount / reviewCount) * 100;

  return (
    <div className="flex gap-4 p-4">
      <div className="w-1/3 mx-auto flex flex-col items-center justify-start">
        <p className="text-xl text-center">{rating}</p>
        <Rating
          name="read-only"
          value={parseInt(rating)}
          readOnly
          sx={{ fontSize: "1rem" }}
        />
        <p className="text-xs font-light text-center mt-1">({reviewCount})</p>
      </div>
      <div className="flex flex-col grow">
        <div className="flex items-center gap-2">
          <p className="text-xs">5</p>
          <BorderLinearProgress
            variant="determinate"
            value={fiveStar}
            sx={{ borderRadius: "45px", flexGrow: 1, height: "0.35rem" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs">4</p>
          <BorderLinearProgress
            variant="determinate"
            value={fourStar}
            sx={{ borderRadius: "45px", flexGrow: 1, height: "0.35rem" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs">3</p>
          <BorderLinearProgress
            variant="determinate"
            value={threeStar}
            sx={{ borderRadius: "45px", flexGrow: 1, height: "0.35rem" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs">2</p>
          <BorderLinearProgress
            variant="determinate"
            value={twoStar}
            sx={{ borderRadius: "45px", flexGrow: 1, height: "0.35rem" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs">1</p>
          <BorderLinearProgress
            variant="determinate"
            value={oneStar}
            sx={{ borderRadius: "45px", flexGrow: 1, height: "0.35rem" }}
          />
        </div>
      </div>
    </div>
  );
}

export default ReviewOverview;

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  // height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      theme.palette.mode === "light" ? "var(--secondary)" : "var(--secondary)",
  },
}));
