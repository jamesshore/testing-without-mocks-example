// Copyright Titanium I.T. LLC.
"use strict";

const COLOR_STYLES = {
	bold: "1;",
	dim: "2;",
	underline: "4;",
	blink: "5;",
	inverse: "7;",
};

module.exports = {
	// this brute-force approach works better with IDE code completion than building the object at run-time.
	black: colorFn(30),
	red: colorFn(31),
	green: colorFn(32),
	yellow: colorFn(33),
	blue: colorFn(34),
	purple: colorFn(35),
	cyan: colorFn(36),
	white: colorFn(37),
	brightBlack: colorFn(90),
	brightRed: colorFn(91),
	brightGreen: colorFn(92),
	brightYellow: colorFn(93),
	brightBlue: colorFn(94),
	brightPurple: colorFn(95),
	brightCyan: colorFn(96),
	brightWhite: colorFn(97),
};

function colorFn(color) {
	const fn = encodeFn("", color);
	combinatorialize(fn, "", color, COLOR_STYLES);
	return fn;

	function encodeFn(style, color) {
		return (text) => {
			return `\u001b[${style}${color}m${text}\u001b[0m`;
		};
	}

	function combinatorialize(fn, baseStyle, color, styles) {
		// adds .bold, .dim, etc. to fn, and does so recursively.
		Object.keys(styles).forEach(styleKey => {
			const myStyle = baseStyle + styles[styleKey];
			fn[styleKey] = encodeFn(myStyle, color);

			const remainingStyles = { ...styles };
			delete remainingStyles[styleKey];
			combinatorialize(fn[styleKey], myStyle, color, remainingStyles);
		});
	}
}
