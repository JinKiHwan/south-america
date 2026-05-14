<template>
  <section class="relative w-full bg-[#FAF7F2] overflow-hidden flex items-center" style="min-height: 800px; height: 100vh;">
    <!-- Background Decoration: World Map -->
    <div class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
      <svg width="1200" height="600" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto max-w-none scale-150 lg:scale-110">
        <path d="M150 200C180 150 250 150 300 180C350 210 400 150 450 160C500 170 550 250 600 240C650 230 700 150 750 160C800 170 850 220 900 210C950 200 1000 120 1050 130" stroke="#2D2A26" stroke-width="2" stroke-dasharray="8 8" class="gs-path-anim" />
        <!-- Simplified continent shapes as paths -->
        <circle cx="200" cy="250" r="80" fill="currentColor" />
        <circle cx="500" cy="350" r="120" fill="currentColor" />
        <circle cx="850" cy="220" r="100" fill="currentColor" />
        <circle cx="1000" cy="400" r="60" fill="currentColor" />
      </svg>
    </div>

    <!-- Airplane Decoration -->
    <div class="absolute top-1/4 right-1/4 z-10 opacity-20 gs-airplane">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16.5L13 11.5V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V11.5L2 16.5V19L10 16.5V21L8 22.5V24L11.5 23L15 24V22.5L13 21V16.5L21 19V16.5Z" fill="#E87A5D"/>
      </svg>
    </div>

    <!-- South America Map Background (Right Side) -->
    <div class="absolute top-1/2 -translate-y-1/2 right-0 z-0 opacity-100 pointer-events-none gs-map-south h-full flex items-center justify-end">
      <img 
        src="/images/heroSection/south-america.png" 
        alt="South America Map Background" 
        class="w-[700px] lg:w-[1100px] max-h-[85vh] h-auto object-contain opacity-100"
      >
    </div>

    <!-- Main Content Container -->
    <div class="container mx-auto max-w-[1600px] px-6 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        <!-- Left Column: Text Content -->
        <div class="flex flex-col items-start text-left">

          <!-- Headline -->
          <h1 
            class="mb-6 gs-fade-text"
            style="
              font-size: clamp(32px, 5vw, 52px);
              font-weight: 600;
              line-height: 1.25;
              letter-spacing: -1.2px;
              color: #2D2A26;
              max-width: 1000px;
            "
          >
            "But you will receive power when the Holy Spirit comes on you; <br>
            and you will be my <span class="text-highlight">witnesses</span> in Jerusalem, and in all Judea and Samaria, <br>
            and to the ends of the earth."
          </h1>

          <!-- Description -->
          <p 
            class="mb-10 gs-fade-up text-[#7A7571]"
            style="
              font-size: 18px;
              font-weight: 400;
              line-height: 1.6;
              max-width: 480px;
            "
          >
            <span class="block mb-4 font-medium text-[#E87A5D]">Acts 1:8</span>
            Reaching the heart of South America with God's love. 
            We are dedicated to sharing the Gospel and 
            discovering vision through the Word of God.
          </p>

          <!-- CTA Button -->
          <div class="gs-fade-btn">
            <a href="#newsletter" class="btn-primary" style="padding: 16px 36px; font-size: 17px;">
              View Newsletters
            </a>
          </div>
        </div>

        <!-- Right Column: Image Grid -->
        <div class="relative gs-image-grid">
          <div class="grid grid-cols-2 gap-4 lg:gap-6 relative z-10">
            <!-- Large Main Image -->
            <div class="gs-img-main rounded-[2rem] overflow-hidden shadow-2xl aspect-[3/4.5] transform lg:-translate-y-8">
              <img 
                :src="heroSlides[0].image" 
                alt="Main Hero" 
                class="w-full h-full object-cover"
              >
            </div>
            
            <!-- Stacked Smaller Images -->
            <div class="flex flex-col gap-4 lg:gap-6">
              <div class="gs-img-sub1 rounded-[2rem] overflow-hidden shadow-xl aspect-square">
                <img 
                  :src="heroSlides[1].image" 
                  alt="Sub Hero 1" 
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="gs-img-sub2 rounded-[2rem] overflow-hidden shadow-xl aspect-square lg:aspect-[4/3]">
                <img 
                  :src="heroSlides[2].image" 
                  alt="Sub Hero 2" 
                  class="w-full h-full object-cover"
                >
              </div>
            </div>
          </div>
          
          <!-- Floating decoration path (optional) -->
          <div class="absolute -bottom-8 -left-8 w-32 h-32 opacity-20 pointer-events-none hidden lg:block z-20">
            <svg viewBox="0 0 100 100" class="w-full h-full">
              <path d="M10 90 Q 50 10 90 90" fill="none" stroke="#E87A5D" stroke-width="2" stroke-dasharray="4 4" />
            </svg>
          </div>
        </div>

      </div>
    </div>

    <!-- Scroll Hint -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 gs-scroll-hint">
      <span class="text-[#7A7571]/60" style="font-size: 12px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Scroll</span>
      <div class="w-px h-10 bg-gradient-to-b from-[#E87A5D] to-transparent" />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

const { $gsap } = useNuxtApp();

const heroSlides = [
  { image: '/images/heroSection/hero_slide_01.webp' },
  { image: '/images/heroSection/hero_slide_02.webp' },
  { image: '/images/heroSection/hero_slide_03.webp' }
];

onMounted(() => {
  if ($gsap) {
    const tl = $gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Staggered entrance for all elements
    tl.fromTo('.gs-fade-text',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.5'
    ).fromTo('.gs-fade-up',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    ).fromTo('.gs-fade-btn',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8 },
      '-=0.5'
    ).fromTo('.gs-img-main',
      { clipPath: 'inset(100% 0% 0% 0%)', y: 50, opacity: 0 },
      { clipPath: 'inset(0% 0% 0% 0%)', y: 0, opacity: 1, duration: 1.4, ease: 'power4.inOut' },
      '-=1'
    ).fromTo(['.gs-img-sub1', '.gs-img-sub2'],
      { clipPath: 'inset(0% 100% 0% 0%)', x: 30, opacity: 0 },
      { clipPath: 'inset(0% 0% 0% 0%)', x: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power4.inOut' },
      '-=1.1'
    ).fromTo('.gs-scroll-hint',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.5'
    );

    // Airplane floating animation
    $gsap.to('.gs-airplane', {
      x: 100,
      y: -50,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
});
</script>

<style scoped>
.text-highlight::after {
  height: 12px;
  background-color: rgba(232, 122, 93, 0.25);
  bottom: 4px;
}

@media (max-width: 1024px) {
  section {
    height: auto !important;
    padding-top: 120px;
    padding-bottom: 80px;
  }
}
</style>
