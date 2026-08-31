<template>
  <div>
    <div class="admin-page-heading">
      <div>
        <p class="admin-eyebrow">LETTERS FROM THE FIELD</p>
        <h1>최근 소식지</h1>
        <p>사역 현장의 이야기를 작성하고 공개 상태를 관리하세요.</p>
      </div>
      <NuxtLink to="/admin/newsletters/new" class="admin-button is-primary"
        >＋ 소식지 작성</NuxtLink
      >
    </div>
    <div class="news-stats">
      <div v-for="item in filters.slice(0, 3)" :key="item.value">
        <span>{{ item.label }}</span
        ><strong>{{
          item.value === 'all'
            ? posts.filter((p) => p.status !== 'deleted').length
            : posts.filter((p) => p.status === item.value).length
        }}</strong>
      </div>
    </div>
    <div class="news-list-controls">
      <div class="news-status-tabs" aria-label="게시글 상태">
        <button
          v-for="item in filters"
          :key="item.value"
          :class="{ 'is-active': filter === item.value }"
          :aria-pressed="filter === item.value"
          @click="filter = item.value"
        >
          {{ item.label }}
        </button>
      </div>
      <input
        v-model="search"
        class="news-search"
        aria-label="소식지 검색"
        placeholder="제목으로 검색"
      />
    </div>
    <p v-if="message" class="admin-alert is-success" role="status">
      {{ message }}
    </p>
    <div v-if="errorMessage || error" class="admin-alert is-error" role="alert">
      {{ errorMessage || '목록을 불러오지 못했습니다.'
      }}<button @click="refresh()">새로고침</button>
    </div>
    <p v-if="pending" class="admin-loading">소식지를 불러오는 중입니다…</p>
    <div v-else-if="!visiblePosts.length" class="news-empty admin-card">
      <span aria-hidden="true">✉</span>
      <h2>
        {{
          filter === 'deleted'
            ? '휴지통이 비어 있습니다'
            : search
              ? '검색 결과가 없습니다'
              : '아직 등록된 소식지가 없습니다'
        }}
      </h2>
      <p>새로운 사역 이야기와 기도 소식을 전해주세요.</p>
      <NuxtLink
        v-if="!search && filter !== 'deleted'"
        to="/admin/newsletters/new"
        class="admin-button is-secondary"
        >첫 소식지 작성하기</NuxtLink
      >
    </div>
    <div v-else class="news-admin-list">
      <article
        v-for="post in visiblePosts"
        :key="post.id"
        class="news-admin-row"
      >
        <img
          v-if="post.thumbnail"
          :src="post.thumbnail"
          :alt="post.translations.ko.title"
        />
        <div v-else class="news-no-image" aria-hidden="true">LETTER</div>
        <div class="news-row-content">
          <div class="news-row-meta">
            <span :class="['news-state', 'is-' + post.status]">{{
              stateNames[post.status]
            }}</span
            ><span>{{
              countries?.find((c) => c.id === post.countryId)?.name
            }}</span
            ><span v-if="post.attachment">PDF 첨부</span>
          </div>
          <NuxtLink
            v-if="post.status !== 'deleted'"
            :to="'/admin/newsletters/' + post.id"
            >{{ post.translations.ko.title }}</NuxtLink
          ><strong v-else>{{ post.translations.ko.title }}</strong
          ><small
            >수정 {{ new Date(post.updatedAt).toLocaleString('ko-KR') }}</small
          >
        </div>
        <div class="news-row-actions">
          <template v-if="post.status !== 'deleted'"
            ><NuxtLink :to="'/admin/newsletters/' + post.id">수정</NuxtLink
            ><button
              :disabled="!!busy"
              @click="
                changeState(
                  post,
                  post.status === 'published' ? 'hidden' : 'published',
                )
              "
            >
              {{ post.status === 'published' ? '숨김' : '공개' }}</button
            ><button
              class="is-danger"
              :disabled="!!busy"
              @click="changeState(post, 'deleted')"
            >
              삭제
            </button></template
          ><button
            v-else
            :disabled="!!busy"
            @click="changeState(post, 'hidden')"
          >
            숨김으로 복원
          </button>
        </div>
      </article>
    </div>
    <p class="admin-field-hint news-list-footnote">
      숨김·삭제된 글은 홈페이지와 PDF 다운로드에서 제외됩니다. 삭제한 글은
      휴지통에서 복원할 수 있으며, PDF 원본은 보존합니다.
    </p>
  </div>
</template>
<script setup lang="ts">
import type { NewsletterSummary, NewsletterCountry } from '#shared/newsletter';
definePageMeta({ layout: 'admin', middleware: 'admin' });
defineI18nRoute({ locales: ['ko'] });
const {
  data: posts,
  error,
  pending,
  refresh,
} = await useFetch<NewsletterSummary[]>('/api/admin/newsletters', {
  default: () => [],
});
const { data: countries } = await useFetch<NewsletterCountry[]>(
  '/api/newsletter-countries',
);
const filter = ref('all');
const search = ref('');
const busy = ref('');
const errorMessage = ref('');
const message = ref('');
const filters = [
  { value: 'all', label: '전체' },
  { value: 'published', label: '공개' },
  { value: 'hidden', label: '숨김' },
  { value: 'deleted', label: '휴지통' },
];
const stateNames = { published: '공개', hidden: '숨김', deleted: '삭제' };
const visiblePosts = computed(() =>
  posts.value.filter(
    (post) =>
      (filter.value === 'all'
        ? post.status !== 'deleted'
        : post.status === filter.value) &&
      post.translations.ko.title
        .toLocaleLowerCase()
        .includes(search.value.trim().toLocaleLowerCase()),
  ),
);
async function changeState(
  post: NewsletterSummary,
  status: 'published' | 'hidden' | 'deleted',
) {
  if (
    status === 'deleted' &&
    !window.confirm(
      '이 소식지를 휴지통으로 이동할까요? 홈페이지와 PDF 다운로드가 차단됩니다.',
    )
  )
    return;
  busy.value = post.id;
  errorMessage.value = '';
  message.value = '';
  try {
    await $fetch('/api/admin/newsletters/' + post.id + '/state', {
      method: 'PATCH',
      body: { version: post.version, status },
    });
    await refresh();
    message.value =
      status === 'deleted'
        ? '휴지통으로 이동했습니다.'
        : '공개 상태를 변경했습니다.';
  } catch (error: any) {
    errorMessage.value =
      error.data?.statusMessage || '상태를 변경하지 못했습니다.';
  } finally {
    busy.value = '';
  }
}
</script>
