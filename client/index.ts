import { Socket, io } from "socket.io-client";

const socket: Socket = io();
let mode: "upload" | "download" = (localStorage.getItem("mode") as "upload" | "download") || "upload";

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

window.addEventListener("keypress", (ev) => {
  if (ev.key === " ") {
    mode = mode === "upload" ? "download" : "upload";
    localStorage.setItem("mode", mode);
    window.location.reload();
  }
});

if (mode == "upload") {
  const urlInput = document.getElementById("url") as HTMLInputElement;
  const submitButton = document.getElementById("submit") as HTMLButtonElement;

  urlInput.removeAttribute("hidden");
  submitButton.removeAttribute("hidden");

  submitButton.addEventListener("click", (ev) => {
    const url = urlInput.value;
    socket.emit("url", url);

    ev.preventDefault();

    submitButton.innerText = "Sent!";

    setTimeout(() => {
      submitButton.innerText = "Submit";
    }, 1000);
  });
} else if (mode == "download") {
  const img = document.getElementById("dumbshit") as HTMLImageElement;
  img.removeAttribute("hidden");

  socket.on("url-send", (url: string) => {
    const img = document.getElementById("dumbshit") as HTMLImageElement;
    img.src = url;
  });
}
