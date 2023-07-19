import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import ButtonSecondary from "@/components/global/buttons/ButtonSecondary";
import React from "react";
import { CircularProgress } from "@mui/material";
import BoxLoader from "@/components/global/loaders/BoxLoader";

function SaveCancelButtons({
  handleCancel,
  isLoading,
  saveButtonType,
  cancelButtonType,
  handleSave,
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-1/2">
        <ButtonSecondary
          name="Cancel"
          handleClick={handleCancel}
          type={cancelButtonType}
        />
      </div>
      <div className="w-1/2 flex justify-center">
        {isLoading ? (
          <BoxLoader />
        ) : (
          <ButtonPrimary
            name="Save"
            type={saveButtonType}
            handleClick={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default SaveCancelButtons;
