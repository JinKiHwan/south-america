<template>
  <section class="relative w-full bg-[#F5F1EB] overflow-visible h-[100dvh] lg:h-screen lg:min-h-[900px]">
    
    <!-- Background Texture/Decoration -->
    <div class="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent" />
      <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1440 900" fill="none">
        <path d="M100 150 Q 500 50 900 400 T 1500 200" stroke="#E87A5D" stroke-width="1.2" stroke-dasharray="6 12" opacity="0.2" />
        <path d="M-50 600 Q 400 900 800 600 T 1600 800" stroke="#E87A5D" stroke-width="1.2" stroke-dasharray="6 12" opacity="0.15" />
      </svg>
    </div>

    <!-- ===== MOBILE LAYOUT (hidden on lg+) ===== -->
    <div class="lg:hidden relative h-full flex flex-col">

      <!-- Mobile: South America Map — absolute background -->
      <div class="absolute top-[5%] right-0 w-[90%] h-[80%] opacity-[0.22] pointer-events-none z-0 overflow-hidden">
        <img
          src="/images/heroSection/south-america2.webp"
          alt="South America Ministry"
          class="w-full h-full object-contain object-right-bottom"
        />
      </div>

      <!-- Mobile: Text content — top area -->
      <div class="relative z-10 px-6 pt-24 flex flex-col justify-start">
        <p class="gs-fade-up uppercase tracking-[0.25em] font-bold text-[10px] text-[#E87A5D] mb-5">
          {{ $t('hero.eyebrow') }}
        </p>

        <div class="relative mb-4">
          <h1 class="gs-fade-text" :style="titleStyleMobile">
            {{ $t('hero.title1') }}<br/>{{ $t('hero.title2') }}
          </h1>
          <div class="relative mt-2">
            <h2 class="gs-fade-up inline-block" :style="subtitleStyleMobile">
              {{ $t('hero.subtitle') }}
            </h2>
            <svg class="absolute -bottom-3 left-0 w-full h-3 gs-fade-up" viewBox="0 0 400 20" preserveAspectRatio="none">
              <path d="M5,15 Q100,5 200,15 T395,15" stroke="#E87A5D" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6" />
            </svg>
          </div>
        </div>

        <div class="gs-fade-up mb-6 mt-5">
          <p class="text-[13px] font-bold text-[#2D2A26] mb-1">{{ $t('hero.verse') }}</p>
          <p class="text-[#7A7571] leading-relaxed text-[14px] max-w-[300px]">
            {{ $t('hero.verse_text') }}
          </p>
        </div>

        <div class="flex items-center gap-3 gs-fade-btn mb-8">
          <a href="#newsletter" class="btn-primary shadow-lg shadow-[#E87A5D]/20" style="padding: 14px 24px; font-size: 14px; border-radius: 99px;" @click.prevent="scrollTo('#newsletter')">
            {{ $t('hero.btn_news') }} →
          </a>
          <a href="#lectures" class="btn-outline" style="padding: 14px 24px; font-size: 14px; border-radius: 99px; border: 1.5px solid #2D2A26; color: #2D2A26; font-weight: 500;" @click.prevent="scrollTo('#lectures')">
            {{ $t('hero.btn_more') }}
          </a>
        </div>

        <!-- Mobile Stats -->
        <div class="flex items-center gap-8 gs-fade-stats">
          <div class="flex flex-col items-start">
            <p class="text-[18px] font-bold text-[#2D2A26] leading-none">20+</p>
            <p class="text-[10px] text-[#7A7571] font-medium uppercase tracking-wider mt-1">{{ $t('hero.stats.years') }}</p>
          </div>
          <div class="flex flex-col items-start">
            <p class="text-[18px] font-bold text-[#2D2A26] leading-none">1,000+</p>
            <p class="text-[10px] text-[#7A7571] font-medium uppercase tracking-wider mt-1">{{ $t('hero.stats.lectures') }}</p>
          </div>
          <div class="flex flex-col items-start">
            <p class="text-[18px] font-bold text-[#2D2A26] leading-none">{{ $t('hero.stats.many') }}</p>
            <p class="text-[10px] text-[#7A7571] font-medium uppercase tracking-wider mt-1">{{ $t('hero.stats.impact') }}</p>
          </div>
        </div>
      </div>

      <!-- Mobile: Polaroid row — pinned to bottom -->
      <div class="relative z-10 px-6 pb-6 flex items-end gap-3">
        <div class="flex-1 bg-white p-2 pb-8 shadow-xl rotate-[-1deg] rounded-sm gs-polaroid-1">
          <div class="aspect-square overflow-hidden bg-[#F2F2F2]">
            <img src="/images/heroSection/hero_slide_02.webp" class="w-full h-full object-cover brightness-[0.85]" />
          </div>
        </div>
        <div class="flex-1 bg-white p-2 pb-8 shadow-xl rotate-[1.5deg] rounded-sm gs-polaroid-2 mb-2">
          <div class="aspect-video overflow-hidden bg-[#F2F2F2]">
            <img src="/images/heroSection/hero_slide_03.webp" class="w-full h-full object-cover brightness-[0.85]" />
          </div>
        </div>
      </div>
    </div>

    <!-- ===== DESKTOP LAYOUT (hidden on mobile) ===== -->
    <div class="hidden lg:flex items-center h-full">
      <div class="container mx-auto max-w-[1400px] px-6 relative z-10">
        <div class="grid grid-cols-12 gap-8 items-center">

          <!-- Left Content -->
          <div class="col-span-5 flex flex-col items-start">
            <p class="gs-fade-up uppercase tracking-[0.25em] font-bold text-[11px] text-[#E87A5D] mb-8">
              {{ $t('hero.eyebrow') }}
            </p>
            <div class="relative mb-6">
              <h1 class="gs-fade-text" :style="titleStyle">
                {{ $t('hero.title1') }}<br/>{{ $t('hero.title2') }}
              </h1>
              <div class="relative mt-2">
                <h2 class="gs-fade-up inline-block" :style="subtitleStyle">
                  {{ $t('hero.subtitle') }}
                </h2>
                <svg class="absolute -bottom-4 left-0 w-full h-4 gs-fade-up" viewBox="0 0 400 20" preserveAspectRatio="none">
                  <path d="M5,15 Q100,5 200,15 T395,15" stroke="#E87A5D" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6" />
                </svg>
              </div>
            </div>
            <div class="gs-fade-up mb-10 mt-6">
              <p class="text-[15px] font-bold text-[#2D2A26] mb-2">{{ $t('hero.verse') }}</p>
              <p class="text-[#7A7571] leading-relaxed max-w-[420px]" style="font-size: 16px;">{{ $t('hero.verse_text') }}</p>
            </div>
            <div class="flex items-center gap-5 gs-fade-btn">
              <a href="#newsletter" class="btn-primary shadow-lg shadow-[#E87A5D]/20" style="padding: 18px 40px; font-size: 16px; border-radius: 99px;" @click.prevent="scrollTo('#newsletter')">
                {{ $t('hero.btn_news') }} <span class="ml-2">→</span>
              </a>
              <a href="#lectures" class="btn-outline" style="padding: 18px 40px; font-size: 16px; border-radius: 99px; border: 1.5px solid #2D2A26; color: #2D2A26; font-weight: 500;" @click.prevent="scrollTo('#lectures')">
                {{ $t('hero.btn_more') }}
              </a>
            </div>
            <div class="flex items-center gap-12 mt-16 gs-fade-stats">
              <div class="flex flex-col items-start">
                <div class="flex items-center gap-3 mb-2">
                  <div class="text-[#E87A5D]">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-10a4 4 0 11-8 0 4 4 0 018 0zm6 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" /></svg>
                  </div>
                  <p class="text-[20px] font-bold text-[#2D2A26] leading-none">20+</p>
                </div>
                <p class="text-[12px] text-[#7A7571] font-medium uppercase tracking-wider">{{ $t('hero.stats.years') }}</p>
              </div>
              <div class="flex flex-col items-start">
                <div class="flex items-center gap-3 mb-2">
                  <div class="text-[#E87A5D]">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <p class="text-[20px] font-bold text-[#2D2A26] leading-none">1,000+</p>
                </div>
                <p class="text-[12px] text-[#7A7571] font-medium uppercase tracking-wider">{{ $t('hero.stats.lectures') }}</p>
              </div>
              <div class="flex flex-col items-start">
                <div class="flex items-center gap-3 mb-2">
                  <div class="text-[#E87A5D]">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <p class="text-[20px] font-bold text-[#2D2A26] leading-none">{{ $t('hero.stats.many') }}</p>
                </div>
                <p class="text-[12px] text-[#7A7571] font-medium uppercase tracking-wider">{{ $t('hero.stats.impact') }}</p>
              </div>
            </div>
          </div>

          <!-- Right Visual -->
          <div class="col-span-7 relative h-[1000px] flex items-center justify-end">
            <div class="relative w-[1250px] h-full flex items-center justify-center pointer-events-none">
              <img src="/images/heroSection/south-america2.webp" alt="South America Ministry" class="w-full h-full object-contain" />
            </div>
            <!-- Desktop Polaroids -->
            <div class="absolute right-[8%] top-[45%] w-[280px] bg-white p-3 pb-12 shadow-2xl rotate-[3deg] rounded-sm gs-polaroid-1 z-20">
              <div class="aspect-square overflow-hidden bg-[#F2F2F2]">
                <img src="/images/heroSection/hero_slide_02.webp" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="absolute right-[0%] top-[63%] w-[320px] bg-white p-3 pb-14 shadow-2xl rotate-[-2deg] rounded-sm gs-polaroid-2 z-20">
              <div class="aspect-video overflow-hidden bg-[#F2F2F2]">
                <img src="/images/heroSection/hero_slide_03.webp" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue';

const { locale } = useI18n();
const { $gsap, $lenis } = useNuxtApp();

const titleStyle = computed(() => ({
  fontFamily: locale.value === 'ko' ? '"Song Myung", serif' : '"Playfair Display", serif',
  fontSize: locale.value === 'ko' ? 'min(7.5vw, 72px)' : 'min(8vw, 82px)',
  fontWeight: locale.value === 'ko' ? '600' : '800',
  lineHeight: '1.1',
  color: '#2D2A26',
  letterSpacing: '-0.02em',
  wordBreak: 'keep-all'
}));

const subtitleStyle = computed(() => ({
  fontFamily: locale.value === 'ko' ? '"Song Myung", serif' : '"Vujahday Script", cursive',
  fontSize: locale.value === 'ko' ? 'min(5vw, 42px)' : 'min(5.5vw, 54px)',
  color: '#E87A5D',
  lineHeight: '1.2',
  transform: 'translateY(-5px)',
  fontWeight: locale.value === 'ko' ? '500' : '400',
  whiteSpace: 'nowrap'
}));

const titleStyleMobile = computed(() => ({
  fontFamily: locale.value === 'ko' ? '"Song Myung", serif' : '"Playfair Display", serif',
  fontSize: locale.value === 'ko' ? 'min(10vw, 48px)' : 'min(11vw, 52px)',
  fontWeight: locale.value === 'ko' ? '600' : '800',
  lineHeight: '1.1',
  color: '#2D2A26',
  letterSpacing: '-0.02em',
  wordBreak: 'keep-all'
}));

const subtitleStyleMobile = computed(() => ({
  fontFamily: locale.value === 'ko' ? '"Song Myung", serif' : '"Vujahday Script", cursive',
  fontSize: locale.value === 'ko' ? 'min(6vw, 28px)' : 'min(7vw, 32px)',
  color: '#E87A5D',
  lineHeight: '1.2',
  fontWeight: locale.value === 'ko' ? '500' : '400',
  whiteSpace: 'nowrap'
}));

const scrollTo = (target) => {
  if ($lenis) {
    $lenis.scrollTo(target, { offset: -64, duration: 1.4 });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(() => {
  if ($gsap) {
    const tl = $gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Entrance animations
    tl.fromTo('.gs-fade-text',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    ).fromTo('.gs-fade-up',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
      '-=0.5'
    ).fromTo('.gs-fade-btn',
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.4'
    ).fromTo('.gs-fade-stats',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.3'
    );

    // Map and Polaroid reveal
    $gsap.fromTo('.gs-map-reveal',
      { scale: 0.98, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, delay: 0.2 }
    );

    $gsap.fromTo('.gs-polaroid-1',
      { x: 30, y: 20, rotation: 10, opacity: 0 },
      { x: 0, y: 0, rotation: 3, opacity: 1, duration: 0.8, delay: 0.6 }
    );

    $gsap.fromTo('.gs-polaroid-2',
      { x: 20, y: 30, rotation: -8, opacity: 0 },
      { x: 0, y: 0, rotation: -2, opacity: 1, duration: 0.8, delay: 0.8 }
    );
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.map-mask-container {
  /* Ensuring the mask works across browsers */
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-position: center;
  -webkit-mask-position: center;
}

@media (max-width: 1024px) {
  .map-mask-container {
    width: 100% !important;
    height: 500px !important;
  }
  .gs-polaroid-1, .gs-polaroid-2 {
    width: 180px !important;
  }
}
</style>
