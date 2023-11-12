import axios from "axios";
import fs from "fs";
import type { Response } from "express";
import { TImage } from "../type";

export const isJSONString = (str: string) => {
  try {
    const obj = JSON.parse(str.replaceAll("'", '"'));
    return obj;
  } catch (error) {
    return null;
  }
};

export const downloadImgFromUrl = async (image: TImage, path: string) => {
  const response = await axios.get(image.src, { responseType: "arraybuffer" });

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  fs.writeFile(`${path}/${image.fileName}.png`, response.data, (err) => {
    if (err) throw err;
  });
};

export function createConnectionSSE(res: Response) {
  res.write(
    "data: " +
      JSON.stringify({
        data: {},
        message: "잠시만 기다려주세요",
        status: 200,
      }) +
      "\n\n"
  );
}

export function writeMessageSSE(res: Response, msg: string, data?: any) {
  console.log(msg);
  res.write(
    "data: " +
      JSON.stringify({ data: data || {}, message: msg, status: 200 }) +
      "\n\n"
  );
}

export function endConnectionSSE(res: Response, data: any) {
  res.write(
    "data: " +
      JSON.stringify({ data: data || {}, message: "완료", status: 200 }) +
      "\n\n"
  );
}
