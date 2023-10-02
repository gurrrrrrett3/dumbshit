import http from "http";
import express from "express";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let currentUrl: string = "https://media.discordapp.net/attachments/1114694800042623007/1158229199023259689/image.png?ex=651b7c7f&is=651a2aff&hm=eb6d69c909e559173a9636d0a333b59f6d816ef3e5f96138fdfa0bc7acbf0b62&=&width=1158&height=900";

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
