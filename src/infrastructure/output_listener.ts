// Copyright Titanium I.T. LLC.
import EventEmitter from "node:events";

const EVENT = "event";

export class OutputListener<T> {

	declare _emitter: EventEmitter;

	static create<T>() {
		return new OutputListener<T>();
	}

	constructor() {
		this._emitter = new EventEmitter();
	}

	trackOutput() {
		return new OutputTracker<T>(this._emitter, EVENT);
	}

	emit(data: T) {
		this._emitter.emit(EVENT, data);
	}

}


class OutputTracker<T> {

	declare _data: T[];
	declare _trackerFn: (data: T) => void;

	constructor(readonly _emitter: EventEmitter, readonly _event: typeof EVENT) {
		this._data = [];

		this._trackerFn = (data) => this._data.push(data);
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