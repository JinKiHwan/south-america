<template>
  <section class="relative w-full overflow-hidden" style="height: 100vh;">
    <!-- Swiper slides as background -->
    <swiper
      :modules="[EffectFade, Autoplay]"
      effect="fade"
      :autoplay="{ delay: 6000, disableOnInteraction: false }"
      :loop="true"
      class="absolute inset-0 w-full z-0"
      style="background-color: #0d253d; height: 100%; width: 100%;"
    >
      <swiper-slide v-for="(slide, index) in heroSlides" :key="index">
        <div 
          class="w-full h-full bg-cover bg-center ken-burns"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <!-- Dark overlay for text readability -->
          <div class="absolute inset-0 bg-ink/30" />
        </div>
      </swiper-slide>
    </swiper>

    <!-- Hero content -->
    <div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
      <!-- Eyebrow tag -->
      <div class="tag-soft mb-8 gs-fade-tag" style="pointer-events:none;">
        남미 선교 사역
      </div>

      <!-- Display headline (display-xxl: 56px / weight 300 / -1.4px) -->
      <h1 
        class="mb-6 gs-fill-text"
        style="
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 300;
          line-height: 1.03;
          letter-spacing: -1.4px;
          font-feature-settings: 'ss01';
          color: #fff;
          max-width: 800px;
        "
      >
        Cristo Es Suficiente
      </h1>

      <!-- Sub-heading (heading-md: 20px / weight 300) -->
      <p 
        class="gs-fade-up"
        style="
          font-size: 20px;
          font-weight: 300;
          line-height: 1.4;
          letter-spacing: -0.2px;
          font-feature-settings: 'ss01';
          color: rgba(255,255,255,0.85);
          max-width: 560px;
          margin-bottom: 40px;
        "
      >
        Vision Thru the Bible Ministries
      </p>

      <!-- CTA row (design.md: single filled pill per band) -->
      <div class="flex items-center gap-4 gs-fade-btn" style="pointer-events: auto;">
        <a href="#newsletter" class="btn-primary" style="font-size:15px; padding: 10px 20px;">
          사역 소식 보기
        </a>
        <a href="#contact" class="btn-pill text-white border border-white/40 hover:bg-white/10 transition-colors" style="font-size:15px; padding: 10px 20px;">
          동역 문의
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 gs-scroll-hint">
      <span class="text-white/50" style="font-size: 11px; font-weight: 300; letter-spacing: 0.1px; text-transform: uppercase; font-feature-settings: 'ss01';">Scroll</span>
      <div class="w-px h-8 bg-white/30 animate-pulse" />
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { onMounted } from 'vue';

const { $gsap } = useNuxtApp();

const heroSlides = [
  { image: '/images/heroSection/hero_slide_01.webp' },
  { image: '/images/heroSection/hero_slide_02.webp' },
  { image: '/images/heroSection/hero_slide_03.webp' },
  { image: '/images/heroSection/hero_slide_04.webp' },
  { image: '/images/heroSection/hero_slide_05.webp' }
];

onMounted(() => {
  if ($gsap) {
    const tl = $gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo('.gs-fade-tag',
      { y: -12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 0.3 }
    ).fromTo('.gs-fill-text',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.3'
    ).fromTo('.gs-fade-up',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      '-=0.6'
    ).fromTo('.gs-fade-btn',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.5'
    ).fromTo('.gs-scroll-hint',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.3'
    );
  }
});
</script>

<style scoped>
.ken-burns {
  animation: kenBurns 12s ease-out infinite alternate;
}

@keyframes kenBurns {
  0%   { transform: scale(1); }
  100% { transform: scale(1.08); }
}
</style>
