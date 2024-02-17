export default function calculateAmountMinusStripeFee(amountPenny) {
  const amount2Decimal = amountPenny / 100;
  const stripeFee = 0.029 * amount2Decimal + 0.3;
  const stripeFeeRounded = Math.round(stripeFee * 100) / 100;
  let stripeFeeRoundedPenny = stripeFeeRounded * 100;

  return stripeFeeRoundedPenny;
}

export function calculateStripePayoutFee(amountPenny, hasMonthlyFee) {
  const stripeFeePercent = 0.0025;
  const stripeFeeConstantInPennies = 25;
  let stripeFeeInPennies = Math.round(
    stripeFeePercent * amountPenny + stripeFeeConstantInPennies
  );

  if (hasMonthlyFee) {
    const monthlyFeeInPennies = 300;
    stripeFeeInPennies += monthlyFeeInPennies;
  }

  return stripeFeeInPennies;
}
