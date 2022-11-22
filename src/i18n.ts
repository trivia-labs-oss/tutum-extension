import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ChainedBackend from 'i18next-chained-backend'
import HttpBackend from 'i18next-http-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'
import { initReactI18next } from 'react-i18next'
import config from './config'
import { getExtensionVersion } from './utils'

i18n
  .use(LanguageDetector)
  .use(ChainedBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['navigator'],
    },
    load: 'languageOnly',
    backend: {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          defaultVersion: getExtensionVersion(),
          expirationTime: 1 * 60 * 60 * 1000, // 1 hour
        },
        {
          loadPath: `${config.serverHost}/api/locales?lng={{lng}}`,
        },
      ],
    },
  })

export default i18n
