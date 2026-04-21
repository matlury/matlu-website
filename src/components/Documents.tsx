import { Language } from "../utils";
import { getDocuments, type DocumentNode } from "../lib/cms-data";
import styles from "./Documents.module.scss";

interface Props {
  language: Language;
}

export const MatluDocuments: React.FC<Props> = async ({ language }) => {
  let nodes: DocumentNode[] = [];
  try {
    nodes = await getDocuments();
  } catch (error) {
    console.error("Failed to fetch documents", error);
  }

  return (
    <ul className={styles.documentLinks}>
      <li>
        <a href="https://drive.google.com/drive/folders/1U1VwouP1PDeHaKRWgzN_K_g3Ge-o9Y2o?usp=sharing">
          {language === "fi" ? "Pöytäkirjat" : "Minutes"}
        </a>
      </li>
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
