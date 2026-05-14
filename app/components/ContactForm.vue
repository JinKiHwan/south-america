<template>
  <!-- canvas-cream band: warm interlude (design.md: card-story style feel) -->
  <section id="contact" class="py-24" style="background-color: transparent;">
    <div class="mx-auto px-6" style="max-width: 800px;">

      <!-- Section header -->
      <div class="text-center mb-16">
        <div class="tag-soft mb-5 contact-eyebrow">동역 문의</div>
        <h2 
          class="mb-4 scroll-title-contact fill-from-left"
          style="
            font-family: 'Outfit', sans-serif;
            font-size: 48px;
            font-weight: 500;
            line-height: 1.1;
            letter-spacing: -0.02em;
            color: #171717;
          "
        >
          Support &amp; Contact
        </h2>
        <p style="font-size: 18px; font-weight: 400; line-height: 1.6; color: #7A7571;">
          기도 동역 및 일대일 제자 양육 교재 자료 요청을 남겨주시면 정성껏 안내해 드립니다.
        </p>
      </div>

      <!-- Form -->
      <form 
        @submit.prevent="submitForm" 
        class="contact-form-wrap card-story overflow-hidden"
        style="padding: 48px 60px;"
      >
        <!-- Name + Email row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div class="form-group">
            <label class="block mb-2 text-sm font-semibold text-[#7A7571]">
              이름 (Name)
            </label>
            <input 
              type="text" 
              v-model="form.name" 
              required 
              class="w-full transition-all duration-300"
              style="
                background: #FDFCFB;
                color: #171717;
                border: 1px solid #E8E3DD;
                border-radius: 12px;
                padding: 14px 18px;
                font-size: 16px;
                outline: none;
              "
              onfocus="this.style.borderColor='#E87A5D'; this.style.boxShadow='0 0 0 4px rgba(232, 122, 93, 0.1)';"
              onblur="this.style.borderColor='#E8E3DD'; this.style.boxShadow='none';"
            />
          </div>
          <div class="form-group">
            <label class="block mb-2 text-sm font-semibold text-[#7A7571]">
              이메일 (Email)
            </label>
            <input 
              type="email" 
              v-model="form.email" 
              required 
              class="w-full transition-all duration-300"
              style="
                background: #FDFCFB;
                color: #171717;
                border: 1px solid #E8E3DD;
                border-radius: 12px;
                padding: 14px 18px;
                font-size: 16px;
                outline: none;
              "
              onfocus="this.style.borderColor='#E87A5D'; this.style.boxShadow='0 0 0 4px rgba(232, 122, 93, 0.1)';"
              onblur="this.style.borderColor='#E8E3DD'; this.style.boxShadow='none';"
            />
          </div>
        </div>

        <!-- Inquiry type -->
        <div class="mb-8">
          <label class="block mb-2 text-sm font-semibold text-[#7A7571]">
            문의 유형 (Inquiry Type)
          </label>
          <div class="relative">
            <select 
              v-model="form.type" 
              class="w-full transition-all duration-300 appearance-none"
              style="
                background: #FDFCFB;
                color: #171717;
                border: 1px solid #E8E3DD;
                border-radius: 12px;
                padding: 14px 18px;
                font-size: 16px;
                outline: none;
              "
              onfocus="this.style.borderColor='#E87A5D'; this.style.boxShadow='0 0 0 4px rgba(232, 122, 93, 0.1)';"
              onblur="this.style.borderColor='#E8E3DD'; this.style.boxShadow='none';"
            >
              <option value="materials">자료 요청 (일대일 제자 양육 교재 PDF 등)</option>
              <option value="prayer">기도 동역 문의</option>
              <option value="general">일반 문의</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A7571]">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Message -->
        <div class="mb-10">
          <label class="block mb-2 text-sm font-semibold text-[#7A7571]">
            메시지 (Message)
          </label>
          <textarea 
            v-model="form.message" 
            rows="5" 
            required 
            class="w-full transition-all duration-300"
            style="
              background: #FDFCFB;
              color: #171717;
              border: 1px solid #E8E3DD;
              border-radius: 12px;
              padding: 14px 18px;
              font-size: 16px;
              outline: none;
              resize: none;
            "
            onfocus="this.style.borderColor='#E87A5D'; this.style.boxShadow='0 0 0 4px rgba(232, 122, 93, 0.1)';"
            onblur="this.style.borderColor='#E8E3DD'; this.style.boxShadow='none';"
          />
        </div>

        <!-- CTA button -->
        <button 
          type="submit" 
          :disabled="isSubmitting" 
          class="btn-primary w-full py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
          :style="isSubmitting ? { opacity: '0.6', cursor: 'not-allowed' } : {}"
        >
          <span>{{ isSubmitting ? '전송 중...' : '메시지 보내기' }}</span>
          <svg v-if="!isSubmitting" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke-width: 2.5;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7-7 7M3 12h18"/>
          </svg>
        </button>

        <!-- Status messages -->
        <p 
          v-if="submitStatus === 'success'" 
          class="mt-4 text-center" 
          style="font-size: 14px; color: #15803d; font-feature-settings: 'ss01';"
        >
          성공적으로 전송되었습니다. 확인 후 연락 드리겠습니다.
        </p>
        <p 
          v-if="submitStatus === 'error'" 
          class="mt-4 text-center" 
          style="font-size: 14px; color: #ea2261; font-feature-settings: 'ss01';"
        >
          오류가 발생했습니다. 나중에 다시 시도해 주세요.
        </p>
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
    $gsap.fromTo('.contact-eyebrow',
      { y: -8, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '#contact', start: 'top 85%' }
      }
    );

    $gsap.fromTo('.scroll-title-contact',
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#contact', start: 'top 80%' }
      }
    );

    $gsap.fromTo('.contact-form-wrap',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '#contact', start: 'top 75%' }
      }
    );
  }
});
</script>
