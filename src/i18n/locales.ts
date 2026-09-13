export const SUPPORTED_LOCALES = ['vi', 'en', 'ko'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'vi'

export const LANGUAGE_OPTIONS: ReadonlyArray<{
  code: AppLocale
  label: string
  flagSrc: string
  flagAlt: string
  name: string
}> = [
  {
    code: 'vi',
    label: 'VI',
    flagSrc: '/icons/flags/vn.svg',
    flagAlt: 'Cờ Việt Nam',
    name: 'Tiếng Việt',
  },
  {
    code: 'en',
    label: 'EN',
    flagSrc: '/icons/flags/gb.svg',
    flagAlt: 'UK Flag',
    name: 'English',
  },
  {
    code: 'ko',
    label: 'KO',
    flagSrc: '/icons/flags/kr.svg',
    flagAlt: 'South Korea Flag',
    name: '한국어',
  },
]

export function isSupportedLocale(locale?: string | null): locale is AppLocale {
  return SUPPORTED_LOCALES.includes(locale as AppLocale)
}
