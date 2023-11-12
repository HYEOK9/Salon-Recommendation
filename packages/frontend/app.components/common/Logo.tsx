import Image from "next/image";
import HairIcon from "@/public/favicon.ico";

interface LogoProps {
  fixed?: boolean;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}
const Logo = ({
  fixed = false,
  top = 0,
  left = 0,
  width = 40,
  height = 40,
}: LogoProps) => {
  return (
    <Image
      src={HairIcon}
      alt="logo"
      width={width}
      height={height}
      style={{
        ...(fixed && { position: "fixed", top, left }),
      }}
    />
  );
};

export default Logo;
