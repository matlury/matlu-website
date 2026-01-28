/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Language } from "../utils";
import * as styles from "./Documents.module.scss";

interface DocumentNode {
  id: string;
  documentId: string;
  title: {
    fi: string;
    en: string;
  };
  file: {
    url: string;
  } | null;
}

interface Props {
  language: Language;
}

export const MatluDocuments: React.FC<Props> = ({ language }) => {
  const data = useStaticQuery(graphql`
    query DocumentsQuery {
      allStrapiDocument {
        nodes {
          id
          documentId
          title {
            fi
            en
          }
          file {
            url
          }
        }
      }
    }
  `);

  const nodes: DocumentNode[] = data.allStrapiDocument.nodes;

  return (
    <ul className={styles.documentLinks}>
      <a href="https://drive.google.com/drive/folders/1U1VwouP1PDeHaKRWgzN_K_g3Ge-o9Y2o?usp=sharing">
        {language === "fi" ? "Pöytäkirjat" : "Minutes"}
      </a>
      {nodes.map((doc) => (
        <li key={doc.documentId}>
          <a href={doc.file?.url} target="_blank" rel="noreferrer">
            {doc.title[language]}
          </a>
        </li>
      ))}
    </ul>
  );
};