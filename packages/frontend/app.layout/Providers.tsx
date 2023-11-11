"use client";
import { SnackbarProvider } from "notistack";
import { Container, SxProps } from "@mui/material";
import { snackbarOptions } from "@/app.constant/config";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <SnackbarProvider {...snackbarOptions}>
      <Container disableGutters maxWidth="xs" sx={style}>
        {children}
      </Container>
    </SnackbarProvider>
  );
};

export default Providers;

const style: SxProps = {
  height: "100vh",
  overflow: "hidden",
};
