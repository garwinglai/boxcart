export function createEarlyBirdCode(lName) {
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
