import { TImage } from "./type";
import type { Options } from "python-shell";

export const pythonShellDefaultOptions: Options = {
  mode: "text",
  pythonPath: "python3",
  pythonOptions: ["-u"],
  scriptPath: "../models/pytorch-hair-segmentation",
};

// keyPicDic에 비교할 이미지의 경로 필요
export const GetBestCosSimWithDirArgs = (
  GPU: boolean = true,
  keyPicDir = "../../data/test.jpeg",
  imgArray: TImage[]
) => ({
  args: [
    "--networks",
    "pspnet_resnet101",
    "--ckpt_dir",
    "../../pspnet_resnet101_sgd_lr_0.002_epoch_100_test_iou_0.918.pth",
    "--key_img_dir",
    keyPicDir,
    "--img_src_array",
    JSON.stringify(imgArray),
    "--use_gpu",
    GPU ? "True" : "False",
  ],
});
