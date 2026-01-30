import { MatluDocuments } from "./Documents";
import styles from "./Footer.module.scss";
import Image from "./image";
import { Language } from "../utils";

interface LocalizedFooterProps {
  language: Language;
}

export const FooterEn: React.FC<LocalizedFooterProps> = ({ language }) => (
  <footer className={styles.appFooter}>
    <div className={styles.appFooterSection}>
      <h4>Documents</h4>
      <MatluDocuments language={language} />
    </div>
    <div className={styles.appFooterSection}>
      <h4>Matlu in social media</h4>
      <ul className={styles.matluSome}>
        <li>
          <a
            href="https://www.facebook.com/Matlury/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-square"></i> Facebook
          </a>
        </li>
        <li>
          <a
            href="https://instagram.com/matlury/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram-square"></i> Instagram
          </a>
        </li>
      </ul>
    </div>
    <div className={styles.appFooterSection}>
      <h4>Sponsored by</h4>
      <ul className={styles.matluSome}>
        <li>
          <Image imageName="loimu" />
        </li>
      </ul>
    </div>
    <div className={styles.footerBottom}>
      &copy; {new Date().getFullYear()} Matlu ry
    </div>
  </footer>
);
