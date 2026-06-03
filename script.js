let addBtn = document.querySelector("#btn");
let get = document.querySelector("#get");
let overlay = document.querySelector(".overlay");
let closeBtn = document.querySelector(".close");
let cancelBtn = document.querySelector(".cancel");
let publishBtn = document.querySelector(".publish");

// INPUTS
let nameInput = document.querySelector("#username");
let titleInput = document.querySelector("#title");
let descInput = document.querySelector("#description");
let categoryInput = document.querySelector("#category");
let tagsInput = document.querySelector("#tags");

let ideaCard = document.querySelector(".idea-card");

// OPEN FORM
function openForm() {
  overlay.classList.add("show");
}

addBtn.addEventListener("click", openForm);
get.addEventListener("click", openForm);

// CLOSE FORM
closeBtn.addEventListener("click", () => overlay.classList.remove("show"));
cancelBtn.addEventListener("click", () => overlay.classList.remove("show"));

// ================= SAVE LOCAL STORAGE =================//
function saveToLocalStorage() {
  let allCards = [];
  let cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    let comments = [];

    card.querySelectorAll(".cmts").forEach((c) => {
      comments.push({
        user: c.querySelector(".comment-user").innerText,
        text: c.querySelector(".comment-text").innerText,
      });
    });

    allCards.push({
      title: card.querySelector("h3").innerText,
      category: card.querySelector(".category").innerText,
      description: card.querySelector(".desc").innerText,
      tags: Array.from(card.querySelectorAll(".single-tag"))
        .map((tag) => tag.innerText.replace("#", ""))
        .join(","),
      author: card
        .querySelector(".author")
        .innerText.replace("Shared by: ", ""),
      likeCount: card.querySelector(".countLike").innerText,
      dislikeCount: card.querySelector(".countDislike").innerText,
      liked: card.querySelector(".like-btn").classList.contains("like-btn-yes"),
      disliked: card
        .querySelector(".dis-like")
        .classList.contains("like-btn-yes"),
      commentCount: card.querySelector(".cmtCount").innerText,
      comments: comments,
    });
  });

  localStorage.setItem("ideas", JSON.stringify(allCards));
}

// ================= HELPER FUNCTION TO CREATE COMMENT DOM =================
function createCommentElement(
  user,
  text,
  commentsArray,
  cmtCountElement,
  onUpdate,
) {
  let commentDiv = document.createElement("div");
  commentDiv.classList.add("cmts");

  let commentTop = document.createElement("div");
  commentTop.classList.add("comment-top");

  let commentUser = document.createElement("span");
  commentUser.classList.add("comment-user");
  commentUser.textContent = user;

  let commentActions = document.createElement("div");
  commentActions.classList.add("comment-actions");

  let editIcon = document.createElement("i");
  editIcon.className = "fa-solid fa-pen edit-comment";

  let deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-solid fa-trash delete-comment";

  commentActions.appendChild(editIcon);
  commentActions.appendChild(deleteIcon);
  commentTop.appendChild(commentUser);
  commentTop.appendChild(commentActions);

  let commentText = document.createElement("p");
  commentText.classList.add("comment-text");
  commentText.textContent = text;

  commentDiv.appendChild(commentTop);
  commentDiv.appendChild(commentText);

  // DELETE COMMENT
  deleteIcon.addEventListener("click", () => {
    commentDiv.remove();
    let index = commentsArray.findIndex(
      (c) => c.text === text && c.user === user,
    );
    if (index !== -1) {
      commentsArray.splice(index, 1);
    }
    cmtCountElement.textContent = commentsArray.length;
    saveToLocalStorage();
  });

  // EDIT COMMENT
  editIcon.addEventListener("click", () => {
    let updatedText = prompt("Edit your comment", commentText.textContent);
    if (updatedText !== null && updatedText.trim() !== "") {
      let oldText = commentText.textContent;
      commentText.textContent = updatedText;

      let index = commentsArray.findIndex(
        (c) => c.text === oldText && c.user === user,
      );
      if (index !== -1) {
        commentsArray[index].text = updatedText;
      }
      saveToLocalStorage();
    }
  });

  return commentDiv;
}

// ================= CREATE CARD =================
function createCard(
  currentUser,
  title,
  description,
  category,
  tags,
  likeCount = 0,
  dislikeCount = 0,
  isLiked = false,
  isDisliked = false,
  commentCount = 0,
  comments = [],
) {
  // Main Card Container
  let card = document.createElement("div");
  card.classList.add("card");

  // Top Section
  let cardTop = document.createElement("div");
  cardTop.classList.add("card-top");

  let h3 = document.createElement("h3");
  h3.textContent = title;

  let catSpan = document.createElement("span");
  catSpan.classList.add("category");
  catSpan.textContent = category;

  cardTop.appendChild(h3);
  cardTop.appendChild(catSpan);

  // Description
  let descP = document.createElement("p");
  descP.classList.add("desc");
  descP.textContent = description;

  // Tags Section
  let tagsDiv = document.createElement("div");
  tagsDiv.classList.add("tags");
  if (tags) {
    tags.split(",").forEach((tag) => {
      if (tag.trim() !== "") {
        let tagSpan = document.createElement("span");
        tagSpan.classList.add("single-tag");
        tagSpan.textContent = `#${tag.trim()}`;
        tagsDiv.appendChild(tagSpan);
      }
    });
  }

  // Bottom Section (Author & Edit/Delete)
  let bottomDiv = document.createElement("div");
  bottomDiv.classList.add("bottom");

  let authorP = document.createElement("p");
  authorP.classList.add("author");
  authorP.textContent = `Shared by: ${currentUser}`;

  let actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");

  let editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);
  bottomDiv.appendChild(authorP);
  bottomDiv.appendChild(actionsDiv);

  //  (Likes, Dislikes, Comments)
  let publicBtnDiv = document.createElement("div");
  publicBtnDiv.classList.add("public-btn");

  // Like Button
  let likeBtn = document.createElement("button");
  likeBtn.className = isLiked ? "like-btn like-btn-yes" : "like-btn";
  let likeIcon = document.createElement("i");
  likeIcon.className = "fa-solid fa-thumbs-up";
  let countLikeSpan = document.createElement("span");
  countLikeSpan.classList.add("countLike");
  countLikeSpan.textContent = likeCount;
  likeBtn.appendChild(likeIcon);
  likeBtn.appendChild(countLikeSpan);

  // Dislike Button
  let disLikeBtn = document.createElement("button");
  disLikeBtn.className = isDisliked ? "dis-like like-btn-yes" : "dis-like";
  let dislikeIcon = document.createElement("i");
  dislikeIcon.className = "fa-solid fa-thumbs-down";
  let countDislikeSpan = document.createElement("span");
  countDislikeSpan.classList.add("countDislike");
  countDislikeSpan.textContent = dislikeCount;
  disLikeBtn.appendChild(dislikeIcon);
  disLikeBtn.appendChild(countDislikeSpan);

  // Comment Toggle Button
  let commentBtn = document.createElement("button");
  commentBtn.classList.add("comment-btn");
  let commentIcon = document.createElement("i");
  commentIcon.className = "fa-regular fa-comment";
  let cmtCountSpan = document.createElement("span");
  cmtCountSpan.classList.add("cmtCount");
  cmtCountSpan.textContent = commentCount;
  commentBtn.appendChild(commentIcon);
  commentBtn.appendChild(cmtCountSpan);

  // Comment Box Container
  let cmtBox = document.createElement("div");
  cmtBox.classList.add("cmt-box");

  let cmtInput = document.createElement("input");
  cmtInput.type = "text";
  cmtInput.classList.add("cmt-input");
  cmtInput.placeholder = "Add Comment....";

  let cmtSentBtn = document.createElement("button");
  cmtSentBtn.classList.add("cmt-sent");
  let sendIcon = document.createElement("i");
  sendIcon.className = "fa-solid fa-paper-plane";
  cmtSentBtn.appendChild(sendIcon);

  cmtBox.appendChild(cmtInput);
  cmtBox.appendChild(cmtSentBtn);

  // Append everything to Public Section
  publicBtnDiv.appendChild(likeBtn);
  publicBtnDiv.appendChild(disLikeBtn);
  publicBtnDiv.appendChild(commentBtn);
  publicBtnDiv.appendChild(cmtBox);

  // Append all structural elements to Main Card
  card.appendChild(cardTop);
  card.appendChild(descP);
  card.appendChild(tagsDiv);
  card.appendChild(bottomDiv);
  card.appendChild(publicBtnDiv);

  ideaCard.appendChild(card);

  // ================= COMMENTS FUNCTIONALITY =================

  comments.forEach((comment) => {
    let commentEl = createCommentElement(
      comment.user,
      comment.text,
      comments,
      cmtCountSpan,
    );
    cmtBox.appendChild(commentEl);
  });

  // Toggle comment box
  commentBtn.addEventListener("click", () => {
    cmtBox.classList.toggle("cmt-box-show");
  });

  // Add new comment
  cmtSentBtn.addEventListener("click", () => {
    let value = cmtInput.value.trim();
    if (value === "") return;

    let newCommentObj = { user: currentUser, text: value };
    comments.push(newCommentObj);

    let commentEl = createCommentElement(
      currentUser,
      value,
      comments,
      cmtCountSpan,
    );
    cmtBox.appendChild(commentEl);

    cmtInput.value = "";
    cmtCountSpan.textContent = comments.length;
    saveToLocalStorage();
  });

  // ================= DELETE CARD =================
  deleteBtn.addEventListener("click", () => {
    card.remove();
    saveToLocalStorage();
  });

  // ================= LIKE EVENT =================
  likeBtn.addEventListener("click", () => {
    let isLiked = likeBtn.classList.toggle("like-btn-yes");
    if (isLiked) {
      countLikeSpan.textContent = 1;
      disLikeBtn.classList.remove("like-btn-yes");
      countDislikeSpan.textContent = 0;
    } else {
      countLikeSpan.textContent = 0;
    }
    saveToLocalStorage();
  });

  // ================= DISLIKE EVENT =================
  disLikeBtn.addEventListener("click", () => {
    let isDisliked = disLikeBtn.classList.toggle("like-btn-yes");
    if (isDisliked) {
      countDislikeSpan.textContent = 1;
      likeBtn.classList.remove("like-btn-yes");
      countLikeSpan.textContent = 0;
    } else {
      countDislikeSpan.textContent = 0;
    }
    saveToLocalStorage();
  });

  // ================= EDIT CARD =================
  editBtn.addEventListener("click", () => {
    nameInput.value = currentUser;
    titleInput.value = title;
    descInput.value = description;
    categoryInput.value = category;
    tagsInput.value = tags;

    overlay.classList.add("show");
    card.remove();
    saveToLocalStorage();
  });
}

// ================= PUBLISH =================
publishBtn.addEventListener("click", () => {
  let currentUser = nameInput.value.trim();
  let title = titleInput.value.trim();
  let description = descInput.value.trim();
  let category = categoryInput.value;
  let tags = tagsInput.value.trim();

  if (!currentUser || !title || !description) {
    alert("Please fill all required fields");
    return;
  }

  createCard(
    currentUser,
    title,
    description,
    category,
    tags,
    0,
    0,
    false,
    false,
    0,
    [],
  );
  saveToLocalStorage();

  nameInput.value = "";
  titleInput.value = "";
  descInput.value = "";
  tagsInput.value = "";

  overlay.classList.remove("show");
});

// ================= LOAD FROM STORAGE =================
function loadCards() {
  let storedIdeas = JSON.parse(localStorage.getItem("ideas")) || [];

  storedIdeas.forEach((data) => {
    createCard(
      data.author,
      data.title,
      data.description,
      data.category,
      data.tags ? data.tags.replaceAll("#", "").replaceAll(" ", ",") : "",
      data.likeCount || 0,
      data.dislikeCount || 0,
      data.liked || false,
      data.disliked || false,
      data.commentCount || 0,
      data.comments || [],
    );
  });
}

loadCards();
