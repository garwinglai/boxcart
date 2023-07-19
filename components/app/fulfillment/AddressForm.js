import React from "react";
import { TextField } from "@mui/material";

function AddressForm({ handleChange, signupValues }) {
  const { address_1, address_2, city, state, zip } = signupValues;

  return (
    <div className="flex flex-col gap-2">
      <h3>Enter your address: </h3>
      <TextField
        autoFocus
        type="text"
        id="address_1"
        name="address_1"
        placeholder="Address 1"
        color="warning"
        size="small"
        fullWidth
        onChange={handleChange}
        value={address_1}
      />
      <TextField
        type="text"
        id="address_2"
        name="address_2"
        placeholder="Address 2"
        color="warning"
        size="small"
        fullWidth
        onChange={handleChange}
        value={address_2}
      />
      <div className="flex gap-2">
        <TextField
          type="text"
          placeholder="City"
          name="city"
          color="warning"
          size="small"
          fullWidth
          onChange={handleChange}
          value={city}
        />
        <TextField
          type="text"
          placeholder="State"
          name="state"
          pattern="[A-Za-z]{2}"
          inputProps={{
            maxLength: 2,
          }}
          color="warning"
          size="small"
          fullWidth
          onChange={handleChange}
          value={state}
        />
        <TextField
          type="number"
          placeholder="Zip"
          name="zip"
          color="warning"
          size="small"
          fullWidth
          onChange={handleChange}
          value={zip}
        />
      </div>
    </div>
  );
}

export default AddressForm;
