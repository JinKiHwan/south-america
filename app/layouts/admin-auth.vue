<template>
  <main class="admin-app admin-auth" data-admin-app><slot /></main>
</template>

<script setup lang="ts">
import '~/assets/css/admin.css';
useHead({ title: '관리자 로그인 | Vision Thru the Bible', meta: [{ name: 'robots', content: 'noindex, nofollow' }] });
</script>
