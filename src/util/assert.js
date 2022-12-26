// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.

// A small modification to Chai. Why? Just to demonstrate how you can customize an assertion library
// without writing it all yourself.

import { assert } from "chai";

const myAssert = { ...assert };

myAssert.fail = function(message) {
	assert.fail(null, null, message);
};

export default myAssert;