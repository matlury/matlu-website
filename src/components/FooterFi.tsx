import React from "react";
import { MatluDocuments } from "./Documents";
import * as styles from "./Footer.module.scss";
import Image from "./image";


export const FooterFi: React.FC = () => (
  <footer className={styles.appFooter}>
    <div className={styles.appFooterSection}>
      <h4>Dokumentteja</h4>
      <MatluDocuments language={"fi"} />
    </div>
    <div className={styles.appFooterSection}>
      <h4>Matlu sosiaalisessa mediassa</h4>
      <ul className={styles.matluSome}>
        <li>
          <i className="fab fa-facebook-square"></i>{" "}
          <a
            href="https://www.facebook.com/Matlury/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </li>
        <li>
          <i className="fab fa-instagram-square"></i>{" "}
          <a
            href="https://www.instagram.com/matlury/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </li>
      </ul>
    </div>
    <div className={styles.appFooterSection}>
      <h4>Sponsored by</h4>
      <ul className={styles.matluSome}>
        <Image imageName="loimu"/>
      </ul>
    </div>
    <div className={styles.footerBottom}>&copy; 2024 Matlu ry</div>
  </footer>
);
