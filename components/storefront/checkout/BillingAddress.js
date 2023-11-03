import React from "react";
import { TextField } from "@mui/material";

function BillingAddress({
  billingAddressValues,
  handleCustomerBillingAddressChange,
}) {
  const { address_1, address_2, city, state, zip } = billingAddressValues;
  return (
    <div>
      <h3 className="font-medium">Billing address:</h3>
      <div className="lg:px-12">
        <TextField
          id="outlined-basic"
          label="Address 1"
          variant="standard"
          required
          type="text"
          fullWidth
          value={address_1}
          name="address_1"
          color="secondary"
          sx={{ marginTop: "1rem" }}
          onChange={handleCustomerBillingAddressChange}
        />
        <TextField
          id="outlined-basic"
          label="Address 2"
          variant="standard"
          type="text"
          fullWidth
          value={address_2}
          name="address_2"
          color="secondary"
          sx={{ marginTop: "1rem" }}
          onChange={handleCustomerBillingAddressChange}
        />
      </div>
      <div className="flex gap-4 lg:px-12">
        <TextField
          id="outlined-basic"
          label="City"
          variant="standard"
          required
          type="text"
          fullWidth
          value={city}
          name="city"
          color="secondary"
          sx={{ marginTop: "1rem" }}
          onChange={handleCustomerBillingAddressChange}
        />
        <TextField
          id="outlined-basic"
          label="State"
          variant="standard"
          type="text"
          required
          fullWidth
          value={state}
          name="state"
          color="secondary"
          sx={{ marginTop: "1rem" }}
          inputProps={{ maxLength: 2 }}
          onChange={handleCustomerBillingAddressChange}
        />
        <TextField
          id="outlined-basic"
          label="Zip"
          variant="standard"
          required
          type="number"
          fullWidth
          value={zip}
          name="zip"
          color="secondary"
          sx={{ marginTop: "1rem" }}
          onChange={handleCustomerBillingAddressChange}
        />
      </div>
    </div>
  );
}

export default BillingAddress;
