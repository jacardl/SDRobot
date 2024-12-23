<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const changeLocale = (lang: string) => {
  locale.value = lang
}
</script>

<template>
  <select v-model="locale" class="form-select">
    <option value="en">English</option>
    <option value="zh">中文</option>
  </select>
</template> 