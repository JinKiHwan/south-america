<template>
  <div class="min-h-screen flex flex-col bg-white text-zinc-900">
    <!-- Header -->
    <header 
      class="fixed top-0 left-0 w-full z-50 transition-colors duration-300"
      :class="{ 'bg-white/80 backdrop-blur-md border-b border-zinc-200': isScrolled, 'bg-transparent': !isScrolled }"
    >
      <div class="container mx-auto px-6 h-20 flex items-center justify-between">
        <NuxtLink to="/" class="font-bold text-xl tracking-wider">
          Vision Thru the Bible
        </NuxtLink>
        
        <nav class="hidden md:flex gap-8 text-sm font-medium">
          <a href="#newsletter" class="hover:text-zinc-600 transition-colors">Newsletters</a>
          <a href="#lectures" class="hover:text-zinc-600 transition-colors">Lectures</a>
          <a href="#contact" class="hover:text-zinc-600 transition-colors">Contact</a>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-zinc-50 py-12 border-t border-zinc-100 text-center text-zinc-500 text-sm">
      <div class="container mx-auto px-6">
        <p class="mb-2">Vision Thru the Bible Ministries</p>
        <p>Email: contact@visionthruthebible.org</p>
        <p class="mt-8 text-zinc-400">&copy; {{ new Date().getFullYear() }} Vision Thru the Bible Ministries. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
