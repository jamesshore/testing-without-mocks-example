// Copyright Titanium I.T. LLC.
import assert from "../util/assert.js";
import OutputTracker from "./output_tracker.js";
import EventEmitter from "node:events";

describe("OutputTracker", () => {

	const EVENT = "my_event";

	it("tracks emitted events", function() {
		const { emitter, tracker } = createTracker();

		emitter.emit(EVENT, "my output 1");
		emitter.emit(EVENT, "my output 2");

		assert.deepEqual(tracker.data,  [ "my output 1", "my output 2" ]);
	});

	it("can be turned off", function() {
		const { emitter, tracker } = createTracker();

		emitter.emit(EVENT, "my output 1");
		tracker.off();
		emitter.emit(EVENT, "my output 2");

		assert.deepEqual(tracker.data,  []);
	});

	it("tracker allows output to be consumed", function() {
		const { emitter, tracker } = createTracker();

		emitter.emit(EVENT, "my output 1");
		assert.deepEqual(tracker.consume(), [ "my output 1" ]);

		emitter.emit(EVENT, "my output 2");
		assert.deepEqual(tracker.consume(), [ "my output 2" ]);
	});

	it("supports arbitrary data types", function() {
		const { emitter, tracker } = createTracker();

		emitter.emit(EVENT, { data: [ "nested", 3.14 ]});
		assert.deepEqual(tracker.data,  [
			{ data: [ "nested", 3.14 ]}
		]);
	});

	function createTracker() {
		const emitter = new EventEmitter();
		const tracker = OutputTracker.create(emitter, EVENT);
		return { emitter, tracker };
	}

});