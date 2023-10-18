import { checkAccessCode } from "@/helper/client/api/account/early-bird-code";

export async function createEarlyBirdCode(lName) {
  let accessCode = createAccessCode(lName);
  let isCodeInUse = await checkAccessCode(accessCode);
  let { value } = isCodeInUse;

  while (value) {
    accessCode = createAccessCode(lName);
    isCodeInUse = await checkAccessCode(accessCode);
  }

  return accessCode;
}

function createAccessCode(lName) {
  const fiveRandomDigits = Math.floor(Math.random() * 90000) + 10000;
  const accessCode = lName + fiveRandomDigits.toString();

  return accessCode;
}

export function createPersonalCode(fName, lName, waitlistCount) {
  const firstNameFirstChar = fName.split("")[0].toLocaleLowerCase();
  const lowerCaselName = lName.toLocaleLowerCase();
  const waitlistCountStr = waitlistCount.toString();
  const referralCode = firstNameFirstChar + lowerCaselName + waitlistCountStr;
  return referralCode;
}
