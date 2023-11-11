"use client";
import { useCallback, useRef } from "react";
import Slider from "react-slick";
// styles
import { Box } from "@mui/material";
import Background from "public/wave-haikei.svg";
import { SxStyle } from "@/style/type";
// constants
import { sliderSettings } from "@/app.constant/config";
// components
import SlideWrapper from "@/app.components/common/SliderWrapper";
import UploadFile from "./UploadFile";
import SetLocation from "./SetLocation";

const HomePage = () => {
  const sliderRef = useRef<Slider>(null);

  const goNext = useCallback(() => sliderRef?.current?.slickNext(), []);
  const goBack = useCallback(() => sliderRef?.current?.slickPrev(), []);

  return (
    <Box sx={styles.container}>
      <Slider {...sliderSettings} ref={sliderRef}>
        <SlideWrapper>
          <SetLocation goNext={goNext} />
        </SlideWrapper>

        <SlideWrapper>
          <UploadFile goBack={goBack} />
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
