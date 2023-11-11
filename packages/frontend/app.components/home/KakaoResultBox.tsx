import { Box, Typography } from "@mui/material";
import { SxStyle } from "../../style/type";

interface KakaoResultBoxProps {
  result: any[];
  selectPlace: (place:string)=>void
}
const KakaoResultBox = ({ result, selectPlace }: KakaoResultBoxProps) => {
  return (
    <Box sx={styles.container}>
      {!result.length ? (
        <Typography className="empty">검색 결과가 없습니다.</Typography>
      ) : (
        result.map(({ x, address_name }) => (
          <Box key={x} className="item" onClick={() => selectPlace(address_name)}>
            <Typography className="address">{address_name}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default KakaoResultBox;

const styles = {
  container: {
    display: "flex",
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: "100px",
    overflowY: "scroll",
    top: 62,
    left: 0,
    bgcolor: "#fff",
    width: "100%",
    zIndex: 3,
    borderRadius: "5px",
    "& .empty": {
      py: "12px",
      color: "var(--color-light-70)",
      fontSize: "0.875rem",
    },
    "& .item": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      py: "12px",
      width: "98%",
      cursor: "pointer",
      "&:not(:last-child)": {
        borderBottom: "1px solid var(--color-borderColor)",
      },
    },
    "& .address": { color: "var(--color-dark-40)" },
  },
} satisfies SxStyle;
