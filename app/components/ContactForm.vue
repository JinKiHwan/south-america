<template>
  <section id="contact" class="py-24 bg-white">
    <div class="container mx-auto px-6 max-w-4xl">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold tracking-tight mb-4 scroll-title-contact fill-from-left">Support & Contact</h2>
        <p class="text-zinc-500">기도 동역 및 일대일 제자 양육 교재 자료 요청을 남겨주시면 개별 안내해 드립니다.</p>
      </div>

      <form @submit.prevent="submitForm" class="bg-zinc-50 p-8 md:p-12 rounded-2xl border border-zinc-100 contact-form-wrap">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label class="block text-sm font-medium text-zinc-500 mb-2">이름 (Name)</label>
            <input type="text" v-model="form.name" required class="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-500 mb-2">이메일 (Email)</label>
            <input type="email" v-model="form.email" required class="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors" />
          </div>
        </div>

        <div class="mb-8">
          <label class="block text-sm font-medium text-zinc-500 mb-2">문의 유형 (Inquiry Type)</label>
          <select v-model="form.type" class="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors appearance-none">
            <option value="materials">자료 요청 (일대일 제자 양육 교재 PDF 등)</option>
            <option value="prayer">기도 동역 문의</option>
            <option value="general">일반 문의</option>
          </select>
        </div>

        <div class="mb-8">
          <label class="block text-sm font-medium text-zinc-500 mb-2">메시지 (Message)</label>
          <textarea v-model="form.message" rows="5" required class="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors resize-none"></textarea>
        </div>

        <button type="submit" :disabled="isSubmitting" class="w-full bg-zinc-900 text-white font-medium py-4 rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? '전송 중...' : '메시지 보내기' }}
        </button>

        <p v-if="submitStatus === 'success'" class="mt-4 text-green-500 text-center text-sm">성공적으로 전송되었습니다. 확인 후 연락 드리겠습니다.</p>
        <p v-if="submitStatus === 'error'" class="mt-4 text-red-500 text-center text-sm">오류가 발생했습니다. 나중에 다시 시도해 주세요.</p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { $gsap, $ScrollTrigger } = useNuxtApp();

const form = ref({
  name: '',
  email: '',
  type: 'materials',
  message: ''
});

const isSubmitting = ref(false);
const submitStatus = ref(null);

const submitForm = async () => {
  isSubmitting.value = true;
  submitStatus.value = null;
  
  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    });
    
    if (response.success) {
      submitStatus.value = 'success';
      form.value = { name: '', email: '', type: 'materials', message: '' };
    } else {
      submitStatus.value = 'error';
    }
  } catch (error) {
    submitStatus.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if ($gsap && $ScrollTrigger) {
    $gsap.fromTo('.scroll-title-contact',
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 80%',
        }
      }
    );

    $gsap.fromTo('.contact-form-wrap',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 75%',
        }
      }
    );
  }
});
</script>
