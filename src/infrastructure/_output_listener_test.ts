// Copyright Titanium I.T. LLC.
import assert from "../util/assert.js";
import { OutputListener } from "./output_listener.js";

describe("OutputListener", () => {

	it("tracks emitted events", () => {
		const { listener, tracker } = createListener();

		listener.emit("my output 1");
		listener.emit("my output 2");

		assert.deepEqual(tracker.data, [
			"my output 1",
			"my output 2",
		]);
	});

	it("supports arbitrary data types", () => {
		const { listener, tracker } = createListener();

		listener.emit({ data: [ "nested", 3.14 ] });
		assert.deepEqual(tracker.data, [
			{ data: [ "nested", 3.14 ] },
		]);
	});

	it("can be stopped", () => {
		const { listener, tracker } = createListener();

		listener.emit("my output 1");
		tracker.stop();
		listener.emit("my output 2");

		assert.deepEqual(tracker.data, [ "my output 1" ]);
	});

	it("can be cleared", () => {
		const { listener, tracker } = createListener();

		listener.emit("my output 1");
		assert.deepEqual(tracker.clear(), [ "my output 1" ]);

		listener.emit("my output 2");
		assert.deepEqual(tracker.clear(), [ "my output 2" ]);
	});

});

function createListener() {
	const listener = OutputListener.create();
	const tracker = listener.trackOutput();

	return { listener, tracker };
}

