import NextImage from "next/image";
import loimuImage from "../images/loimu_varillinen.png";

interface ImageProps {
  imageName: string;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({ imageName, className }) => {
  if (imageName === "matlu") {
    return (
      <NextImage
        src="/logos/matlu-optimized.png"
        alt="matlu"
        width={375}
        height={187}
        priority
        className={className}
        style={{
          width: "auto",
          height: className ? undefined : "80px",
        }}
      />
    );
  }

  return (
    <NextImage
      src={loimuImage}
      alt={imageName}
      height={70}
      className={className}
      style={{
        width: "auto",
        height: className ? undefined : "70px",
      }}
    />
  );
};

export default Image;
