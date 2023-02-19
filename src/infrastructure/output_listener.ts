// Copyright Titanium I.T. LLC.
import EventEmitter from "node:events";

const EVENT = "event";

export class OutputListener<T> {

	private readonly _emitter: EventEmitter;

	static create<T>(): OutputListener<T> {
		return new OutputListener<T>();
	}

	constructor() {
		this._emitter = new EventEmitter();
	}

	trackOutput(): OutputTrackerInternal<T> {
		return new OutputTrackerInternal<T>(this._emitter, EVENT);
	}

	emit(data: T): void {
		this._emitter.emit(EVENT, data);
	}

}


class OutputTrackerInternal<T> {

	private readonly _data: T[];
	private readonly _trackerFn: (data: T) => void;

	constructor(private readonly _emitter: EventEmitter, private readonly _event: typeof EVENT) {
		this._data = [];

		this._trackerFn = (data) => this._data.push(data);
		this._emitter.on(this._event, this._trackerFn);
	}

	get data(): readonly T[] {
		return this._data;
	}

	clear(): readonly T[] {
		const result = [ ...this._data ];
		this._data.length = 0;
		return result;
	}

	stop(): void {
		this._emitter.off(this._event, this._trackerFn);
	}

}

export type OutputTracker<T> = OutputTrackerInternal<T>;