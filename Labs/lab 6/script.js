// ----- Counters and comments array -----
let likes = 0;
let dislikes = 0;
let comments = [];

// ----- Get the elements from the page -----
const likeButton = document.getElementById("like-btn");
const dislikeButton = document.getElementById("dislike-btn");
const likeCount = document.getElementById("like-count");
const dislikeCount = document.getElementById("dislike-count");
const message = document.getElementById("message");
const commentInput = document.getElementById("comment-input");
const commentButton = document.getElementById("comment-btn");
const commentsList = document.getElementById("comments-list");
const resetButton = document.getElementById("reset-btn");

// ----- Cookie helper functions -----
function setCookie(name, value) {
    // the cookie is kept for 7 days
    document.cookie = name + "=" + value + "; max-age=" + 7 * 24 * 60 * 60 + "; path=/";
}

function getCookie(name) {
    let allCookies = document.cookie.split(";");
    for (let i = 0; i < allCookies.length; i++) {
        if (allCookies[i].indexOf(name + "=") !== -1) {
            return allCookies[i].split("=")[1];
        }
    }
    // the cookie was not found
    return "";
}

function deleteCookie(name) {
    // a cookie is deleted by giving it an expiry date in the past
    document.cookie = name + "=; expires=" + new Date(2000, 0, 1).toUTCString() + "; path=/";
}

// ----- Update the page -----
function updateCounters() {
    likeCount.innerText = likes;
    dislikeCount.innerText = dislikes;
}

function showComments() {
    // remove the old comments first
    commentsList.innerHTML = "";

    if (comments.length === 0) {
        let emptyText = document.createElement("p");
        emptyText.innerText = "No comments yet.";
        commentsList.appendChild(emptyText);
    }

    for (let i = 0; i < comments.length; i++) {
        let commentElement = document.createElement("p");
        commentElement.innerText = comments[i];
        commentsList.appendChild(commentElement);
    }
}

// ----- Like / Dislike -----
function vote(choice) {
    // if the vote cookie exists, the user already voted
    if (getCookie("vote") !== "") {
        message.innerText = "You already voted. Press Reset to vote again.";
        return;
    }

    if (choice === "like") {
        likes++;
    } else {
        dislikes++;
    }

    setCookie("vote", choice);
    updateCounters();
    message.innerText = "Thank you for voting!";
}

// ----- Comment -----
function addComment() {
    // if the comment cookie exists, the user already commented
    if (getCookie("comment") !== "") {
        message.innerText = "You already commented. Press Reset to comment again.";
        return;
    }

    let text = commentInput.value;

    // do not accept an empty comment (or a comment with only spaces)
    if (text.split(" ").join("") === "") {
        message.innerText = "Please write a comment first.";
        return;
    }

    // ; and = would break the cookie, so we replace them
    text = text.split(";").join(",");
    text = text.split("=").join("-");

    comments.push(text);
    setCookie("comment", text);
    showComments();
    commentInput.value = "";
    message.innerText = "Thank you for your comment!";
}

// ----- Reset -----
function resetAll() {
    deleteCookie("vote");
    deleteCookie("comment");

    likes = 0;
    dislikes = 0;
    comments = [];

    updateCounters();
    showComments();
    commentInput.value = "";
    message.innerText = "Everything was reset. You can vote and comment again.";
}

// ----- Load the saved state from the cookies when the page opens -----
function loadState() {
    let savedVote = getCookie("vote");
    if (savedVote === "like") {
        likes = 1;
    }
    if (savedVote === "dislike") {
        dislikes = 1;
    }

    let savedComment = getCookie("comment");
    if (savedComment !== "") {
        comments.push(savedComment);
    }

    updateCounters();
    showComments();
}

// ----- Events -----
likeButton.addEventListener("click", function () {
    vote("like");
});

dislikeButton.addEventListener("click", function () {
    vote("dislike");
});

commentButton.addEventListener("click", addComment);
resetButton.addEventListener("click", resetAll);

// ----- Run when the page loads -----
loadState();