// Copyright Titanium I.T. LLC.
export function transform(input: string) {
	return input.replace(/[A-Za-z]/g, transformLetter);
}

function transformLetter(letter: string) {
  const rotation = letter.toUpperCase() <= "M" ? 13 : -13;
  return String.fromCharCode(letter.charCodeAt(0) + rotation);
}