import { SxProps } from "@mui/material";

export type SxStyle = Record<string, SxProps | ((param?: any) => SxProps)>;
