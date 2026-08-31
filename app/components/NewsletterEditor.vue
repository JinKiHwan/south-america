<template>
  <div>
    <div class="admin-page-heading news-editor-heading">
      <div>
        <NuxtLink to="/admin/newsletters" class="news-back"
          >← 소식지 목록</NuxtLink
        >
        <p class="admin-eyebrow">WRITE A LETTER</p>
        <h1>{{ postId ? '소식지 수정' : '새 소식지 작성' }}</h1>
        <p>사진과 글, PDF로 사역의 이야기를 전하세요.</p>
      </div>
      <div class="news-editor-actions">
        <button
          class="admin-button is-secondary"
          :disabled="busy || deleted"
          @click="save('hidden')"
        >
          숨김 저장</button
        ><button
          class="admin-button is-primary"
          :disabled="busy || deleted"
          @click="save('published')"
        >
          {{ saving ? '저장 중…' : '공개 저장' }}
        </button>
      </div>
    </div>
    <div class="admin-save-bar">
      <span :class="['admin-save-state', { 'is-dirty': dirty }]"
        ><i />{{
          dirty
            ? '저장하지 않은 변경사항이 있습니다'
            : postId
              ? '저장된 내용과 같습니다'
              : '새 소식지를 작성 중입니다'
        }}</span
      ><span
        >현재 상태
        <strong>{{
          currentStatus === 'published' ? '공개' : deleted ? '삭제' : '숨김'
        }}</strong></span
      >
    </div>
    <p v-if="errorMessage" class="admin-alert is-error" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="success" class="admin-alert is-success" role="status">
      {{ success }}
    </p>
    <p v-if="deleted" class="admin-alert is-warning">
      휴지통에 있는 글입니다. 목록에서 복원한 뒤 수정해주세요.
    </p>
    <div v-if="!deleted" class="news-write-grid">
      <div class="news-write-main">
        <section class="admin-card">
          <div class="admin-card-heading">
            <span class="admin-step">01</span>
            <div>
              <h2>본문 작성</h2>
              <p>
                한국어는 필수입니다. 번역을 비워두면 한국어 내용이 표시됩니다.
              </p>
            </div>
          </div>
          <div class="admin-locale-tabs" role="tablist" aria-label="본문 언어">
            <button
              v-for="item in siteLocales"
              :key="item"
              role="tab"
              :aria-selected="locale === item"
              :class="{ 'is-active': locale === item }"
              @click="locale = item"
            >
              {{ localeNames[item] }}
            </button>
          </div>
          <div class="admin-form-fields">
            <label class="admin-field"
              >제목
              <input
                v-model="copy.title"
                aria-label="소식지 제목"
                maxlength="180"
                placeholder="이번 사역의 이야기를 담은 제목"
                :disabled="saving" /></label
            ><label class="admin-field"
              >요약 설명<textarea
                v-model="copy.excerpt"
                aria-label="요약 설명"
                rows="3"
                maxlength="600"
                placeholder="목록에서 보여줄 짧은 소개를 적어주세요."
                :disabled="saving"
              />
            </label>
            <div class="admin-field">
              <span>본문</span
              ><ClientOnly
                ><TiptapEditor
                  :key="locale"
                  v-model="copy.body"
                  :disabled="saving"
                  placeholder="사역 현장의 소식과 기도 제목을 자유롭게 작성해주세요." /></ClientOnly
              ><small class="admin-field-hint"
                >굵게, 제목, 목록, 인용 등의 서식을 사용할 수 있습니다. 본문은
                언어별 최대 50,000자(HTML 포함)입니다.</small
              >
            </div>
          </div>
        </section>
      </div>
      <aside class="news-write-aside">
        <section class="admin-card">
          <h2>게시 설정</h2>
          <label class="admin-field"
            >사역 국가<select v-model="draft.countryId" :disabled="saving">
              <option
                v-for="country in countries"
                :key="country.id"
                :value="country.id"
              >
                {{ country.name }}
              </option>
            </select></label
          ><NuxtLink
            to="/admin/countries"
            target="_blank"
            class="news-inline-link"
            >국가 추가하기 ↗</NuxtLink
          ><button class="news-text-button" @click="refreshCountries()">
            국가 목록 새로고침
          </button>
          <p class="admin-field-hint">
            공개 저장하면 홈페이지의 최근 소식지와 목록에 표시됩니다.
          </p>
          <NuxtLink
            v-if="postId && currentStatus === 'published'"
            :to="'/newsletter/' + postId"
            target="_blank"
            class="news-inline-link"
            >게시글 보기 ↗</NuxtLink
          >
        </section>
        <section class="admin-card">
          <h2>대표 썸네일</h2>
          <div class="news-thumbnail">
            <img
              v-if="draft.thumbnail"
              :src="draft.thumbnail"
              alt="소식지 썸네일 미리보기"
            /><span v-else>사역의 한 장면을 담아주세요</span>
          </div>
          <label class="admin-button is-secondary admin-file-button"
            >{{ imageUploading ? '업로드 중…' : '이미지 선택'
            }}<input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="소식지 썸네일 업로드"
              :disabled="busy"
              @change="uploadThumbnail" /></label
          ><button
            v-if="draft.thumbnail"
            class="news-text-button"
            :disabled="busy"
            @click="draft.thumbnail = ''"
          >
            이미지 제거
          </button>
          <p class="admin-field-hint">JPG, PNG, WebP · 최대 4MB · 16:9 권장</p>
        </section>
        <section class="admin-card news-pdf-card">
          <div class="news-pdf-heading">
            <h2>PDF 첨부</h2>
            <span>GOOGLE DRIVE</span>
          </div>
          <p v-if="!pdfStatus?.configured" class="admin-alert is-warning">
            Google Drive 연결이 필요합니다. PDF 없이 글을 먼저 저장할 수
            있습니다.
          </p>
          <p
            v-else-if="pdfStatus.provider === 'emulator'"
            class="admin-field-hint"
          >
            테스트용 로컬 저장소입니다. 실제 Google Drive에는 전송되지 않습니다.
          </p>
          <div v-if="attachment" class="news-pdf-file">
            <span class="news-pdf-icon">PDF</span>
            <div>
              <strong>{{ attachment.name }}</strong
              ><small
                >{{ formatFileSize(attachment.size) }} · 첨부 준비 완료</small
              >
            </div>
            <button
              class="news-text-button"
              :disabled="busy"
              @click="
                attachment = null;
                draft.attachmentId = null;
              "
            >
              제거
            </button>
          </div>
          <label class="admin-button is-secondary admin-file-button"
            >{{
              pdfPreparing
                ? '파일 확인 중…'
                : attachment
                  ? 'PDF 교체'
                  : 'PDF 선택'
            }}<input
              type="file"
              accept="application/pdf,.pdf"
              aria-label="PDF 업로드"
              :disabled="busy || !pdfStatus?.configured"
              @change="choosePdf"
          /></label>
          <p class="admin-field-hint">
            최대 500MB · 한 글에 PDF 1개<br />업로드 완료 후 글을 저장하면
            다운로드 버튼이 생깁니다.
          </p>
          <div v-if="upload" class="news-upload-progress">
            <div>
              <strong>{{ upload.name }}</strong
              ><span
                >{{ Math.floor((upload.offset / upload.size) * 100) }}%</span
              >
            </div>
            <progress
              :value="upload.offset"
              :max="upload.size"
              aria-label="PDF 업로드 진행률"
            /><small
              >{{ formatFileSize(upload.offset) }} /
              {{ formatFileSize(upload.size) }}</small
            ><button
              v-if="pdfUploading"
              class="news-text-button"
              @click="pauseRequested = true"
            >
              일시정지</button
            ><button
              v-else-if="upload.state !== 'complete'"
              class="news-text-button"
              :disabled="saving"
              @click="resumePdf"
            >
              이어 올리기
            </button>
          </div>
          <p v-if="pdfError" class="admin-alert is-error" role="alert">
            {{ pdfError }}
          </p>
          <p class="admin-field-hint">
            페이지를 새로고침했다면 같은 파일을 다시 선택해 이어 올릴 수
            있습니다. 글을 숨기거나 삭제하면 다운로드도 차단됩니다.
          </p>
        </section>
      </aside>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  emptyNewsletter,
  formatFileSize,
  PDF_CHUNK_BYTES,
  PDF_MAX_BYTES,
  type NewsletterInput,
  type NewsletterPost,
  type NewsletterCountry,
  type PdfAttachment,
} from '#shared/newsletter';
import {
  siteLocales,
  localeNames,
  type SiteLocale,
} from '#shared/site-content';
const props = defineProps<{ id?: string }>();
const route = useRoute();
const router = useRouter();
const { data: countries, refresh: refreshCountries } = await useFetch<
  NewsletterCountry[]
>('/api/newsletter-countries');
const { data: pdfStatus } = await useFetch<{
  configured: boolean;
  provider: string | null;
}>('/api/admin/pdf/status');
const initialId =
  props.id || (typeof route.query.draft === 'string' ? route.query.draft : '');
const postId = ref(initialId);
const draft = ref<NewsletterInput>(emptyNewsletter());
const attachment = ref<PdfAttachment | null>(null);
const version = ref(0);
const currentStatus = ref('hidden');
const baseline = ref('');
const locale = ref<SiteLocale>('ko');
const saving = ref(false);
const imageUploading = ref(false);
const pdfUploading = ref(false);
const pdfPreparing = ref(false);
const pauseRequested = ref(false);
const errorMessage = ref('');
const success = ref('');
const pdfError = ref('');
const deleted = computed(() => currentStatus.value === 'deleted');
const busy = computed(
  () =>
    saving.value ||
    imageUploading.value ||
    pdfUploading.value ||
    pdfPreparing.value,
);
const copy = computed(() => draft.value.translations[locale.value]);
const dirty = computed(() => JSON.stringify(draft.value) !== baseline.value);
interface Upload {
  id: string;
  postId: string;
  name: string;
  size: number;
  fingerprint: string;
  offset: number;
  state: 'uploading' | 'complete';
}
const upload = ref<Upload | null>(null);
let selectedFile: File | null = null;
function hydrate(post: NewsletterPost) {
  postId.value = post.id;
  version.value = post.version;
  currentStatus.value = post.status;
  attachment.value = post.attachment;
  draft.value = {
    countryId: post.countryId,
    thumbnail: post.thumbnail,
    status: post.status === 'published' ? 'published' : 'hidden',
    attachmentId: post.attachment?.id || null,
    translations: structuredClone(post.translations),
  };
  baseline.value = JSON.stringify(draft.value);
}
if (initialId) {
  try {
    hydrate(
      await useRequestFetch()<NewsletterPost>(
        '/api/admin/newsletters/' + encodeURIComponent(initialId),
      ),
    );
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: '소식지를 찾을 수 없습니다.',
    });
  }
} else baseline.value = JSON.stringify(draft.value);
async function save(
  status: 'hidden' | 'published',
  quiet = false,
): Promise<boolean> {
  if (saving.value || imageUploading.value || pdfUploading.value) return false;
  errorMessage.value = '';
  success.value = '';
  if (!draft.value.translations.ko.title.trim()) {
    locale.value = 'ko';
    errorMessage.value = '한국어 제목을 입력해주세요.';
    return false;
  }
  saving.value = true;
  try {
    const content = { ...draft.value, status };
    const id = postId.value || crypto.randomUUID();
    const post = await $fetch<NewsletterPost>(
      '/api/admin/newsletters' + (postId.value ? '/' + postId.value : ''),
      {
        method: postId.value ? 'PUT' : 'POST',
        body: postId.value
          ? { version: version.value, content }
          : { id, content },
      },
    );
    hydrate(post);
    success.value = quiet
      ? 'PDF를 첨부할 숨김 글을 저장했습니다.'
      : status === 'published'
        ? '공개 저장했습니다. 홈페이지에 반영되었습니다.'
        : '숨김 상태로 저장했습니다.';
    if (!props.id)
      await router.replace({ query: { ...route.query, draft: post.id } });
    return true;
  } catch (error: any) {
    errorMessage.value =
      error.data?.statusMessage || '글을 저장하지 못했습니다.';
    return false;
  } finally {
    saving.value = false;
  }
}
async function uploadThumbnail(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) {
    errorMessage.value = '썸네일은 4MB 이하로 선택해주세요.';
    input.value = '';
    return;
  }
  imageUploading.value = true;
  errorMessage.value = '';
  try {
    const result = await $fetch<{ imageUrl: string }>('/api/admin/upload', {
      method: 'POST',
      body: file,
      headers: { 'Content-Type': file.type },
    });
    draft.value.thumbnail = result.imageUrl;
  } catch (error: any) {
    errorMessage.value =
      error.data?.statusMessage || '이미지를 업로드하지 못했습니다.';
  } finally {
    imageUploading.value = false;
    input.value = '';
  }
}
function cacheUpload() {
  try {
    if (upload.value)
      sessionStorage.setItem(
        'newsletter-upload:' + postId.value,
        JSON.stringify(upload.value),
      );
  } catch {
    /* Upload still works when session storage is unavailable. */
  }
}
async function fileFingerprint(file: File) {
  // Hash every byte in bounded slices, so resume cannot mix similarly named PDFs.
  // Hashing the small list of chunk digests avoids buffering a 500MB file in memory.
  const digests = new Uint8Array(Math.ceil(file.size / PDF_CHUNK_BYTES) * 32);
  for (
    let start = 0, index = 0;
    start < file.size;
    start += PDF_CHUNK_BYTES, index++
  ) {
    const bytes = await file
      .slice(start, start + PDF_CHUNK_BYTES)
      .arrayBuffer();
    digests.set(
      new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),
      index * 32,
    );
  }
  return Array.from(
    new Uint8Array(await crypto.subtle.digest('SHA-256', digests)),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
async function choosePdf(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file || busy.value) return;
  pdfError.value = '';
  if (
    !/\.pdf$/i.test(file.name) ||
    file.size > PDF_MAX_BYTES ||
    file.size < 8
  ) {
    pdfError.value = '500MB 이하 PDF 파일을 선택해주세요.';
    return;
  }
  pdfPreparing.value = true;
  try {
    if (!/^%PDF-\d\.\d/.test(await file.slice(0, 8).text())) {
      pdfError.value = '올바른 PDF 파일이 아닙니다.';
      return;
    }
    if (!postId.value && !(await save('hidden', true))) return;
    const fingerprint = await fileFingerprint(file);
    selectedFile = file;
    let cached: Upload | null = null;
    try {
      cached = JSON.parse(
        sessionStorage.getItem('newsletter-upload:' + postId.value) || 'null',
      );
    } catch {}
    if (
      cached &&
      cached.name === file.name &&
      cached.size === file.size &&
      cached.fingerprint === fingerprint &&
      cached.state !== 'complete'
    ) {
      try {
        upload.value = await $fetch<Upload>('/api/admin/pdf/' + cached.id);
      } catch (error: any) {
        if (error.statusCode !== 404 && error.statusCode !== 410) throw error;
        upload.value = null;
      }
    } else upload.value = null;
    if (!upload.value)
      upload.value = await $fetch<Upload>('/api/admin/pdf', {
        method: 'POST',
        body: {
          postId: postId.value,
          name: file.name,
          size: file.size,
          fingerprint,
        },
      });
    cacheUpload();
    await resumePdf();
  } catch (error: any) {
    pdfError.value =
      error.data?.statusMessage || 'PDF 업로드를 시작하지 못했습니다.';
  } finally {
    pdfPreparing.value = false;
  }
}
async function resumePdf() {
  if (pdfUploading.value) return;
  if (!upload.value || !selectedFile) {
    pdfError.value = '같은 PDF 파일을 다시 선택해주세요.';
    return;
  }
  pdfUploading.value = true;
  pauseRequested.value = false;
  pdfError.value = '';
  try {
    upload.value = await $fetch<Upload>('/api/admin/pdf/' + upload.value.id);
    while (upload.value.state !== 'complete' && !pauseRequested.value) {
      const start = upload.value.offset;
      const end = Math.min(start + PDF_CHUNK_BYTES, selectedFile.size);
      upload.value = await $fetch<Upload>('/api/admin/pdf/' + upload.value.id, {
        method: 'PUT',
        body: selectedFile.slice(start, end),
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Range': `bytes ${start}-${end - 1}/${selectedFile.size}`,
        },
        retry: 0,
      });
      cacheUpload();
    }
    if (upload.value.state === 'complete') {
      attachment.value = {
        id: upload.value.id,
        name: upload.value.name,
        size: upload.value.size,
      };
      draft.value.attachmentId = upload.value.id;
      cacheUpload();
      success.value = 'PDF 업로드를 완료했습니다. 글을 저장하면 첨부됩니다.';
    }
  } catch (error: any) {
    pdfError.value =
      error.data?.statusMessage ||
      '전송이 중단되었습니다. 이어 올리기를 눌러주세요.';
  } finally {
    pdfUploading.value = false;
  }
}
function beforeUnload(event: BeforeUnloadEvent) {
  if (dirty.value || pdfUploading.value || pdfPreparing.value) {
    event.preventDefault();
    event.returnValue = '';
  }
}
onMounted(() => window.addEventListener('beforeunload', beforeUnload));
onBeforeUnmount(() => {
  pauseRequested.value = true;
  window.removeEventListener('beforeunload', beforeUnload);
});
onBeforeRouteLeave(() => {
  if (
    (dirty.value || pdfUploading.value || pdfPreparing.value) &&
    !window.confirm(
      '저장하지 않은 내용 또는 진행 중인 업로드가 있습니다. 나갈까요?',
    )
  )
    return false;
});
</script>
