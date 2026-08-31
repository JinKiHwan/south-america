<template>
  <article v-if="post" class="newsletter-page newsletter-detail">
    <div class="newsletter-reading-width">
      <NuxtLink :to="localePath('/newsletter')" class="newsletter-back"
        >← {{ $t('newsletter.back_to_list') }}</NuxtLink
      >
      <header class="newsletter-article-heading">
        <span class="newsletter-eyebrow">{{
          countryLabel(
            countries?.find((c) => c.id === post.countryId),
            locale,
          )
        }}</span>
        <h1>{{ copy.title }}</h1>
        <p>{{ copy.excerpt }}</p>
        <small>{{
          post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : ''
        }}</small>
      </header>
      <img
        v-if="post.thumbnail"
        class="newsletter-detail-cover"
        :src="post.thumbnail"
        :alt="copy.title"
      />
      <div class="newsletter-prose" v-html="copy.body" />
      <section v-if="post.attachment" class="newsletter-download">
        <span class="newsletter-pdf-symbol" aria-hidden="true">PDF</span>
        <div>
          <h2>{{ $t('newsletter.pdf_attachment') }}</h2>
          <p>{{ post.attachment.name }}</p>
          <small>{{ formatFileSize(post.attachment.size) }}</small>
        </div>
        <a :href="'/api/newsletters/' + post.id + '/pdf'" class="btn-primary"
          >{{ $t('newsletter.download_pdf') }} ↓</a
        >
      </section>
      <footer class="newsletter-detail-footer">
        <span>Vision Thru the Bible Ministries</span
        ><NuxtLink :to="localePath('/newsletter')"
          >{{ $t('newsletter.back_to_list') }} ↗</NuxtLink
        >
      </footer>
    </div>
  </article>
</template>
<script setup lang="ts">
import {
  newsletterCopy,
  countryLabel,
  formatFileSize,
  type NewsletterPost,
  type NewsletterCountry,
} from '#shared/newsletter';
import '~/assets/css/newsletter.css';
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();
const { data: post, error } = await useFetch<NewsletterPost>(
  '/api/newsletters/' + encodeURIComponent(String(route.params.id)),
  { key: 'public-newsletter:' + String(route.params.id) },
);
if (error.value || !post.value)
  throw createError({
    statusCode: 404,
    statusMessage: '이 소식지를 찾을 수 없거나 공개되지 않았습니다.',
  });
const { data: countries } = await useFetch<NewsletterCountry[]>(
  '/api/newsletter-countries',
);
const copy = computed(() =>
  newsletterCopy(post.value!.translations, locale.value),
);
useHead(() => ({
  title: copy.value.title + ' | Vision Thru the Bible',
  meta: [{ name: 'description', content: copy.value.excerpt }],
}));
</script>
