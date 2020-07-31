const form = document.getElementById("editForm");

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
