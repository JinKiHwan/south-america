<template>
  <section id="newsletter" class="py-24 bg-transparent">
    <div class="mx-auto px-6" style="max-width: 1600px;">

      <!-- Section header -->
      <div class="mb-14">
        <!-- Eyebrow -->
        <div class="tag-soft mb-5 news-eyebrow">사역 소식</div>
        <h2 
          class="mb-4 scroll-title fill-from-left"
          style="
            font-family: 'Outfit', sans-serif;
            font-size: 48px;
            font-weight: 500;
            line-height: 1.1;
            letter-spacing: -0.02em;
            color: #171717;
          "
        >
          Ministry <span class="text-primary">Newsletters</span>
        </h2>
        <p style="font-size: 18px; font-weight: 400; line-height: 1.6; color: #7A7571;">
          남미 선교 현장의 생생한 소식과 기도 제목을 나눕니다.
        </p>
      </div>

      <!-- Filter pills -->
      <div class="flex gap-3 mb-10 overflow-x-auto pb-2 hide-scrollbar">
        <button 
          v-for="filter in filters" :key="filter"
          @click="activeFilter = filter"
          class="btn-pill whitespace-nowrap transition-all duration-300"
          :class="activeFilter === filter 
            ? 'bg-primary text-white' 
            : 'bg-[#F2EFE9] text-[#7A7571] hover:bg-[#E8E3DD]'"
          style="font-size: 14px; padding: 10px 20px; border-radius: 99px;"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Cards grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(item, index) in filteredItems" 
          :key="item.id"
          class="group cursor-pointer card-story overflow-hidden news-card"
        >
          <!-- Thumbnail -->
          <div class="relative overflow-hidden" style="height: 240px;">
            <img 
              :src="item.thumbnail" 
              :alt="item.title" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div class="absolute inset-0 bg-ink/5 group-hover:bg-transparent transition-colors duration-300" />
          </div>

          <!-- Card body -->
          <div style="padding: 28px;">
            <!-- Region tag -->
            <span class="text-primary text-sm font-semibold mb-3 inline-block">{{ item.region }}</span>

            <h3 
              class="mb-4 group-hover:text-primary transition-colors duration-300"
              style="
                font-family: 'Outfit', sans-serif;
                font-size: 22px;
                font-weight: 500;
                line-height: 1.4;
                color: #171717;
              "
            >
              {{ item.title }}
            </h3>
            <div class="flex items-center justify-between">
              <p style="font-size: 14px; color: #7A7571;">
                {{ item.date }}
              </p>
              <span class="text-primary text-sm font-medium">읽어보기 →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const filters = ['전체', '브라질', '페루', '멕시코'];
const activeFilter = ref('전체');

const mockData = [
  { id: 1, title: '2026년 5월 아마존 사역 보고서', region: '브라질', date: '2026-05-01', thumbnail: 'https://images.unsplash.com/photo-1518182170546-076616fd46fa?q=80&w=600&auto=format&fit=crop' },
  { id: 2, title: '페루 리마 제자훈련 소식지', region: '페루', date: '2026-04-15', thumbnail: 'https://images.unsplash.com/photo-1526080243450-4820689fcc49?q=80&w=600&auto=format&fit=crop' },
  { id: 3, title: '멕시코 신학교 강의 일정 및 기도제목', region: '멕시코', date: '2026-03-20', thumbnail: 'https://images.unsplash.com/photo-1588612140404-b97d21396aee?q=80&w=600&auto=format&fit=crop' },
];

const filteredItems = computed(() => {
  if (activeFilter.value === '전체') return mockData;
  return mockData.filter(item => item.region === activeFilter.value);
});

onMounted(() => {
  if ($gsap && $ScrollTrigger) {
    $gsap.fromTo('.news-eyebrow',
      { y: -8, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '#newsletter', start: 'top 85%' }
      }
    );

    $gsap.fromTo('.scroll-title',
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#newsletter', start: 'top 80%' }
      }
    );

    $gsap.fromTo('.news-card',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.news-card', start: 'top 88%' }
      }
    );
  }
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
