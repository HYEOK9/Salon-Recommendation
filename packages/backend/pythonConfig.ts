import { TImage } from "./type";
import type { Options } from "python-shell";

export const pythonShellDefaultOptions: Options = {
  mode: "text",
  pythonPath: "python3",
  pythonOptions: ["-u"],
  scriptPath: "../models/pytorch-hair-segmentation",
};

export const RunWithSrcArrayArgs = (
  GPU: boolean = true,
  imgArray: TImage[]
) => ({
  args: [
    "--networks",
    "pspnet_resnet101",
    "--ckpt_dir",
    "../../pspnet_resnet101_sgd_lr_0.002_epoch_100_test_iou_0.918.pth",
    "--img_src_array",
    JSON.stringify(imgArray),
    "--save_dir",
    "../pytorch-hair-segmentation/result",
    "--use_gpu",
    GPU ? "True" : "False",
  ],
});

export const GetBestCosSimArgs = (
  GPU: boolean = true,
  keyPicDir = "../models/pytorch-hair-segmentation/data/0.jpeg",
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
    "--save_dir",
    "../models/pytorch-hair-segmentation/result",
    "--use_gpu",
    GPU ? "True" : "False",
  ],
});
