<template>
  <!-- Contact Section with Background Image -->
  <section 
    id="contact" 
    class="py-32 relative overflow-hidden bg-cover bg-center bg-fixed" 
    style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/contact/contact_bg.webp'); background-attachment: fixed;"
  >
    <div class="mx-auto px-6 relative z-10" style="max-width: 1000px;">

      <!-- Section header -->
      <div class="text-center mb-16">
        <div class="tag-soft mb-5 contact-eyebrow" style="background-color: rgba(255, 255, 255, 0.1); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.2);">{{ $t('nav.support') }}</div>
        <h2 
          class="mb-4 scroll-title-contact fill-from-left"
          style="
            font-family: 'Noto Sans KR', 'Noto Sans Symbols', sans-serif;
            font-size: 48px;
            font-weight: 500;
            line-height: 1.1;
            letter-spacing: -0.02em;
            background-image: linear-gradient(to right, #FFFFFF 50%, rgba(255, 255, 255, 0.4) 50%);
          "
        >
          {{ $t('contact.title') }} &amp; {{ $t('contact.highlight') }}
        </h2>
        <p style="font-size: 18px; font-weight: 400; line-height: 1.6; color: rgba(255, 255, 255, 0.8);">
          {{ $t('contact.subtitle') }}
        </p>
      </div>

      <!-- Glassmorphism Form -->
      <form 
        @submit.prevent="submitForm" 
        class="contact-form-wrap overflow-hidden"
        style="
          padding: 56px 64px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        "
      >
        <!-- Name + Email row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div class="form-group">
            <label class="block mb-2 text-sm font-semibold text-white opacity-90">
              {{ $t('contact.form.name') }}
            </label>
            <input 
              type="text" 
              v-model="form.name" 
              required 
              class="w-full transition-all duration-300"
              style="
                background: rgba(255, 255, 255, 0.05);
                color: #FFFFFF;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 14px 18px;
                font-size: 16px;
                outline: none;
              "
              onfocus="this.style.borderColor='rgba(232, 122, 93, 0.6)'; this.style.background='rgba(255, 255, 255, 0.1)';"
              onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.background='rgba(255, 255, 255, 0.05)';"
            />
          </div>
          <div class="form-group">
            <label class="block mb-2 text-sm font-semibold text-white opacity-90">
              {{ $t('contact.form.email') }}
            </label>
            <input 
              type="email" 
              v-model="form.email" 
              required 
              class="w-full transition-all duration-300"
              style="
                background: rgba(255, 255, 255, 0.05);
                color: #FFFFFF;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 14px 18px;
                font-size: 16px;
                outline: none;
              "
              onfocus="this.style.borderColor='rgba(232, 122, 93, 0.6)'; this.style.background='rgba(255, 255, 255, 0.1)';"
              onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.background='rgba(255, 255, 255, 0.05)';"
            />
          </div>
        </div>

        <!-- Inquiry type -->
        <div class="mb-8">
          <label class="block mb-2 text-sm font-semibold text-white opacity-90">
            {{ $t('contact.form.type') }}
          </label>
          <div class="relative">
            <select 
              v-model="form.type" 
              class="w-full transition-all duration-300 appearance-none"
              style="
                background: rgba(255, 255, 255, 0.05);
                color: #FFFFFF;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 14px 18px;
                font-size: 16px;
                outline: none;
              "
              onfocus="this.style.borderColor='rgba(232, 122, 93, 0.6)'; this.style.background='rgba(255, 255, 255, 0.1)';"
              onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.background='rgba(255, 255, 255, 0.05)';"
            >
              <option value="materials" style="background: #171717;">{{ $t('contact.form.type_options.materials') }}</option>
              <option value="prayer" style="background: #171717;">{{ $t('contact.form.type_options.prayer') }}</option>
              <option value="general" style="background: #171717;">{{ $t('contact.form.type_options.general') }}</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white opacity-60">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Message -->
        <div class="mb-10">
          <label class="block mb-2 text-sm font-semibold text-white opacity-90">
            {{ $t('contact.form.message') }}
          </label>
          <textarea 
            v-model="form.message" 
            rows="5" 
            required 
            class="w-full transition-all duration-300"
            style="
              background: rgba(255, 255, 255, 0.05);
              color: #FFFFFF;
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              padding: 14px 18px;
              font-size: 16px;
              outline: none;
              resize: none;
            "
            onfocus="this.style.borderColor='rgba(232, 122, 93, 0.6)'; this.style.background='rgba(255, 255, 255, 0.1)';"
            onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.background='rgba(255, 255, 255, 0.05)';"
          />
        </div>

        <!-- CTA button -->
        <button 
          type="submit" 
          :disabled="isSubmitting" 
          class="w-full py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-white"
          :style="isSubmitting ? { background: '#E87A5D', opacity: '0.6', cursor: 'not-allowed' } : { background: '#E87A5D', boxShadow: '0 10px 20px rgba(232, 122, 93, 0.2)' }"
        >
          <span>{{ isSubmitting ? $t('contact.form.sending') : $t('contact.form.submit') }}</span>
          <svg v-if="!isSubmitting" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke-width: 2.5;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7-7 7M3 12h18"/>
          </svg>
        </button>

        <!-- Status messages -->
        <p 
          v-if="submitStatus === 'success'" 
          class="mt-6 text-center font-medium" 
          style="font-size: 15px; color: #4ADE80;"
        >
          {{ $t('contact.form.success') }}
        </p>
        <p 
          v-if="submitStatus === 'error'" 
          class="mt-6 text-center font-medium" 
          style="font-size: 15px; color: #F87171;"
        >
          {{ $t('contact.form.error') }}
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

<style scoped>
@media (max-width: 1023px) {
  section#contact {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  .contact-form-wrap {
    padding: 28px 24px !important;
  }
  .contact-form-wrap input,
  .contact-form-wrap select,
  .contact-form-wrap textarea {
    padding: 10px 14px !important;
    font-size: 15px !important;
  }
}
</style>
