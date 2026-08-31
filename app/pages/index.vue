<template>
  <div class="overflow-hidden pt-16">
    <HeroSlide v-bind="mainVisual" />
    <MissionaryIntro v-bind="missionaryIntro" />
    <Newsletter />
    <YoutubeLectures />
    <ContactForm />
  </div>
</template>

<script setup lang="ts">
import { createDefaultContent, type SiteLocale } from '#shared/site-content';
const { t, locale } = useI18n();
const { data: content } = await useFetch('/api/site-content', { default: createDefaultContent });
const contentLocale = computed(() => ['ko', 'en', 'es', 'pt'].includes(locale.value) ? locale.value as SiteLocale : 'ko');

const mainVisual = computed(() => ({
  imageUrl: content.value.hero.imageUrl,
  alignment: content.value.hero.alignment,
  ...content.value.hero.translations[contentLocale.value],
}));
const missionaryIntro = computed(() => ({
  imageUrl: content.value.missionary.imageUrl,
  ...content.value.missionary.translations[contentLocale.value],
}));

useHead({
  title: t('site.title'),
  meta: [
    { name: 'description', content: t('site.description') }
  ]
})
</script>
