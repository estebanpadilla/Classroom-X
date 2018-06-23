window.addEventListener('load', init, false);

function init(params) {

    var titleTxt = document.getElementById('titleTxt');
    var postingContainer = document.getElementById('postingContainer');
    var bodyTxt = document.getElementById('bodyTxt');
    var postBtn = document.getElementById('postBtn');
    var editableButtonsContainer = document.getElementById('editableButtonsContainer');
    var updateBtn = document.getElementById('updateBtn');
    // var deleteBtn = document.getElementById('deleteBtn');
    var cancelBtn = document.getElementById('cancelBtn');
    var newPostBtn = document.getElementById('newPostBtn');
    var cancelPostBtn = document.getElementById('cancelPostBtn');

    var addNewPostsMsj = document.createElement('p');
    addNewPostsMsj.innerHTML = 'Use the PLUS circle button on the right to add new messages!';
    addNewPostsMsj.className = 'moreMorePosts';

    var moreMorePostsMsj = document.createElement('p');
    moreMorePostsMsj.innerHTML = 'No more messages available!';
    moreMorePostsMsj.className = 'moreMorePosts';

    postBtn.hidden = false;
    cancelPostBtn.hidden = false;
    editableButtonsContainer.hidden = true;

    postBtn.onclick = sendPost;
    updateBtn.onclick = updatePost;
    // deleteBtn.onclick = deletePost;
    cancelBtn.onclick = cancelBtnOnClick;
    newPostBtn.onclick = newPostBtnAction;
    cancelPostBtn.onclick = cancelBtnOnClick;

    var urlBase = 'https://classroomsx.firebaseio.com/data/';
    var room = 'room1';
    var user = null;
    var userKey = '1user';
    var users = [];
    var posts = [];
    var selectedPostUI = null;
    var moveToBottom = true;
    var isShowingPostingContainer = true;
    hidePostingContainer();

    //firebaseInit();
    requestUsers();

    //Network request callbacks
    //Add Here all network requests
    //Program Logic
    function updatePostsContainer() {

        var postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = '';

        postsContainer.appendChild(moreMorePostsMsj);

        for (var i = 0; i < posts.length; i++) {
            var postUI = new PostUI(posts[i], deletePost, openUpdateView);
            postUI.sendReplyBtn.onclick = sendReply;
            postsContainer.appendChild(postUI.container);
        }

        postsContainer.appendChild(addNewPostsMsj);

        if (moveToBottom) {
            postsContainer.scrollTop = postsContainer.scrollHeight;
            moveToBottom = false;
        }

        titleTxt.value = '';
        bodyTxt.value = '';
        selectedPostUI = null;
    }

    function sendReply(event) {

        selectedPostUI = event.target;

        if (selectedPostUI.postUI.replayTxt.value != '') {

            var post = selectedPostUI.postUI.post;
            var reply = new Reply(selectedPostUI.postUI.replayTxt.value, user.fbkey, null)

            var request = new XMLHttpRequest();
            var url = 'https://theevilmouseblog.firebaseio.com/data/rooms/' + room + '/posts/' + post.fbkey + '/replies.json';
            request.open('POST', url, true);
            request.onreadystatechange = updatePostCallback;
            request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            request.send(JSON.stringify(reply));

        } else {
            alert('Please enter your reply!');
        }
    }

    function removeSelectedPostStyle() {
        if (selectedPostUI) {
            selectedPostUI.classList.remove('selectedPost');
            selectedPostUI = null;
            titleTxt.value = '';
            bodyTxt.value = '';
            postBtn.hidden = false;
            cancelPostBtn.hidden = false;
            editableButtonsContainer.hidden = true;
        }
    }

    function findUser(fbkey) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].fbkey === fbkey) {
                return users[i];
            }
        }
        return null;
    }

    //HTML Element Event Handlers
    //HTML Requests
    function requestUsers() {
        var request = new XMLHttpRequest();
        request.open('GET', urlBase + 'users.json', true);
        request.onreadystatechange = requestUsersCallback;
        request.send();
    }

    function requestUsersCallback(event) {
        var request = event.target;
        switch (request.readyState) {
            case XMLHttpRequest.DONE:
                switch (request.status) {
                    case 200:
                        users = [];
                        var usersData = JSON.parse(request.responseText);

                        for (const key in usersData) {
                            var userData = usersData[key];
                            var owner = new User(key, userData.name, userData.lastName, userData.email);
                            users.push(owner);
                        }
                        user = findUser(userKey);
                        requestAllPosts();

                        break;
                    case 400:
                        break;
                    case 401:
                        break;
                    default:
                        break;
                }
                break;
            case XMLHttpRequest.LOADING:
                //console.log('LOADING');
                break;
            case XMLHttpRequest.OPENED:
                //console.log('OPENED');
                break;
            case XMLHttpRequest.HEADERS_RECEIVED:
                //console.log('HEADERS_RECEIVED');
                break;
            case XMLHttpRequest.UNSENT:
                //console.log('UNSENT');
                break;
            default:
                break;
        }
    }

    function requestAllPosts() {
        var request = new XMLHttpRequest();
        request.open('GET', (urlBase + '/rooms/' + room + '/posts.json'), true);
        request.onreadystatechange = requestAllPostsCallback;
        request.send();
    }

    function requestAllPostsCallback(event) {

        var request = event.target;

        switch (request.readyState) {
            case XMLHttpRequest.DONE:
                switch (request.status) {
                    case 200:
                        posts = [];
                        var postsData = JSON.parse(request.responseText);

                        for (const key in postsData) {
                            var postData = postsData[key];
                            var editable = false;

                            if (postData.user === user.fbkey) {
                                editable = true;
                            }

                            var replies = [];
                            for (const replyKey in postData.replies) {
                                // console.log(postData.replies[replyKey]);
                                var reply = new Reply(postData.replies[replyKey].body, findUser(postData.replies[replyKey].user), postData.replies[replyKey].timestamp);
                                replies.push(reply);
                            }

                            var post = new Post(key, postData.title, postData.body, findUser(postData.user), postData.timestamp, editable, replies);
                            posts.push(post);
                        }

                        updatePostsContainer();

                        break;
                    case 400:
                        break;
                    case 401:
                        break;
                    default:
                        break;
                }
                break;
            case XMLHttpRequest.LOADING:
                //console.log('LOADING');
                break;
            case XMLHttpRequest.OPENED:
                //console.log('OPENED');
                break;
            case XMLHttpRequest.HEADERS_RECEIVED:
                //console.log('HEADERS_RECEIVED');
                break;
            case XMLHttpRequest.UNSENT:
                //console.log('UNSENT');
                break;
            default:
                break;
        }
    }

    function sendPostCallback(event) {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                requestAllPosts();
            } else {
                console.log('Error on request: ', request.status);
            }
        }
    }

    function sendPost(event) {

        if (titleTxt.value === '' || bodyTxt.value === '') {
            alert('Los datos del post no están completos');
        } else {
            var post = new Post(null, titleTxt.value, bodyTxt.value, user.fbkey, null, true);
            var request = new XMLHttpRequest();
            request.open('POST', (urlBase + '/rooms/' + room + '/posts.json'), true);
            request.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
            request.onreadystatechange = sendPostCallback;
            request.send(JSON.stringify(post));
            cleanUI();
            hidePostingContainer();
        }
    }

    function updatePostCallback() {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                requestAllPosts();
            } else {
                console.log('Error on request: ', request.status);
            }
        }
    }

    function updatePost(event) {
        var request = new XMLHttpRequest();
        request.open('PATCH', (urlBase + '/rooms/' + room + '/posts.json'), true);
        request.onreadystatechange = updatePostCallback;
        request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');

        var post = selectedPostUI.post;
        post.title = titleTxt.value;
        post.body = bodyTxt.value;
        post.timestamp = new Date();
        post.user = user.fbkey;

        for (let i = 0; i < post.replies.length; i++) {
            const reply = post.replies[i];
            reply.user = user.fbkey;
        }

        var fbkey = post.fbkey;
        post.fbkey = null;
        var postJson = '{' + JSON.stringify(fbkey) + ':' + JSON.stringify(post) + '}';
        /*
        var post = '{' + JSON.stringify(selectedPostUI.post.fbkey) +
            ':{"title":' + JSON.stringify(titleTxt.value) +
            ', "body":' + JSON.stringify(bodyTxt.value) +
            ', "owner":' + JSON.stringify(owner) +
            ', "timestamp":' + JSON.stringify(selectedPostUI.post.timestamp) +
            '}}';
            */
        request.send(postJson);
        removeSelectedPostStyle();
        hidePostingContainer();
    }

    function deletePostCallback(event) {
        var request = event.target;
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                requestAllPosts();
            } else {
                console.log('Error on request: ', request.status);
            }
        }
    }

    function deletePost(post) {
        if (confirm('Estás seguro de eliminar el post?')) {
            var url = (urlBase + '/rooms/' + room + '/posts/' + post.fbkey + '.json');
            var request = new XMLHttpRequest();
            request.open('DELETE', url, true);
            request.onreadystatechange = deletePostCallback;
            request.send();
            removeSelectedPostStyle();
            //hidePostingContainer();
        }
    }

    function cancelBtnOnClick(event) {
        removeSelectedPostStyle();
        hidePostingContainer();
    }

    function cleanUI() {
        titleTxt.value = '';
        bodyTxt.value = '';
        moveToBottom = true;
    }

    function openUpdateView(container) {
        removeSelectedPostStyle();
        if (container.post) {
            selectedPostUI = container;
            titleTxt.value = selectedPostUI.post.title;
            bodyTxt.value = selectedPostUI.post.body;
            postBtn.hidden = true;
            cancelPostBtn.hidden = true;
            editableButtonsContainer.hidden = false;
            selectedPostUI.classList.add('selectedPost');
            showPostingContainer();
        }
    }

    function onPostClickEventHandler(event) {
        removeSelectedPostStyle();
        if (event.target.post) {
            openUpdateView(event.target);
        }
    }

    function editPost(post) {

    }

    function hidePostingContainer() {
        var options = { duration: 100, fill: 'forwards' };
        var keyFrames = [{ top: ((window.innerHeight - 190) + 'px') }, { top: (window.innerHeight + 'px') }];
        postingContainer.style.position = 'absolute';
        var hideAnimation = postingContainer.animate(keyFrames, options);
        hideAnimation.onfinish = onfinishHideAnimation;

        keyFrames = [{ height: (window.innerHeight + 'px') }, { height: ((window.innerHeight - 30) + 'px') }];
        postsContainer.animate(keyFrames, options);
    }

    function onfinishHideAnimation(e) {

        isShowingPostingContainer = false;
    }

    function newPostBtnAction(e) {
        showPostingContainer();
    }

    function showPostingContainer() {
        if (!isShowingPostingContainer) {
            var options = { duration: 100, fill: 'forwards' };
            var keyFrames = [{ top: (window.innerHeight + 'px') }, { top: ((window.innerHeight - 190) + 'px') }];
            postingContainer.style.position = 'absolute';
            var showAmination = postingContainer.animate(keyFrames, options)
            showAmination.onfinish = onfinishShowAnimation;

            keyFrames = [{ height: (window.innerHeight + 'px') }, { height: ((window.innerHeight - 220) + 'px') }];
            postsContainer.animate(keyFrames, options);
        }
    }

    function onfinishShowAnimation(e) {
        isShowingPostingContainer = true;
    }

    //Firebase
    // Get a reference to the database service
    var database = firebase.database();
    var ref = database.ref('posts');

    ref.once('value', onValue, errorHandler);
    ref.on('child_changed', onPostChanged, errorHandler);
    ref.on("child_removed", onPostRemoved, errorHandler);

    function onPostRemoved(data) {
        console.log('onPostRemoved');
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].fbkey === data.key) {
                posts.splice(i, 1);
            }
        }
        updatePostsContainer();
    }

    function onValue(data) {
        var postsData = data.val();
        for (var key in postsData) {
            var value = postsData[key];
            console.log(value);
            var editable = value.owner === owner;
            posts.push(new Post(key, value.title, value.body, value.owner, value.timestamp, editable));
        }

        updatePostsContainer();
    }

    function errorHandler(data) {
        console.log(data.val());
    }

    function onPostChanged(data) {
        console.log('onPostChanged', data);

        for (let i = 0; i < posts.length; i++) {
            if (posts[i].fbkey === data.key) {
                posts[i] = new Post(data.key, data.val().title, data.val().body, data.val().owner, data.val().timestamp);
            }
        }

        updatePostsContainer();
    }

    function firebaseInit() {
        var config = {
            apiKey: "AIzaSyC_QTx6ZaFn1QEWQZdzDv3NqCm5MPJzJu8",
            authDomain: "theevilmouseblog.firebaseapp.com",
            databaseURL: "https://theevilmouseblog.firebaseio.com",
            projectId: "theevilmouseblog",
            storageBucket: "theevilmouseblog.appspot.com",
            messagingSenderId: "341107600456"
        };
        firebase.initializeApp(config);
    }
}
