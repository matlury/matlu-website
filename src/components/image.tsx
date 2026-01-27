import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import {GatsbyImage, getImage, IGatsbyImageData} from "gatsby-plugin-image";

interface ImageProps {
  imageName: string;
}

type FileImage = {
  childImageSharp: {
    gatsbyImageData: IGatsbyImageData;
  } | null;
} | null;

interface ImageQuery {
  matluImage: FileImage;
  loimuImage: FileImage;
}

export const Image: React.FC<ImageProps> = ({imageName}) => {
  const data: ImageQuery = useStaticQuery(graphql`
  query {
    matluImage: file(relativePath: { eq: "matlu.png" }) {
        childImageSharp {
          gatsbyImageData(height: 80)
        }
      }
      loimuImage: file(relativePath: { eq: "loimu_varillinen.png" }) {
        childImageSharp {
          gatsbyImageData(height: 70)
        }
      }
  }
`);
const imageData = imageName === "matlu" ? data.matluImage : data.loimuImage;

  if (!imageData || !imageData.childImageSharp) {
    return <div>Image not found</div>;
  }

  const image = getImage(imageData.childImageSharp);

  if (!image) {
    return <div>Image not found</div>;
  }

  return <GatsbyImage image={image} alt={imageName} />;
  
};

export default Image;