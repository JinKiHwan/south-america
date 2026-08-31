<template><div /></template>
<script setup lang="ts">
// Old bookmarks lead to the protected writing screen.
await navigateTo('/admin/newsletters/new', { redirectCode: 302 });
</script>
