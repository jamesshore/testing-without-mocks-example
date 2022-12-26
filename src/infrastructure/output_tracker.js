// Copyright Titanium I.T. LLC.
import EventEmitter from "node:events";

export default class OutputTracker {

	static create(emitter, event) {
		return new OutputTracker(emitter, event);
	}

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

	consume() {
		const result = [ ...this._data ];
		this._data.length = 0;
		return result;
	}

	off() {
		this.consume();
		this._emitter.off(this._event, this._trackerFn);
	}

}