"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Slider from "react-slick";
import { useSetRecoilState } from "recoil";
// styles
import { Box } from "@mui/material";
import Background from "public/wave-haikei.svg";
import { SxStyle } from "@/style/type";
// constants
import { sliderSettings } from "@/app.constant/config";
// store
import { resultAtom } from "@/app.store/resultAtom";
// components
import SlideWrapper from "@/app.components/common/SliderWrapper";
import UploadFile from "./UploadFile";
import SetLocation from "./SetLocation";

const HomePage = () => {
  const sliderRef = useRef<Slider>(null);

  const goNext = useCallback(() => sliderRef?.current?.slickNext(), []);
  const goBack = useCallback(() => sliderRef?.current?.slickPrev(), []);

  const [place, setPlace] = useState("");
  const setResultState = useSetRecoilState(resultAtom);

  useEffect(() => {
    setResultState(null);
  }, [setResultState]);

  return (
    <Box sx={styles.container}>
      <Slider {...sliderSettings} ref={sliderRef}>
        <SlideWrapper>
          <SetLocation goNext={goNext} place={place} setPlace={setPlace} />
        </SlideWrapper>

        <SlideWrapper>
          <UploadFile goBack={goBack} place={place} />
        </SlideWrapper>
      </Slider>
    </Box>
  );
};

export default HomePage;

const styles = {
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
} satisfies SxStyle;
