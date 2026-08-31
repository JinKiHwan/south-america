<template>
  <div class="admin-login-wrap">
    <NuxtLink to="/" class="admin-login-brand">Vision Thru the Bible <span>MINISTRIES</span></NuxtLink>
    <section class="admin-login-card" aria-labelledby="login-title">
      <div class="admin-login-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/></svg>
      </div>
      <p class="admin-eyebrow">SOUTH AMERICA · ADMIN</p>
      <h1 id="login-title">사이트 운영에 오신 것을<br>환영합니다.</h1>
      <p class="admin-login-description">관리자 계정으로 로그인해 홈페이지를 관리하세요.</p>
      <div v-if="status && !status.configured" class="admin-alert is-warning" role="status">
        <strong>Firebase 연결을 준비하고 있습니다.</strong>
        <p>서버 연결 설정과 마스터 계정 생성 후 로그인할 수 있습니다.</p>
      </div>
      <div v-else-if="status?.emulator" class="admin-alert is-warning" role="status">
        로컬 테스트 환경입니다. 실제 Firebase 프로젝트에는 저장되지 않습니다.
      </div>
      <form @submit.prevent="login" class="admin-login-form">
        <label class="admin-field">아이디
          <input v-model="username" name="username" autocomplete="username" placeholder="관리자 아이디" required maxlength="40" autocapitalize="none" spellcheck="false">
        </label>
        <label class="admin-field">비밀번호
          <span class="admin-password-input">
            <input v-model="password" name="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="비밀번호 입력" required maxlength="128">
            <button type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'">{{ showPassword ? '숨김' : '보기' }}</button>
          </span>
        </label>
        <p v-if="errorMessage" class="admin-alert is-error" role="alert">{{ errorMessage }}</p>
        <button class="admin-button is-primary admin-login-submit" type="submit" :disabled="pending || !status?.configured">{{ pending ? '로그인 중…' : '로그인' }} <span aria-hidden="true">→</span></button>
      </form>
      <p class="admin-login-security">허가된 관리자만 접근할 수 있습니다.</p>
    </section>
    <NuxtLink to="/" class="admin-login-back">← 홈페이지로 돌아가기</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin-auth' });
defineI18nRoute({ locales: ['ko'] });
const { session } = useAdminSession();
const { data: status } = await useFetch('/api/admin/status');
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const pending = ref(false);
const errorMessage = ref('');

async function login() {
  pending.value = true;
  errorMessage.value = '';
  try {
    session.value = await $fetch('/api/admin/login', {
      method: 'POST', body: { username: username.value, password: password.value },
    });
    password.value = '';
    await navigateTo('/admin');
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || '로그인할 수 없습니다. 잠시 후 다시 시도해주세요.';
  } finally {
    pending.value = false;
  }
}
</script>
