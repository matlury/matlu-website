/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";

export const MatluImage: React.FC = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "matlu.png" }) {
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

export const LoimuImage: React.FC = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "loimu_varillinen.png" }) {
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

export default MatluImage;