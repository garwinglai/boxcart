export default function calculateAmountMinusStripeFee(amountPenny) {
  const amount2Decimal = amountPenny / 100;
  const stripeFee = 0.029 * amount2Decimal + 0.3;
  const stripeFeeRounded = Math.round(stripeFee * 100) / 100;
  let stripeFeeRoundedPenny = stripeFeeRounded * 100;

  return stripeFeeRoundedPenny;
}

export function calculateStripePayoutFee(amountPenny, hasMonthlyFee) {
  const stripeFee = 0.25;
  let stripeFeeRoundedPenny = stripeFee * 100;

  if (hasMonthlyFee) stripeFeeRoundedPenny += 200;

  return stripeFeeRoundedPenny;
}
