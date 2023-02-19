// Copyright Titanium I.T. LLC.
import assert from "../util/assert.js";
import { transform } from "./rot13.js";

describe("ROT-13", () => {

	it("does nothing when input is empty", () => {
		assert.equal(transform(""), "");
	});

	it("transforms lower-case letters", () => {
		assert.equal(transform("abcdefghijklmnopqrstuvwxyz"), "nopqrstuvwxyzabcdefghijklm");
	});

	it("transforms upper-case letters", () => {
		assert.equal(transform("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "NOPQRSTUVWXYZABCDEFGHIJKLM");
	});

	it("doesn't transform symbols", () => {
		assertNoTransform("`{@[");
	});

	it("doesn't transform numbers", () => {
		assertNoTransform("1234567890");
	});

	it("doesn't transform non-English letters", () => {
		assertNoTransform("åéîøüçñ");
	});

	it("doesn't break when given emojis", () => {
		assertNoTransform("✅🚫🙋");
	});

});

function assertNoTransform(input: string) {
	assert.equal(transform(input), input);
}
