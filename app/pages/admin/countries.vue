<template>
  <div>
    <div class="admin-page-heading">
      <div>
        <p class="admin-eyebrow">NEWSLETTER SETTINGS</p>
        <h1>국가 관리</h1>
        <p>소식지 작성과 홈페이지 필터에 사용할 국가의 이름과 순서를 관리합니다.</p>
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
            :disabled="saving || dirty"
        /></label>
        <button
          class="admin-button is-primary"
          :disabled="saving || dirty || !name.trim()"
        >
          {{ saving ? '추가 중…' : '국가 추가' }}
        </button>
      </form>
      <p class="admin-field-hint">
        이름과 순서는 저장 후 글 작성 화면과 홈페이지의 국가 필터에 반영됩니다.
        순서나 이름을 편집 중이면 먼저 변경사항을 저장해주세요.
      </p>
    </section>
    <section class="admin-card news-country-card">
      <h2>
        등록된 국가 <span class="news-count">{{ draftCountries.length }}</span>
      </h2>
      <div class="country-edit-list">
        <div v-for="(country, index) in draftCountries" :key="country.id" class="country-edit-row">
          <span class="country-edit-index">{{ index + 1 }}</span>
          <input v-model="country.name" :aria-label="`${index + 1}번째 국가 이름`" maxlength="60" :disabled="saving" />
          <button type="button" :disabled="saving || index === 0" :aria-label="`${country.name} 위로 이동`" @click="moveCountry(index, -1)">↑</button>
          <button type="button" :disabled="saving || index === draftCountries.length - 1" :aria-label="`${country.name} 아래로 이동`" @click="moveCountry(index, 1)">↓</button>
          <button type="button" class="is-danger" :disabled="saving || draftCountries.length === 1" :aria-label="`${country.name} 삭제`" @click="removeCountry(index)">삭제</button>
        </div>
      </div>
      <div class="country-edit-actions">
        <button class="admin-button is-primary" :disabled="saving || !dirty" @click="saveCountries">{{ saving ? '저장 중…' : '순서·이름 저장' }}</button>
        <button class="admin-button is-secondary" :disabled="saving || !dirty" @click="resetCountries">변경 취소</button>
      </div>
      <p class="admin-field-hint">게시글에서 사용 중인 국가는 삭제할 수 없습니다. 삭제 전 해당 게시글의 국가를 변경해주세요.</p>
    </section>
  </div>
</template>
<script setup lang="ts">
import type { NewsletterCountry } from '#shared/newsletter';
definePageMeta({ layout: 'admin', middleware: 'admin' });
defineI18nRoute({ locales: ['ko'] });
const {
  data: snapshot,
  error,
  refresh,
} = await useFetch<{ version: number; countries: NewsletterCountry[] }>('/api/admin/newsletter-countries');
const draftCountries = ref<NewsletterCountry[]>([]);
watch(snapshot, (value) => {
  draftCountries.value = structuredClone(value?.countries || []);
}, { immediate: true });
const dirty = computed(() => JSON.stringify(draftCountries.value.map((country) => ({ id: country.id, name: country.name }))) !== JSON.stringify(snapshot.value?.countries.map((country) => ({ id: country.id, name: country.name })) || []));
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
function moveCountry(index: number, direction: -1 | 1) {
  const copy = [...draftCountries.value];
  const next = index + direction;
  if (next < 0 || next >= copy.length) return;
  [copy[index], copy[next]] = [copy[next]!, copy[index]!];
  draftCountries.value = copy;
}
function removeCountry(index: number) {
  const country = draftCountries.value[index];
  if (!country || !window.confirm(`${country.name}을(를) 목록에서 삭제할까요?`)) return;
  draftCountries.value.splice(index, 1);
}
function resetCountries() {
  draftCountries.value = structuredClone(snapshot.value?.countries || []);
  errorMessage.value = '';
}
async function saveCountries() {
  if (!snapshot.value || !dirty.value) return;
  saving.value = true;
  errorMessage.value = '';
  success.value = '';
  try {
    await $fetch('/api/admin/newsletter-countries', {
      method: 'PUT',
      body: { version: snapshot.value.version, countries: draftCountries.value.map(({ id, name }) => ({ id, name })) },
    });
    await refresh();
    success.value = '국가 이름과 순서를 저장했습니다.';
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || '국가 목록을 저장하지 못했습니다.';
  } finally {
    saving.value = false;
  }
}
</script>
<style scoped>
.country-edit-list { display: grid; gap: 10px; margin-top: 18px; }
.country-edit-row { display: flex; align-items: center; gap: 10px; }
.country-edit-row input { flex: 1; min-width: 0; padding: 12px 14px; border: 1px solid #ded8d1; border-radius: 10px; background: #fff; }
.country-edit-row button { border: 1px solid #ded8d1; border-radius: 10px; padding: 10px 13px; background: #fff; }
.country-edit-row button:disabled { opacity: .4; cursor: not-allowed; }
.country-edit-row .is-danger { color: #b8463d; }
.country-edit-index { width: 24px; color: #817871; text-align: center; }
.country-edit-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
</style>
