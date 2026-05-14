<template>
  <div class="overflow-hidden">
    <HeroSlide />
    <Newsletter />
    <YoutubeLectures />
    <ContactForm />
  </div>
</template>

<script setup>
// Components will be auto-imported by Nuxt 3
useHead({
  title: 'Vision Thru the Bible Ministries',
  meta: [
    { name: 'description', content: 'Cristo Es Suficiente para mi' }
  ]
})
</script>
