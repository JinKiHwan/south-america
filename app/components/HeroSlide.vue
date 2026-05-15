<template>
  <section class="relative w-full bg-[#F5F1EB] overflow-hidden flex items-center min-h-[850px] lg:h-screen lg:min-h-[900px]">
    
    <!-- Background Texture/Decoration -->
    <div class="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent" />
      <!-- Subtle dotted path decoration -->
      <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1440 900" fill="none">
        <path d="M100 150 Q 500 50 900 400 T 1500 200" stroke="#E87A5D" stroke-width="1.2" stroke-dasharray="6 12" opacity="0.2" />
        <path d="M-50 600 Q 400 900 800 600 T 1600 800" stroke="#E87A5D" stroke-width="1.2" stroke-dasharray="6 12" opacity="0.15" />
      </svg>
    </div>

    <div class="container mx-auto max-w-[1600px] px-6 relative z-10 pt-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <!-- Left Content (Col 1-5) -->
        <div class="lg:col-span-5 flex flex-col items-start pt-20 lg:pt-0">
          <p class="gs-fade-up uppercase tracking-[0.25em] font-bold text-[11px] text-[#E87A5D] mb-8">
            REACHING SOUTH AMERICA WITH THE GOSPEL
          </p>
          
          <div class="relative mb-6">
            <h1 class="gs-fade-text" style="font-family: 'Playfair Display', serif; font-size: clamp(60px, 9vw, 104px); font-weight: 800; line-height: 0.9; color: #2D2A26; letter-spacing: -0.03em;">
              You will be<br/>my witnesses
            </h1>
            <div class="relative mt-2">
              <h2 class="gs-fade-up inline-block" style="font-family: 'Vujahday Script', cursive; font-size: clamp(40px, 6vw, 68px); color: #E87A5D; line-height: 1; transform: translateY(-5px);">
                to the ends of the earth.
              </h2>
              <!-- Decorative Underline for Script -->
              <svg class="absolute -bottom-4 left-0 w-full h-4 gs-fade-up" viewBox="0 0 400 20" preserveAspectRatio="none">
                <path d="M5,15 Q100,5 200,15 T395,15" stroke="#E87A5D" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6" />
              </svg>
            </div>
          </div>

          <div class="gs-fade-up mb-12 mt-8">
            <p class="text-[16px] font-bold text-[#2D2A26] mb-3">Acts 1:8</p>
            <p class="text-[#7A7571] leading-relaxed max-w-[440px]" style="font-size: 17px;">
              We are dedicated to sharing the Gospel and<br/>discovering vision through the Word of God.
            </p>
          </div>

          <div class="flex items-center gap-5 gs-fade-btn">
            <a href="#newsletter" class="btn-primary shadow-lg shadow-[#E87A5D]/20" style="padding: 18px 40px; font-size: 16px; border-radius: 99px;">
              View Newsletters
              <span class="ml-2">→</span>
            </a>
            <a href="#lectures" class="btn-outline" style="padding: 18px 40px; font-size: 16px; border-radius: 99px; border: 1.5px solid #2D2A26; color: #2D2A26; font-weight: 500;">
              Learn More
            </a>
          </div>

          <!-- Stats Row (Horizontal) -->
          <div class="flex items-center gap-12 mt-28 gs-fade-stats">
            <div class="flex flex-col items-start">
              <div class="flex items-center gap-3 mb-2">
                <div class="text-[#E87A5D]">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-10a4 4 0 11-8 0 4 4 0 018 0zm6 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                  </svg>
                </div>
                <p class="text-[24px] font-bold text-[#2D2A26] leading-none">20+</p>
              </div>
              <p class="text-[12px] text-[#7A7571] font-medium uppercase tracking-wider">Years of Ministry</p>
            </div>
            <div class="flex flex-col items-start">
              <div class="flex items-center gap-3 mb-2">
                <div class="text-[#E87A5D]">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p class="text-[24px] font-bold text-[#2D2A26] leading-none">1,000+</p>
              </div>
              <p class="text-[12px] text-[#7A7571] font-medium uppercase tracking-wider">Bible Lectures</p>
            </div>
            <div class="flex flex-col items-start">
              <div class="flex items-center gap-3 mb-2">
                <div class="text-[#E87A5D]">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p class="text-[24px] font-bold text-[#2D2A26] leading-none">Many</p>
              </div>
              <p class="text-[12px] text-[#7A7571] font-medium uppercase tracking-wider">Lives Impacted</p>
            </div>
          </div>
        </div>

        <!-- Right Visual (Col 6-12) -->
        <div class="lg:col-span-7 relative h-[800px] lg:h-[1000px] flex items-center justify-end">
          <!-- South America Mask Image Container (Mask Temporarily Removed) -->
          <div class="relative w-full h-full flex items-center justify-end gs-map-reveal pr-0 overflow-visible">
            <div 
              class="relative w-[600px] lg:w-[1100px] h-full"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <!-- Main Image: south-america2.webp -->
              <img 
                src="/images/heroSection/south-america2.webp" 
                alt="South America Ministry" 
                class="w-full h-full object-contain"
              />
            </div>

            <!-- Overlapping Polaroid Photos -->
            <!-- Polaroid 1: Mission Group -->
            <div class="absolute right-[22%] top-[48%] lg:top-[45%] w-[260px] lg:w-[340px] bg-white p-3 pb-16 shadow-2xl rotate-[3deg] rounded-sm gs-polaroid-1 z-20">
              <div class="aspect-square overflow-hidden bg-[#F2F2F2]">
                <img src="/images/heroSection/hero_slide_02.webp" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Polaroid 2: Cross at Sunset -->
            <div class="absolute right-[8%] top-[65%] lg:top-[63%] w-[260px] lg:w-[380px] bg-white p-3 pb-20 shadow-2xl rotate-[-2deg] rounded-sm gs-polaroid-2 z-20">
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
import { onMounted } from 'vue';

const { $gsap } = useNuxtApp();

onMounted(() => {
  if ($gsap) {
    const tl = $gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Entrance animations
    tl.fromTo('.gs-fade-text',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }
    ).fromTo('.gs-fade-up',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
      '-=0.8'
    ).fromTo('.gs-fade-btn',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    ).fromTo('.gs-fade-stats',
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      '-=0.4'
    );

    // Map and Polaroid reveal
    $gsap.fromTo('.gs-map-reveal',
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, delay: 0.4 }
    );

    $gsap.fromTo('.gs-polaroid-1',
      { x: 100, y: 50, rotation: 15, opacity: 0 },
      { x: 0, y: 0, rotation: 3, opacity: 1, duration: 1.2, delay: 1 }
    );

    $gsap.fromTo('.gs-polaroid-2',
      { x: 80, y: 100, rotation: -10, opacity: 0 },
      { x: 0, y: 0, rotation: -2, opacity: 1, duration: 1.2, delay: 1.3 }
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
