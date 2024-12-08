import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zh from './locales/zh'

export default createI18n({
  legacy: false,
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 备用语言
  messages: {
    en,
    zh
  }
}) 