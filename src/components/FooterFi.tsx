import styles from "./Footer.module.scss";
import Image from "./image";
import { Language } from "../utils";
import { MatluDocuments } from "./Documents";
import MemberLogosMarquee, { FooterLogo } from "./MemberLogosMarquee";

interface LocalizedFooterProps {
  language: Language;
  logos: FooterLogo[];
}

export const FooterFi: React.FC<LocalizedFooterProps> = ({ language, logos }) => (
  <footer className={styles.appFooter}>
    <div className={styles.appFooterSection}>
      <h4>Dokumentteja</h4>
      <MatluDocuments language={language} />
    </div>
    <div className={styles.appFooterSection}>
      <h4>Matlu sosiaalisessa mediassa</h4>
      <ul className={styles.matluSome}>
        <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a
            href="https://www.facebook.com/Matlury/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, textDecoration: "none", color: "inherit" }}
          >
            <span style={{ width: 36, display: "flex", justifyContent: "center" }}>
              <i className="fab fa-facebook-square" style={{ fontSize: 32 }}></i>
            </span>
            Facebook
          </a>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a
            href="https://www.instagram.com/matlury/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, textDecoration: "none", color: "inherit" }}
          >
            <span style={{ width: 36, display: "flex", justifyContent: "center" }}>
              <img
                src="/logos/instagram_logo.svg"
                alt="Instagram"
                style={{ width: 32, height: 32, display: "inline-block" }}
              />
            </span>
            Instagram
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
    <div className={styles.footerMarquee}>
      <MemberLogosMarquee logos={logos} />
    </div>
    <div className={styles.footerBottom}>
      &copy; {new Date().getFullYear()} Matlu ry
    </div>
  </footer>
);
