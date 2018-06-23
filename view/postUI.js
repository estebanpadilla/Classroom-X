class PostUI {
	constructor(post, removeCallback, updateCallback) {

		this.post = post;
		this.removeCallback = removeCallback;
		this.updateCallback = updateCallback;
		this.isNotShowingReplayContainer = true;

		this.container = document.createElement('div');
		this.titleTxt = document.createElement('h2');
		this.bodyTxt = document.createElement('p');
		this.timestampTxt = document.createElement('p');
		this.postFooter = document.createElement('div');

		//Replay Container
		this.replayTxt = document.createElement('textarea');
		this.sendReplyBtn = document.createElement('button');
		this.addReplyContainer = document.createElement('div');
		this.addReplyContainer.appendChild(this.replayTxt);
		this.addReplyContainer.appendChild(this.sendReplyBtn);
		this.sendReplyBtn.innerText = 'Send your reply';
		this.sendReplyBtn.className = 'sendReplyBtn';
		this.replayTxt.placeholder = 'Add your replay here.';

		//Replais container
		this.repliesContainer = document.createElement('div');
		this.container.appendChild(this.titleTxt);
		this.container.appendChild(this.bodyTxt);

		this.postFooter.appendChild(this.timestampTxt);

		this.container.appendChild(this.postFooter);
		this.container.appendChild(this.repliesContainer);
		this.container.appendChild(this.addReplyContainer);

		this.postActionsContaine = document.createElement('div');
		this.postActionsContaine.className = 'postActionsContaine';
		this.container.appendChild(this.postActionsContaine);

		this.likeBtn = document.createElement('i');
		this.likeBtn.className = 'material-icons md-18';
		this.likeBtn.innerHTML = 'favorite';
		this.postActionsContaine.appendChild(this.likeBtn);

		if (this.post.editable) {
			this.removeBtn = document.createElement('i');
			this.removeBtn.className = 'material-icons md-18';
			this.removeBtn.innerHTML = 'delete';
			this.removeBtn.onclick = this.removeBtnAction.bind(this);
			this.postActionsContaine.appendChild(this.removeBtn);

			this.updateBtn = document.createElement('i');
			this.updateBtn.className = 'material-icons md-18';
			this.updateBtn.innerHTML = 'edit';
			this.updateBtn.onclick = this.updateBtnAction.bind(this);
			this.postActionsContaine.appendChild(this.updateBtn);
		}

		this.replyBtn = document.createElement('i');
		this.replyBtn.className = 'material-icons md-18';
		this.replyBtn.innerHTML = 'add_comment';
		this.replyBtn.onclick = this.showReplayContainer.bind(this);
		this.postActionsContaine.appendChild(this.replyBtn);

		this.container.className = 'postContainer';
		this.timestampTxt.className = 'timestampTxt';
		this.postFooter.className = 'postFooter';
		this.repliesContainer.className = 'repliesContainer';
		this.addReplyContainer.className = 'addReplyContainer';

		if (this.post !== null) {
			this.titleTxt.innerText = this.post.title;
			this.bodyTxt.innerText = this.post.body;
			this.timestampTxt.innerText = this.post.user.name + ' - ' + this.post.timestamp.toLocaleString();
		}

		this.container.post = this.post;
		this.addReplyContainer.hidden = this.isNotShowingReplayContainer;
		this.sendReplyBtn.postUI = this;
		this.updateRepliesContainer();
	}

	updateRepliesContainer() {
		this.repliesContainer.innerHTML = '';
		this.post.replies.forEach(reply => {
			var replyUI = new ReplyUI(reply);
			this.repliesContainer.appendChild(replyUI.container);
		});
	}

	showReplayContainer() {
		this.replayTxt.value = '';
		this.isNotShowingReplayContainer = !this.isNotShowingReplayContainer;
		this.addReplyContainer.hidden = this.isNotShowingReplayContainer;
	}

	removeBtnAction(e) {
		this.removeCallback(this.post);
	}

	updateBtnAction(e) {
		this.updateCallback(this.container);
	}
}

