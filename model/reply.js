class Reply {
	constructor(body, user, timestamp) {
		this.body = body;
		this.user = user;

		if (timestamp === null) {
			this.timestamp = new Date();
		}
		else {
			this.timestamp = new Date(timestamp);
		}
	}
}