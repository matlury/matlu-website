import NextImage from "next/image";
import matluImage from "../images/matlu.png";
import loimuImage from "../images/loimu_varillinen.png";

interface ImageProps {
  imageName: string;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({ imageName, className }) => {
  const image = imageName === "matlu" ? matluImage : loimuImage;

  return (
    <NextImage
      src={image}
      alt={imageName}
      height={imageName === "matlu" ? 80 : 70}
      priority={imageName === "matlu"}
      className={className}
      style={{
        width: "auto",
        height: className ? undefined : (imageName === "matlu" ? "80px" : "70px"),
      }}
    />
  );
};

export default Image;
