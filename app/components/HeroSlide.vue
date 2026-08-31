<template>
  <section class="main-visual" :data-alignment="alignment" aria-labelledby="main-visual-title">
    <img
      class="main-visual__image"
      :src="imageUrl"
      :alt="imageAlt"
      loading="eager"
      fetchpriority="high"
    />
    <div class="main-visual__overlay" aria-hidden="true" />

    <div class="main-visual__inner">
      <div class="main-visual__content">
        <h1 id="main-visual-title" class="main-visual__title">{{ title }}</h1>
        <p v-if="description" class="main-visual__description">{{ description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  imageUrl: string;
  imageAlt?: string;
  title: string;
  description: string;
  alignment?: 'left' | 'center' | 'right';
}>(), {
  imageAlt: '',
  alignment: 'center',
});
</script>

<style scoped>
.main-visual {
  position: relative;
  isolation: isolate;
  container-type: inline-size;
  display: grid;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #2D2A26;
  color: #FFFFFF;
}

.main-visual__image,
.main-visual__overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.main-visual__image {
  object-fit: cover;
  object-position: center;
}

.main-visual__overlay {
  background: rgba(18, 16, 14, 0.56);
  pointer-events: none;
}

.main-visual__inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding: clamp(16px, 4cqw, 64px);
}

.main-visual__content {
  width: 100%;
  max-width: 800px;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: keep-all;
}

.main-visual__title {
  margin: 0;
  color: inherit;
  font-size: clamp(24px, 4.5cqw, 72px);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.025em;
  white-space: pre-line;
  text-wrap: balance;
}

.main-visual__description {
  max-width: 580px;
  margin: clamp(12px, 2cqw, 28px) auto 0;
  font-size: clamp(14px, 1.5cqw, 20px);
  line-height: 1.65;
  white-space: pre-line;
  text-wrap: pretty;
}

.main-visual[data-alignment='left'] .main-visual__inner {
  justify-content: flex-start;
}

.main-visual[data-alignment='left'] .main-visual__content {
  text-align: left;
}

.main-visual[data-alignment='left'] .main-visual__description {
  margin-inline: 0 auto;
}

.main-visual[data-alignment='left'] .main-visual__overlay {
  background: linear-gradient(90deg, rgba(18, 16, 14, 0.72), rgba(18, 16, 14, 0.3));
}

.main-visual[data-alignment='right'] .main-visual__inner {
  justify-content: flex-end;
}

.main-visual[data-alignment='right'] .main-visual__content {
  text-align: right;
}

.main-visual[data-alignment='right'] .main-visual__description {
  margin-inline: auto 0;
}

.main-visual[data-alignment='right'] .main-visual__overlay {
  background: linear-gradient(270deg, rgba(18, 16, 14, 0.72), rgba(18, 16, 14, 0.3));
}
</style>
