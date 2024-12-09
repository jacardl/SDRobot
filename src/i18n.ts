import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import en from './locales/en'
import zh from './locales/zh'

// 从 localStorage 获取保存的语言设置，如果没有则使用浏览器语言或默认为中文
const getStoredLanguage = () => {
  const storedLang = localStorage.getItem('language')
  if (storedLang) {
    return storedLang
  }
  
  // 获取浏览器语言设置
  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('zh') ? 'zh' : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getStoredLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

// 监听语言变化并保存到 localStorage
watch(
  () => i18n.global.locale.value,
  (newLocale: string) => {
    localStorage.setItem('language', newLocale)
  }
)

export default i18n 