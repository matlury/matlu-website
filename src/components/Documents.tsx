/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Language } from "../utils";
import styles from "./Documents.module.scss";

interface Document {
  node: {
    title: {
      fi: string;
      en: string;
    };
    ordering: number;
    file: {
      publicURL: string;
    };
  };
}

interface Props {
  language: Language;
}

export const MatluDocuments: React.FC<Props> = ({ language }) => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      allStrapiDocument {
        edges {
          node {
            id
            title {
              fi
              en
            }
            file {
              publicURL
            }
          }
        }
      }
    }
  `);
  const documents: Document[] = data.allStrapiDocument.edges;
  return (
    <ul className={styles.documentLinks}>
    <a href="https://drive.google.com/drive/folders/1U1VwouP1PDeHaKRWgzN_K_g3Ge-o9Y2o?usp=sharing">Pöytäkirjat</a>
      {documents.map((document) => (
        <li key={document.node.title[language]}>
          <a href={document.node.file.publicURL} target="_blank" rel="noreferrer">
            {document.node.title[language]}
          </a>
        </li>
      ))}
    </ul>
  );
};
