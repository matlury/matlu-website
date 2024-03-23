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
    file(filter: {relativePath: {in: ["matlu.png","loimu_varillinen.png"] }}) {
      edges {
        node {
          id
          fluid(maxWidth: 200, maxHeight: 200) {
              ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`);
let filteredData = data
if(imageName === "matlu") {
  filteredData = data.file.find(image => image.src.includes("matlu.png"))
} else {
  filteredData = data.file.find(image => image.src.includes("loimu_varillinen.png"))
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