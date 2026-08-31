<template><AdminContentEditor section="hero" /></template>
<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });
// Keep a single Korean /admin route recognized by the locale router.
defineI18nRoute({ locales: ['ko'] });
</script>
