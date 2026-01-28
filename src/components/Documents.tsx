/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Language } from "../utils";
import * as styles from "./Documents.module.scss";

interface Document {
  node: {
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
        };
      };
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
    }
  `);
  const documents: Document[] = data.allStrapiDocument.edges;
  return (
    <ul className={styles.documentLinks}>
      <a href="https://drive.google.com/drive/folders/1U1VwouP1PDeHaKRWgzN_K_g3Ge-o9Y2o?usp=sharing">Pöytäkirjat</a>
        {data.allStrapiDocument.nodes.map((doc: Document) => (
          <li key={doc.id}>
            <a
              href={doc.attributes.file?.data?.attributes?.url}
              target="_blank"
              rel="noreferrer"
            >
              {doc.attributes.Title}
            </a>
          </li>
        ))}
    </ul>
  );
};
