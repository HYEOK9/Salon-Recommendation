import { Box } from "@mui/material";
import HomeSlider from "../../components/HomeSlider";

export default function Home() {
  return (
    <Box sx={styles.container}>
      <HomeSlider />
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
};
