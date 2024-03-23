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
    matluImage: file(relativePath: { eq: "matlu.png" }) {
      childImageSharp {
        fluid(maxWidth: 160) {
          ...GatsbyImageSharpFluid
          presentationWidth
        }
      }
    }
    loimuImage: file(relativePath: { eq: "loimu_varillinen.png" }) {
      childImageSharp {
        fluid(maxWidth: 160) {
          ...GatsbyImageSharpFluid
          presentationWidth
        }
      }
    }
  }
`);
let filteredData = null
if(imageName === "matlu") {
  filteredData = data.matluImage
} else {
  filteredData = data.loimuImage
  if(filteredData === null) {
    <div>Image not found</div>
  }
}
  return (
    <Img
    fluid={data.placeholderImage.childImageSharp.fluid}
    style={{
      maxWidth: data.placeholderImage.childImageSharp.fluid.presentationWidth,
    }}
  />
  );
};

export default Image;