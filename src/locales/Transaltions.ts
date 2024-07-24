import I18n from 'react-native-i18n';

I18n.defaultLocale = 'en';
// I18n.locale = 'en';
I18n.fallbacks = true;
I18n.translations = {
  'en-US': require('./en.json'),
  en: require('./en.json'),
  es: require('./es.json'),
};
export default I18n;
