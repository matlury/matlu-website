import NextImage from "next/image";
import matluImage from "../images/matlu.png";
import loimuImage from "../images/loimu_varillinen.png";

interface ImageProps {
  imageName: string;
}

export const Image: React.FC<ImageProps> = ({ imageName }) => {
  const image = imageName === "matlu" ? matluImage : loimuImage;

  return (
    <NextImage
      src={image}
      alt={imageName}
      height={imageName === "matlu" ? 80 : 70}
      priority={imageName === "matlu"}
      style={{
        width: "auto",
        height: imageName === "matlu" ? "80px" : "70px",
      }}
    />
  );
};

export default Image;
