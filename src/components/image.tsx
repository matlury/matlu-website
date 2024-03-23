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
      placeholderImage: file(relativePath: { eq: "${imageName}" }) {
        childImageSharp {
          fluid(maxWidth: 160) {
            ...GatsbyImageSharpFluid
            presentationWidth
          }
        }
      }
    }
  `);
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
