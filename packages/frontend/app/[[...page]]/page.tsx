import { Box } from "@mui/material";
import { SxStyle } from "../../style/type";
import HomePage from "../../app.components/home";

export default function Home() {
  return (
    <Box sx={styles.container}>
      <HomePage />
    </Box>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
} satisfies SxStyle;
