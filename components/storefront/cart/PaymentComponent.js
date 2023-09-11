import React from "react";
import { TextField } from "@mui/material";

// TODO: maybe don't store cc info, require customer to renter cc info on checkout, just store it to state for now

function PaymentComponent() {
  return (
    <div className="px-4 py-6 gap-2 flex flex-col bg-white md:border md:round md:my-4 md:mx-16 lg:mx-0  lg:mt-0">
      <h3 className="font-medium">Payment:</h3>
      <div className="lg:px-12">
        <TextField
          id="outlined-basic"
          label="Name on card"
          variant="standard"
          required
          type="text"
          fullWidth
          autoComplete="cc-name"
          // value={customerEmail}
          name="nameOnCard"
          color="warning"
          sx={{ marginTop: "1rem" }}
          // onChange={handleCustomerInfoChange}
        />
        <TextField
          id="outlined-basic"
          label="Card number"
          variant="standard"
          required
          type="text"
          fullWidth
          // value={customerEmail}
          name="cardNumber"
          color="warning"
          sx={{ marginTop: "1rem" }}
          // onChange={handleCustomerInfoChange}
        />
        <div className="flex w-full gap-2 mt-2">
          <TextField
            id="outlined-basic"
            label="Exp"
            variant="standard"
            fullWidth
            required
            color="warning"
            placeholder="MM/YYYY"
            // value={customerFName}
            name="exp"
            // onChange={handleCustomerInfoChange}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            label="CVV"
            variant="standard"
            required
            color="warning"
            // value={customerLName}
            name="cvv"
            // onChange={handleCustomerInfoChange}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            label="Zip"
            variant="standard"
            required
            color="warning"
            // value={customerLName}
            name="zip"
            // onChange={handleCustomerInfoChange}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentComponent;
