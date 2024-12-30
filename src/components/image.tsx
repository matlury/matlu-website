/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import {GatsbyImage, getImage} from "gatsby-plugin-image";

interface ImageProps {
  imageName: string;
}

export const Image: React.FC<ImageProps> = ({imageName}) => {
  const data = useStaticQuery(graphql`
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