/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";

interface ImageProps {
  imageName: string;
}

export const Image: React.FC<ImageProps> = ({imageName}) => {
  const data = useStaticQuery(graphql`
  query {
    matluImage: file(relativePath: { eq: "images/matlu.png" }) {
      childImageSharp {
        fluid(maxWidth: 160, quality: 100) {
          ...GatsbyImageSharpFluid
          presentationWidth
        }
      }
    }
    loimuImage: file(relativePath: { eq: "images/loimu_varillinen.png" }) {
      childImageSharp {
        fluid(maxWidth: 160, quality: 100) {
          ...GatsbyImageSharpFluid
          presentationWidth
        }
      }
    }
  }
`);
let filteredData = data.matluImage
if(imageName === "matlu") {
  filteredData = data.matluImage
} else {
  filteredData = data.loimuImage
  if(filteredData === null) {
    return <div>Image not found</div>
  }
}
  return (
    <Img
    fluid={filteredData.childImageSharp.fluid}
    style={{
      maxWidth: filteredData.childImageSharp.fluid.presentationWidth,
    }}
  />
  );
};

export default Image;