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
  try {
    const response = await fetch(image.src);
    const buffer = await response.arrayBuffer();

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    fs.writeFile(
      `${path}/${image.fileName}.png`,
      Buffer.from(buffer),
      (err) => {
        if (err) throw err;
      }
    );
  } catch (e) {
    console.log(e);
  }
};

export const downloadImgFromBuffer = async (
  buffer: ArrayBuffer,
  fileName: string,
  path: string
) => {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    fs.writeFile(`${path}/${fileName}.png`, Buffer.from(buffer), (err) => {
      if (err) throw err;
    });
  } catch (e) {
    console.log(e);
  }
};

export const getNow = () => {
  const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
  const d = new Date();

  const date = new Date(d.getTime() + TIME_ZONE).toISOString().split("T")[0];
  const time = d.toTimeString().split(" ")[0];

  return date + " " + time;
};
