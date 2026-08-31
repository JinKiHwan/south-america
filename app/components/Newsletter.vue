<template>
  <section id="newsletter" class="newsletter-home">
    <div class="newsletter-container">
      <div class="newsletter-home-heading">
        <h2>
          {{ $t('newsletter.title') }}
          <span>{{ $t('newsletter.highlight') }}</span>
        </h2>
        <NuxtLink :to="localePath('/newsletter')" class="btn-outline"
          >{{ $t('newsletter.view_all') }} ↗</NuxtLink
        >
      </div>
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
      <p v-if="error" class="newsletter-empty">
        {{ $t('newsletter.load_error') }}
      </p>
      <p v-else-if="!items.length" class="newsletter-empty">
        {{ $t('newsletter.no_results') }}
      </p>
      <div v-else class="newsletter-home-grid">
        <NuxtLink
          :to="localePath('/newsletter/' + items[0]!.id)"
          class="newsletter-featured"
          ><div class="newsletter-featured-image">
            <img
              v-if="items[0]!.thumbnail"
              :src="items[0]!.thumbnail"
              :alt="newsletterCopy(items[0]!.translations, locale).title"
              loading="lazy"
            /><span v-else class="newsletter-image-placeholder"
              >Vision Thru the Bible</span
            >
          </div>
          <span class="newsletter-eyebrow">{{
            countryLabel(
              countries.find((c) => c.id === items[0]!.countryId),
              locale,
            )
          }}</span>
          <h3>{{ newsletterCopy(items[0]!.translations, locale).title }}</h3>
          <small>{{ formatDate(items[0]!.publishedAt) }}</small>
          <p>
            {{ newsletterCopy(items[0]!.translations, locale).excerpt }}
          </p></NuxtLink
        >
        <div class="newsletter-home-rest">
          <NuxtLink
            v-for="post in items.slice(1, 5)"
            :key="post.id"
            :to="localePath('/newsletter/' + post.id)"
            ><img
              v-if="post.thumbnail"
              :src="post.thumbnail"
              :alt="newsletterCopy(post.translations, locale).title"
              loading="lazy"
            /><span v-else class="newsletter-small-placeholder">LETTER</span>
            <div>
              <span class="newsletter-eyebrow">{{
                countryLabel(
                  countries.find((c) => c.id === post.countryId),
                  locale,
                )
              }}</span>
              <h3>{{ newsletterCopy(post.translations, locale).title }}</h3>
              <small>{{ formatDate(post.publishedAt) }}</small>
            </div></NuxtLink
          >
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import {
  newsletterCopy,
  countryLabel,
  type NewsletterSummary,
  type NewsletterCountry,
} from '#shared/newsletter';
import '~/assets/css/newsletter.css';
const { locale } = useI18n();
const localePath = useLocalePath();
const country = ref('');
const { data: posts, error } = await useFetch<NewsletterSummary[]>(
  '/api/newsletters',
  { default: () => [] },
);
const { data: countries } = await useFetch<NewsletterCountry[]>(
  '/api/newsletter-countries',
  { default: () => [] },
);
const items = computed(() =>
  posts.value.filter(
    (post) => !country.value || post.countryId === country.value,
  ),
);
function formatDate(date: string | null) {
  return date
    ? new Date(date).toLocaleDateString(locale.value, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';
}
</script>
