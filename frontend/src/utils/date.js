import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

import { normalizeLanguage } from './i18n';

dayjs.extend(relativeTime);

const getIntlLocale = (language) => (normalizeLanguage(language) === 'zh-CN' ? 'zh-CN' : 'en-US');

const getDayjsLocale = (language) => (normalizeLanguage(language) === 'zh-CN' ? 'zh-cn' : 'en');

export const formatDateTime = (value, language) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(getIntlLocale(language), {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(value));
};

export const formatRelativeTime = (value, language) => {
  if (!value) {
    return '-';
  }

  dayjs.locale(getDayjsLocale(language));
  return dayjs(value).fromNow();
};
