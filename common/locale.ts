import type { Locale as DateFnsLocale } from 'date-fns'
import { enUS, fi } from 'date-fns/locale'

export type LocaleName = 'fi' | 'en'

export const locales: Record<LocaleName, LocaleName> = {
    fi: 'fi',
    en: 'en',
}

export const dateFnsLocales: Record<LocaleName, DateFnsLocale> = {
    fi: fi,
    en: enUS,
}

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
