import { ChangeEvent, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { SxStyle } from "@/style/type";
// api
import { kakaoAxios } from "@/lib";
import { GET_KAKAO_ADDRESS } from "@/app.endpoint";
// components
import KakaoResultBox from "@/app.components/common/KakaoResultBox";
import Logo from "@/app.components/common/Logo";

interface SetLocationProps {
  goNext?: () => void;
  place: string;
  setPlace: React.Dispatch<React.SetStateAction<string>>;
}

const SetLocation = ({ goNext, place, setPlace }: SetLocationProps) => {
  const [text, setText] = useState("");
  const [responseArray, setResponseArray] = useState([]);
  const [useLocation, setUseLocation] = useState(false);

  const canGoNext = place !== "" || useLocation;

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setText(value);
    if (!value.trim()) return;

    const {
      data: { documents },
    } = await kakaoAxios.get(GET_KAKAO_ADDRESS({ query: value }));
    setResponseArray(documents);
  };

  const clearValues = () => {
    setText("");
    setPlace("");
  };

  const selectPlace = (place: string) => {
    setText("");
    setPlace(place);
    setResponseArray([]);
  };

  const useCurLocation = () => {
    clearValues();
    setUseLocation((prev) => !prev);
  };

  useEffect(() => {
    if (place && text) setPlace("");
  }, [text, place, setPlace]);

  return (
    <>
      <Logo fixed top={20} left={380} />
      <Typography sx={styles.title}>헤어 이미지로 미용실 찾기</Typography>

      <Box position="relative">
        <TextField
          value={place || text}
          onChange={onChange}
          InputProps={{
            endAdornment:
              text || place ? (
                <HighlightOffIcon sx={styles.clear} onClick={clearValues} />
              ) : (
                <SearchIcon fontSize="small" />
              ),
          }}
          autoComplete="off"
          placeholder="어느 지역에서 찾을까요? ex)서천동"
          disabled={useLocation}
        />
        {text && (
          <KakaoResultBox
            result={responseArray}
            selectPlace={selectPlace}
            top={60}
          />
        )}
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            value={useLocation}
            checked={useLocation}
            onClick={useCurLocation}
          />
        }
        label="현위치 사용"
      />

      <Button
        sx={styles.nextButton(canGoNext)}
        onClick={() => {
          if (!canGoNext) {
            enqueueSnackbar("위치를 선택해주세요!");
            return;
          }
          goNext?.();
        }}
      >
        다음
      </Button>
    </>
  );
};

export default SetLocation;

const styles = {
  title: {
    position: "fixed",
    top: 180,
    fontSize: "1.75rem",
    fontFamily: "Jua",
    color: "var(--color-primary)",
  },
  clear: {
    cursor: "pointer",
    fill: "var(--color-light-70)",
    "&:active": {
      transform: "translateY(1px)",
    },
  },
  nextButton: (valid: boolean) => ({
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
      transform: "translateY(1px)",
    },
  }),
} satisfies SxStyle;
