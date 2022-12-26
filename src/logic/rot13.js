// Copyright Titanium I.T. LLC.
export function transform(input) {
  if (input === undefined || typeof input !== "string") throw new Error("Expected string parameter");

	return input.replace(/[A-Za-z]/g, transformLetter);
}

function transformLetter(letter) {
  const rotation = letter.toUpperCase() <= "M" ? 13 : -13;
  return String.fromCharCode(letter.charCodeAt(0) + rotation);
}