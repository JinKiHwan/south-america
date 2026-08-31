<template>
  <NewsletterEditor
    :id="String(route.params.id)"
    :key="String(route.params.id)"
  />
</template>
<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });
defineI18nRoute({ locales: ['ko'] });
const route = useRoute();
</script>
