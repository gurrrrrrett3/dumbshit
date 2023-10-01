import http from "http";
import express from "express";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let currentUrl: string = "https://media.discordapp.net/attachments/1157910592749846599/1157918483313594388/20211004_142225.png?ex=651a5b1f&is=6519099f&hm=01bc56739cc919f5a12598d99881b7cf9c47f3719340fc06db91ac4712635187&=";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/client/index.html"));
});

app.use(express.static("client"));
app.use("/client", express.static("client/dist/client/"));

io.on("connection", (socket) => {
  console.log("Connected to server");

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("url", (url: string) => {
    console.log(`URL received: ${url}`);
    io.emit("url-send", url);
    currentUrl = url;
  });

  socket.emit("url-send", currentUrl);
});

server.listen(3038, () => {
  console.log("Listening on port 3000");
});
