<template>
  <div class="min-h-screen flex flex-col relative" style="color: #171717;">
    <!-- Background Decorator (Flight Path) -->
    <div class="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]">
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path d="M-100,200 C200,100 400,500 600,300 C800,100 1100,400 1100,400" stroke="#E87A5D" stroke-width="4" stroke-dasharray="12,12" fill="none" />
        <path d="M-100,700 C300,800 500,400 700,600 C900,800 1200,500 1200,500" stroke="#E87A5D" stroke-width="3" stroke-dasharray="10,15" fill="none" />
      </svg>
    </div>

    <!-- Background is handled by body in tailwind.css (#F5F1EB) -->

    <!-- Header -->
    <header
      class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      :style="isScrolled
        ? 'background-color: rgba(250, 247, 242, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid #E8E3DD; box-shadow: 0 4px 12px rgba(45, 42, 38, 0.04);'
        : 'background-color: transparent;'"
    >
      <div class="mx-auto px-6 h-16 flex items-center justify-between" style="max-width: 1400px;">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2" style="text-decoration: none;">
          <span style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 500; letter-spacing: -0.01em; color: #171717;">
            Vision Thru the Bible
          </span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-8">
          <a href="#newsletter" class="nav-link" @click.prevent="scrollTo('#newsletter')">{{ $t('nav.newsletters') }}</a>
          <a href="#lectures" class="nav-link" @click.prevent="scrollTo('#lectures')">{{ $t('nav.lectures') }}</a>
          <a href="#contact" class="nav-link" @click.prevent="scrollTo('#contact')">{{ $t('nav.contact') }}</a>
        </nav>

        <div class="hidden md:flex items-center gap-6">
          <!-- Language Switcher Dropdown -->
          <div class="relative lang-switcher-container">
            <button 
              @click="langDropdownOpen = !langDropdownOpen"
              class="flex items-center gap-2 text-[12px] font-bold tracking-widest text-[#7A7571] hover:text-[#171717] transition-colors uppercase"
            >
              {{ locale }}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" class="transition-transform" :class="{ 'rotate-180': langDropdownOpen }">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <Transition name="fade">
              <div 
                v-if="langDropdownOpen"
                class="absolute top-full right-0 mt-3 py-2 w-32 bg-white rounded-xl shadow-xl border border-[#E8E3DD] z-[60]"
              >
                <button 
                  v-for="lang in locales" 
                  :key="lang.code"
                  @click="setLocale(lang.code); langDropdownOpen = false"
                  class="w-full px-4 py-2 text-left text-[12px] font-semibold transition-colors hover:bg-[#F5F1EB]"
                  :class="locale === lang.code ? 'text-[#E87A5D]' : 'text-[#7A7571]'"
                >
                  {{ lang.name }}
                </button>
              </div>
            </Transition>
          </div>
          <a href="#contact" class="btn-primary px-6 py-2.5 text-[14px]" @click.prevent="scrollTo('#contact')">{{ $t('nav.support') }}</a>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          style="color: #171717; background: none; border: none; cursor: pointer;"
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
        <a href="#newsletter" class="nav-link" @click.prevent="scrollTo('#newsletter'); mobileOpen = false">{{ $t('nav.newsletters') }}</a>
        <a href="#lectures" class="nav-link" @click.prevent="scrollTo('#lectures'); mobileOpen = false">{{ $t('nav.lectures') }}</a>
        <a href="#contact" class="nav-link" @click.prevent="scrollTo('#contact'); mobileOpen = false">{{ $t('nav.contact') }}</a>
        
        <!-- Mobile Language Switcher -->
        <div class="flex items-center gap-4 py-2 border-y border-[#E8E3DD]">
          <button 
            v-for="lang in locales" 
            :key="lang.code"
            @click="setLocale(lang.code); mobileOpen = false"
            class="text-[12px] font-bold uppercase"
            :class="locale === lang.code ? 'text-[#E87A5D]' : 'text-[#7A7571]'"
          >
            {{ lang.name }}
          </button>
        </div>

        <a href="#contact" class="btn-primary" style="text-align: center;" @click.prevent="scrollTo('#contact'); mobileOpen = false">{{ $t('nav.support') }}</a>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer style="border-top: 1px solid #E8E3DD; background-color: rgba(242, 239, 233, 0.6); backdrop-filter: blur(4px);">
      <div class="mx-auto px-6 py-20" style="max-width: 1400px;">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <p style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 500; color: #171717; margin-bottom: 12px;">
              Vision Thru the Bible
            </p>
            <p style="font-size: 14px; font-weight: 400; line-height: 1.6; color: #7A7571;">
              {{ $t('hero.verse_text') }}
            </p>
          </div>
          <div>
            <p style="font-size: 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #7A7571; margin-bottom: 16px;">{{ $t('nav.newsletters') }} / {{ $t('nav.lectures') }}</p>
            <div class="flex flex-col gap-3">
              <a href="#newsletter" class="footer-link">{{ $t('nav.newsletters') }}</a>
              <a href="#lectures" class="footer-link">{{ $t('nav.lectures') }}</a>
            </div>
          </div>
          <div>
            <p style="font-size: 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #7A7571; margin-bottom: 16px;">{{ $t('nav.contact') }}</p>
            <div class="flex flex-col gap-3">
              <a href="mailto:contact@visionthruthebible.org" class="footer-link-primary">
                contact@visionthruthebible.org
              </a>
              <a href="#contact" class="footer-link" @click.prevent="scrollTo('#contact')">{{ $t('nav.support') }}</a>
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

const { locale, locales, setLocale } = useI18n();
const localePath = useLocalePath();
const { $lenis } = useNuxtApp();

const isScrolled = ref(false);
const mobileOpen = ref(false);
const langDropdownOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (!e.target.closest('.lang-switcher-container')) {
    langDropdownOpen.value = false;
  }
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
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('click', closeDropdown);
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
  color: #171717;
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
}
.footer-link-primary:hover {
  color: #E87A5D;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
