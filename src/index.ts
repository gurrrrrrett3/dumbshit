import http from "http";
import express from "express";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let sockets: {
  [id: string]: {
    lastUrl: number;
    requests: number;
    uptime: number;
  };
};

let currentUrl: string =
  "https://media.discordapp.net/attachments/1114694800042623007/1158229199023259689/image.png?ex=651b7c7f&is=651a2aff&hm=eb6d69c909e559173a9636d0a333b59f6d816ef3e5f96138fdfa0bc7acbf0b62&=&width=1158&height=900";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/client/index.html"));
});

app.use(express.static("client"));
app.use("/client", express.static("client/dist/client/"));

io.on("connection", (socket) => {
  console.log("Connected to server");

  if (!sockets[socket.id]) {
    sockets[socket.id] = {
      lastUrl: Date.now(),
      requests: 1,
      uptime: 0,
    };
  }

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("url", (url: string) => {
    if (Date.now() - sockets[socket.id].lastUrl < 10000) {
      sockets[socket.id].requests++;
    } else {
      sockets[socket.id].requests = 1;
    }

    if (sockets[socket.id].requests > 10) {
      socket.emit("error", "Too many requests");
      console.log(`Rate limited ${socket.id}`);
      return;
    }

    console.log(`URL received: ${url}`);
    io.emit("url-send", url);
    currentUrl = url;
  });

  socket.emit("url-send", currentUrl);
});

server.listen(3038, () => {
  console.log("Listening on port 3000");
});
