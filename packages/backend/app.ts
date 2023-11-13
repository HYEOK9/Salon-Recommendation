import express from "express";
import cors from "cors";
import http from "http";
import socketIO from "socket.io";
import { run } from "./main";
import { downloadImgFromBuffer, downloadImgFromUrl, getNow } from "./util";

const PORT = 3001;
const corsOption = { origin: process.env.CLIENT_BASE_URL, credentials: true };

const app = express().use(cors(corsOption));
const server = http.createServer(app);

const io = new socketIO.Server(server, { cors: corsOption });

io.on("connection", (socket) => {
  let place = "";
  let date = getNow();
  let uploadDir = `../../userImage/${date}`;

  try {
    socket.on("place", (data: string) => (place = data));

    socket.on("file", async (data: Buffer) => {
      await downloadImgFromBuffer(data, "keyImage", uploadDir);
      socket.emit("fileReady", true);
    });

    socket.on("start", async () => {
      await run(place, uploadDir, socket);
      socket.emit("finish");
    });
  } catch (e) {
    console.log(e);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}...`);
});
