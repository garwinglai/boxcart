export default function firstCharCapitlize(string) {
	const firstCharUpper = string.charAt(0).toUpperCase();
	const stringArr = string.split("");
	stringArr.shift();
	const lowerCaseRestOfName = stringArr.join("").toLowerCase();
	const firstCharUpperString = firstCharUpper + lowerCaseRestOfName;

	return firstCharUpperString;
}
