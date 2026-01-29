import { Language } from "../utils";
import styles from "./Documents.module.scss";
import { fetchGraphQL } from "../lib/strapi";
import { gql } from "@apollo/client";

interface DocumentNode {
  documentId: string;
  title: {
    fi: string;
    en: string;
  };
  file: {
    url: string;
  } | null;
}

interface DocumentsQueryResult {
  documents: Array<{
    documentId: string;
    title: {
      fi: string;
      en: string;
    };
    file: {
      url: string;
    } | null;
  }>;
}

const DOCUMENTS_QUERY = gql`
  query DocumentsQuery {
    documents {
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
`;

interface Props {
  language: Language;
}

export const MatluDocuments: React.FC<Props> = async ({ language }) => {
  const { data } = await fetchGraphQL<DocumentsQueryResult>(DOCUMENTS_QUERY);

  const nodes: DocumentNode[] = (data?.documents || []).map((node) => ({
    documentId: node.documentId,
    title: node.title,
    file: node.file ? { url: node.file.url } : null,
  }));

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
