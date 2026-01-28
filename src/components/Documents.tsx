/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Language } from "../utils";
import * as styles from "./Documents.module.scss";

interface DocumentNode {
  id: string;
  attributes: {
    title: {
      fi: string;
      en: string;
    };
    file: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    } | null;
  };
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
          attributes {
            title {
              fi
              en
            }
            file {
              data {
                attributes {
                  url
                }
              }
            }
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
        <li key={doc.id}>
          <a
            href={doc.attributes.file?.data?.attributes?.url}
            target="_blank"
            rel="noreferrer"
          >
            {doc.attributes.title[language]}
          </a>
        </li>
      ))}
    </ul>
  );
};