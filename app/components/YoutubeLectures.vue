<template>
  <!-- canvas-soft background: feature band beneath gradient hero (design.md) -->
  <section id="lectures" class="py-24 overflow-hidden" style="background-color: transparent;">
    <div class="mx-auto px-6 mb-12" style="max-width: 1200px;">
      <div class="flex items-end justify-between">
        <div>
          <div class="tag-soft mb-5 lectures-eyebrow">성경 강해</div>
          <h2 
            class="mb-4 scroll-title-lectures fill-from-left"
            style="
              font-family: 'Outfit', sans-serif;
              font-size: 48px;
              font-weight: 500;
              line-height: 1.1;
              letter-spacing: -0.02em;
              color: #2D2A26;
            "
          >
            YouTube <span class="text-primary">Lectures</span>
          </h2>
          <p style="font-size: 18px; font-weight: 400; line-height: 1.6; color: #7A7571;">
            성경의 진리를 깊이 있게 배우는 영상 강해 자료입니다.
          </p>
        </div>

        <!-- View all -->
        <a 
          href="#" 
          class="hidden md:flex items-center gap-1.5 transition-colors duration-300"
          style="font-size: 15px; font-weight: 500; color: #E87A5D; text-decoration: none;"
          onmouseover="this.style.color='#CC664D'"
          onmouseout="this.style.color='#E87A5D'"
        >
          모든 영상 보기
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke-width: 2.5;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Scroll carousel -->
    <div class="pl-6 md:pl-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))]">
      <swiper
        :modules="[FreeMode]"
        :slidesPerView="'auto'"
        :spaceBetween="24"
        :freeMode="true"
        class="w-full overflow-visible lecture-swiper"
      >
        <swiper-slide v-for="video in mockVideos" :key="video.id" class="w-[320px] md:w-[420px]">
          <div class="group cursor-pointer card-story overflow-hidden">
            <!-- Thumbnail -->
            <div class="relative overflow-hidden" style="aspect-ratio: 16/10; background: #2D2A26;">
              <img 
                :src="video.thumbnail" 
                :alt="video.title" 
                class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              />
              <!-- Play button -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div 
                  class="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style="background: rgba(250, 247, 242, 0.2); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.3);"
                >
                  <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <svg class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card info -->
            <div style="padding: 24px 28px 28px;">
              <h3 
                class="line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-300"
                style="
                  font-family: 'Outfit', sans-serif;
                  font-size: 20px;
                  font-weight: 500;
                  line-height: 1.4;
                  color: #2D2A26;
                "
              >
                {{ video.title }}
              </h3>
              <p style="font-size: 14px; color: #7A7571;">
                {{ video.date }}
              </p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { onMounted } from 'vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const mockVideos = [
  { id: 1, title: '신명기 강해 1강 - 서론', date: '2026-04-10', thumbnail: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?q=80&w=800&auto=format&fit=crop' },
  { id: 2, title: '신명기 강해 2강 - 언약의 갱신', date: '2026-04-17', thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop' },
  { id: 3, title: '일대일 제자양육 1과 - 예수 그리스도는 누구신가?', date: '2026-04-24', thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop' },
  { id: 4, title: '일대일 제자양육 2과 - 구원의 확신', date: '2026-05-01', thumbnail: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=800&auto=format&fit=crop' },
  { id: 5, title: '성경적 리더십 세미나', date: '2026-05-08', thumbnail: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop' },
];

onMounted(() => {
  if ($gsap && $ScrollTrigger) {
    $gsap.fromTo('.lectures-eyebrow',
      { y: -8, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '#lectures', start: 'top 85%' }
      }
    );

    $gsap.fromTo('.scroll-title-lectures',
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#lectures', start: 'top 80%' }
      }
    );

    $gsap.fromTo('.lecture-swiper',
      { opacity: 0, x: 40 },
      {
        opacity: 1, x: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '#lectures', start: 'top 72%' }
      }
    );
  }
});
</script>

<style scoped>
.swiper-slide { width: auto; }
</style>
