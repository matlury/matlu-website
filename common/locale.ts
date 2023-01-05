export type LocaleName = 'fi' | 'en'

const DEFAULT_LOCALE = 'fi'

export const getLocale = (localeMaybe: string | undefined): LocaleName => {
    switch (localeMaybe) {
        case 'fi':
            return 'fi'
        case 'en':
            return 'en'
        default:
            return DEFAULT_LOCALE
    }
}
