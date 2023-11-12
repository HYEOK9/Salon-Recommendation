import express from "express";
import cors from "cors";
import http from "http";
import socketIO from "socket.io";
import { run } from "./main";

const PORT = 3001;
const corsOption = { origin: process.env.CLIENT_BASE_URL, credentials: true };

const app = express().use(cors(corsOption));
const server = http.createServer(app);

const io = new socketIO.Server(server, { cors: corsOption });

io.on("connection", (socket) => {
  let place = "";
  let file: any;
  try {
    socket.on("place", (data: string) => (place = data));

    socket.on("file", (data: Blob) => (file = data));

    socket.on("start", async () => {
      if (place === "" || !file) throw new Error("file or place doesn't exist");

      await run(place, file, socket);
      socket.emit("finish");
    });
  } catch (e) {
    console.log(e);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}...`);
});
