"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import Slider from "react-slick";
// styles
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CameraIcon from "public/ic-camera.png";
import Background from "public/wave-haikei.svg";
// types
import { SxStyle } from "../style/type";
import { sliderSettings } from "../constant/config";
const HomeSlider = () => {
  const sliderRef = useRef<Slider>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [useLocation, setUseLocation] = useState(false);

  const goNext = () => sliderRef?.current?.slickNext();
  const goBack = () => sliderRef?.current?.slickPrev();

  return (
    <Box sx={styles.container}>
      <Slider {...sliderSettings} ref={sliderRef}>
        <Box sx={styles.slideWrapper}>
          <Typography sx={styles.title}>이미지로 미용실 찾기</Typography>
          <Box
            sx={styles.imageUploadBox}
            onClick={() => inputRef?.current?.click()}
          >
            <Image className="camera-icon" src={CameraIcon} alt="camera-icon" />
            <Typography>원하는 헤어 이미지를 끌어놓으세요!</Typography>
          </Box>
          <input hidden ref={inputRef} type="file" />
          <Button sx={styles.button} onClick={goNext}>
            다음
          </Button>
        </Box>
        <Box sx={styles.slideWrapper}>
          <KeyboardBackspaceIcon
            className="left-arrow"
            fontSize="large"
            onClick={goBack}
          />
          <TextField
            InputProps={{ endAdornment: <SearchIcon /> }}
            autoComplete="off"
            placeholder="위치를 입력해주세요! ex) 서천동"
            disabled={useLocation}
          />
          <FormControlLabel
            control={
              <Checkbox
                value={useLocation}
                checked={useLocation}
                onClick={() => setUseLocation((prev) => !prev)}
              />
            }
            label="현위치로 찾기"
          />

          <Button sx={styles.button}>찾기</Button>
        </Box>
      </Slider>
    </Box>
  );
};

export default HomeSlider;

const styles: SxStyle = {
  container: {
    maxWidth: "444px",
    width: "100%",
    height: "100%",
    "& .slick-slider, .slick-list, .slick-track": { height: "100%" },
    "& .slick-track": {
      backgroundImage: `url(${Background.src})`,
      backgroundSize: "cover",
    },
    "& .slick-slide > div": { height: "100%" },
  },
  title: { position: "fixed", top: 40, fontSize: "1.5rem", fontFamily: "Jua" },
  slideWrapper: {
    display: "flex !important",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    "& .MuiInputBase-root": {
      width: "300px",
      bgcolor: "#f5f5f5",
      border: "1.5px solid #002233",
      borderRadius: "10px",
      "& *": { border: "none" },
    },
    "& .left-arrow": {
      position: "absolute",
      top: 20,
      left: 20,
      cursor: "pointer",
      fill: "#002233",
    },
    "& .MuiFormControlLabel-root": {
      marginLeft: "150px",
      "& span": { fontSize: "0.875rem" },
    },
  },
  imageUploadBox: {
    display: "flex",
    bgcolor: "#fff",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "200px",
    height: "200px",
    border: "1px solid var(--color-line-400)",
    borderRadius: "8px",
    cursor: "pointer",
    "& .camera-icon": { width: 50, height: 50, marginBottom: "20px" },
    "& p": { color: "var(--color-light-70)", fontSize: " 0.75rem" },
  },
  button: {
    position: "absolute",
    bottom: 20,
    width: "320px",
    height: "50px",
    color: "#002233",
    bgcolor: "#fff",
    fontSize: "1.125rem",
    "&:hover": { color: "#002233", bgcolor: "#fff" },
  },
};
