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

// ================= SAVE LOCAL STORAGE =================
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
  let formattedTags = tags
    .split(",")
    .map((tag) => `<span class="single-tag">#${tag.trim()}</span>`)
    .join("");
  let card = document.createElement("div");
  card.classList.add("card");

  let likeClass = isLiked ? "like-btn like-btn-yes" : "like-btn";
  let dislikeClass = isDisliked ? "dis-like like-btn-yes" : "dis-like";

  card.innerHTML = `
    <div class="card-top">
        <h3>${title}</h3>
        <span class="category">${category}</span>
    </div>

    <p class="desc">${description}</p>

    <div class="tags">${formattedTags}</div>

    <div class="bottom">
        <p class="author">Shared by: ${currentUser}</p>
        <div class="actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    </div>

    <div class="public-btn">
        <button class="${likeClass}">
            <i class="fa-solid fa-thumbs-up"></i>
            <span class="countLike">${likeCount}</span>
        </button>

        <button class="${dislikeClass}">
            <i class="fa-solid fa-thumbs-down"></i>
            <span class="countDislike">${dislikeCount}</span>
        </button>

        <button class="comment-btn">
            <i class="fa-regular fa-comment"></i>
            <span class="cmtCount">${commentCount}</span>
        </button>

        <div class="cmt-box">
            <input type="text" class="cmt-input" placeholder="Add Comment....">
            <button class="cmt-sent">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    </div>
  `;

  ideaCard.appendChild(card);

  // ================= COMMENTS =================
  let cmtBox = card.querySelector(".cmt-box");
  let commentBtn = card.querySelector(".comment-btn");
  let cmtInput = card.querySelector(".cmt-input");
  let cmtSent = card.querySelector(".cmt-sent");
  let cmtCount = card.querySelector(".cmtCount");

  // load old comments
  comments.forEach((comment) => {
    let commentDiv = document.createElement("div");
    commentDiv.classList.add("cmts");

    commentDiv.innerHTML = `
        <div class="comment-top">
            <span class="comment-user">${comment.user}</span>

            <div class="comment-actions">
                <i class="fa-solid fa-pen edit-comment"></i>
                <i class="fa-solid fa-trash delete-comment"></i>
            </div>
        </div>

        <p class="comment-text">${comment.text}</p>
    `;

    cmtBox.appendChild(commentDiv);

    // DELETE
    let deleteBtn = commentDiv.querySelector(".delete-comment");

    deleteBtn.addEventListener("click", () => {
      commentDiv.remove();


      comments = comments.filter((c) => c.text !== comment.text);

      cmtCount.innerText = comments.length;
      

      saveToLocalStorage();
    });

    // EDIT
    let editBtn = commentDiv.querySelector(".edit-comment");

    editBtn.addEventListener("click", () => {
      let textP = commentDiv.querySelector(".comment-text");

      let updatedText = prompt("Edit your comment", textP.innerText);

      if (updatedText !== null && updatedText.trim() !== "") {
        textP.innerText = updatedText;

        comment.text = updatedText;

        saveToLocalStorage();
      }
    });
  });

  // toggle comment box
  commentBtn.addEventListener("click", () => {
    cmtBox.classList.toggle("cmt-box-show");
  });

  // add comment
  cmtSent.addEventListener("click", () => {
    let value = cmtInput.value;
    if (value === "") return;


    let commentDiv = document.createElement("div");
    commentDiv.classList.add("cmts");

    commentDiv.innerHTML = `
    <div class="comment-top">
        <span class="comment-user">${currentUser}</span>

        <div class="comment-actions">
            <i class="fa-solid fa-pen edit-comment"></i>
            <i class="fa-solid fa-trash delete-comment"></i>
        </div>
    </div>

    <p class="comment-text">${value}</p>
`;

    cmtBox.appendChild(commentDiv);
    cmtInput.value = "";

    // DELETE COMMENT
    let deleteBtn = commentDiv.querySelector(".delete-comment");

    deleteBtn.addEventListener("click", () => {
      commentDiv.remove();

      comments = comments.filter((c) => c !== value);

      cmtCount.innerText = comments.length;

      saveToLocalStorage();
    });

    // EDIT COMMENT
    let editBtn = commentDiv.querySelector(".edit-comment");

    editBtn.addEventListener("click", () => {
      let textP = commentDiv.querySelector(".comment-text");

      let updatedText = prompt("Edit your comment", textP.innerText);

      if (updatedText !== null && updatedText.trim() !== "") {
        textP.innerText = updatedText;

        let index = comments.indexOf(value);

        if (index !== -1) {
          comments[index] = updatedText;
        }

        saveToLocalStorage();
      }
    });

    comments.push({
      user: currentUser,
      text: value,
    });
    cmtCount.innerText = comments.length;

    saveToLocalStorage();
  });

  // ================= DELETE =================
  card.querySelector(".delete-btn").addEventListener("click", () => {
    card.remove();
    saveToLocalStorage();
  });

  // ================= LIKE =================
  let likeBtn = card.querySelector(".like-btn");
  let countLike = card.querySelector(".countLike");

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("like-btn-yes");
    countLike.innerText = likeBtn.classList.contains("like-btn-yes") ? 1 : 0;
    saveToLocalStorage();
  });

  // ================= DISLIKE =================
  let disLike = card.querySelector(".dis-like");
  let countDislike = card.querySelector(".countDislike");

  disLike.addEventListener("click", () => {
    disLike.classList.toggle("like-btn-yes");
    countDislike.innerText = disLike.classList.contains("like-btn-yes") ? 1 : 0;
    saveToLocalStorage();
  });

  // ================= EDIT =================
  card.querySelector(".edit-btn").addEventListener("click", () => {
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
      data.tags.replaceAll("#", "").replaceAll(" ", ","),
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
