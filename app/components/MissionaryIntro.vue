<template>
  <section id="missionary" class="relative z-10 py-24 lg:py-28 bg-[#F5EBE0] overflow-hidden rounded-t-[32px] md:rounded-t-[48px] shadow-[0_-20px_40px_rgba(45,42,38,0.07)]">
    <!-- Subtle dotted path decoration in background -->
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <svg class="w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100 200 C 300 50, 700 450, 1500 250" stroke="#E87A5D" stroke-width="2" stroke-dasharray="6 12" />
      </svg>
    </div>

    <div class="mx-auto px-6 relative z-10" style="max-width: 1400px;">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <!-- Left Column: Elegant Organic Image with Soft Overlap -->
        <div class="lg:col-span-5 flex justify-center relative">
          <div class="gs-missionary-img-wrap relative w-full max-w-[460px]">
            <!-- Main Family Image with large rounded-3xl corners and Level 2 Shadow -->
            <div class="relative overflow-hidden rounded-[24px] shadow-[rgba(45,42,38,0.08)_0_12px_32px] border border-[#E8E3DD] z-10 bg-white">
              <div class="aspect-[3/4] w-full overflow-hidden">
                <img 
                  :src="imageUrl"
                  :alt="imageAlt"
                  loading="lazy"
                  class="w-full h-full object-cover transform hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            </div>

            <!-- Overlapping decorative card representing Journey Stats / Stamp -->
            <div v-if="badgeTitle || badgeSubtitle" class="absolute -bottom-6 -right-4 bg-[#FFFFFF] p-5 rounded-[16px] shadow-[rgba(45,42,38,0.06)_0_8px_24px] border border-[#E8E3DD] z-20 hidden sm:block max-w-[180px]">
              <div class="flex flex-col items-center text-center">
                <div class="w-10 h-10 rounded-full bg-[#E87A5D]/10 flex items-center justify-center text-[#E87A5D] mb-2">
                  <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.001 9.001 0 018.716 5.253M12 3a9.001 9.001 0 00-8.716 5.253m0 13.497l8.716-8.716m0 0h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <p class="text-[12px] font-bold text-[#171717] tracking-wider uppercase mb-0.5">{{ badgeTitle }}</p>
                <p class="text-[10px] text-[#7A7571] font-medium uppercase tracking-wider">{{ badgeSubtitle }}</p>
              </div>
            </div>

            <!-- Background decorative offset layer to emphasize Journey depth -->
            <div class="absolute -inset-2 bg-[#F0E8DD] rounded-[24px] -z-10 translate-x-2 translate-y-2 border border-[#E8E3DD]/80"></div>
          </div>
        </div>

        <!-- Right Column: Premium Text Introduction -->
        <div class="lg:col-span-7 flex flex-col items-start gs-missionary-text-wrap">
          <!-- Eyebrow -->
          <span class="uppercase tracking-[0.25em] font-bold text-[11px] text-[#E87A5D] mb-4">
            {{ label }}
          </span>

          <!-- Heading -->
          <h2 
            class="text-[#171717] mb-3"
            style="
              font-family: 'Outfit', 'Noto Sans KR', sans-serif;
              font-size: clamp(32px, 4vw, 42px);
              font-weight: 500;
              line-height: 1.2;
              letter-spacing: -0.01em;
            "
          >
            {{ title }}
          </h2>

          <!-- Role -->
          <p class="text-[13px] font-bold text-[#7A7571] tracking-[0.1em] uppercase mb-8">
            {{ role }}
          </p>

          <!-- Divider -->
          <div class="w-16 h-[2px] bg-[#E87A5D] mb-8"></div>

          <!-- Paragraphs -->
          <div class="flex flex-col gap-6 text-[#524E4A] max-w-[620px] mb-10 leading-[1.6]">
            <p class="text-[16px] font-normal whitespace-pre-line break-words">{{ description }}</p>
          </div>

          <!-- Button -->
          <div v-if="buttonLabel" class="flex items-center gap-4">
            <a 
              href="#contact" 
              class="btn-primary shadow-lg shadow-[#E87A5D]/15 hover:shadow-xl hover:shadow-[#E87A5D]/25 transition-all duration-300 flex items-center gap-2 group"
              style="padding: 16px 36px; font-size: 15px; border-radius: 9999px; background-color: #E87A5D; color: #FFFFFF;"
              @click.prevent="scrollTo('#contact')"
            >
              {{ buttonLabel }}
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" class="transform group-hover:translate-x-1 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

defineProps({
  imageUrl: { type: String, required: true },
  imageAlt: { type: String, default: '' },
  label: { type: String, default: '' },
  title: { type: String, required: true },
  role: { type: String, default: '' },
  description: { type: String, required: true },
  buttonLabel: { type: String, default: '' },
  badgeTitle: { type: String, default: '' },
  badgeSubtitle: { type: String, default: '' },
});

const { $gsap, $ScrollTrigger, $lenis } = useNuxtApp();
let animationContext;

const scrollTo = (target) => {
  if ($lenis) {
    $lenis.scrollTo(target, { offset: -64, duration: 1.4 });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(() => {
  if ($gsap && $ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animationContext = $gsap.context(() => {
    $gsap.fromTo('.gs-missionary-img-wrap',
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#missionary',
          start: 'top 85%',
        }
      }
    );

    $gsap.fromTo('.gs-missionary-text-wrap > *',
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#missionary',
          start: 'top 85%',
        }
      }
    );
    });
  }
});

onBeforeUnmount(() => animationContext?.revert());
</script>

<style scoped>
/* Scoped styles align to global Outfit and Inter fonts */
</style>
