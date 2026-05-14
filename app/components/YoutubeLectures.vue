<template>
  <section id="lectures" class="py-24 bg-zinc-50 border-y border-zinc-100 overflow-hidden">
    <div class="container mx-auto px-6 mb-12">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-4xl font-bold tracking-tight mb-4 scroll-title-lectures fill-from-left">YouTube Lectures</h2>
          <p class="text-zinc-500">성경 강해 및 훈련 영상 자료입니다.</p>
        </div>
        <a href="#" class="hidden md:flex items-center text-sm font-medium hover:text-zinc-600 transition-colors">
          View all videos
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </a>
      </div>
    </div>

    <div class="pl-6 md:pl-[max(1.5rem,calc((100vw-1536px)/2+1.5rem))]">
      <swiper
        :modules="[FreeMode]"
        :slidesPerView="'auto'"
        :spaceBetween="24"
        :freeMode="true"
        class="w-full overflow-visible lecture-swiper"
      >
        <swiper-slide v-for="video in mockVideos" :key="video.id" class="w-[300px] md:w-[400px]">
          <div class="group cursor-pointer">
            <div class="relative aspect-video rounded-xl overflow-hidden bg-black mb-4">
              <img :src="video.thumbnail" :alt="video.title" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-red-600 transition-colors">
                  <svg class="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
            <h3 class="text-lg font-medium line-clamp-2 mb-1 group-hover:text-zinc-600 transition-colors">{{ video.title }}</h3>
            <p class="text-sm text-zinc-500">{{ video.date }}</p>
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
    $gsap.fromTo('.scroll-title-lectures',
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#lectures',
          start: 'top 80%',
        }
      }
    );

    $gsap.fromTo('.lecture-swiper',
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0, duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: '#lectures',
          start: 'top 70%',
        }
      }
    );
  }
});
</script>

<style scoped>
.swiper-slide {
  width: auto;
}
</style>
