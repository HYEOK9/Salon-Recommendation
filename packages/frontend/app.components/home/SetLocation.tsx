import { useState } from "react";
import { enqueueSnackbar } from "notistack";
// styles
import {
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SxStyle } from "../../style/type";

interface SetLocationProps {
  goNext?: () => void;
}

const SetLocation = ({ goNext }: SetLocationProps) => {
  const [place, setPlace] = useState("");
  const [useLocation, setUseLocation] = useState(false);

  return (
    <>
      <Typography sx={styles.title}>헤어 이미지로 미용실 찾기</Typography>

      <TextField
        value={place}
        onChange={({ target: { value } }) => setPlace(value)}
        InputProps={{ endAdornment: <SearchIcon fontSize="small" /> }}
        autoComplete="off"
        placeholder="어느 지역에서 찾을까요? ex)서천동"
        disabled={useLocation}
      />
      <FormControlLabel
        control={
          <Checkbox
            value={useLocation}
            checked={useLocation}
            onClick={() => {
              setPlace("");
              setUseLocation((prev) => !prev);
            }}
          />
        }
        label="현위치로 찾기"
      />

      <Button
        sx={styles.nextButton(place.trim() !== "" || useLocation)}
        onClick={() => {
          if (!place && !useLocation) {
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
    top: 40,
    fontSize: "1.5rem",
    fontFamily: "Jua",
    fontWeight: "400",
    color: "var(--color-primary)",
  },
  nextButton: (valid: boolean) => ({
    position: "absolute",
    bottom: 20,
    width: "320px",
    height: "50px",
    color: valid ? "var(--color-primary)" : "var(--color-light-50)",
    bgcolor: "var(--color-grayBackground)",
    fontSize: "1.125rem",
    "&:hover": {
      color: valid ? "var(--color-primary)" : "var(--color-light-50)",
      bgcolor: "var(--color-grayBackground)",
    },
  }),
} satisfies SxStyle;
