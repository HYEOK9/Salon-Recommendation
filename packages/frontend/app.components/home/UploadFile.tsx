import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { enqueueSnackbar } from "notistack";
// styles
import { Box, Button, Typography } from "@mui/material";
import { SxStyle } from "@/style/type";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CameraIcon from "public/ic-camera.png";
// lib
import { type TFile, deleteSingleFile, setSingleFile } from "@/lib";
import { GET_RESULT, GetResultResponse } from "@/app.endpoint";
// components
import ModalWithProgress from "../common/ModalWithProgress";

interface UploadFileProps {
  goBack?: () => void;
  place: string;
}

const UploadFile = ({ goBack, place }: UploadFileProps) => {
  const [fileState, setFileState] = useState<TFile | null>(null);
  const [startApi, setStartApi] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const SSE = useRef<EventSource>();

  const [apiState, setApiState] = useState({
    data: null,
    message: "",
    status: 200,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const unSubscribe = () => {
    SSE.current?.close();
    setOpenModal(false);
    setStartApi(false);
  };

  useEffect(() => {
    if (!startApi) return;

    try {
      SSE.current = new EventSource(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${GET_RESULT(
          place || "curLocation"
        )}`,
        {
          withCredentials: true,
        }
      );

      if (!SSE.current) return;

      setOpenModal(true);

      SSE.current.onmessage = async (event) => {
        const res = JSON.parse(await event.data) as GetResultResponse;
        setApiState({
          data: res.data,
          message: res.message,
          status: res.status,
        });
      };

      SSE.current.onerror = async (event) => {
        console.log(event);
        SSE.current?.close();
        setStartApi(false);
        setOpenModal(false);
      };
    } catch (e) {
      console.log(e);
      setStartApi(false);
      setOpenModal(false);
    }

    return () => SSE.current?.close();
  }, [place, startApi]);

  return (
    <>
      <KeyboardBackspaceIcon
        sx={styles.arrow}
        fontSize="large"
        onClick={goBack}
      />

      <Box
        sx={styles.imageUploadBox}
        onClick={() => inputRef?.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          setSingleFile(e, fileState, setFileState);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        {fileState ? (
          <Image
            src={fileState.url}
            alt="preview"
            fill
            objectFit="contain"
            priority
          />
        ) : (
          <>
            <Image
              className="camera-icon"
              src={CameraIcon}
              alt="camera-icon"
              priority
            />
            <Typography>원하는 헤어 이미지를 끌어놓으세요!</Typography>
          </>
        )}
      </Box>
      {fileState?.file && (
        <Button
          sx={styles.deleteButton}
          onClick={() => {
            deleteSingleFile(fileState, setFileState);
            if (inputRef.current) inputRef.current.value = "";
          }}
          variant="outlined"
          color="error"
        >
          Delete
        </Button>
      )}
      <input
        ref={inputRef}
        onChange={(e) => setSingleFile(e, fileState, setFileState)}
        type="file"
        accept="image/*"
        hidden
      />
      <Button
        sx={styles.submitButton(!!fileState?.file)}
        onClick={() => {
          if (!fileState?.file) {
            enqueueSnackbar("파일을 업로드 해주세요!");
            return;
          }
          enqueueSnackbar("backend is not deployed", { variant: "warning" });
          setStartApi(true);
        }}
      >
        찾기
      </Button>
      <ModalWithProgress
        open={openModal}
        setOpen={setOpenModal}
        onClose={unSubscribe}
        text={apiState.message}
      />
    </>
  );
};

export default UploadFile;

const styles = {
  arrow: {
    position: "absolute",
    top: 20,
    left: 20,
    cursor: "pointer",
    fill: "var(--color-primary)",
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
    boxShadow: 3,
    borderRadius: "8px",
    cursor: "pointer",
    "& .camera-icon": { width: 50, height: 50, marginBottom: "20px" },
    "& p": { color: "var(--color-light-70)", fontSize: " 0.75rem" },
  },
  deleteButton: { mt: "20px" },
  submitButton: (valid: boolean) => ({
    position: "absolute",
    bottom: 80,
    width: "320px",
    height: "50px",
    color: valid ? "var(--color-textPrimary)" : "var(--color-light-40)",
    bgcolor: valid ? "var(--color-grayBackground)" : "var(--color-light-50)",
    fontSize: "1.125rem",
    fontWeight: 600,
    "&:hover": {
      color: valid ? "var(--color-textPrimary)" : "var(--color-light-40)",
      bgcolor: valid ? "var(--color-grayBackground)" : "var(--color-light-50)",
    },
    "&:active": {
      transform: "translateY(2px)",
    },
  }),
} satisfies SxStyle;
