<template>
  <section id="newsletter" class="py-24 bg-transparent">
    <div class="mx-auto px-6" style="max-width: 1400px;">

      <!-- Header with Title and View All -->
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 
            class="scroll-title fill-from-left"
            style="
              font-family: 'Outfit', sans-serif;
              font-size: 42px;
              font-weight: 600;
              line-height: 1.1;
              letter-spacing: -0.02em;
              color: #171717;
            "
          >
            {{ $t('newsletter.title') }} <span style="color: #E87A5D;">{{ $t('newsletter.highlight') }}</span>
          </h2>
        </div>
        <a href="#" class="btn-outline flex items-center gap-2 group" style="border-radius: 99px; padding: 8px 20px; font-size: 14px;">
          {{ $t('newsletter.view_all') }}
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="group-hover:translate-x-1 transition-transform">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7M3 12h18"/>
          </svg>
        </a>
      </div>

      <!-- Filter Tabs directly below Title -->
      <div class="flex gap-6 mb-12 border-b border-[#E8E3DD] overflow-x-auto hide-scrollbar">
        <button 
          v-for="filterKey in filterKeys" :key="filterKey"
          @click="activeFilter = filterKey"
          class="pb-4 text-sm font-medium transition-all duration-300 relative whitespace-nowrap"
          :style="activeFilter === filterKey ? { color: '#E87A5D' } : { color: '#7A7571' }"
        >
          {{ $t(`newsletter.filters.${filterKey}`) }}
          <div 
            v-if="activeFilter === filterKey" 
            class="absolute bottom-0 left-0 w-full h-[2px] transition-all duration-300"
            style="background-color: #E87A5D;"
          ></div>
        </button>
      </div>

      <!-- Content Grid with Transition -->
      <Transition name="fade-slide" mode="out-in">
        <div :key="activeFilter" class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Left: Featured (Latest) Item -->
          <div class="lg:col-span-7 news-featured-wrap h-full">
            <div v-if="featuredItem" class="group cursor-pointer h-full flex flex-col">
              <div class="relative overflow-hidden rounded-2xl mb-5 shadow-sm" style="aspect-ratio: 21/9;">
                <img 
                  :src="featuredItem.thumbnail" 
                  :alt="featuredItem.title" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div class="flex flex-col gap-2 flex-grow">
                <span class="text-[12px] font-semibold uppercase tracking-wider" style="color: #E87A5D;">{{ featuredItem.region }}</span>
                <h3 
                  class="text-[#171717] group-hover:text-[#E87A5D] transition-colors duration-300"
                  style="
                    font-family: 'Outfit', sans-serif;
                    font-size: 24px;
                    font-weight: 600;
                    line-height: 1.3;
                    max-width: 100%;
                  "
                >
                  {{ featuredItem.title }}
                </h3>
                <div class="flex items-center gap-3 text-[13px] text-[#7A7571] mb-1">
                  <span>{{ featuredItem.date }}</span>
                  <span class="w-1 h-1 rounded-full bg-[#E8E3DD]"></span>
                  <span>{{ featuredItem.readTime }} {{ $t('newsletter.read_time') }}</span>
                </div>
                <p class="text-[#7A7571] leading-relaxed line-clamp-2" style="font-size: 15px;">
                  {{ featuredItem.excerpt }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right: List of Subsequent Items -->
          <div class="lg:col-span-5 flex flex-col justify-between gap-6 lg:gap-0 news-list-wrap h-full">
            <div 
              v-for="item in listItems" 
              :key="item.id"
              class="group cursor-pointer flex gap-5"
            >
              <!-- Small Thumbnail -->
              <div class="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-2xl shadow-sm">
                <img 
                  :src="item.thumbnail" 
                  :alt="item.title" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              
              <!-- List Item Content -->
              <div class="flex flex-col justify-center gap-1.5">
                <span class="text-[11px] font-semibold uppercase tracking-wider" style="color: #E87A5D;">{{ item.region }}</span>
                <h4 
                  class="text-[#171717] group-hover:text-[#E87A5D] transition-colors duration-300 line-clamp-2"
                  style="
                    font-family: 'Outfit', sans-serif;
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 1.4;
                  "
                >
                  {{ item.title }}
                </h4>
                <div class="flex items-center gap-2 text-[12px] text-[#7A7571]">
                  <span>{{ item.date }}</span>
                  <span class="w-1 h-1 rounded-full bg-[#E8E3DD]"></span>
                  <span>{{ item.readTime }} {{ $t('newsletter.read_time') }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();
const { t } = useI18n();

const filterKeys = ['all', 'brazil', 'peru', 'mexico', 'general'];
const activeFilter = ref('all');

const mockData = [
  { 
    id: 1, 
    title: '2026년 5월 아마존 사역 보고서: 밀림 속에서 피어나는 소망', 
    region: 'Brazil', 
    date: 'May 10, 2026', 
    readTime: '5 min',
    excerpt: '아마존 깊은 곳에서 진행된 이번 사역을 통해 우리는 하나님의 놀라운 역사를 경험했습니다. 원주민 마을에 세워진 새로운 예배 처소와 그들의 고백을 전합니다.',
    thumbnail: '/images/mock/mock01.webp' 
  },
  { 
    id: 2, 
    title: '페루 리마 제자훈련: 도심 속 젊은이들의 변화', 
    region: 'Peru', 
    date: 'Apr 28, 2026', 
    readTime: '4 min',
    excerpt: '리마의 대학가에서 시작된 제자훈련 프로그램이 큰 결실을 맺고 있습니다. 복음을 향한 갈급함이 가득한 현장의 목소리를 들어보세요.',
    thumbnail: '/images/mock/mock02.webp' 
  },
  { 
    id: 3, 
    title: '멕시코 신학교 강의: 다음 세대 지도자를 세우는 여정', 
    region: 'Mexico', 
    date: 'Apr 15, 2026', 
    readTime: '6 min',
    excerpt: '미래의 영적 지도자들을 양육하는 멕시코 신학교의 사역 현장입니다. 이번 학기 강의 일정과 학생들을 위한 기도를 부탁드립니다.',
    thumbnail: '/images/mock/mock03.webp' 
  },
  { 
    id: 4, 
    title: '남미 선교를 위한 중보 기도 편지 (제124호)', 
    region: 'General', 
    date: 'Mar 30, 2026', 
    readTime: '3 min',
    excerpt: '남미 대륙 전체를 위한 연합 기도 제목을 나눕니다. 각 지역의 상황과 함께 긴급한 기도 제목들을 확인해 주세요.',
    thumbnail: '/images/mock/mock04.webp' 
  },
  { 
    id: 5, 
    title: '볼리비아 의료 선교: 사랑의 인술을 전하다', 
    region: 'General', 
    date: 'Mar 15, 2026', 
    readTime: '7 min',
    excerpt: '볼리비아 오지 마을에서 진행된 의료 사역 보고입니다. 육신의 질병뿐만 아니라 마음의 상처까지 치유하시는 하나님의 은혜를 나누고 싶습니다.',
    thumbnail: '/images/mock/mock05.webp' 
  }
];

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return mockData;
  return mockData.filter(item => item.region.toLowerCase() === activeFilter.value);
});

const featuredItem = computed(() => filteredItems.value[0]);
const listItems = computed(() => filteredItems.value.slice(1));

onMounted(() => {
  if ($gsap && $ScrollTrigger) {
    $gsap.fromTo('.scroll-title',
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#newsletter', start: 'top 85%' }
      }
    );

    $gsap.fromTo('.news-featured-wrap',
      { x: -15, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.news-featured-wrap', start: 'top 85%' }
      }
    );

    $gsap.fromTo('.news-list-wrap > div',
      { x: 15, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.news-list-wrap', start: 'top 85%' }
      }
    );
  }
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
