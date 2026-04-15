import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import zhCN from './locales/zh-CN';
import { getInitialLanguage, LANGUAGE_STORAGE_KEY } from './utils/i18n';

const resources = {
  en: {
    translation: en,
  },
  'zh-CN': {
    translation: zhCN,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (language) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

export default i18n;
