// Copyright Titanium I.T. LLC.

import assert from "../util/assert.js";
import { transform } from "./rot13.js";

describe("ROT-13", function() {

	it("does nothing when input is empty", function() {
		assert.equal(transform(""), "");
	});

	it("transforms lower-case letters", function() {
		assert.equal(transform("abcdefghijklmnopqrstuvwxyz"), "nopqrstuvwxyzabcdefghijklm");
	});

	it("transforms upper-case letters", function() {
		assert.equal(transform("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "NOPQRSTUVWXYZABCDEFGHIJKLM");
	});

	it("doesn't transform symbols", function() {
		assertNoTransform("`{@[");
	});

	it("doesn't transform numbers", function() {
		assertNoTransform("1234567890");
	});

	it("doesn't transform non-English letters", function() {
		assertNoTransform("åéîøüçñ");
	});

	it("doesn't break when given emojis", function() {
		assertNoTransform("✅🚫🙋");
	});

	it("fails fast when no parameter provided", function() {
		assert.throws(
			() => transform(),
			"Expected string parameter"
		);
	});

	it("fails fast when wrong parameter type provided", function() {
		assert.throws(
			() => transform(123),
			"Expected string parameter"
		);
	});

});

function assertNoTransform(input) {
	assert.equal(transform(input), input);
}
