<template>
  <div class="admin-editor">
    <div class="admin-page-heading">
      <div>
        <p class="admin-eyebrow">HOMEPAGE CONTENT</p>
        <h1>{{ isHero ? '메인 비주얼' : '선교사 소개' }}</h1>
        <p>{{ isHero ? '첫 화면에서 전할 사진과 메시지를 설정하세요.' : '선교사님의 사진과 사역 이야기를 관리하세요.' }}</p>
      </div>
      <button class="admin-button is-primary" :disabled="!content || !isDirty || saving || uploading" @click="save">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>
        {{ saving ? '저장 중…' : '변경사항 저장' }}
      </button>
    </div>

    <div class="admin-save-bar">
      <span :class="['admin-save-state', { 'is-dirty': isDirty }]"><i />{{ isDirty ? '저장하지 않은 변경사항이 있습니다' : '저장된 내용과 같습니다' }}</span>
      <span>마지막 저장 <strong>{{ savedTime }}</strong></span>
    </div>
    <p v-if="successMessage" class="admin-alert is-success" role="status">{{ successMessage }}</p>
    <div v-if="errorMessage || loadError" class="admin-alert is-error" role="alert">
      {{ errorMessage || '내용을 불러오지 못했습니다. Firebase 연결을 확인해주세요.' }}
      <button type="button" @click="reloadContent">최신 내용 다시 불러오기</button>
    </div>
    <div v-if="pending" class="admin-loading" role="status">저장된 내용을 불러오는 중입니다…</div>

    <div v-if="content" class="admin-editor-grid">
      <div class="admin-editor-fields">
        <section class="admin-card">
          <div class="admin-card-heading"><span class="admin-step">01</span><div><h2>이미지</h2><p>{{ isHero ? '가로로 넓은 16:9 사진을 권장합니다.' : '세로형 3:4 사진을 권장합니다.' }}</p></div><span class="admin-ratio-badge">{{ isHero ? '16:9' : '3:4' }}</span></div>
          <div class="admin-upload-area" :class="{ 'is-portrait': !isHero }">
            <img :src="draft.imageUrl" :alt="text.imageAlt || '선택된 이미지 미리보기'" class="admin-upload-image">
            <div class="admin-upload-details">
              <span class="admin-upload-check">현재 적용할 이미지</span>
              <strong>{{ isHero ? '메인 비주얼 이미지' : '선교사 소개 이미지' }}</strong>
              <p>JPG, PNG, WebP · 원본 용량 제한 없음<br>자동으로 1MB 이하 WebP로 최적화됩니다.</p>
              <label class="admin-button is-secondary admin-file-button">
                {{ uploading ? '업로드 중…' : '이미지 변경' }}
                <input type="file" accept="image/jpeg,image/png,image/webp" :disabled="uploading || saving" aria-label="이미지 업로드" @change="uploadImage">
              </label>
            </div>
          </div>
          <p class="admin-field-hint">이미지를 변경한 뒤 ‘변경사항 저장’을 눌러야 홈페이지에 반영됩니다.</p>
        </section>

        <section class="admin-card">
          <div class="admin-card-heading"><span class="admin-step">02</span><div><h2>텍스트</h2><p>홈페이지 언어별로 표시할 내용을 입력하세요.</p></div></div>
          <div class="admin-locale-tabs" role="tablist" aria-label="편집 언어">
            <button v-for="item in siteLocales" :key="item" role="tab" :aria-selected="editingLocale === item" :class="{ 'is-active': editingLocale === item }" @click="editingLocale = item">{{ localeNames[item] }}</button>
          </div>
          <div class="admin-form-fields" role="tabpanel" :aria-label="localeNames[editingLocale] + ' 텍스트'">
            <label v-for="field in fields" :key="field.key" class="admin-field">
              <span class="admin-field-label">{{ field.label }} <small v-if="field.required">필수</small><span>{{ (text[field.key] || '').length }} / {{ field.max }}</span></span>
              <textarea v-if="field.rows" v-model="text[field.key]" :rows="field.rows" :maxlength="field.max" :required="field.required" :placeholder="field.placeholder" :disabled="saving" />
              <input v-else v-model="text[field.key]" :maxlength="field.max" :required="field.required" :placeholder="field.placeholder" :disabled="saving">
              <small v-if="field.hint" class="admin-field-hint">{{ field.hint }}</small>
            </label>
          </div>
        </section>

        <section v-if="isHero" class="admin-card">
          <div class="admin-card-heading"><span class="admin-step">03</span><div><h2>텍스트 정렬</h2><p>사진에 어울리는 위치를 선택하세요.</p></div></div>
          <div class="admin-alignment" role="group" aria-label="메인 비주얼 텍스트 정렬">
            <button v-for="option in alignments" :key="option.value" type="button" :aria-pressed="heroDraft.alignment === option.value" :class="{ 'is-active': heroDraft.alignment === option.value }" @click="heroDraft.alignment = option.value">
              <span class="admin-align-icon" :class="'is-' + option.value" aria-hidden="true"><i /><i /><i /></span>
              {{ option.label }}
            </button>
          </div>
        </section>
      </div>

      <aside class="admin-preview-column">
        <section class="admin-card admin-preview-card">
          <div class="admin-preview-heading"><span class="admin-live-dot" /><h2>미리보기</h2><span>{{ localeNames[editingLocale] }}</span></div>
          <div class="admin-preview-browser"><i /><i /><i /><span>Vision Thru the Bible</span></div>
          <HeroSlide v-if="isHero" v-bind="heroPreview" preview />
          <div v-else class="admin-missionary-preview">
            <img :src="draft.imageUrl" :alt="text.imageAlt">
            <div><span>{{ text.label }}</span><h3>{{ text.title }}</h3><small>{{ text.role }}</small><div class="admin-preview-divider" /><p>{{ text.description }}</p><span class="admin-preview-contact">{{ text.buttonLabel }}</span></div>
          </div>
          <div class="admin-preview-caption"><strong>{{ isHero ? '사진 위에 전하는 한 문장' : '선교의 마음을 담은 소개' }}</strong><p>저장 전 모습을 확인하는 미리보기입니다.<br>실제 화면 크기에 따라 줄바꿈이 달라질 수 있습니다.</p></div>
        </section>
        <div class="admin-editor-note"><span aria-hidden="true">↗</span><p><strong>저장하면 홈페이지에 바로 반영됩니다.</strong><br>언어별 내용을 확인한 후 저장해주세요.</p></div>
        <NuxtLink to="/" target="_blank" class="admin-preview-link">홈페이지에서 확인하기 <span aria-hidden="true">↗</span></NuxtLink>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createDefaultContent, heroSchema, missionarySchema, siteLocales, localeNames, type ContentSection, type SiteContent, type HeroContent, type MissionaryContent, type SiteLocale } from '#shared/site-content';
import { prepareImageUpload } from '~/utils/image-upload';

const props = defineProps<{ section: ContentSection }>();
const { session: adminSession } = useAdminSession();
const { data: content, pending, error: loadError, refresh } = await useFetch<SiteContent>('/api/admin/content', { key: 'admin-site-content' });
const isHero = computed(() => props.section === 'hero');
const draft = ref<HeroContent | MissionaryContent>(createDefaultContent()[props.section]);
const baseline = ref('');
const editingLocale = ref<SiteLocale>('ko');
const saving = ref(false);
const uploading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const text = computed(() => draft.value.translations[editingLocale.value] as unknown as Record<string, string>);
const heroDraft = computed(() => draft.value as HeroContent);
const isDirty = computed(() => Boolean(baseline.value) && JSON.stringify(draft.value) !== baseline.value);
const heroPreview = computed(() => ({
  imageUrl: draft.value.imageUrl, imageAlt: text.value.imageAlt,
  title: text.value.title || '메인타이틀을 입력하세요',
  description: text.value.description || '',
  alignment: heroDraft.value.alignment,
}));
const alignments = [{ value: 'left', label: '좌측 정렬' }, { value: 'center', label: '중앙 정렬' }, { value: 'right', label: '우측 정렬' }] as const;
const savedTime = computed(() => content.value?.updatedAt ? new Date(content.value.updatedAt).toLocaleString('ko-KR') : '아직 저장하지 않음');

interface Field { key: string; label: string; max: number; rows?: number; required?: boolean; placeholder?: string; hint?: string }
const fields = computed<Field[]>(() => isHero.value ? [
  { key: 'title', label: '메인타이틀', max: 180, rows: 3, required: true, hint: '줄바꿈을 입력하면 홈페이지에도 그대로 표시됩니다.' },
  { key: 'description', label: '설명', max: 600, rows: 4 },
  { key: 'imageAlt', label: '이미지 설명', max: 200, hint: '화면 낭독기로 사진을 이해할 수 있도록 설명해주세요.' },
] : [
  { key: 'label', label: '섹션 이름', max: 80 },
  { key: 'title', label: '선교사 이름 / 제목', max: 180, required: true },
  { key: 'role', label: '소속 / 역할', max: 200 },
  { key: 'description', label: '소개 내용', max: 6000, rows: 10, required: true, hint: '문단 사이에 빈 줄을 넣어 구분할 수 있습니다.' },
  { key: 'buttonLabel', label: '문의 버튼 문구', max: 80, hint: '클릭하면 홈페이지 문의 영역으로 이동합니다. 비우면 버튼을 숨깁니다.' },
  { key: 'badgeTitle', label: '사진 배지 제목', max: 80 },
  { key: 'badgeSubtitle', label: '사진 배지 설명', max: 80 },
  { key: 'imageAlt', label: '이미지 설명', max: 200 },
]);

watch([content, () => props.section], () => {
  if (content.value) {
    draft.value = JSON.parse(JSON.stringify(content.value[props.section]));
    baseline.value = JSON.stringify(draft.value);
  }
}, { immediate: true });

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  errorMessage.value = '';
  successMessage.value = '';
  uploading.value = true;
  try {
    const prepared = await prepareImageUpload(file);
    const result = await $fetch<{ imageUrl: string }>('/api/admin/upload', {
      method: 'POST', body: prepared, headers: { 'Content-Type': 'image/webp' },
    });
    draft.value.imageUrl = result.imageUrl;
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || error.message || '이미지 업로드에 실패했습니다.';
  } finally {
    uploading.value = false;
    input.value = '';
  }
}

async function save() {
  if (!content.value || uploading.value) return;
  errorMessage.value = '';
  successMessage.value = '';
  const validation = (isHero.value ? heroSchema : missionarySchema).safeParse(draft.value);
  if (!validation.success) {
    const issue = validation.error.issues[0];
    if (issue?.path[0] === 'translations') editingLocale.value = issue.path[1] as SiteLocale;
    errorMessage.value = '필수 제목과 소개 내용, 글자 수를 확인해주세요.';
    return;
  }
  saving.value = true;
  try {
    content.value = await $fetch<SiteContent>('/api/admin/content/' + props.section, {
      method: 'PUT', body: { content: validation.data, version: content.value.version },
    });
    successMessage.value = '저장했습니다. 홈페이지에 변경사항이 반영되었습니다.';
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || '저장하지 못했습니다. 다시 시도해주세요.';
    if (error.statusCode === 401 || error.status === 401) {
      adminSession.value = null;
      errorMessage.value = '로그인이 만료되었습니다. 새 창에서 다시 로그인한 뒤 저장해주세요.';
    }
  } finally {
    saving.value = false;
  }
}
async function reloadContent() {
  if (isDirty.value && !window.confirm('저장하지 않은 내용을 버리고 최신 내용을 불러올까요?')) return;
  errorMessage.value = '';
  successMessage.value = '';
  await refresh();
}
function beforeUnload(event: BeforeUnloadEvent) {
  if (!isDirty.value && !uploading.value) return;
  event.preventDefault();
  event.returnValue = '';
}
onMounted(() => window.addEventListener('beforeunload', beforeUnload));
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload));
onBeforeRouteLeave(() => {
  if ((isDirty.value || uploading.value) && !window.confirm('저장하지 않은 변경사항이 있습니다. 이 페이지를 나갈까요?')) return false;
});
</script>
