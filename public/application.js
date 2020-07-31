const form = document.getElementById("editForm");
const newForm = document.getElementById("newForm");
const createRoom = document.getElementById("createRoom");
const input = document.getElementById("word");
const inputRoom = document.getElementById("exampleInputEmail1");
const inputLink = document.getElementById("exampleInputPassword1");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = e.target.roomName.id;
  // console.log("hello");
  const resp = await fetch(`/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomName: e.target.roomName.value,
      link: e.target.link.value,
    }),
  });
  const result = await resp.json();
  if (result.message) {
    window.location = "/rooms";
  } else {
    window.location = "/";
  }
});

document.addEventListener("click", async (event) => {
  if (event.target.name === "delete") {
    try {
      event.preventDefault();
      const id = event.target.title.id;
      const response = await fetch(event.target.href, { method: "DELETE" });
      if (response.status === 200) window.location.href = "/rooms";
    } catch (err) {
      console.log(err);
    }
  }
});

newForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    console.log(input.value);
    console.log("ss");
    const resp = await (
      await fetch(`/get/smth`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ word: input.value }),
      })
    ).json();
  } catch (e) {
    console.error(e.message);
  }
});

createRoom.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const resp = await fetch("/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        roomName: inputRoom.value,
        link: inputLink.value,
      }),
    }).json();
  } catch (e) {
    console.error(e.message);
  }
});
