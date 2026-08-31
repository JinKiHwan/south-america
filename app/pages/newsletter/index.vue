<template>
  <div class="newsletter-page">
    <header class="newsletter-banner">
      <div class="newsletter-container">
        <NuxtLink :to="localePath('/')">Home</NuxtLink
        ><span class="newsletter-eyebrow">LETTERS FROM THE FIELD</span>
        <h1>{{ $t('newsletter.subpage_title') }}</h1>
        <p>{{ $t('newsletter.subpage_subtitle') }}</p>
      </div>
    </header>
    <div class="newsletter-container newsletter-list-section">
      <div class="newsletter-controls">
        <div class="newsletter-filters">
          <button :class="{ 'is-active': !country }" @click="country = ''">
            {{ $t('newsletter.filters.all') }}</button
          ><button
            v-for="item in countries"
            :key="item.id"
            :class="{ 'is-active': country === item.id }"
            @click="country = item.id"
          >
            {{ countryLabel(item, locale) }}
          </button>
        </div>
        <input
          v-model="search"
          :placeholder="$t('newsletter.search_placeholder')"
          :aria-label="$t('newsletter.search_placeholder')"
        />
      </div>
      <p v-if="error" class="newsletter-empty">
        {{ $t('newsletter.load_error') }}
        <button @click="refresh()">{{ $t('newsletter.retry') }}</button>
      </p>
      <p v-else-if="!visiblePosts.length" class="newsletter-empty">
        {{ $t('newsletter.no_results') }}
      </p>
      <div v-else class="newsletter-card-grid">
        <NuxtLink
          v-for="post in visiblePosts.slice(0, limit)"
          :key="post.id"
          :to="localePath('/newsletter/' + post.id)"
          class="newsletter-card"
          ><div class="newsletter-card-image">
            <img
              v-if="post.thumbnail"
              :src="post.thumbnail"
              :alt="newsletterCopy(post.translations, locale).title"
              loading="lazy"
            /><span v-else class="newsletter-image-placeholder"
              >Vision Thru the Bible</span
            ><span class="newsletter-country">{{
              countryLabel(
                countries?.find((c) => c.id === post.countryId),
                locale,
              )
            }}</span>
          </div>
          <div class="newsletter-card-copy">
            <small
              >{{ formatDate(post.publishedAt) }}
              <span v-if="post.attachment"> · PDF</span></small
            >
            <h2>{{ newsletterCopy(post.translations, locale).title }}</h2>
            <p>{{ newsletterCopy(post.translations, locale).excerpt }}</p>
            <span class="newsletter-read-more"
              >{{ $t('newsletter.read_more') }} ↗</span
            >
          </div></NuxtLink
        >
      </div>
      <button
        v-if="visiblePosts.length > limit"
        class="btn-outline newsletter-load-more"
        @click="limit += 9"
      >
        {{ $t('newsletter.load_more') }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  newsletterCopy,
  countryLabel,
  type NewsletterSummary,
  type NewsletterCountry,
} from '#shared/newsletter';
import '~/assets/css/newsletter.css';
const { locale, t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
if (
  typeof route.query.id === 'string' &&
  /^[a-f0-9-]{36}$/.test(route.query.id)
)
  await navigateTo(localePath('/newsletter/' + route.query.id), {
    redirectCode: 302,
  });
const {
  data: posts,
  error,
  refresh,
} = await useFetch<NewsletterSummary[]>('/api/newsletters', {
  default: () => [],
});
const { data: countries } = await useFetch<NewsletterCountry[]>(
  '/api/newsletter-countries',
  { default: () => [] },
);
const country = ref('');
const search = ref('');
const limit = ref(9);
const visiblePosts = computed(() =>
  posts.value.filter(
    (post) =>
      (!country.value || post.countryId === country.value) &&
      [
        newsletterCopy(post.translations, locale.value).title,
        newsletterCopy(post.translations, locale.value).excerpt,
      ]
        .join(' ')
        .toLocaleLowerCase()
        .includes(search.value.trim().toLocaleLowerCase()),
  ),
);
watch([country, search], () => (limit.value = 9));
function formatDate(date: string | null) {
  return date
    ? new Date(date).toLocaleDateString(locale.value, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';
}
useHead(() => ({
  title: t('newsletter.subpage_title') + ' | Vision Thru the Bible',
}));
</script>
