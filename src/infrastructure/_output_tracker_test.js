// Copyright Titanium I.T. LLC.
import assert from "../util/assert.js";
import OutputTracker from "./output_tracker.js";
import EventEmitter from "node:events";

const EVENT = "my_event";

describe("OutputTracker", () => {

	it("tracks emitted events", () => {
		const { emitter, tracker } = createTracker();

		emitter.emit(EVENT, "my output 1");
		emitter.emit(EVENT, "my output 2");

		assert.deepEqual(tracker.data, [
			"my output 1",
			"my output 2",
		]);
	});

	it("supports arbitrary data types", () => {
		const { emitter, tracker } = createTracker();

		emitter.emit(EVENT, { data: [ "nested", 3.14 ] });
		assert.deepEqual(tracker.data, [
			{ data: [ "nested", 3.14 ] },
		]);
	});

	it("can be stopped", () => {
		const { emitter, tracker } = createTracker();

		emitter.emit(EVENT, "my output 1");
		tracker.stop();
		emitter.emit(EVENT, "my output 2");

		assert.deepEqual(tracker.data, [ "my output 1" ]);
	});

	it("can be cleared", () => {
		const { emitter, tracker } = createTracker();

		emitter.emit(EVENT, "my output 1");
		assert.deepEqual(tracker.clear(), [ "my output 1" ]);

		emitter.emit(EVENT, "my output 2");
		assert.deepEqual(tracker.clear(), [ "my output 2" ]);
	});

});

function createTracker() {
	const emitter = new EventEmitter();
	const tracker = OutputTracker.create(emitter, EVENT);
	return { emitter, tracker };
}
