import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { enqueueSnackbar } from "notistack";

export type TFile = { file: Blob; url: string };

const acceptableExt = ["jpg", "jpeg", "png"];

const checkAcceptableExt = (fileName: string, acceptableArr: string[]) => {
  const fileExtIdx = fileName.lastIndexOf(".");
  const fileExt = fileName.slice(fileExtIdx + 1).toLowerCase();

  return acceptableArr.some((acceptable) => fileExt === acceptable);
};

export const setSingleFile = (
  event: ChangeEvent<HTMLInputElement>,
  fileState: TFile | null,
  setFileState: Dispatch<SetStateAction<TFile | null>>
) => {
  event.preventDefault();
  const { target } = event;

  if (!target.files) return;

  const file = target.files[0];

  if (checkAcceptableExt(file.name, acceptableExt)) {
    const url = URL.createObjectURL(file);
    if (fileState) URL.revokeObjectURL(fileState.url);
    setFileState({ file, url });
  } else {
    enqueueSnackbar(`${acceptableExt.join(", ")}파일만 가능합니다!`, {
      variant: "error",
    });
  }
};

export const deleteSingleFile = (
  fileState: TFile | null,
  setFileState: Dispatch<SetStateAction<TFile | null>>
) => {
  if (fileState) URL.revokeObjectURL(fileState.url);
  setFileState(null);
};
