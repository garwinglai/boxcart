import React from "react";
import { TextField } from "@mui/material";

function PaymentComponent({ paymentValues, handleCustomerPaymentChange }) {
  const { nameOnCard, cardNumber, expDate, cvv, zip } = paymentValues;
  return (
    <React.Fragment>
      <h3 className="font-medium">Payment:</h3>
      <div className="lg:px-12">
        <TextField
          id="outlined-basic"
          label="Name on card"
          variant="standard"
          required
          type="text"
          fullWidth
          value={nameOnCard}
          name="nameOnCard"
          color="warning"
          sx={{ marginTop: "1rem" }}
          onChange={handleCustomerPaymentChange}
        />
        <TextField
          id="outlined-basic"
          label="Card number"
          variant="standard"
          required
          type="number"
          fullWidth
          value={cardNumber}
          name="cardNumber"
          color="warning"
          sx={{ marginTop: "1rem" }}
          onChange={handleCustomerPaymentChange}
        />
        <div className="flex w-full gap-2 mt-2">
          <TextField
            id="outlined-basic"
            label="Exp"
            variant="standard"
            fullWidth
            required
            type="text"
            color="warning"
            placeholder="MM/YYYY"
            value={expDate}
            name="expDate"
            onChange={handleCustomerPaymentChange}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            label="CVV"
            variant="standard"
            required
            type="number"
            color="warning"
            value={cvv}
            name="cvv"
            onChange={handleCustomerPaymentChange}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            label="Zip"
            variant="standard"
            type="number"
            required
            color="warning"
            value={zip}
            name="zip"
            onChange={handleCustomerPaymentChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default PaymentComponent;
