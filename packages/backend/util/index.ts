import axios from "axios";
import fs from "fs";
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
