import I18n from 'react-native-i18n';

// I18n.defaultLocale = 'en';
// I18n.locale = 'en';
I18n.fallbacks = true;
I18n.translations = {
  'en-US': require('./locales/en.json'),
  en: require('./locales/en.json'),
  hi: require('./locales/hi.json'),
};
export default I18n;
