<template>
  <div>
    <div class="admin-page-heading">
      <div>
        <p class="admin-eyebrow">CONTACT SETTINGS</p>
        <h1>문의 유형 관리</h1>
        <p>문의하기 양식에 표시할 유형과 언어별 이름, 표시 순서를 관리합니다.</p>
      </div>
    </div>
    <p v-if="errorMessage || error" class="admin-alert is-error" role="alert">{{ errorMessage || '문의 유형을 불러오지 못했습니다.' }}</p>
    <p v-if="success" class="admin-alert is-success" role="status">{{ success }}</p>
    <section class="admin-card contact-types-card">
      <div v-for="(type, index) in draft" :key="type.id" class="type-editor">
        <div class="type-editor-head">
          <strong>문의 유형 {{ index + 1 }}</strong>
          <div class="type-editor-actions">
            <button type="button" :disabled="saving || index === 0" @click="move(index, -1)" :aria-label="`${index + 1}번째 문의 유형 위로 이동`">↑ 위로</button>
            <button type="button" :disabled="saving || index === draft.length - 1" @click="move(index, 1)" :aria-label="`${index + 1}번째 문의 유형 아래로 이동`">↓ 아래로</button>
            <button type="button" :disabled="saving || draft.length === 1" @click="draft.splice(index, 1)">삭제</button>
          </div>
        </div>
        <div class="type-editor-grid">
          <label v-for="language in contactLocales" :key="language" class="admin-field">{{ localeNames[language] }}
            <input v-model="type.labels[language]" :maxlength="80" :disabled="saving" required />
          </label>
        </div>
      </div>
      <button type="button" class="admin-button is-secondary" :disabled="saving || draft.length >= 30" @click="addType">＋ 문의 유형 추가</button>
      <p class="admin-field-hint">유형을 삭제하면 문의 양식에서만 사라집니다. 메일 전송 설정은 별도로 유지됩니다.</p>
    </section>
    <div class="type-save-actions">
      <button type="button" class="admin-button is-primary" :disabled="saving || !dirty" @click="save">{{ saving ? '저장 중…' : '변경사항 저장' }}</button>
      <button type="button" class="admin-button is-secondary" :disabled="saving || !dirty" @click="reset">변경 취소</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { contactLocales, type ContactType } from '#shared/contact-types';
import { localeNames } from '#shared/site-content';
definePageMeta({ layout: 'admin', middleware: 'admin' });
defineI18nRoute({ locales: ['ko'] });
const { data: snapshot, error, refresh } = await useFetch<{ version: number; types: ContactType[] }>('/api/admin/contact-types');
const draft = ref<ContactType[]>([]);
watch(snapshot, (value) => { draft.value = structuredClone(value?.types || []); }, { immediate: true });
const dirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(snapshot.value?.types || []));
const errorMessage = ref('');
const success = ref('');
const saving = ref(false);
function move(index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= draft.value.length) return;
  [draft.value[index], draft.value[next]] = [draft.value[next]!, draft.value[index]!];
}
function addType() {
  draft.value.push({ id: `type-${crypto.randomUUID()}`, labels: { ko: '', en: '', es: '', pt: '' } });
}
function reset() {
  draft.value = structuredClone(snapshot.value?.types || []);
  errorMessage.value = '';
}
async function save() {
  if (!snapshot.value || !dirty.value) return;
  saving.value = true;
  errorMessage.value = '';
  success.value = '';
  try {
    await $fetch('/api/admin/contact-types', { method: 'PUT', body: { version: snapshot.value.version, types: draft.value } });
    await refresh();
    success.value = '문의 유형을 저장했습니다.';
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || '문의 유형을 저장하지 못했습니다. 네 언어의 이름을 모두 입력했는지 확인해주세요.';
  } finally { saving.value = false; }
}
</script>

<style scoped>
.contact-types-card { display: grid; gap: 24px; }
.type-editor { padding-bottom: 22px; border-bottom: 1px solid #e9e5de; }
.type-editor-head, .type-editor-actions, .type-save-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.type-editor-head { justify-content: space-between; margin-bottom: 17px; }
.type-editor-actions button { padding: 8px 12px; border: 1px solid #ded8d1; border-radius: 8px; background: #fff; font-size: 12px; }
.type-editor-actions button:disabled { opacity: .4; }
.type-editor-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.type-save-actions { margin-top: 22px; }
@media (max-width: 680px) { .type-editor-grid { grid-template-columns: 1fr; } }
</style>
