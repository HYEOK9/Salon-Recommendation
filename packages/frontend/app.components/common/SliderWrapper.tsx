import { Box } from "@mui/material";

interface SlideWrapperProps {
  children: React.ReactNode;
}

const SlideWrapper = ({ children }: SlideWrapperProps) => {
  return <Box sx={style}>{children}</Box>;
};

export default SlideWrapper;

const style = {
  display: "flex !important",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  "& .MuiInputBase-root": {
    width: "300px",
    bgcolor: "#fff",
    border: "1px solid var(--color-primary)",
    borderRadius: "10px",
    "& fieldset": { border: "none" },
    "&.Mui-disabled": { bgcolor: "var(--color-light-50)" },
  },

  "& .MuiFormControlLabel-root": {
    marginLeft: "150px",
    "& span": { fontSize: "0.875rem" },
  },
};
