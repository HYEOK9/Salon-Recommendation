"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// style
import { Box, Typography } from "@mui/material";
import type { SxStyle } from "@/style/type";
// store
import { useRecoilValue } from "recoil";
import { resultAtom } from "@/app.store/resultAtom";

export default function ResultPage() {
  const resultState = useRecoilValue(resultAtom);

  useEffect(() => {
    if (resultState?.keyImage)
      return () => URL.revokeObjectURL(resultState.keyImage);
  }, [resultState]);

  if (!resultState) return null;

  return (
    <Box sx={styles.container}>
      <Image
        className="key-image"
        src={resultState.keyImage}
        alt="key-image"
        width={100}
        height={150}
      />
      <Typography className="title">
        해당 이미지로 비교한 결과 입니다!
      </Typography>

      <Box className="resultWrapper">
        {resultState.result.map(({ src, fileName, salonLink }) => (
          <Box className="resultItem" key={src}>
            <Typography className="shopName">
              {fileName.split("-")[0]}
            </Typography>
            <Image
              src={src}
              alt="result-image"
              width={100}
              height={150}
              onClick={() => window.open(salonLink)}
            />
          </Box>
        ))}
      </Box>

      <Link href="/" style={styles.button}>
        홈으로
      </Link>
    </Box>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    bgcolor: "var(--color-grayBackground)",
    overflow: "scroll",
    p: "20px",
    "& *": { fontFamily: "Jua" },
    "& img": {
      width: "100px",
      height: "auto",
      maxHeight: "150px",
      cursor: "pointer",
    },
    "& .key-image": { marginTop: "50px" },
    "& .title": { fontSize: "1rem", p: "10px 0 20px 0" },
    "& .resultWrapper": {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
    },
    "& .shopName": { fontSize: "1.125rem" },
    "& .resultItem": {
      textAlign: "center",
      m: "5px",
      "& p": { fontSize: "0.875rem" },
    },
  },
  image: { width: "200px", height: "100px" },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    width: "320px",
    height: "50px",
    color: "var(--color-grayBackground)",
    backgroundColor: "var(--color-primary)",
    fontSize: "1.125rem",
    fontWeight: 600,
    "&:hover": {
      color: "var(--color-grayBackground)",
      backgroundColor: "var(--color-primary)",
    },
    "&:active": {
      transform: "translateY(2px)",
    },
  },
} satisfies SxStyle;
