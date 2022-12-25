// Copyright Titanium I.T. LLC.
"use strict";

const assert = require("./assert");
const colors = require("./colors");

describe("Colors", () => {

	const { red } = colors;    // see production code for other supported colors

	it("color-codes text", () => {
		assert.equal(red("text"), "\u001b[31mtext\u001b[0m");
	});

	it("has styling", () => {
		// note that support for styles depends on terminal emulator

		assert.equal(red.bold("text"), "\u001b[1;31mtext\u001b[0m", "bold");
		assert.equal(red.dim("text"), "\u001b[2;31mtext\u001b[0m", "dim");
		assert.equal(red.underline("text"), "\u001b[4;31mtext\u001b[0m", "underline");
		assert.equal(red.blink("text"), "\u001b[5;31mtext\u001b[0m", "blink");
		assert.equal(red.inverse("text"), "\u001b[7;31mtext\u001b[0m", "inverse");
	});

	it("can chain styles", () => {
		assert.equal(red.bold.underline("text"), "\u001b[1;4;31mtext\u001b[0m", "multiple styles");
		assert.equal(red.underline.bold("text"), "\u001b[4;1;31mtext\u001b[0m", "use any order");

		assert.isUndefined(red.bold.bold, "doesn't repeat styles");
		assert.isUndefined(red.bold.underline.bold, "doesn't repeat styles even recursively");
	});

});
