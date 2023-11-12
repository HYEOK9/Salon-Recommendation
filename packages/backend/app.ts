import express from "express";
import cors from "cors";
import { run } from "./main";

const PORT = 3001;

const app = express();

app.use(
  cors({
    origin: process.env.API_BASE_URL,
    credentials: true,
  })
);

app.get("/api/result/:place", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    charset: "UTF-8",
    "Transfer-Encoding": "chunked",
    "X-Accel-Buffering": "no",
  });

  await run(req.params.place, res);
  res.send("finish");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
