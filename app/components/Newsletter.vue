<template>
  <section id="newsletter" class="py-24 bg-white">
    <div class="container mx-auto px-6">
      <div class="mb-16">
        <h2 class="text-4xl font-bold tracking-tight mb-4 scroll-title fill-from-left">Newsletters</h2>
        <p class="text-zinc-500">사역 소식과 기도 제목을 나눕니다.</p>
      </div>

      <div class="flex gap-4 mb-10 overflow-x-auto pb-4 hide-scrollbar">
        <button 
          v-for="filter in filters" :key="filter"
          @click="activeFilter = filter"
          class="px-6 py-2 rounded-full border transition-colors whitespace-nowrap"
          :class="activeFilter === filter ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-500 hover:border-zinc-900'"
        >
          {{ filter }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(item, index) in filteredItems" 
          :key="item.id"
          class="group cursor-pointer bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden hover:border-zinc-200 transition-colors news-card"
        >
          <div class="h-48 bg-zinc-100 relative overflow-hidden">
            <!-- Mock image -->
            <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div class="p-6">
            <span class="text-xs font-medium px-2 py-1 bg-zinc-200 text-zinc-600 rounded uppercase tracking-wider mb-3 inline-block">
              {{ item.region }}
            </span>
            <h3 class="text-lg font-medium mb-2 group-hover:text-zinc-600 transition-colors">{{ item.title }}</h3>
            <p class="text-sm text-zinc-500">{{ item.date }}</p>
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
    $gsap.fromTo('.scroll-title',
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#newsletter',
          start: 'top 80%',
        }
      }
    );

    $gsap.fromTo('.news-card',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.news-card',
          start: 'top 85%',
        }
      }
    );
  }
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
