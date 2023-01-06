import { FooterDocument } from './FooterDocument'

interface MatluDocumentsProps {
    documents: FooterDocument[]
}

const MatluDocuments = ({ documents }: MatluDocumentsProps) => {
    return (
        <ul>
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
