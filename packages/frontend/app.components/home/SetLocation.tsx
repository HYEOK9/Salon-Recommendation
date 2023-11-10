import { useState } from "react";
// styles
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { SxStyle } from "../../style/type";

interface SetLocationProps {
  goBack?: () => void;
}

const SetLocation = ({ goBack }: SetLocationProps) => {
  const [useLocation, setUseLocation] = useState(false);

  return (
    <>
      <KeyboardBackspaceIcon
        sx={styles.arrow}
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
    </>
  );
};

export default SetLocation;

const styles = {
  arrow: {
    position: "absolute",
    top: 20,
    left: 20,
    cursor: "pointer",
    fill: "var(--color-primary)",
  },
  button: {
    position: "absolute",
    bottom: 20,
    width: "320px",
    height: "50px",
    color: "var(--color-primary)",
    bgcolor: "var(--color-grayBackground)",
    fontSize: "1.125rem",
    "&:hover": {
      color: "var(--color-primary)",
      bgcolor: "var(--color-grayBackground)",
    },
  },
} satisfies SxStyle;
