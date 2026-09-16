<template>
  <div>
    <div class="admin-page-heading">
      <div>
        <p class="admin-eyebrow">YOUTUBE SETTINGS</p>
        <h1>유튜브 자동화</h1>
        <p>채널을 연결하면 홈페이지에 최신 공개 영상이 자동으로 표시됩니다.</p>
      </div>
    </div>
    <p v-if="errorMessage || error" class="admin-alert is-error" role="alert">{{ errorMessage || '유튜브 설정을 불러오지 못했습니다.' }}</p>
    <p v-if="success" class="admin-alert is-success" role="status">{{ success }}</p>
    <section class="admin-card youtube-settings-card">
      <h2>채널 연결</h2>
      <label class="admin-field">유튜브 채널 주소 또는 채널 ID
        <input v-model="channel" placeholder="https://www.youtube.com/@채널핸들" maxlength="300" :disabled="saving" />
      </label>
      <p class="admin-field-hint">/channel/UC… 주소, UC로 시작하는 채널 ID 또는 @핸들 주소를 입력하세요. @핸들은 API 키 설정 후 확인할 수 있습니다. 비워 저장하면 홈페이지에서 유튜브 영역을 숨깁니다.</p>
      <p :class="['admin-alert', snapshot?.apiKeyConfigured ? 'is-success' : 'is-warning']" role="status">
        {{ snapshot?.apiKeyConfigured ? '서버의 YouTube API 키가 설정되어 있습니다.' : '서버의 YouTube API 키가 아직 설정되지 않았습니다. Vercel 환경 변수 YOUTUBE_API_KEY를 추가해야 실제 영상을 불러올 수 있습니다.' }}
      </p>
      <div class="youtube-settings-actions">
        <button type="button" class="admin-button is-primary" :disabled="saving || !dirty" @click="save">{{ saving ? '저장 중…' : '채널 저장' }}</button>
        <NuxtLink v-if="snapshot?.channelId" :to="`https://www.youtube.com/channel/${snapshot.channelId}/videos`" target="_blank" rel="noopener noreferrer" class="admin-button is-secondary">채널 확인 ↗</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });
defineI18nRoute({ locales: ['ko'] });
const { data: snapshot, error, refresh } = await useFetch<{ version: number; channelId: string; apiKeyConfigured: boolean }>('/api/admin/youtube');
const channel = ref('');
watch(snapshot, (value) => { channel.value = value?.channelId || ''; }, { immediate: true });
const dirty = computed(() => channel.value.trim() !== (snapshot.value?.channelId || ''));
const saving = ref(false);
const errorMessage = ref('');
const success = ref('');
async function save() {
  if (!snapshot.value) return;
  saving.value = true;
  errorMessage.value = '';
  success.value = '';
  try {
    await $fetch('/api/admin/youtube', { method: 'PUT', body: { version: snapshot.value.version, channel: channel.value } });
    await refresh();
    success.value = '유튜브 채널을 저장했습니다.';
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || '채널을 저장하지 못했습니다.';
  } finally { saving.value = false; }
}
</script>

<style scoped>
.youtube-settings-card { max-width: 760px; display: grid; gap: 20px; }
.youtube-settings-card h2 { margin: 0; font-size: 18px; }
.youtube-settings-actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
