import React from "react";
import { businessIdentityArr } from "@/helper/temp/tempData";
import BusinessTypeCheckbox from "@/components/auth/signup/BusinessTypeCheckbox";
import BoxLoader from "@/components/global/loaders/BoxLoader";
import ButtonPrimary from "@/components/global/buttons/ButtonPrimary";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  "@media (min-width: 426px)": {
    width: "50%",
  },
  "@media (min-width: 769px)": {
    width: "40%",
  },
  "@media (min-width: 1025px)": {
    width: "30%",
  },
  height: "510px",
  overflowY: "scroll",
  bgcolor: "background.paper",
  borderRadius: "8px",
  // border: "2px solid #000",
  boxShadow: 24,
};

function IdentityModal({
  openBusinessIdentity,
  isBusinessIdentityLoading,
  isBusinessIdentityChecked,
  noIdentitySelectedError,
  handleChange,
  saveBusinessIdentity,
  tooManyIdentitiesError,
}) {
  return (
    <Modal
      open={openBusinessIdentity}
      aria-labelledby="Select business identity modal"
      aria-describedby="Select your business identity"
    >
      <Box sx={style2}>
        <div className="">
          <div className="p-4 flex flex-col gap-4">
            <div>
              <h2>Select your business identity:</h2>
              <p className="text-sm font-light">(Select up to 3)</p>
            </div>
            {businessIdentityArr.map((identity) => {
              const { id, name, label, imgSrc, imgAlt } = identity;
              return (
                <BusinessTypeCheckbox
                  key={id}
                  id={id}
                  name={name}
                  onChange={handleChange}
                  checked={isBusinessIdentityChecked}
                  label={label}
                  imgSrc={imgSrc}
                  imgAlt={imgAlt}
                  // autoFocus
                />
              );
            })}
          </div>
          <div className="sticky bottom-0 bg-white shadow-2xl p-4 border-t">
            {isBusinessIdentityLoading ? (
              <div className="h-10 relative top-2 flex justify-center gap-2">
                <BoxLoader />
                <p className="text-sm font-light">saving...</p>
              </div>
            ) : (
              <div className="h-10">
                <ButtonPrimary
                  type="button"
                  name={
                    noIdentitySelectedError
                      ? "Select at least one"
                      : tooManyIdentitiesError
                      ? "Select 3 max"
                      : "Save"
                  }
                  handleClick={saveBusinessIdentity}
                />
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default IdentityModal;
