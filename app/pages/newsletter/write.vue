<template>
  <div class="min-h-screen bg-[#F5EBE0] flex flex-col">
    <!-- Subvisual Header -->
    <div 
      class="relative py-20 lg:py-24 overflow-hidden bg-cover bg-center bg-no-repeat border-b border-[#E8E3DD]"
      style="background-image: linear-gradient(rgba(23, 23, 23, 0.72), rgba(23, 23, 23, 0.72)), url('/images/visual/newsletter_bg.jpg');"
    >
      <!-- Decorative Dotted SVG Path -->
      <div class="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <svg class="w-full h-full" viewBox="0 0 1440 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 120 C 400 30, 800 200, 1500 80" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 12" />
        </svg>
      </div>

      <div class="mx-auto px-6 relative z-10 max-w-[1200px]">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-[12px] font-bold tracking-wider text-white/60 uppercase mb-4">
          <NuxtLink :to="localePath('/')" class="hover:text-white transition-colors">Home</NuxtLink>
          <span class="text-white/30 font-normal">/</span>
          <NuxtLink :to="localePath('/newsletter')" class="hover:text-white transition-colors">{{ $t('nav.newsletters') }}</NuxtLink>
          <span class="text-white/30 font-normal">/</span>
          <span class="text-white">Write</span>
        </nav>

        <h1 class="text-3xl sm:text-4xl font-medium tracking-tight text-white" style="font-family: 'Outfit', 'Noto Sans KR', sans-serif;">
          {{ $t('newsletter.write_btn') }}
        </h1>
        <p class="mt-2 text-white/80 max-w-[620px] text-sm">
          새로운 선교 사역 보고서와 기도 제목을 작성합니다. 한국어로 입력하면 영어, 스페인어, 포르투갈어 등으로 자동 번역됩니다.
        </p>
      </div>
    </div>

    <!-- Main Write Form Section -->
    <main class="flex-grow py-12 lg:py-16">
      <div class="mx-auto px-6 max-w-[1000px]">
        <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E8E3DD]/45 -mt-16 relative z-20 mb-16">
          <form @submit.prevent="submitPost" class="space-y-8">
            
            <!-- 1. Basic Meta Fields Grid -->
            <div class="grid grid-cols-1 gap-6">
              <!-- Region Select -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">사역 국가 (Region)</label>
                <select 
                  v-model="form.region" 
                  class="w-full bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                  required
                >
                  <option value="Brazil">Brazil (브라질)</option>
                  <option value="Peru">Peru (페루)</option>
                  <option value="Mexico">Mexico (멕시코)</option>
                  <option value="General">General (기타 남미)</option>
                </select>
              </div>


            </div>

            <!-- Thumbnail Upload Area (Replaced Selection Grid) -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">대표 썸네일 이미지 업로드 (Thumbnail Upload)</label>
              <div class="flex flex-col sm:flex-row gap-6 items-start">
                
                <!-- Image Upload Clickable Box -->
                <div 
                  @click="triggerFileSelect"
                  class="relative w-full sm:w-[280px] aspect-[16/10] rounded-xl overflow-hidden border-2 border-dashed border-[#E8E3DD] hover:border-[#E87A5D] transition-colors cursor-pointer flex flex-col items-center justify-center bg-[#FDFBF9]"
                  :class="form.thumbnail ? 'border-solid border-[#E8E3DD]' : ''"
                >
                  <input 
                    type="file" 
                    ref="fileInput" 
                    accept="image/*" 
                    class="hidden" 
                    @change="handleImageUpload" 
                  />
                  
                  <!-- Preview if uploaded -->
                  <img 
                    v-if="form.thumbnail" 
                    :src="form.thumbnail" 
                    class="w-full h-full object-cover" 
                  />
                  
                  <!-- Placeholder if empty -->
                  <div v-else class="text-center p-4 flex flex-col items-center gap-2">
                    <svg width="28" height="28" fill="none" stroke="#7A7571" stroke-width="1.5" viewBox="0 0 24 24" class="text-[#7A7571]">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span class="text-xs font-bold text-[#E87A5D]">사역 사진 업로드</span>
                    <span class="text-[10px] text-[#7A7571] uppercase tracking-wider font-semibold">PNG, JPG, WebP (Max 2MB)</span>
                  </div>
                  
                  <!-- Overlay Hover to Change -->
                  <div 
                    v-if="form.thumbnail" 
                    class="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1.5"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    이미지 교체하기
                  </div>
                </div>

                <!-- Guidance Notes -->
                <div class="flex-grow text-xs text-[#7A7571] leading-relaxed pt-2 max-w-[500px]">
                  <p class="font-bold text-[#171717] mb-1">💡 이미지 권장사양 및 안내:</p>
                  <p>• 선교 사역지에서 찍으신 인물 또는 풍경 이미지 파일을 직접 드래그하거나 선택하여 업로드합니다.</p>
                  <p>• 이 시연 사이트는 로컬 테스트용이므로, 업로드한 파일은 서버로 전송되지 않고 브라우저 자체 로컬 저장소(`LocalStorage`)에 **Base64**로 보관됩니다.</p>
                  <p>• 로컬 저장 한도를 넘지 않도록 가능한 **용량이 압축된 고효율 이미지(1MB 이하)**를 권장합니다.</p>
                  <p v-if="form.thumbnail" class="mt-3 text-[#E87A5D] font-bold flex items-center gap-1.5">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    대표 사진 업로드 완료
                  </p>
                </div>
              </div>
            </div>

            <hr class="border-[#E8E3DD]/60" />

            <!-- 2. Korean Contents Entry -->
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-base font-bold text-[#171717] flex items-center gap-2">
                  <span class="w-1.5 h-4 bg-[#E87A5D] rounded-full"></span>
                  본문 작성 (한국어)
                </h3>
                <span class="text-xs text-[#7A7571]">이 본문을 바탕으로 다국어가 자동으로 번역됩니다.</span>
              </div>

              <!-- Title (KO) -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">제목 (Title)</label>
                <input 
                  type="text" 
                  v-model="form.ko.title" 
                  placeholder="예: 2026년 6월 아마존 강변교회 성경공부 소식"
                  class="w-full bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                  required
                />
              </div>

              <!-- Excerpt (KO) -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">요약설명 (Excerpt)</label>
                <textarea 
                  v-model="form.ko.excerpt" 
                  rows="2" 
                  placeholder="목록 카드에 노출될 짧은 소개글을 작성해주세요."
                  class="w-full bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all resize-none"
                  required
                ></textarea>
              </div>

              <!-- Body Text (KO) -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">상세 사역 보고 본문 (Body)</label>
                <textarea 
                  v-model="form.ko.bodyText" 
                  rows="6" 
                  placeholder="사역 현장의 소식을 단락별로 엔터(줄바꿈)하여 작성해주세요."
                  class="w-full bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                  required
                ></textarea>
              </div>

              <!-- Quote (KO) -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">대표 인용구 (Highlight Quote - 선택)</label>
                <input 
                  type="text" 
                  v-model="form.ko.quote" 
                  placeholder="예: '비록 거친 환경이지만 이곳에서 드려지는 찬양은 그 어떤 성당의 선율보다 감격스러웠습니다.'"
                  class="w-full bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                />
              </div>

              <!-- Prayers (KO) -->
              <div class="space-y-3">
                <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-1">기도 제목 목록 (Prayers)</label>
                <div 
                  v-for="(prayer, idx) in form.ko.prayers" 
                  :key="idx" 
                  class="flex items-center gap-2"
                >
                  <span class="text-xs text-[#7A7571] font-bold w-6 text-center">{{ idx + 1 }}.</span>
                  <input 
                    type="text" 
                    v-model="form.ko.prayers[idx]" 
                    placeholder="기도 제목을 입력하세요."
                    class="flex-grow bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                    required
                  />
                  <button 
                    type="button" 
                    @click="removePrayer(idx)"
                    class="p-2 text-[#7A7571] hover:text-[#E87A5D] transition-colors"
                    title="Remove prayer point"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>
                <button 
                  type="button" 
                  @click="addPrayer"
                  class="text-xs font-bold text-[#E87A5D] hover:text-[#D7694C] flex items-center gap-1.5 transition-colors pt-1"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  기도 제목 추가
                </button>
              </div>
            </div>

            <!-- Auto Translate Trigger Button -->
            <div class="pt-4 flex justify-center">
              <button 
                type="button" 
                @click="triggerAutoTranslation"
                :disabled="isTranslating || !isKoFormValid"
                class="flex items-center justify-center gap-2 font-bold py-3.5 px-8 rounded-full border border-dashed transition-all"
                :class="isTranslating 
                  ? 'bg-[#FDFBF9] text-[#7A7571] border-[#E8E3DD] cursor-wait'
                  : isKoFormValid
                    ? 'bg-white border-[#E87A5D] text-[#E87A5D] hover:bg-[#E87A5D]/5 hover:border-solid active:scale-95 shadow-sm'
                    : 'bg-[#F5F1EB]/50 border-[#E8E3DD] text-[#7A7571] cursor-not-allowed opacity-60'"
              >
                <!-- Loading spinner or Magic Wand -->
                <svg v-if="isTranslating" class="animate-spin h-5 w-5 text-[#7A7571]" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L3 15m6 6l6-6m-9-3.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" />
                </svg>
                <span>{{ isTranslating ? '다국어 자동 번역 중...' : 'AI 다국어 자동 번역하기 (English/Español/Português)' }}</span>
              </button>
            </div>

            <!-- 3. Localized Translation Previews & Manual Edits -->
            <div 
              v-if="hasTranslations || isTranslating" 
              class="border-t border-[#E8E3DD] pt-8 space-y-6"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-base font-bold text-[#171717] flex items-center gap-2">
                  <span class="w-1.5 h-4 bg-[#7A7571] rounded-full"></span>
                  다국어 번역 결과 확인 및 수동 검토
                </h3>
                <span class="text-xs text-[#E87A5D] font-bold">자동 번역된 내용을 직접 수정하고 다듬을 수 있습니다.</span>
              </div>

              <!-- Translation Lang Tabs -->
              <div class="flex gap-4 border-b border-[#E8E3DD] pb-2">
                <button 
                  v-for="tab in ['en', 'es', 'pt']" 
                  :key="tab"
                  type="button"
                  @click="activeLangTab = tab"
                  class="pb-2 text-sm font-semibold transition-all relative px-2 uppercase"
                  :class="activeLangTab === tab ? 'text-[#E87A5D]' : 'text-[#7A7571] hover:text-[#171717]'"
                >
                  {{ tab === 'en' ? 'English (영문)' : tab === 'es' ? 'Español (스페인어)' : 'Português (포르투갈어)' }}
                  <div 
                    v-if="activeLangTab === tab" 
                    class="absolute bottom-0 left-0 w-full h-[2px] bg-[#E87A5D]"
                  ></div>
                </button>
              </div>

              <!-- Translation inputs container -->
              <div v-if="isTranslating" class="py-12 text-center text-[#7A7571] space-y-2">
                <p class="text-sm font-medium animate-pulse">각 국가의 언어로 번역을 수행하고 있습니다...</p>
                <p class="text-xs">MyMemory API를 활용하여 약 5~10초 가량 소요됩니다.</p>
              </div>
              <div v-else class="space-y-6">
                <!-- Title (Localized) -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">제목 번역 (Title - {{ activeLangTab.toUpperCase() }})</label>
                  <input 
                    type="text" 
                    v-model="form[activeLangTab].title" 
                    class="w-full bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                    required
                  />
                </div>

                <!-- Excerpt (Localized) -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">요약설명 번역 (Excerpt - {{ activeLangTab.toUpperCase() }})</label>
                  <textarea 
                    v-model="form[activeLangTab].excerpt" 
                    rows="2" 
                    class="w-full bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <!-- Body (Localized) -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">본문 문단 번역 (Body - {{ activeLangTab.toUpperCase() }})</label>
                  <div class="space-y-3">
                    <textarea 
                      v-for="(p, pIdx) in form[activeLangTab].body" 
                      :key="pIdx"
                      v-model="form[activeLangTab].body[pIdx]" 
                      rows="3" 
                      class="w-full bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                      required
                    ></textarea>
                  </div>
                </div>

                <!-- Quote (Localized) -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-2">인용구 번역 (Quote - {{ activeLangTab.toUpperCase() }})</label>
                  <input 
                    type="text" 
                    v-model="form[activeLangTab].quote" 
                    class="w-full bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                  />
                </div>

                <!-- Prayers (Localized) -->
                <div class="space-y-3">
                  <label class="block text-xs font-bold uppercase tracking-wider text-[#7A7571] mb-1">기도 제목 번역 (Prayers - {{ activeLangTab.toUpperCase() }})</label>
                  <div 
                    v-for="(prayer, pIdx) in form[activeLangTab].prayers" 
                    :key="pIdx" 
                    class="flex items-center gap-2"
                  >
                    <span class="text-xs text-[#7A7571] font-bold w-6 text-center">{{ pIdx + 1 }}.</span>
                    <input 
                      type="text" 
                      v-model="form[activeLangTab].prayers[pIdx]" 
                      class="flex-grow bg-[#FDFBF9] border border-[#E8E3DD] rounded-xl py-2.5 px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr class="border-[#E8E3DD]/60" />

            <!-- Form Actions -->
            <div class="flex items-center justify-end gap-4">
              <NuxtLink 
                :to="localePath('/newsletter')"
                class="btn-outline"
                style="border-radius: 9999px; padding: 12px 30px; font-size: 14px;"
              >
                취소 (Cancel)
              </NuxtLink>
              <button 
                type="submit" 
                :disabled="isSubmitting || !isFormFullyReady"
                class="btn-primary flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-[#E87A5D]/10"
                style="border-radius: 9999px; padding: 12px 36px; font-size: 14px; background-color: #E87A5D; color: #FFFFFF;"
                :class="(!isFormFullyReady || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#D7694C] transition-all'"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>소식지 올리기 (Publish)</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const localePath = useLocalePath();
const router = useRouter();

// References
const fileInput = ref(null);

// Trigger file selector click
const triggerFileSelect = () => {
  fileInput.value?.click();
};

// Auto-generate formatted date at submission time (Firebase 연동 시 serverTimestamp()로 대체)
const getFormattedToday = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  return `${months[today.getMonth()]} ${String(today.getDate()).padStart(2, '0')}, ${today.getFullYear()}`;
};

const form = ref({
  region: 'Brazil',
  thumbnail: '', // Empty by default, user must upload
  ko: {
    title: '',
    excerpt: '',
    bodyText: '',
    quote: '',
    prayers: ['']
  },
  en: { title: '', excerpt: '', body: [], quote: '', prayers: [] },
  es: { title: '', excerpt: '', body: [], quote: '', prayers: [] },
  pt: { title: '', excerpt: '', body: [], quote: '', prayers: [] }
});

const activeLangTab = ref('en');
const isTranslating = ref(false);
const hasTranslations = ref(false);
const isSubmitting = ref(false);

// Handle image upload and convert to base64
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Enforce a 2MB limit to prevent localStorage quota issues
  if (file.size > 2 * 1024 * 1024) {
    alert('대표 썸네일 이미지 크기는 2MB 이하여야 로컬 저장소(LocalStorage)에 안정적으로 저장됩니다.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target?.result) {
      form.value.thumbnail = event.target.result;
    }
  };
  reader.readAsDataURL(file);
};

// Add dynamic prayer input field
const addPrayer = () => {
  form.value.ko.prayers.push('');
};

// Remove dynamic prayer input field
const removePrayer = (idx) => {
  if (form.value.ko.prayers.length > 1) {
    form.value.ko.prayers.splice(idx, 1);
  } else {
    form.value.ko.prayers[0] = '';
  }
};

// Validate Korean section fields and image upload to enable Auto-Translate button
const isKoFormValid = computed(() => {
  const f = form.value.ko;
  return form.value.thumbnail.length > 0 &&
         f.title.trim().length > 0 &&
         f.excerpt.trim().length > 0 &&
         f.bodyText.trim().length > 0 &&
         f.prayers.every(prayer => prayer.trim().length > 0);
});

// Check if entire form (including translation previews) is populated before publishing
const isFormFullyReady = computed(() => {
  if (!isKoFormValid.value || !hasTranslations.value) return false;
  
  const langs = ['en', 'es', 'pt'];
  return langs.every(lang => {
    const l = form.value[lang];
    return l.title.trim().length > 0 &&
           l.excerpt.trim().length > 0 &&
           l.body.length > 0 &&
           l.body.every(p => p.trim().length > 0) &&
           l.prayers.length === form.value.ko.prayers.length &&
           l.prayers.every(p => p.trim().length > 0);
  });
});

// Trigger Nuxt server API to translate the Korean fields
const triggerAutoTranslation = async () => {
  if (!isKoFormValid.value) return;
  
  isTranslating.value = true;
  hasTranslations.value = false;
  
  try {
    const response = await $fetch('/api/translate', {
      method: 'POST',
      body: {
        title: form.value.ko.title,
        excerpt: form.value.ko.excerpt,
        bodyText: form.value.ko.bodyText,
        prayers: form.value.ko.prayers
      }
    });

    if (response.success && response.translations) {
      const trans = response.translations;
      
      // Load translations into form
      for (const lang of ['en', 'es', 'pt']) {
        form.value[lang].title = trans[lang].title || '';
        form.value[lang].excerpt = trans[lang].excerpt || '';
        form.value[lang].body = trans[lang].body || [];
        form.value[lang].prayers = trans[lang].prayers || [];
        // Quote auto-translation fallback (translate if exist)
        if (form.value.ko.quote.trim()) {
          try {
            const quoteRes = await $fetch('/api/translate', {
              method: 'POST',
              body: { title: form.value.ko.quote }
            });
            form.value[lang].quote = quoteRes.translations[lang].title;
          } catch {
            form.value[lang].quote = `[${lang.toUpperCase()}] ${form.value.ko.quote}`;
          }
        } else {
          form.value[lang].quote = '';
        }
      }
      
      hasTranslations.value = true;
    } else {
      alert('자동 번역에 실패했습니다. 수동으로 입력하거나 다시 시도해 주세요.');
    }
  } catch (err) {
    console.error('Translation error:', err);
    alert('번역 서버 오류가 발생했습니다. 다시 시도해 주세요.');
  } finally {
    isTranslating.value = false;
  }
};

// Publish / Save mock post to LocalStorage
const submitPost = () => {
  if (!isFormFullyReady.value) return;
  
  isSubmitting.value = true;
  
  try {
    // Determine readTime (word count heuristic: 1 min per 150 Korean words)
    const wordCount = form.value.ko.bodyText.split(/\s+/).length;
    const calcReadTime = Math.max(1, Math.ceil(wordCount / 120));
    
    // Retrieve custom newsletters from LocalStorage
    let customList = [];
    const stored = localStorage.getItem('custom_newsletters');
    if (stored) {
      try {
        customList = JSON.parse(stored);
      } catch (e) {}
    }
    
    // Determine new unique ID starting from 9 (mock data ends at 8)
    const newId = customList.length > 0 
      ? Math.max(...customList.map(item => item.id)) + 1 
      : 9;
      
    // 저장 시점의 날짜를 자동 생성 (Firebase 연동 시 serverTimestamp()로 대체 예정)
    const autoDate = getFormattedToday();
    
    // Format full article payload matching articlesContent map structure
    const newPost = {
      id: newId,
      region: form.value.region,
      thumbnail: form.value.thumbnail,
      readTime: String(calcReadTime),
      ko: {
        date: autoDate,
        title: form.value.ko.title,
        excerpt: form.value.ko.excerpt,
        body: form.value.ko.bodyText.split('\n').map(p => p.trim()).filter(p => p),
        quote: form.value.ko.quote,
        prayers: form.value.ko.prayers
      },
      en: {
        date: autoDate,
        title: form.value.en.title,
        excerpt: form.value.en.excerpt,
        body: form.value.en.body,
        quote: form.value.en.quote,
        prayers: form.value.en.prayers
      },
      es: {
        date: autoDate,
        title: form.value.es.title,
        excerpt: form.value.es.excerpt,
        body: form.value.es.body,
        quote: form.value.es.quote,
        prayers: form.value.es.prayers
      },
      pt: {
        date: autoDate,
        title: form.value.pt.title,
        excerpt: form.value.pt.excerpt,
        body: form.value.pt.body,
        quote: form.value.pt.quote,
        prayers: form.value.pt.prayers
      }
    };
    
    // Append to list and write to localstorage
    customList.push(newPost);
    localStorage.setItem('custom_newsletters', JSON.stringify(customList));
    
    alert('소식지가 성공적으로 등록되었습니다! 목록 페이지에서 등록한 소식지를 확인해보세요.');
    router.push(localePath('/newsletter'));
  } catch (err) {
    console.error('Submit error:', err);
    alert('게시글 등록에 실패했습니다. 다시 시도해 주세요.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.btn-primary:disabled {
  background-color: #E8E3DD !important;
  color: #7A7571 !important;
}
</style>
