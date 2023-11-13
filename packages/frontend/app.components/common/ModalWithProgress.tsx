import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { SxStyle } from "@/style/type";
import { Button } from "@mui/material";

interface ModalWithProgressProps {
  open: boolean;
  text?: string;
  onClose?: () => void;
}

const ModalWithProgress = ({ open, text, onClose }: ModalWithProgressProps) => {
  return (
    <Box>
      <Modal open={open} onClose={onClose}>
        <Box sx={styles.container}>
          <CircularProgress size={30} />
          <Typography>{text}</Typography>
          {onClose && <Button onClick={onClose}>취소</Button>}
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalWithProgress;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "var(--color-grayBackground)",
    border: "1px solid var(--color-borderColor)",
    boxShadow: 24,
    padding: "30px 0 5px 0",
    "& p": { mt: "15px", color: "var(--color-dark-40)", fontSize: "0.875rem" },
  },
} satisfies SxStyle;
