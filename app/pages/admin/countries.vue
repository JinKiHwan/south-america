<template>
  <div>
    <div class="admin-page-heading">
      <div>
        <p class="admin-eyebrow">NEWSLETTER SETTINGS</p>
        <h1>국가 관리</h1>
        <p>소식지 작성과 홈페이지 필터에 사용할 국가를 추가합니다.</p>
      </div>
    </div>
    <p v-if="errorMessage || error" class="admin-alert is-error" role="alert">
      {{ errorMessage || '국가 목록을 불러오지 못했습니다.' }}
    </p>
    <p v-if="success" class="admin-alert is-success" role="status">
      {{ success }}
    </p>
    <section class="admin-card news-country-card">
      <h2>새 국가 추가</h2>
      <form class="news-country-form" @submit.prevent="addCountry">
        <label class="admin-field"
          >국가 이름<input
            v-model="name"
            maxlength="60"
            placeholder="예: 콜롬비아"
            required
            :disabled="saving"
        /></label>
        <button
          class="admin-button is-primary"
          :disabled="saving || !name.trim()"
        >
          {{ saving ? '추가 중…' : '국가 추가' }}
        </button>
      </form>
      <p class="admin-field-hint">
        추가하면 글 작성 화면과 홈페이지의 국가 필터에 바로 표시됩니다. 입력한
        이름은 모든 언어에서 사용됩니다.
      </p>
    </section>
    <section class="admin-card news-country-card">
      <h2>
        등록된 국가 <span class="news-count">{{ countries?.length || 0 }}</span>
      </h2>
      <div class="news-country-chips">
        <span v-for="country in countries" :key="country.id">{{
          country.name
        }}</span>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import type { NewsletterCountry } from '#shared/newsletter';
definePageMeta({ layout: 'admin', middleware: 'admin' });
defineI18nRoute({ locales: ['ko'] });
const {
  data: countries,
  error,
  refresh,
} = await useFetch<NewsletterCountry[]>('/api/newsletter-countries');
const name = ref('');
const saving = ref(false);
const errorMessage = ref('');
const success = ref('');
async function addCountry() {
  saving.value = true;
  errorMessage.value = '';
  success.value = '';
  try {
    await $fetch('/api/admin/newsletter-countries', {
      method: 'POST',
      body: { name: name.value },
    });
    name.value = '';
    await refresh();
    success.value = '국가를 추가했습니다.';
  } catch (error: any) {
    errorMessage.value =
      error.data?.statusMessage || '국가를 추가하지 못했습니다.';
  } finally {
    saving.value = false;
  }
}
</script>
