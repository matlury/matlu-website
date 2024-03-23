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
      placeholderImage: file(relativePath: {filter: { name: { in: ["matlu.png","loimu_varillinen.png"] }}}) {
        childImageSharp {
          fluid(maxWidth: 160) {
            ...GatsbyImageSharpFluid
            presentationWidth
          }
        }
      }
    }
  `);
  let filteredData = data
  if(imageName === "matlu") {
    filteredData = data.placeholderImage.find((image: any) => image.relativePath === "matlu.png")
  } else {
    filteredData = data.placeholderImage.find((image: any) => image.relativePath === "loimu_varillinen.png")
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