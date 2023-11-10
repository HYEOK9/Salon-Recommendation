import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
// styles
import { Box, Button, Typography } from "@mui/material";
import { SxStyle } from "../../style/type";
import CameraIcon from "public/ic-camera.png";
import { TFile, deleteSingleFile, setSingleFile } from "../../app.lib";
import { enqueueSnackbar } from "notistack";

interface UploadFileProps {
  goNext?: () => void;
}

const UploadFile = ({ goNext }: UploadFileProps) => {
  const [fileState, setFileState] = useState<TFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clickUpload = () => inputRef?.current?.click();

  const upLoadFile = (e: ChangeEvent<HTMLInputElement>) =>
    setSingleFile(e, fileState, setFileState);

  const deleteFile = () => {
    deleteSingleFile(fileState, setFileState);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <Typography sx={styles.title}>헤어 이미지로 미용실 찾기</Typography>
      <Box sx={styles.imageUploadBox} onClick={clickUpload}>
        {fileState ? (
          <Image src={fileState.url} alt="preview" fill objectFit="contain" />
        ) : (
          <>
            <Image className="camera-icon" src={CameraIcon} alt="camera-icon" />
            <Typography>원하는 헤어 이미지를 끌어놓으세요!</Typography>
          </>
        )}
      </Box>
      {fileState?.file && (
        <Button
          sx={styles.deleteButton}
          onClick={deleteFile}
          variant="outlined"
          color="error"
        >
          Delete
        </Button>
      )}
      <input
        ref={inputRef}
        onChange={upLoadFile}
        type="file"
        accept="image/*"
        hidden
      />
      <Button
        sx={styles.nextButton(!!fileState?.file)}
        onClick={() => {
          if (!fileState?.file) {
            enqueueSnackbar("파일을 업로드 해주세요!");
            return;
          }
          goNext?.();
        }}
      >
        다음 단계
      </Button>
    </>
  );
};

export default UploadFile;

const styles = {
  title: {
    position: "fixed",
    top: 40,
    fontSize: "1.5rem",
    fontFamily: "Jua",
    fontWeight: "400",
    color: "var(--color-primary)",
  },
  imageUploadBox: {
    display: "flex",
    bgcolor: "#fff",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "200px",
    height: "200px",
    position: "relative",
    border: "1.5px solid var(--color-line-400)",
    borderRadius: "8px",
    cursor: "pointer",
    "& .preview": {},
    "& .camera-icon": { width: 50, height: 50, marginBottom: "20px" },
    "& p": { color: "var(--color-light-70)", fontSize: " 0.75rem" },
  },
  deleteButton: { mt: "20px" },
  nextButton: (valid: boolean) => ({
    position: "absolute",
    bottom: 20,
    width: "320px",
    height: "50px",
    color: "var(--color-primary)",
    bgcolor: "#fff",
    fontSize: "1.125rem",
    "&:hover": { color: "var(--color-primary)", bgcolor: "#fff" },
  }),
} satisfies SxStyle;
