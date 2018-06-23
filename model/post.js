class Post {
	constructor(fbkey, title, body, user, timestamp, editable, replies) {
		this.fbkey = fbkey;
		this.title = title;
		this.body = body;
		this.user = user;
		this.editable = editable;
		this.replies = replies;

		if (timestamp === null) {
			this.timestamp = new Date();
		}
		else {
			this.timestamp = new Date(timestamp);
		}
	}
}