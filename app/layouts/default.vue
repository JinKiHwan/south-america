<template>
  <div class="min-h-screen flex flex-col relative" style="color: #2D2A26;">
    <!-- Background Decorator (Flight Path) -->
    <div class="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]">
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path d="M-100,200 C200,100 400,500 600,300 C800,100 1100,400 1100,400" stroke="#E87A5D" stroke-width="4" stroke-dasharray="12,12" fill="none" />
        <path d="M-100,700 C300,800 500,400 700,600 C900,800 1200,500 1200,500" stroke="#E87A5D" stroke-width="3" stroke-dasharray="10,15" fill="none" />
      </svg>
    </div>

    <!-- Background is handled by body in tailwind.css (#FAF7F2) -->

    <!-- Header -->
    <header
      class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      :style="isScrolled
        ? 'background-color: rgba(250, 247, 242, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid #E8E3DD; box-shadow: 0 4px 12px rgba(45, 42, 38, 0.04);'
        : 'background-color: transparent;'"
    >
      <div class="mx-auto px-6 h-16 flex items-center justify-between" style="max-width: 1600px;">
        <NuxtLink to="/" class="flex items-center gap-2" style="text-decoration: none;">
          <span style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 500; letter-spacing: -0.01em; color: #2D2A26;">
            Vision Thru the Bible
          </span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-8">
          <a href="#newsletter" class="nav-link" @click.prevent="scrollTo('#newsletter')">Newsletters</a>
          <a href="#lectures" class="nav-link" @click.prevent="scrollTo('#lectures')">Lectures</a>
          <a href="#contact" class="nav-link" @click.prevent="scrollTo('#contact')">Contact</a>
        </nav>

        <div class="hidden md:flex items-center gap-3">
          <a href="#contact" class="btn-primary" @click.prevent="scrollTo('#contact')">동역 문의</a>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          style="color: #2D2A26; background: none; border: none; cursor: pointer;"
          @click="mobileOpen = !mobileOpen"
          aria-label="Menu"
        >
          <span
            class="block w-5 h-px bg-current transition-all"
            :style="mobileOpen ? 'transform: rotate(45deg) translateY(8px);' : ''"
          />
          <span
            class="block w-5 h-px bg-current transition-all"
            :style="mobileOpen ? 'opacity: 0;' : ''"
          />
          <span
            class="block w-5 h-px bg-current transition-all"
            :style="mobileOpen ? 'transform: rotate(-45deg) translateY(-8px);' : ''"
          />
        </button>
      </div>

      <!-- Mobile nav -->
      <div
        v-if="mobileOpen"
        class="md:hidden px-6 py-4 flex flex-col gap-4"
        style="background-color: rgba(250, 247, 242, 0.95); backdrop-filter: blur(8px); border-bottom: 1px solid #E8E3DD;"
      >
        <a href="#newsletter" class="nav-link" @click.prevent="scrollTo('#newsletter'); mobileOpen = false">Newsletters</a>
        <a href="#lectures" class="nav-link" @click.prevent="scrollTo('#lectures'); mobileOpen = false">Lectures</a>
        <a href="#contact" class="nav-link" @click.prevent="scrollTo('#contact'); mobileOpen = false">Contact</a>
        <a href="#contact" class="btn-primary" style="text-align: center;" @click.prevent="scrollTo('#contact'); mobileOpen = false">동역 문의</a>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer style="border-top: 1px solid #E8E3DD; background-color: rgba(242, 239, 233, 0.6); backdrop-filter: blur(4px);">
      <div class="mx-auto px-6 py-20" style="max-width: 1600px;">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <p style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 500; color: #2D2A26; margin-bottom: 12px;">
              Vision Thru the Bible
            </p>
            <p style="font-size: 14px; font-weight: 400; line-height: 1.6; color: #7A7571;">
              남미 선교 사역과 성경 강해를 통해<br/>그리스도의 충분하심을 전합니다.
            </p>
          </div>
          <div>
            <p style="font-size: 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #7A7571; margin-bottom: 16px;">사역 현황</p>
            <div class="flex flex-col gap-3">
              <a href="#newsletter" class="footer-link">Newsletters</a>
              <a href="#lectures" class="footer-link">Lectures</a>
            </div>
          </div>
          <div>
            <p style="font-size: 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #7A7571; margin-bottom: 16px;">연락처</p>
            <div class="flex flex-col gap-3">
              <a href="mailto:contact@visionthruthebible.org" class="footer-link-primary">
                contact@visionthruthebible.org
              </a>
              <a href="#contact" class="footer-link">동역 문의하기</a>
            </div>
          </div>
        </div>
        <div class="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style="border-top: 1px solid #E8E3DD;">
          <p style="font-size: 14px; font-weight: 400; color: #7A7571;">
            © {{ new Date().getFullYear() }} Vision Thru the Bible Ministries. All rights reserved.
          </p>
          <p style="font-size: 14px; color: #7A7571; font-family: 'Outfit', sans-serif;">Cristo Es Suficiente</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const { $lenis } = useNuxtApp();

const isScrolled = ref(false);
const mobileOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

// Lenis를 통한 앵커 스크롤
const scrollTo = (target) => {
  if ($lenis) {
    $lenis.scrollTo(target, { offset: -64, duration: 1.4 });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.footer-link {
  font-size: 14px;
  color: #7A7571;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: #E87A5D;
}

.footer-link-primary {
  font-size: 14px;
  color: #2D2A26;
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
}
.footer-link-primary:hover {
  color: #E87A5D;
}
</style>
