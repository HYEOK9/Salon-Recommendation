import { TImage } from "./constant";

export const RunWithSrcPythonShellOption = (
  GPU: boolean = true,
  imgObj: TImage
) => ({
  mode: "text" as const,
  pythonPath: "python3",
  pythonOptions: ["-u"],
  scriptPath: "../pytorch-hair-segmentation",
  args: [
    "--networks",
    "pspnet_resnet101",
    "--ckpt_dir",
    "../pytorch-hair-segmentation/models/pspnet_resnet101_sgd_lr_0.002_epoch_100_test_iou_0.918.pth",
    "--img_obj",
    JSON.stringify(imgObj),
    "--save_dir",
    "../pytorch-hair-segmentation/result",
    "--use_gpu",
    GPU ? "True" : "False",
  ],
});

export const RunWithSrcArrayPythonShellOption = (
  GPU: boolean = true,
  imgArray: TImage[]
) => ({
  mode: "text" as const,
  pythonPath: "python3",
  pythonOptions: ["-u"],
  scriptPath: "../pytorch-hair-segmentation",
  args: [
    "--networks",
    "pspnet_resnet101",
    "--ckpt_dir",
    "../pytorch-hair-segmentation/models/pspnet_resnet101_sgd_lr_0.002_epoch_100_test_iou_0.918.pth",
    "--img_src_array",
    JSON.stringify(imgArray),
    "--save_dir",
    "../pytorch-hair-segmentation/result",
    "--use_gpu",
    GPU ? "True" : "False",
  ],
});

export const GetBestCosSimPythonShellOption = (
  GPU: boolean = true,
  keyPicDir = "../pytorch-hair-segmentation/data/0.jpeg",
  imgArray: TImage[]
) => ({
  mode: "text" as const,
  pythonPath: "python3",
  pythonOptions: ["-u"],
  scriptPath: "../pytorch-hair-segmentation",
  args: [
    "--networks",
    "pspnet_resnet101",
    "--ckpt_dir",
    "../pytorch-hair-segmentation/models/pspnet_resnet101_sgd_lr_0.002_epoch_100_test_iou_0.918.pth",
    "--key_img_dir",
    keyPicDir,
    "--img_src_array",
    JSON.stringify(imgArray),
    "--save_dir",
    "../pytorch-hair-segmentation/result",
    "--use_gpu",
    GPU ? "True" : "False",
  ],
});

export const RunWithFilePathPythonShellOption = (
  GPU: boolean = true,
  filePath: string = "../pytorch-hair-segmentation/data",
  savePath: string = "../pytorch-hair-segmentation/result"
) => ({
  mode: "text" as const,
  pythonPath: "python3",
  pythonOptions: ["-u"],
  scriptPath: "../pytorch-hair-segmentation",
  args: [
    "--networks",
    "pspnet_resnet101",
    "--ckpt_dir",
    "../pytorch-hair-segmentation/models/pspnet_resnet101_sgd_lr_0.002_epoch_100_test_iou_0.918.pth",
    "--img_src_array",
    filePath,
    "--save_dir",
    savePath,
    "--use_gpu",
    GPU ? "True" : "False",
  ],
  encoding: "utf8",
});
