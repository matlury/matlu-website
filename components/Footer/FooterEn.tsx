import styles from 'styles/components/Footer.module.scss'
import { FooterDocument } from './FooterDocument'
import MatluDocuments from './MatluDocuments'

interface Props {
    documents: FooterDocument[]
}

export const FooterEn = ({ documents }: Props) => (
    <footer className={styles.appFooter}>
        <div className={styles.appFooterSection}>
            <h4>Documents</h4>
            <MatluDocuments documents={documents} />
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
        <div className={styles.footerBottom}>&copy; 2020 Matlu ry</div>
    </footer>
)