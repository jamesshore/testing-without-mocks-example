// Copyright Titanium I.T. LLC.
import EventEmitter from "node:events";

const EVENT = "event";

export class OutputListener {

	static create() {
		return new OutputListener();
	}

	constructor() {
		this._emitter = new EventEmitter();
	}

	trackOutput() {
		return new OutputTracker(this._emitter, EVENT);
	}

	emit(data) {
		this._emitter.emit(EVENT, data);
	}

}


class OutputTracker {

	constructor(emitter, event) {
		this._emitter = emitter;
		this._event = event;
		this._data = [];

		this._trackerFn = (text) => this._data.push(text);
		this._emitter.on(this._event, this._trackerFn);
	}

	get data() {
		return this._data;
	}

	clear() {
		const result = [ ...this._data ];
		this._data.length = 0;
		return result;
	}

	stop() {
		this._emitter.off(this._event, this._trackerFn);
	}

}