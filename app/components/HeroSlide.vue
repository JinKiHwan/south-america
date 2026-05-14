<template>
  <section class="relative w-full h-screen overflow-hidden bg-black">
    <swiper
      :modules="[EffectFade, Autoplay]"
      effect="fade"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :loop="true"
      class="w-full h-full"
    >
      <swiper-slide v-for="(slide, index) in mockSlides" :key="index">
        <div 
          class="w-full h-full bg-cover bg-center origin-center ken-burns"
          :style="{ backgroundImage: `url(${slide.image})` }"
        ></div>
        <div class="absolute inset-0 bg-black/40"></div>
      </swiper-slide>
    </swiper>

    <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 gs-fill-text">
        Cristo Es Suficiente
      </h1>
      <p class="text-xl md:text-3xl font-light text-zinc-300 gs-fade-up">
        Vision Thru the Bible Ministries
      </p>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { onMounted } from 'vue';

const { $gsap } = useNuxtApp();

const mockSlides = [
  { image: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2560&auto=format&fit=crop' }, // forest/jungle
  { image: 'https://images.unsplash.com/photo-1444084316824-dc26d6657664?q=80&w=2560&auto=format&fit=crop' }, // mountains
  { image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2560&auto=format&fit=crop' }  // landscape
];

onMounted(() => {
  if ($gsap) {
    const tl = $gsap.timeline();
    
    tl.fromTo('.gs-fill-text', 
      { backgroundPosition: '100% 0' },
      { backgroundPosition: '0% 0', duration: 1.5, ease: 'power2.out', delay: 0.5 }
    ).fromTo('.gs-fade-up',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
      '-=0.5'
    );
  }
});
</script>

<style scoped>
.ken-burns {
  animation: kenBurns 10s ease-out infinite alternate;
}

@keyframes kenBurns {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.gs-fill-text {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(to right, #fff 50%, #52525b 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
}
</style>
