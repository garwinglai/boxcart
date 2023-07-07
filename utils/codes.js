import { checkAccessCode } from "@/helper/client/api/account/early-bird-code";

export async function createEarlyBirdCode(lName) {
  let earlyBirdCode = createAccessCode(lName);
  let isCodeInUse = await checkAccessCode(earlyBirdCode);
  let { value } = isCodeInUse;

  while (value) {
    earlyBirdCode = createAccessCode(lName);
    isCodeInUse = await checkAccessCode(earlyBirdCode);
  }

  return earlyBirdCode;
}

function createAccessCode(lName) {
  const fiveRandomDigits = Math.floor(Math.random() * 90000) + 10000;
  const earlyBirdCode = lName + fiveRandomDigits.toString();

  return earlyBirdCode;
}

export function createPersonalCode(fName, lName, waitlistCount) {
  const firstNameFirstChar = fName.split("")[0].toLocaleLowerCase();
  const lowerCaselName = lName.toLocaleLowerCase();
  const waitlistCountStr = waitlistCount.toString();
  const referralCode = firstNameFirstChar + lowerCaselName + waitlistCountStr;
  return referralCode;
}
