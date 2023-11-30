import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import io, { type Socket } from "socket.io-client";
import { enqueueSnackbar } from "notistack";
// styles
import { Box, Button, Typography } from "@mui/material";
import type { SxStyle } from "@/style/type";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CameraIcon from "public/ic-camera.png";
// store
import { useSetRecoilState } from "recoil";
import { type TResult, resultAtom } from "@/app.store/resultAtom";
// lib
import { type TFile, deleteSingleFile, setSingleFile } from "@/lib";
// components
import ModalWithProgress from "../common/ModalWithProgress";

interface UploadFileProps {
  goBack?: () => void;
  place: string;
}

const UploadFile = ({ goBack, place }: UploadFileProps) => {
  const [fileState, setFileState] = useState<TFile | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [startApi, setStartApi] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [socketMessage, setSocketMessage] = useState("");

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const setResultState = useSetRecoilState(resultAtom);

  const finishApi = () => {
    setOpenModal(false);
    setStartApi(false);
    setSocketMessage("");
  };

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL as string, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("connect_error", () => {
      newSocket.disconnect();
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      finishApi();
    };
  }, []);

  useEffect(() => {
    if (!socket || !startApi || !fileState) return;

    try {
      setOpenModal(true);

      socket.emit("place", place || "curLocation");
      socket.emit("file", fileState.file);

      socket.on("fileReady", () => socket.emit("start"));
      socket.on("message", (message) => setSocketMessage(message));
      socket.on("data", (data: TResult[]) => {
        setResultState({ keyImage: fileState.url, result: data });
        router.push("/result");
        socket.disconnect();
      });

      socket.on("disconnect", () => {
        socket.disconnect();
        finishApi();
      });
    } catch (e) {
      console.log(e);
      socket.disconnect();
      finishApi();
      console.log("asdfasdf");
      enqueueSnackbar("서버와의 연결이 끊겼어요.", { variant: "error" });
    }
  }, [place, fileState, startApi, socket, setResultState, router]);

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
          } else if (!socket) {
            enqueueSnackbar("backend is not deployed", { variant: "warning" });
            return;
          }
          setStartApi(true);
        }}
      >
        찾기
      </Button>
      <ModalWithProgress
        open={openModal}
        onClose={finishApi}
        text={socketMessage}
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
