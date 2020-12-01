require("./styles.css");

function createElement(name, className, html = null) {
  const element = document.createElement(name);
  element.className = className;
  element.innerHTML = html;
  return element;
}

const getCommentsForPage = async (slug) => {
  const path = slug
    .split("/")
    .filter((s) => s)
    .join("/");

  const comments = await fetch(`/comments/${path}.json`);
  return comments.json();
};

const getCommentListItem = (comment) => {
  const li = createElement("li");
  li.className = "comment-list-item";

  const nameCont = createElement("div");
  const name = createElement("strong", "comment-author", comment.name);
  const date = createElement(
    "span",
    "comment-date",
    new Date(comment.createdAt).toLocaleDateString()
  );

  nameCont.append(name);
  nameCont.append(date);

  const commentCont = createElement("div", "comment-cont", comment.content);

  li.append(nameCont);
  li.append(commentCont);
  return li;
};

const createCommentForm = () => {
  const form = createElement("form");
  form.className = "comment-form";
  const nameInput = createElement("input", "name-input", null);
  nameInput.type = text;
  nameInput.placehoder = "Your Name";
  form.appendChild(nameInput);

  const commentInput = createElement("textarea", "comment-input", null);
  commentInput.placehoder = "Comment";
  form.appendChild(commentInput);

  const feedback = createElement("span", "feedback");
  form.appendChild(feedback);

  const button = createElement("button", "comment-btn", "Submit");
  button.type = "Submit";
  form.appendChild(button);

  return form;
};

const updateFeedback = (message = "", className) => {
  const feedback = document.querySelector(".feedback");
  feedback.className = `feedback ${className ? className : ""}`.trim();
  feedback.innerHTML = message;

  return feedback;
};

exports.onRouteUpdate = async ({ location, prevLocation }, pluginOptions) => {
  const commentContainer = document.getElementById("commentContainer");
  if (commentContainer && location.path !== "/") {
    const header = createElement("h2");
    header.innerHTML = "Comments";
    commentContainer.appendChild(header);

    const commentListUl = createElement("ul");
    commentListUl.className = "comment-list";
    commentContainer.appendChild(commentListUl);

    const comments = await getCommentsForPage(location.pathname);

    if (comments && comments.length) {
      comments.map((comment) => {
        const html = getCommentListItem(comment);
        commentListUl.append(html);
        return comment;
      });
    }

    commentContainer.appendChild(createCommentForm);
  }

  document
    .querySelector("body .comment-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      updateFeedback();
      const name = document.querySelector(".name-input").value;
      const comment = document.querySelector(".comment-input").value;

      if (!name) {
        return updateFeedback("Name is required");
      }
      if (!comment) {
        return updateFeedback("Comment is required");
      }
      updateFeedback("Saving comment...", "info");

      const button = document.querySelector(".comment-btn");
      button.disabled = true;

      const commentData = {
        name,
        content: comment,
        slug: location.pathname,
        website: pluginOptions.website,
      };

      fetch(
        "https://cors-anywhere.herokuapp.com/gatsbyjs-comment-server.herokuapp.com/comments",
        {
          body: JSON.stringify(commentData),
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then(async function (result) {
          const json = await result.json();
          button.disabled = false;

          if (!result.ok) {
            updateFeedback(json.error.msg, "error");
          } else {
            document.querySelector(".name-input").value = "";
            document.querySelector(".comment-input").value = "";
            updateFeedback("Comment has been saved!", "success");
          }
        })
        .catch(async (error) => {
          const errorText = await error.text();
          updateFeedback(errorText, "error");
        });
    });
};
