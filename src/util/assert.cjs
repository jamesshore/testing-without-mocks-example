// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

// A small modification to Chai. Why? Just to demonstrate how you can customize an assertion library
// without writing it all yourself.

const assert = require("chai").assert;

// 'module.exports = assert' doesn't work because it's a reference copy. Any changes (such as when we
// overwrite exports.fail) changes Chai's functions. In the case of exports.fail, it causes an infinite
// loop. Oops. So we use {...} to do a shallow copy instead.
module.exports = { ...assert };

exports.fail = function(message) {
	assert.fail(null, null, message);
};
