<template>
  <div class="admin-app" data-admin-app>
    <aside class="admin-sidebar">
      <NuxtLink to="/admin" class="admin-brand">
        <span class="admin-brand-mark">V</span>
        <span>Vision Thru the Bible<small>SOUTH AMERICA · ADMIN</small></span>
      </NuxtLink>
      <div class="admin-nav-label">홈페이지 관리</div>
      <nav class="admin-nav" aria-label="운영툴 메뉴">
        <NuxtLink to="/admin" :class="{ 'is-active': route.path === '/admin' }">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="8" cy="9" r="1.5" />
            <path d="m3 17 5-5 4 4 3-3 6 6" />
          </svg>
          메인 비주얼
        </NuxtLink>
        <NuxtLink
          to="/admin/missionary"
          :class="{ 'is-active': route.path === '/admin/missionary' }"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
          </svg>
          선교사 소개
        </NuxtLink>
        <NuxtLink
          to="/admin/newsletters"
          :class="{ 'is-active': route.path.startsWith('/admin/newsletters') }"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 8h8M8 12h8M8 16h5" />
          </svg>
          최근 소식지
        </NuxtLink>
        <NuxtLink
          to="/admin/countries"
          :class="{ 'is-active': route.path === '/admin/countries' }"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <path d="M3 12h18" />
          </svg>
          국가 관리
        </NuxtLink>
      </nav>
      <div class="admin-sidebar-bottom">
        <p>마음을 전하는 공간을<br />함께 가꾸어갑니다.</p>
        <NuxtLink to="/" target="_blank" class="admin-site-link"
          >홈페이지 열기 <span aria-hidden="true">↗</span></NuxtLink
        >
        <small>Vision Thru the Bible Ministries</small>
      </div>
    </aside>
    <div class="admin-workspace">
      <header class="admin-topbar">
        <span
          >홈페이지 관리 <span class="admin-breadcrumb-divider">/</span>
          <strong>{{ sectionTitle }}</strong></span
        >
        <div class="admin-account">
          <span class="admin-account-dot" aria-hidden="true" />
          <span>{{ session?.username }} <small>마스터</small></span>
          <button type="button" @click="logout" :disabled="loggingOut">
            로그아웃
          </button>
        </div>
      </header>
      <p v-if="logoutError" class="admin-alert is-error" role="alert">
        {{ logoutError }}
      </p>
      <main class="admin-main">
        <p v-if="status?.emulator" class="admin-alert is-warning" role="status">
          로컬 테스트 환경 · 변경사항은 실제 Firebase 프로젝트에 저장되지
          않습니다.
        </p>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import '~/assets/css/admin.css';

const route = useRoute();
const { session } = useAdminSession();
const { data: status } = await useFetch('/api/admin/status');
const loggingOut = ref(false);
const logoutError = ref('');
const sectionTitle = computed(() =>
  route.path.startsWith('/admin/newsletters')
    ? '최근 소식지'
    : route.path === '/admin/countries'
      ? '국가 관리'
      : route.path === '/admin/missionary'
        ? '선교사 소개'
        : '메인 비주얼',
);
useHead({
  title: '사이트 운영 | Vision Thru the Bible',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

async function logout() {
  loggingOut.value = true;
  logoutError.value = '';
  try {
    await $fetch('/api/admin/logout', { method: 'POST' });
    session.value = null;
    await navigateTo('/admin/login');
  } catch {
    logoutError.value = '로그아웃하지 못했습니다. 다시 시도해주세요.';
  } finally {
    loggingOut.value = false;
  }
}
</script>
