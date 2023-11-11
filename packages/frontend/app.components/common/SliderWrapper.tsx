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
    borderRadius: "10px",
    boxShadow: 2,
    "& fieldset": { border: "none" },
    "&.Mui-disabled": {
      bgcolor: "var(--color-light-40)",
    },
  },
  "& .MuiFormControlLabel-root": {
    marginLeft: "200px",
    "& span": { color: "var(--color-primary)", fontSize: "0.875rem" },
  },
  "& *": { transition: "all 0.15s ease" },
};
