<template>
  <section id="lectures" class="relative z-0 py-24 overflow-hidden bg-[#ECDBC6]">
    <div class="mx-auto px-6 mb-12" style="max-width: 1400px;">
      
      <!-- Header with Title and View All -->
      <div class="flex items-end justify-between">
        <div>
          <h2 
            class="scroll-title-lectures fill-from-left"
            style="
              font-family: 'Noto Sans KR', 'Noto Sans Symbols', sans-serif;
              font-size: 42px;
              font-weight: 600;
              line-height: 1.1;
              letter-spacing: -0.02em;
              color: #171717;
            "
          >
            {{ $t('youtube.title') }} <span style="color: #E87A5D;">{{ $t('youtube.highlight') }}</span>
          </h2>
          <p class="mt-4 text-[#7A7571]" style="font-size: 16px;">
            {{ $t('hero.verse_text') }}
          </p>
        </div>
        <a v-if="videos.length" :href="channelUrl" target="_blank" rel="noopener noreferrer" class="btn-outline flex items-center gap-2 group" style="border-radius: 99px; padding: 8px 24px; font-size: 14px;">
          {{ $t('youtube.view_all') }}
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="group-hover:translate-x-1 transition-transform">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7M3 12h18"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Scroll carousel -->
    <p v-if="!videos.length" class="mx-auto px-6 text-[#7A7571]" style="max-width: 1400px;">{{ $t('youtube.empty') }}</p>
    <div v-else class="relative pl-6 md:pl-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))]">
      <div class="lecture-swiper-container">
        <swiper
          :modules="[FreeMode]"
          :slidesPerView="'auto'"
          :spaceBetween="28"
          :freeMode="true"
          class="w-full overflow-visible lecture-swiper"
        >
          <swiper-slide v-for="video in videos" :key="video.id" style="width: 360px !important;">
            <a :href="`https://www.youtube.com/watch?v=${video.id}`" target="_blank" rel="noopener noreferrer" class="group block" style="width: 100%; max-width: 360px;">
              <!-- Thumbnail (16:9) -->
              <div class="relative overflow-hidden rounded-2xl mb-5 shadow-sm" style="aspect-ratio: 16/9; background: #171717; width: 100%;">
                <img 
                  :src="video.thumbnail" 
                  :alt="video.title" 
                  class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                />
                <!-- Play button overlay -->
                <div class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors duration-300">
                  <div 
                    class="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.25);"
                  >
                    <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style="background-color: #E87A5D;">
                      <svg class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card info -->
              <div class="flex flex-col gap-1.5 px-1">
                <h3 
                  class="line-clamp-1 text-[#171717] group-hover:text-[#E87A5D] transition-colors duration-300"
                  style="
                    font-family: 'Noto Sans KR', 'Noto Sans Symbols', sans-serif;
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 1.3;
                  "
                >
                  {{ video.title }}
                </h3>
                <div class="flex items-center gap-2 text-sm text-[#7A7571]">
                  <span class="font-medium" style="color: #E87A5D;">YouTube</span>
                  <span class="w-1 h-1 rounded-full bg-[#E8E3DD]"></span>
                  <span>{{ video.publishedAt ? new Date(video.publishedAt).toLocaleDateString(locale) : '' }}</span>
                </div>
              </div>
            </a>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { YoutubeVideo } from '#shared/youtube';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const { $gsap, $ScrollTrigger } = useNuxtApp();
const { locale } = useI18n();
const { data } = await useFetch<{ channelId: string; videos: YoutubeVideo[] }>('/api/youtube-videos');
const videos = computed(() => data.value?.videos || []);
const channelUrl = computed(() => `https://www.youtube.com/channel/${data.value?.channelId}/videos`);

onMounted(() => {
  if ($gsap && $ScrollTrigger) {
    $gsap.fromTo('.scroll-title-lectures',
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#lectures', start: 'top 85%' }
      }
    );

    if (videos.value.length) $gsap.fromTo('.lecture-swiper',
      { opacity: 0, x: 20 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '#lectures', start: 'top 80%' }
      }
    );
  }
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.lecture-swiper-container {
  position: relative;
  width: 100%;
  mask-image: linear-gradient(to right, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
}

@media (max-width: 768px) {
  :deep(.swiper-slide) {
    width: 280px !important;
  }
  .lecture-swiper-container {
    mask-image: none;
    -webkit-mask-image: none;
  }
}
</style>
