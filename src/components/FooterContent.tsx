import styles from "./Footer.module.scss";
import Image from "./image";
import { Language } from "../utils";
import { MatluDocuments } from "./Documents";
import MemberLogosMarquee, { FooterLogo } from "./MemberLogosMarquee";
import TelegramShare from "./TelegramShare";

const FOOTER_LABELS = {
  fi: {
    documents: "Dokumentteja",
    socialMedia: "Matlu sosiaalisessa mediassa",
    sponsoredBy: "Yhteistyössä",
    telegramJoin: "Liity Matlun infokanavalle",
    telegramChannel: "@matluInfo",
  },
  en: {
    documents: "Documents",
    socialMedia: "Matlu in social media",
    sponsoredBy: "Sponsored by",
    telegramJoin: "Join to Matlu's info channel",
    telegramChannel: "@matluInfo",
  },
} as const;

interface FooterContentProps {
  language: Language;
  logos: FooterLogo[];
}

const FooterContent: React.FC<FooterContentProps> = ({ language, logos }) => {
  const labels = FOOTER_LABELS[language];

  return (
    <footer className={styles.appFooter}>
      <div className={styles.appFooterSection}>
        <h4>{labels.documents}</h4>
        <MatluDocuments language={language} />
      </div>
      <div className={styles.appFooterSection}>
        <h4>{labels.socialMedia}</h4>
        <ul className={styles.matluSome}>
          <li>
            <a
              href="https://www.facebook.com/Matlury/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "linear-gradient(135deg, #1877f2 0%, #4293f6 100%)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
            >
              <i className="fab fa-facebook-square" style={{ fontSize: 20 }}></i>
              Facebook
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/matlury/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
            >
              <img
                src="/logos/instagram_white_logo.svg"
                alt="Instagram"
                style={{ width: 20, height: 20, display: "inline-block", filter: "brightness(0) invert(1)" }}
              />
              Instagram
            </a>
          </li>
          <li>
            <TelegramShare joinChannel={labels.telegramJoin} channelName={labels.telegramChannel} />
          </li>
        </ul>
      </div>
      <div className={styles.appFooterSection}>
        <h4>{labels.sponsoredBy}</h4>
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
};

export default FooterContent;
