export default function calculateAmountMinusStripeFee(amountPenny) {
  const amount2Decimal = amountPenny / 100;
  const stripeFee = 0.029 * amount2Decimal + 0.3;
  const stripeFeeRounded = Math.round(stripeFee * 100) / 100;
  const stripeFeeRoundedPenny = stripeFeeRounded * 100;

  return stripeFeeRoundedPenny;
}
