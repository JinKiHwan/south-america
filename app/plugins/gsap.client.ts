import { defineNuxtPlugin } from '#app';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger);

    // ── Lenis smooth scroll ──────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.4,          // 관성 지속 시간 (클수록 느리고 부드러움)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // GSAP ticker에 Lenis RAF를 등록 → ScrollTrigger와 자동 동기화
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger가 Lenis의 스크롤 위치를 인식하도록 연결
    lenis.on('scroll', ScrollTrigger.update);

    return {
      provide: {
        gsap,
        ScrollTrigger,
        lenis,
      }
    };
  }
});
