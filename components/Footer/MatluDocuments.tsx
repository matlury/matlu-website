import styles from 'styles/components/MatluDocuments.module.scss'
import { FooterDocument } from './FooterDocument'

interface MatluDocumentsProps {
    documents: FooterDocument[]
}

const MatluDocuments = ({ documents }: MatluDocumentsProps) => {
    return (
        <ul className={styles.documentLinks}>
            {documents.map(({ id, title, url }) => (
                <li key={id}>
                    <a href={url} target="_blank" rel="noreferrer noopener">
                        {title}
                    </a>
                </li>
            ))}
        </ul>
    )
}

export default MatluDocuments
