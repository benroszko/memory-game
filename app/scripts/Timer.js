class Timer {
	constructor() {
		this._timerElement = document.getElementsByClassName('timer')[0];
		this._timeCounter = 0;
		this._intervalId = null;
	}

	getTimeCounter() {
		return this._timeCounter;
	}

	getIntervalId() {
		return this._intervalId;
	}

	loadTimer() {
		const timerTextContent = 'Time: ';
		this._timeCounter = 0;

		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._timerElement.textContent = timerTextContent + this._timeCounter;
		}
		this._timerElement.hidden = false;
		this._intervalId = setInterval(() => {
			this._timerElement.textContent = timerTextContent + ++this._timeCounter;
		}, 1000);
	}
}

export { Timer };
