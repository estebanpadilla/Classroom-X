class ReplyUI {
	constructor(reply) {

		this.reply = reply;
		this.container = document.createElement('div');
		this.bodyTxt = document.createElement('p');
		this.timestampTxt = document.createElement('p');

		this.container.appendChild(this.bodyTxt);
		this.container.appendChild(this.timestampTxt);

		this.bodyTxt.className = 'replyBodyTxt';
		this.container.className = 'replyContainer';
		this.timestampTxt.className = 'replyTimestampTxt';

		if (this.post !== null) {

			this.bodyTxt.innerText = this.reply.body;
			this.timestampTxt.innerText = this.reply.user.name + ' - '
				+ this.reply.timestamp.toLocaleString();
		}
	}

}

