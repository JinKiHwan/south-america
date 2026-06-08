<template>
  <div class="min-h-screen bg-[#F5EBE0] flex flex-col">
    <!-- Subvisual Header -->
    <div 
      class="relative py-24 lg:py-32 overflow-hidden bg-cover bg-center bg-no-repeat border-b border-[#E8E3DD]"
      style="background-image: linear-gradient(rgba(23, 23, 23, 0.72), rgba(23, 23, 23, 0.72)), url('/images/visual/newsletter_bg.jpg');"
    >
      <!-- Decorative Dotted SVG Path -->
      <div class="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <svg class="w-full h-full" viewBox="0 0 1440 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 120 C 400 30, 800 200, 1500 80" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 12" />
        </svg>
      </div>

      <div class="mx-auto px-6 relative z-10 max-w-[1400px]">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-[12px] font-bold tracking-wider text-white/60 uppercase mb-4">
          <NuxtLink :to="localePath('/')" class="hover:text-white transition-colors">Home</NuxtLink>
          <span class="text-white/30 font-normal">/</span>
          <span class="text-white">{{ $t('nav.newsletters') }}</span>
        </nav>

        <span class="uppercase tracking-[0.25em] font-bold text-[11px] text-[#E87A5D] mb-3 block">Missionary Letters</span>
        <h1 class="text-4xl sm:text-5xl font-medium tracking-tight text-white" style="font-family: 'Outfit', 'Noto Sans KR', sans-serif;">
          {{ $t('newsletter.subpage_title') }}
        </h1>
        <p class="mt-4 text-white/85 max-w-[620px] text-base leading-relaxed">
          {{ $t('newsletter.subpage_subtitle') }}
        </p>
      </div>
    </div>

    <!-- Main List Section -->
    <main class="flex-grow py-16 lg:py-20">
      <div class="mx-auto px-6 max-w-[1400px]">
        
        <!-- Controls: Filters, Search, and Write Action -->
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-12">
          
          <!-- Category Filter Tabs -->
          <div class="flex gap-4 border-b border-[#E8E3DD] overflow-x-auto hide-scrollbar pb-1.5 flex-grow max-w-full lg:max-w-2-3">
            <button 
              v-for="filterKey in filterKeys" :key="filterKey"
              @click="activeFilter = filterKey"
              class="pb-3 text-sm font-semibold transition-all duration-300 relative whitespace-nowrap px-1"
              :class="activeFilter === filterKey ? 'text-[#E87A5D]' : 'text-[#7A7571] hover:text-[#171717]'"
            >
              {{ $t(`newsletter.filters.${filterKey}`) }}
              <div 
                v-if="activeFilter === filterKey" 
                class="absolute bottom-0 left-0 w-full h-[2px] bg-[#E87A5D] transition-all duration-300"
              ></div>
            </button>
          </div>

          <!-- Search & Write Actions wrapper -->
          <div class="flex flex-col sm:flex-row items-center gap-4 sm:w-full lg:w-auto">
            <!-- Search bar -->
            <div class="relative w-full sm:w-64">
              <input 
                type="text" 
                v-model="searchQuery"
                :placeholder="$t('newsletter.search_placeholder')"
                class="w-full bg-[#FFFFFF] border border-[#E8E3DD] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#171717] placeholder-[#7A7571] focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7571]">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <!-- Clear query button -->
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7571] hover:text-[#171717]"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Write Post Button -->
            <NuxtLink 
              :to="localePath('/newsletter/write')"
              class="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-[#E87A5D]/10"
              style="padding: 10px 24px; font-size: 14px; border-radius: 12px; background-color: #E87A5D; color: #FFFFFF;"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {{ $t('newsletter.write_btn') }}
            </NuxtLink>
          </div>

        </div>

        <!-- No Results state -->
        <div v-if="filteredItems.length === 0" class="text-center py-24 bg-[#FFFFFF] rounded-2xl border border-[#E8E3DD] shadow-xs">
          <div class="w-16 h-16 rounded-full bg-[#F5F1EB] flex items-center justify-center text-[#7A7571] mx-auto mb-4">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p class="text-[15px] font-semibold text-[#171717]">{{ $t('newsletter.no_results') }}</p>
        </div>

        <!-- Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gs-cards-grid">
          <a 
            v-for="item in visibleItems" 
            :key="item.id"
            href="#"
            @click.prevent="openArticle(item.id)"
            class="group bg-white p-5 pb-6 rounded-[16px] shadow-[rgba(45,42,38,0.04)_0_4px_12px] border border-[#E8E3DD]/45 transition-all duration-300 hover:translate-y-[-6px] hover:shadow-[rgba(45,42,38,0.08)_0_12px_32px] flex flex-col h-full cursor-pointer"
            style="text-decoration: none;"
          >
            <!-- Thumbnail aspect-ratio: 16/9 -->
            <div class="relative overflow-hidden rounded-[12px] mb-4 aspect-[16/10] bg-[#F2F2F2]">
              <img 
                :src="item.thumbnail" 
                :alt="item.title" 
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />
              <!-- Soft overlay gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent mix-blend-multiply pointer-events-none"></div>
              <!-- Floating Category Tag -->
              <span class="absolute top-3 left-3 bg-[#E87A5D] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-[6px] shadow-xs">
                {{ item.region }}
              </span>
            </div>

            <!-- Content Area -->
            <div class="flex flex-col flex-grow">
              <!-- Meta Row -->
              <div class="flex items-center gap-2 text-[12px] text-[#7A7571] mb-2 font-medium">
                <span>{{ item.date }}</span>
                <span class="w-1 h-1 rounded-full bg-[#E8E3DD]"></span>
                <span>{{ item.readTime }} {{ $t('newsletter.read_time') }}</span>
              </div>

              <!-- Title -->
              <h3 
                class="text-[#171717] group-hover:text-[#E87A5D] transition-colors duration-300 line-clamp-2 mb-3"
                style="
                  font-family: 'Noto Sans KR', 'Noto Sans Symbols', sans-serif;
                  font-size: 19px;
                  font-weight: 600;
                  line-height: 1.35;
                "
              >
                {{ item.title }}
              </h3>

              <!-- Excerpt -->
              <p class="text-[#524E4A] text-[14px] leading-relaxed line-clamp-3 mb-4">
                {{ item.excerpt }}
              </p>

              <!-- Read More Link -->
              <div class="mt-auto pt-4 border-t border-[#E8E3DD]/30 flex items-center gap-1 text-[13px] font-bold text-[#E87A5D] group-hover:gap-2 transition-all">
                <span>Read More</span>
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        <!-- Load More Button -->
        <div 
          v-if="hasMoreItems" 
          class="flex justify-center mt-16"
        >
          <button 
            @click="loadMore"
            class="btn-outline flex items-center gap-2 group shadow-sm bg-white hover:bg-[#F8F3EC] transition-all"
            style="border-radius: 9999px; padding: 14px 36px; font-size: 15px;"
          >
            <span>{{ $t('newsletter.load_more') }}</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" class="transform group-hover:translate-y-0.5 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

      </div>
    </main>

    <!-- Detail View Modal -->
    <Transition name="modal-fade">
      <div 
        v-if="isModalOpen && currentArticle" 
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:p-10 pt-16 pb-16 modal-scroll-container"
      >
        <!-- Backdrop (click to close) -->
        <div 
          class="fixed inset-0 bg-[#171717]/75 backdrop-blur-xs transition-opacity" 
          @click="closeModal"
        ></div>

        <!-- Modal Container (White Journal Card) -->
        <div 
          class="relative w-full max-w-[900px] max-h-[85vh] bg-[#F5EBE0] rounded-[24px] shadow-2xl z-10 my-auto transform transition-all duration-500 flex flex-col overflow-hidden"
          style="font-family: 'Noto Sans KR', 'Noto Sans Symbols', sans-serif;"
        >
          <!-- Subvisual Banner of Modal -->
          <div 
            class="relative h-[200px] sm:h-[260px] bg-cover bg-center bg-no-repeat flex flex-col justify-end p-6 sm:p-10 flex-shrink-0"
            :style="`background-image: linear-gradient(rgba(23, 23, 23, 0.72), rgba(23, 23, 23, 0.72)), url('${currentArticle.thumbnail}');`"
          >
            <!-- Close Button (Floating in Subvisual) -->
            <button 
              @click="closeModal" 
              class="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 text-white flex items-center justify-center transition-all duration-200 z-30 focus:outline-none"
              aria-label="Close modal"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Metadata & Category Tag -->
            <div class="relative z-10 flex items-center gap-2 mb-3">
              <span class="bg-[#E87A5D] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-[6px]">
                {{ currentArticle.region }}
              </span>
              <span class="text-white/60 text-xs font-semibold">{{ currentArticle.date }}</span>
              <span class="text-white/40 text-xs">•</span>
              <span class="text-white/60 text-xs font-semibold">{{ currentArticle.readTime }} {{ $t('newsletter.read_time') }}</span>
            </div>

            <!-- Title in Banner -->
            <h2 
              class="relative z-10 text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug max-w-[760px]"
              style="font-family: 'Outfit', 'Noto Sans KR', sans-serif;"
            >
              {{ currentArticle.title }}
            </h2>
          </div>

          <!-- Modal Body content with overlap journal look -->
          <div class="px-4 sm:px-8 pb-10 pt-8 bg-[#F5EBE0] overflow-y-auto flex-grow modal-body-scroll" data-lenis-prevent>
            <div class="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#E8E3DD]/45 -mt-14 relative z-20">
              
              <!-- Content Paragraphs -->
              <div class="prose max-w-none text-[#524E4A] text-[15px] sm:text-base leading-relaxed space-y-6">
                <p v-for="(p, index) in currentArticle.body" :key="index">
                  {{ p }}
                </p>
              </div>

              <!-- Quote Block -->
              <blockquote 
                v-if="currentArticle.quote"
                class="border-l-4 border-[#E87A5D] pl-5 my-8 text-[#524E4A] italic text-base sm:text-lg font-song leading-relaxed"
              >
                "{{ currentArticle.quote }}"
              </blockquote>

              <!-- Prayer Requests List -->
              <div 
                v-if="currentArticle.prayers && currentArticle.prayers.length" 
                class="mt-10 p-6 bg-[#FDFBF9] rounded-xl border border-[#E8E3DD]/50"
              >
                <h4 class="text-base font-bold text-[#171717] mb-4 flex items-center gap-2">
                  <span class="w-1.5 h-4 bg-[#E87A5D] rounded-full"></span>
                  {{ $t('contact.form.type_options.prayer') }}
                </h4>
                <ul class="space-y-3">
                  <li 
                    v-for="(prayer, pIdx) in currentArticle.prayers" 
                    :key="pIdx"
                    class="flex gap-2.5 text-[14px] sm:text-[15px] text-[#524E4A] leading-relaxed"
                  >
                    <svg class="w-5 h-5 text-[#E87A5D] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{{ prayer }}</span>
                  </li>
                </ul>
              </div>

              <!-- CTA Prayer Section -->
              <div class="mt-10 p-6 sm:p-8 rounded-xl bg-[#F8F3EC] border border-[#E8E3DD]/60 flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="text-center md:text-left">
                  <h5 class="text-base font-bold text-[#171717] mb-2">{{ $t('newsletter.cta_title') }}</h5>
                  <p class="text-[13px] sm:text-[14px] text-[#7A7571] max-w-[480px] leading-normal">{{ $t('newsletter.cta_desc') }}</p>
                </div>
                <button 
                  @click="handleCtaClick"
                  class="btn-primary whitespace-nowrap shadow-md shadow-[#E87A5D]/10 text-sm py-2.5 px-6 rounded-full bg-[#E87A5D] text-white font-bold hover:bg-[#D7694C] transition-all"
                  style="border-radius: 9999px; background-color: #E87A5D; color: #FFFFFF;"
                >
                  {{ $t('missionary.btn_contact') }}
                </button>
              </div>

            </div>

            <!-- Previous/Next Navigation Controls -->
            <div class="flex items-center justify-between mt-6 px-4">
              <!-- Previous Post Button -->
              <button 
                v-if="prevArticleId"
                @click="navigateToArticle(prevArticleId)"
                class="flex items-center gap-2 text-[13px] sm:text-sm font-bold text-[#7A7571] hover:text-[#E87A5D] transition-colors"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>{{ $t('newsletter.prev_post') }}</span>
              </button>
              <div v-else class="w-10"></div>

              <!-- Next Post Button -->
              <button 
                v-if="nextArticleId"
                @click="navigateToArticle(nextArticleId)"
                class="flex items-center gap-2 text-[13px] sm:text-sm font-bold text-[#7A7571] hover:text-[#E87A5D] transition-colors"
              >
                <span>{{ $t('newsletter.next_post') }}</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <div v-else class="w-10"></div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const { $gsap, $ScrollTrigger, $lenis } = useNuxtApp();
const localePath = useLocalePath();
const { locale, t } = useI18n();
const route = useRoute();
const router = useRouter();

const filterKeys = ['all', 'brazil', 'peru', 'mexico', 'general'];
const activeFilter = ref('all');
const searchQuery = ref('');
const visibleCount = ref(6);

// Modal states
const selectedArticleId = ref(null);
const isModalOpen = ref(false);

// Rich details and content mapping for all 8 newsletters in KO, EN, ES, PT
const articlesContent = {
  1: {
    region: 'Brazil',
    thumbnail: '/images/mock/mock01.webp',
    readTime: '5',
    ko: {
      date: '2026년 5월 10일',
      title: '2026년 5월 아마존 사역 보고서: 밀림 속에서 피어나는 소망',
      excerpt: '아마존 깊은 곳에서 진행된 이번 사역을 통해 우리는 하나님의 놀라운 역사를 경험했습니다. 원주민 마을에 세워진 새로운 예배 처소와 그들의 고백을 전합니다.',
      body: [
        '아마존 강 유역의 깊은 밀림 속 원주민 마을에서 지난 한 달간 하나님의 크신 은혜가 임했습니다. 전기와 도로조차 없는 열악한 환경 속에서, 우리는 오직 성경 말씀 하나만을 들고 현지 부족민들을 만났습니다. 그들이 복음을 듣고 기쁨으로 반응하며 눈물로 예배드리는 현장은 감격 그 자체였습니다.',
        '이번 사역의 가장 큰 결실은 부족의 청년 리더인 마테오가 주도하여 마을 주민들과 함께 나무로 지은 작은 예배당입니다. 이 작은 공간이 정글 속 성경 공부와 예배의 중심지가 될 것입니다. 현지인 지도자가 스스로 교회를 돌보고 말씀을 나눌 수 있도록 앞으로 계속 양육할 예정입니다.'
      ],
      quote: '비록 정글 속의 거친 통나무 예배당이지만, 이곳에서 드려지는 찬양은 그 어떤 웅장한 대성당의 선율보다 천국에 가깝게 들렸습니다.',
      prayers: [
        '새로 세워진 정글 예배당이 부족민들의 진정한 영적 피난처이자 생명의 말씀이 샘솟는 곳이 되도록',
        '현지 청년 리더 마테오가 지혜와 믿음 안에서 성장하여 부족을 영적으로 잘 이끌 수 있도록',
        '우기철 이동 시 강물 범람과 해충으로부터 사역팀의 건강과 안전을 지켜주시도록'
      ]
    },
    en: {
      date: 'May 10, 2026',
      title: 'May 2026 Amazon Ministry Report: Hope Blooming in the Jungle',
      excerpt: 'Through this ministry in the deep Amazon, we experienced the amazing work of God. We share the new places of worship built in indigenous villages and their confessions.',
      body: [
        'Over the past month, God\'s great grace descended on an indigenous village deep in the Amazon River basin. In a harsh environment with no electricity or roads, we met local tribesmen with only the Bible in our hands. The scene where they heard the Gospel, reacted with joy, and worshiped in tears was pure emotion.',
        'The greatest fruit of this ministry is a small wooden chapel built by the village residents, led by Mateo, a young tribal leader. This small space will serve as the center for Bible study and worship in the jungle. We plan to continue nurturing him so that local leaders can take care of the church themselves and share the Word.'
      ],
      quote: 'Although it is a rough log chapel in the jungle, the praise offered here sounded closer to heaven than the melody of any grand cathedral.',
      prayers: [
        'That the newly established jungle chapel will be a true spiritual refuge for the villagers and a place where the word of life springs up.',
        'That local youth leader Mateo will grow in wisdom and faith to lead the tribe well spiritually.',
        'That the health and safety of the ministry team will be protected from river flooding and pests during travel in the rainy season.'
      ]
    },
    es: {
      date: '10 de mayo de 2026',
      title: 'Informe del Ministerio de la Amazonía de Mayo de 2026: Esperanza Floreciendo en la Selva',
      excerpt: 'A través de este ministerio en la profundidad de la Amazonía, experimentamos la asombrosa obra de Dios. Compartimos los nuevos lugares de adoración construidos en las aldeas indígenas y sus confesiones.',
      body: [
        'Durante el último mes, la gran gracia de Dios descendió sobre una aldea indígena en lo profundo de la cuenca del río Amazonas. En un entorno hostil sin electricidad ni carreteras, nos encontramos con los nativos locales solo con la Biblia en nuestras manos. La escena donde escucharon el Evangelio, reaccionaron con gozo y adoraron con lágrimas fue pura emoción.',
        'El fruto más grande de este ministerio es una pequeña capilla de madera construida por los residentes de la aldea, liderados por Mateo, un joven líder tribal. Este pequeño espacio servirá como centro para el estudio bíblico y la adoración en la selva. Planeamos continuar capacitándolo para que los líderes locales puedan cuidar de la iglesia por sí mismos y compartir la Palabra.'
      ],
      quote: 'Aunque es una capilla de troncos tosca en la selva, la alabanza ofrecida aquí sonaba más cercana al cielo que la melodía de cualquier gran catedral.',
      prayers: [
        'Que la capilla de la selva recientemente establecida sea un verdadero refugio espiritual para los aldeanos y un lugar de donde brote la palabra de vida.',
        'Que el joven líder local Mateo crezca en sabiduría y fe para guiar espiritualmente a la tribu.',
        'Que la salud y seguridad del equipo se protejan de las inundaciones del río y plagas durante los viajes en la temporada de lluvias.'
      ]
    },
    pt: {
      date: '10 de maio de 2026',
      title: 'Relatório do Ministério da Amazônia de Maio de 2026: Esperança Florescendo na Selva',
      excerpt: 'Através deste ministério no profundo da Amazônia, experimentamos a obra maravilhosa de Deus. Compartilhamos os novos locais de adoração concluídos nas aldeias indígenas e suas confissões.',
      body: [
        'No último mês, a grande graça de Deus desceu sobre uma aldeia indígena no fundo da bacia do rio Amazonas. Em um ambiente hostil sem eletricidade nem estradas, nos encontramos com os nativos locais apenas com a Bíblia em nossas mãos. A cena onde ouviram o Evangelho, reagiram com alegria e adoraram com lágrimas foi pura emoção.',
        'O fruto mais lindo deste ministério é uma pequena capela de madeira concluída pelos moradores da aldeia, liderados por Mateo, um jovem líder tribal. Este espaço servirá como centro para estudo bíblico e adoração na selva. Planejamos continuar capacitando-o para que os líderes locais possam cuidar da igreja por si mesmos e compartilhar a Palavra.'
      ],
      quote: 'Embora seja uma capela de troncos rústica na selva, o louvor oferecido aqui soava mais próximo ao céu do que a melodia de qualquer grande catedral.',
      prayers: [
        'Que a capela da selva recentemente estabelecida seja um verdadeiro refúgio espiritual para os aldeões e um lugar onde a palavra da vida brote.',
        'Que o jovem líder local Mateo cresça em sabedoria e fé para guiar espiritualmente a tribo.',
        'Que a saúde e segurança da equipe sejam protegidas de inundações do rio e pragas durante as viagens na temporada de chuvas.'
      ]
    }
  },
  2: {
    region: 'Peru',
    thumbnail: '/images/mock/mock02.webp',
    readTime: '4',
    ko: {
      date: '2026년 4월 28일',
      title: '페루 리마 제자훈련: 도심 속 젊은이들의 변화',
      excerpt: '리마의 대학가에서 시작된 제자훈련 프로그램이 큰 결실을 맺고 있습니다. 복음을 향한 갈급함이 가득한 현장의 목소리를 들어보세요.',
      body: [
        '페루의 수도 리마는 현대화된 도시이지만, 수많은 대학생들과 청년들이 세속적인 가치관 속에서 영적인 갈급함과 방황을 겪고 있습니다. 우리는 리마 대학가 근처의 센터에서 청년들을 대상으로 성경 일대일 제자양육 과정을 개시했습니다.',
        '매주 15명의 청년들이 모여 하나님의 말씀을 깊이 배우며, 자신들의 삶을 고백하고 있습니다. 특히 상처 많았던 가정환경에서 자란 청년들이 하나님의 무조건적인 사랑을 깨닫고 치유를 경험하며 변화되는 모습은 선교의 가장 큰 보람입니다.'
      ],
      quote: '세상적인 성공만을 좇던 리마의 엘리트 청년들이 십자가의 복음 앞에 무릎 꿇고 주님의 제자로 살기로 결단하는 기적이 일어나고 있습니다.',
      prayers: [
        '제자양육 과정에 참여 중인 15명의 청년들이 그리스도의 헌신된 제자로 굳건히 서도록',
        '리마 도심 청년 세대 안에 영적 대부흥이 일어나고 캠퍼스 선교의 문이 넓게 열리도록',
        '제자양육을 이끄는 현지인 간사들의 영육간의 강건함과 지혜를 위해'
      ]
    },
    en: {
      date: 'April 28, 2026',
      title: 'Peru Discipleship: Transforming Urban Youth',
      excerpt: 'A discipleship training program started in the university district of Lima is bearing great fruit. Listen to the voices of the field filled with thirst for the Gospel.',
      body: [
        'Although Lima, the capital of Peru, is a modernized city, many college students and young people experience spiritual hunger and wandering amidst secular values. We started a one-on-one Bible discipleship training course for youth at a center near Lima University.',
        'Every week, 15 young people gather to learn the Word of God deeply and confess their lives. In particular, seeing young people who grew up in wounded family environments realize God\'s unconditional love, experience healing, and transform is the greatest reward of mission.'
      ],
      quote: 'The miracle of elite young people in Lima, who used to pursue only worldly success, kneeling before the Gospel of the cross and deciding to live as disciples of the Lord is taking place.',
      prayers: [
        'That the 15 young people participating in the discipleship training will stand firm as dedicated disciples of Christ.',
        'That a great spiritual revival will take place among the youth generation in Lima\'s city center and the door of campus mission will open wide.',
        'For the spiritual and physical health and wisdom of the local ministers leading the discipleship training.'
      ]
    },
    es: {
      date: '28 de abril de 2026',
      title: 'Discipulado en Lima, Perú: Transformación de los Jóvenes en la Ciudad',
      excerpt: 'Un programa de discipulado iniciado en la zona universitaria de Lima está dando grandes frutos. Escuche las voces del campo llenas de sed por el Evangelio.',
      body: [
        'Aunque Lima, la capital de Perú, es una ciudad modernizada, muchos estudiantes universitarios y jóvenes experimentan hambre espiritual y deambulaciones entre los valores seculares. Comenzamos un curso de discipulado bíblico uno a uno para jóvenes en un centro cerca de la Universidad de Lima.',
        'Cada semana, 15 jóvenes se reúnen para aprender profundamente la Palabra de Dios y confesar sus vidas. En particular, ver a jóvenes que crecieron en entornos familiares heridos darse cuenta del amor incondicional de Dios, experimentar sanidad y transformarse es la mayor recompensa de la misión.'
      ],
      quote: 'Está ocurriendo el milagro de jóvenes élites en Lima, que solían perseguir solo el éxito mundano, arrodillándose ante el Evangelio de la cruz y decidiendo vivir como discípulos del Señor.',
      prayers: [
        'Que los 15 jóvenes que participan en el discipulado permanezcan firmes como discípulos dedicados de Cristo.',
        'Que ocurra un gran avivamiento espiritual entre la generación joven en el centro de Lima y que la puerta de la misión universitaria se abra de par en par.',
        'Por la salud espiritual y física y la sabiduría de los ministros locales que lideran el discipulado.'
      ]
    },
    pt: {
      date: '28 de abril de 2026',
      title: 'Discipulado em Lima, Peru: Transformação dos Jovens na Cidade',
      excerpt: 'Um programa de discipulado iniciado na área universitária de Lima está dando grandes frutos. Ouça as vozes do campo cheias de sede pelo Evangelho.',
      body: [
        'Embora Lima, a capital do Peru, seja uma cidade moderna, muitos estudantes universitários e jovens experimentam fome espiritual e andanças entre os valores seculares. Começamos um curso de discipulado bíblico um a um para jovens em um centro perto da Universidade de Lima.',
        'A cada semana, 15 jovens se reúnem para aprender profundamente a Palavra de Deus e confessar suas vezes. Em particular, ver jovens que cresceram em ambientes familiares feridos perceberem o amor incondicional de Deus, experimentarem a cura e se transformarem é a maior recompensa da missão.'
      ],
      quote: 'Está acontecendo o milagre de jovens de elite em Lima, que costumavam buscar apenas o sucesso mundano, ajoelhando-se diante do Evangelho da cruz e decidindo viver como discípulos do Senhor.',
      prayers: [
        'Que os 15 jovens que participam do discipulado permaneçam firmes como discípulos dedicados de Cristo.',
        'Que ocorra um grande avivamento espiritual entre a geração jovem no centro de Lima e que a porta da missão universitária se abra de par em par.',
        'Pela saúde espiritual e física e sabedoria dos ministros locais que lideram o discipulado.'
      ]
    }
  },
  3: {
    region: 'Mexico',
    thumbnail: '/images/mock/mock03.webp',
    readTime: '6',
    ko: {
      date: '2026년 4월 15일',
      title: '멕시코 신학교 강의: 다음 세대 지도자를 세우는 여정',
      excerpt: '미래의 영적 지도자들을 양육하는 멕시코 신학교의 사역 현장입니다. 이번 학기 강의 일정과 학생들을 위한 기도를 부탁드립니다.',
      body: [
        '멕시코의 영적 재건을 위해서는 현지인 지도자를 올바르게 세우는 것이 무엇보다 중요합니다. 이번 학기 멕시코 신학교에서 구약 및 신약 성경 해석학 집중 강의를 진행했습니다. 여러 지역에서 온 25명의 신학생들이 밤낮으로 말씀 연구에 전념하고 있습니다.',
        '이들은 장차 목회자가 되어 멕시코 전역의 미자립 교회들을 이끌어갈 주역들입니다. 말씀의 깊이와 선교적 비전을 품고 훈련에 임하는 학생들의 뜨거운 눈빛 속에서 멕시코 교회의 밝은 미래를 봅니다. 이들이 복음의 진리 위에 바로 서도록 동역이 필요합니다.'
      ],
      quote: '교회 개척과 현지 자립의 초석은 오직 올바른 성경 가르침과 훈련을 받은 현지 지도자를 양성하는 것에서 시작됩니다.',
      prayers: [
        '신학교 학생들이 학문적인 지식을 넘어 하나님의 마음을 품은 참된 영적 목회자로 세워지도록',
        '졸업 후 현지 교회를 스스로 개척하고 섬길 때, 자립할 수 있는 선교적 비전과 물질적 필요가 채워지도록',
        '신학교 사역을 위한 교수진과 교육 환경의 재정적 안정이 마련되도록'
      ]
    },
    en: {
      date: 'April 15, 2026',
      title: 'Mexico Seminary Lecture: Equipping Next Gen Leaders',
      excerpt: 'Seminary lectures raising future spiritual leaders in Mexico. Please pray for this term\'s schedule and the students.',
      body: [
        'For the spiritual reconstruction of Mexico, raising local leaders correctly is of paramount importance. This semester, we conducted intensive lectures on Old and New Testament hermeneutics at the Mexico Seminary. Twenty-five seminary students from various regions are dedicated to studying the Word day and night.',
        'They will eventually become pastors and lead non-self-supporting churches throughout Mexico. In the passionate eyes of the students training with biblical depth and missionary vision, we see the bright future of the Mexican church. Partnership is needed for them to stand firm on the truth of the Gospel.'
      ],
      quote: 'The cornerstone of church planting and local self-reliance begins with nurturing local leaders who have received correct biblical teaching and training.',
      prayers: [
        'That the seminary students will grow beyond academic knowledge to become true spiritual pastors who possess God\'s heart.',
        'That they will have the missionary vision and financial provisions to plant and serve local churches self-sustainingly after graduation.',
        'That financial stability will be provided for the faculty and the educational environment of the seminary.'
      ]
    },
    es: {
      date: '15 de abril de 2026',
      title: 'Conferencias en el Seminario de México: Un Viaje para Formar Líderes de la Próxima Generación',
      excerpt: 'Clases de seminario para formar a los futuros líderes espirituales en México. Por favor, ore por el cronograma y los estudiantes.',
      body: [
        'Para la reconstrucción espiritual de México, formar líderes locales correctamente es de suma importancia. Este semestre, realizamos conferencias intensivas sobre hermenéutica del Antiguo y Nuevo Testamento en el Seminario de México. Veinticinco estudiantes de seminario de varias regiones se dedican a estudiar la Palabra día y noche.',
        'Con el tiempo, se convertirán en pastores y liderarán iglesias no autosuficientes en todo México. En los ojos apasionados de los estudiantes que se capacitan con profundidad bíblica y visión misionera, vemos el futuro brillante de la iglesia mexicana. Se necesita cooperación para que permanezcan firmes en la verdad del Evangelio.'
      ],
      quote: 'La piedra angular de la plantación de iglesias y la autosuficiencia local comienza con la formación de líderes locales que hayan recibido una enseñanza y capacitación bíblica correcta.',
      prayers: [
        'Que los estudiantes del seminario crezcan más allá del conocimiento académico para convertirse en verdaderos pastores espirituales con el corazón de Dios.',
        'Que tengan la visión misionera y las provisiones financieras para plantar y servir iglesias locales de manera autosuficiente después de graduarse.',
        'Que se provea estabilidad financiera para la facultad y el entorno educativo del seminario.'
      ]
    },
    pt: {
      date: '15 de abril de 2026',
      title: 'Palestras no Seminário do México: Uma Jornada para Equipar a Próxima Geração de Líderes',
      excerpt: 'Palestras do seminário para criar os futuros líderes espirituais no México. Por favor, ore pelo cronograma e pelos alunos.',
      body: [
        'Para a reconstrução espiritual do México, formar líderes locais corretamente é de suma importância. Este semestre, realizamos palestras intensivas sobre hermenêutica do Antigo e Novo Testamento no Seminário do México. Vinte e cinco alunos de seminário de várias regiões se dedicam a estudar a Palavra dia e noite.',
        'Eles se tornarão pastores e liderarão igrejas não autossuficientes em todo o México. Nos olhos apaixonados dos alunos que se capacitam com profundidade bíblica e visão missionária, vemos o futuro brilhante da igreja mexicana. A cooperação é necessária para que eles permaneçam firmes na verdade do Evangelho.'
      ],
      quote: 'A pedra angular da plantação de igrejas e da autossuficiência local começa com a formação de líderes locais que receberam ensino e treinamento bíblico corretos.',
      prayers: [
        'Que os alunos do seminário cresçam além do conhecimento acadêmico para se tornarem verdadeiros pastores espirituais com o coração de Deus.',
        'Que eles tenham a visão dinâmica e as provisões financeiras para plantar e servir igrejas locais de maneira autossuficiente após a formatura.',
        'Que a estabilidade financeira seja providenciada para o corpo docente e o ambiente educacional do seminário.'
      ]
    }
  },
  4: {
    region: 'General',
    thumbnail: '/images/mock/mock04.webp',
    readTime: '3',
    ko: {
      date: '2026년 3월 30일',
      title: '남미 선교를 위한 중보 기도 편지 (제124호)',
      excerpt: '남미 대륙 전체를 위한 연합 기도 제목을 나눕니다. 각 지역의 상황과 함께 긴급한 기도 제목들을 확인해 주세요.',
      body: [
        '남미의 여러 국가들은 경제적 불안정, 치안 악화, 그리고 이단 세력의 팽창으로 영적인 큰 도전을 맞이하고 있습니다. 그럼에도 불구하고 하나님의 말씀은 매이지 않고 구석구석 퍼져나가고 있습니다. 대륙을 덮고 있는 어둠을 걷어내는 힘은 오직 중보기도입니다.',
        '이번 중보 기도 편지에서는 선교지 현지 교회들이 외부의 도움에만 의존하는 것이 아니라, 스스로 자립하여 이웃 마을에 또 다른 선교의 손길을 뻗을 수 있도록 돕는 자립 개척 모델의 확산을 위해 초점을 맞추었습니다. 함께 무릎으로 동역해 주십시오.'
      ],
      quote: '선교 현장에서 일어나는 모든 승리는 보이지 않는 곳에서 눈물로 씨를 뿌리는 중보 기도자들의 연합된 기도 덕분입니다.',
      prayers: [
        '볼리비아, 베네수엘라 등 정치·경제적으로 매우 불안정한 국가의 교회와 성도들을 보호해 주시도록',
        '현지 자립 선교 모델이 대륙 전역으로 확산되어 건강한 토착 교회가 끊임없이 세워지도록',
        '선교 편지를 받아보는 모든 후원 교회와 가정 위에 하나님의 평강과 영적 부흥이 넘쳐나도록'
      ]
    },
    en: {
      date: 'March 30, 2026',
      title: 'Mission Intercession Prayer Letter (No. 124)',
      excerpt: 'We share the unified prayer topics for the entire South American continent. Please check the urgent prayer topics along with local situations.',
      body: [
        'Many countries in South America are facing major spiritual challenges due to economic instability, worsening public safety, and the expansion of heretical sects. Nevertheless, the Word of God is not chained and is spreading to every corner. The only power to clear the darkness covering the continent is intercessory prayer.',
        'In this prayer letter, we focused on spreading the self-supporting pioneer model that helps local churches in mission fields not only rely on external help, but also stand on their own and extend another mission hand to neighboring villages. Please partner with us on your knees.'
      ],
      quote: 'Every victory in the mission field is due to the united prayers of intercessors who sow seeds with tears in unseen places.',
      prayers: [
        'To protect the churches and saints in countries with high political and economic instability, such as Bolivia and Venezuela.',
        'That the local self-supporting mission model will spread across the continent so that healthy indigenous churches are constantly planted.',
        'That God\'s peace and spiritual revival will overflow upon all sponsoring churches and families receiving the mission letter.'
      ]
    },
    es: {
      date: '30 de marzo de 2026',
      title: 'Carta de Oración Intercesora para la Misión en Sudamérica (No. 124)',
      excerpt: 'Compartimos los temas de oración unificados para todo el continente sudamericano. Consulte los temas de oración urgentes junto con las situaciones locales.',
      body: [
        'Muchos países de Sudamérica enfrentan grandes desafíos espirituales debido a la inestabilidad económica, el empeoramiento de la seguridad pública y la expansión de sectas heréticas. Sin embargo, la Palabra de Dios no está encadenada y se está difundiendo por todos los rincones. El único poder para disipar la oscuridad que cubre el continente es la oración intercesora.',
        'En esta carta de oración, nos enfocamos en difundir el modelo de pionero autosuficiente que ayuda a las iglesias locales en los campos misioneros no solo a depender de la ayuda externa, sino también a valerse por sí mismas y extender otra mano misionera a las aldeas vecinas. Por favor colabore con nosotros de rodillas.'
      ],
      quote: 'Cada victoria en el campo misionero se debe a las oraciones unidas de los intercesores que siembran semillas con lágrimas en lugares invisibles.',
      prayers: [
        'Para proteger a las iglesias y santos en países con alta inestabilidad política y económica, como Bolivia y Venezuela.',
        'Que el modelo misionero local autosuficiente se extienda por todo el continente para que se planten constantemente iglesias de manera saludable.',
        'Que la paz de Dios y el avivamiento espiritual desborden sobre todas las iglesias y familias patrocinadoras que reciben la carta misionera.'
      ]
    },
    pt: {
      date: '30 de março de 2026',
      title: 'Carta de Oração Intercessória para a Missão na América do Sul (No. 124)',
      excerpt: 'Compartilhamos os tópicos de oração unificados para todo o continente sul-americano. Por favor, verifique os tópicos urgentes de oração junto com as situações locais.',
      body: [
        'Muitos países da América do Sul enfrentam grandes desafios espirituais devido à instabilidade econômica, piora da segurança pública e expansão de seitas heréticas. No entanto, a Palavra de Deus não está acorrentada e está se espalhando por todos os cantos. O único poder para dissipar a escuridão que cobre o continente é a oração intercessória.',
        'Nesta carta de oração, focamos em espalhar o modelo pioneiro autossuficiente que ajuda as igrejas locais nos campos missionários não apenas a depender de ajuda externa, mas também a se sustentarem por si mesmas e estenderem outra mão missionária às aldeias vizinhas. Por favor, seja nosso parceiro de joelhos.'
      ],
      quote: 'Cada vitória no campo missionário se deve às orações unidas de intercessores que semeiam sementes com lágrimas em locais invisíveis.',
      prayers: [
        'Para proteger as igrejas e santos em países com alta instabilidade política e econômica, como Bolívia e Venezuela.',
        'Que o modelo missionário local autossuficiente se espalhe pelo continente para que igrejas nativas saudáveis sejam constantemente plantadas.',
        'Que a paz de Deus e o avivamento espiritual transbordem sobre todas as igrejas e famílias patrocinadoras que recebem a carta missionária.'
      ]
    }
  },
  5: {
    region: 'General',
    thumbnail: '/images/mock/mock05.webp',
    readTime: '7',
    ko: {
      date: '2026년 3월 15일',
      title: '볼리비아 의료 선교: 사랑의 인술을 전하다',
      excerpt: '볼리비아 오지 마을에서 진행된 의료 사역 보고입니다. 육신의 질병뿐만 아니라 마음의 상처까지 치유하시는 하나님의 은혜를 나누고 싶습니다.',
      body: [
        '해발 3,800m의 척박한 안데스 고원 지대에 위치한 볼리비아의 한 원주민 마을을 찾았습니다. 병원조차 없어서 가벼운 질병도 큰 병으로 키우는 가난한 주민들을 위해, 현지 협력 의사들과 함께 연합 의료 선교팀을 구성해 방문했습니다.',
        '3일간 약 300명의 환자들을 치료하며 약품을 전달하고, 대기하는 주민들에게 복음 카드를 전하고 영접 기도를 도왔습니다. 육신의 치유를 넘어 하나님이 자신들을 기억하고 계신다는 소식에 많은 원주민들이 감격의 눈물을 흘렸습니다.'
      ],
      quote: '차가운 고산지대의 바람 속에서도 복음과 사랑의 손길이 닿을 때, 그들의 얼어붙은 마음과 질병이 녹아내리는 온기를 느꼈습니다.',
      prayers: [
        '의료 혜택을 받은 300여 명의 원주민들이 육신의 회복을 넘어 예수 그리스도를 구주로 영접하도록',
        '마을에 지속적인 케어와 예배 인도를 담당할 현지인 가정사역자가 속히 세워지도록',
        '약품 조달 및 이동 차량 확보 등 향후 의료 선교가 지속될 수 있는 자원이 계속 이어지도록'
      ]
    },
    en: {
      date: 'March 15, 2026',
      title: 'Bolivia Medical Mission: Healing Hearts & Bodies',
      excerpt: 'A report on the medical ministry conducted in a remote village in Bolivia. We want to share the grace of God healing both physical illness and emotional wounds.',
      body: [
        'We visited an indigenous village in Bolivia located in the barren Andes highlands, 3,800 meters above sea level. For the poor residents who grow minor illnesses into major ones because they do not even have a hospital, we formed a joint medical mission team with local cooperative doctors.',
        'We treated about 300 patients over three days, delivered medicine, distributed Gospel cards to waiting residents, and helped them pray to accept Christ. Beyond physical healing, many indigenous people shed tears of emotion at the news that God remembered them.'
      ],
      quote: 'Even in the cold wind of the highlands, when the touch of the Gospel and love reached them, we felt the warmth that melted their frozen hearts and illnesses.',
      prayers: [
        'That the 300 indigenous people who received medical benefits will accept Jesus Christ as Savior beyond physical recovery.',
        'That a local family minister who will be responsible for ongoing care and leading worship will be established in the village soon.',
        'That resources such as securing medicine and transportation vehicles will continue for future medical missions.'
      ]
    },
    es: {
      date: '15 de marzo de 2026',
      title: 'Misión Médica en Bolivia: Compartiendo el Amor Sanador de Cristo',
      excerpt: 'Informe sobre el ministerio médico realizado en una aldea remota de Bolivia. Deseamos compartir la gracia de Dios que sana tanto la enfermedad física como las heridas emocionales.',
      body: [
        'Visitamos una aldea indígena en Bolivia ubicada en las áridas tierras altas de los Andes, a 3.800 metros sobre el nivel del mar. Para los residentes pobres que convierten enfermedades menores en mayores porque ni siquiera tienen un hospital, formamos un equipo conjunto de misión médica con médicos cooperadores locales.',
        'Atendimos a unos 300 pacientes durante tres días, entregamos medicamentos, distribuimos tarjetas del Evangelio a los residentes en espera y los ayudamos a orar para aceptar a Cristo. Más allá de la curación física, muchos indígenas derramaron lágrimas de emoción ante la noticia de que Dios los recordaba.'
      ],
      quote: 'Incluso en el viento frío del altiplano, cuando el toque del Evangelio y el amor los alcanzó, sentimos la calidez que derritió sus corazones congelados y sus enfermedades.',
      prayers: [
        'Que los 300 indígenas que recibieron beneficios médicos acepten a Jesucristo como Salvador más allá de la recuperación física.',
        'Que pronto se establezca en la aldea un ministro familiar local que sea responsable del cuidado continuo y de liderar la adoración.',
        'Que continúen los recursos, como la obtención de medicamentos y vehículos de transporte, para futuras misiones médicas.'
      ]
    },
    pt: {
      date: '15 de março de 2026',
      title: 'Missão Médica na Bolívia: Compartilhando o Amor Curador de Cristo',
      excerpt: 'Um relatório sobre o ministério médico realizado em uma aldeia remota na Bolívia. Queremos compartilhar a graça de Deus curando tanto a doença física quanto as feridas emocionais.',
      body: [
        'Visitamos uma aldeia indígena na Bolívia localizada nas áridas terras altas dos Andes, a 3.800 metros acima do nível do mar. Para os moradores pobres que transformam doenças menores em graves porque nem sequer têm um hospital, formamos uma equipe de missão médica conjunta com médicos cooperadores locais.',
        'Atendemos cerca de 300 pacientes durante três dias, entregamos medicamentos, distribuímos cartões do Evangelho aos moradores em espera e os ajudamos a aceitar a Cristo. Além da cura física, muitos indígenas choraram de emoção com a notícia de que Deus se lembrava deles.'
      ],
      quote: 'Mesmo no vento frio do planalto, quando o toque do Evangelho e do amor os alcançou, sentimos o calor que derreteu seus corações congelados e suas doenças.',
      prayers: [
        'Que os 300 indígenas que receberam benefícios médicos aceitem Jesus Cristo como Salvador além da recuperação física.',
        'Que um ministro de família local, que será responsável pelos cuidados contínuos e por liderar a adoração, seja estabelecido em breve na aldeia.',
        'Que continuem os recursos, como a obtenção de medicamentos e veículos de transporte, para futuras missões médicas.'
      ]
    }
  },
  6: {
    region: 'General',
    thumbnail: '/images/mock/mock06.webp',
    readTime: '5',
    ko: {
      date: '2026년 3월 01일',
      title: '칠레 산티아고 가정교회 개척 지원 보고',
      excerpt: '산티아고 외곽 지역에 새롭게 시작된 가정교회 개척 소식입니다. 현지 협력 목회자와 성도들의 뜨거운 헌신을 나눕니다.',
      body: [
        '칠레의 수도 산티아고 외곽의 빈민가 지역에 조그만 가정교회가 세워졌습니다. 현지인 협력 전도사인 에스테반과 그의 가족이 자신의 낡은 거실을 예배 처소로 아낌없이 개방하며 사역의 첫걸음을 뗐습니다.',
        '가난과 절망이 가득한 거리에 성경 말씀 소리가 울려 퍼지기 시작하자, 한두 명씩 이웃들이 모여들어 이제는 10여 명의 예배 공동체로 자라났습니다. 작은 겨자씨 같은 이 교회가 산티아고 빈민가 전체를 변화시키는 누룩이 될 줄 믿습니다.'
      ],
      quote: '거실 구석에 놓인 낡은 피아노와 성경책이 전부이지만, 그곳은 이미 하나님의 임재로 충만한 영광스러운 성전이었습니다.',
      prayers: [
        '에스테반 전도사의 가정교회가 빈민가 주민들에게 천국의 소망을 전하는 구원의 등대가 되도록',
        '늘어나는 성도들을 수용하고 안전하게 예배를 드릴 수 있는 든든한 처소가 마련되도록',
        '자립적인 재정 확보와 현지 성도들의 신실한 십일조 및 헌신이 생활 속에 온전히 정착되도록'
      ]
    },
    en: {
      date: 'March 01, 2026',
      title: 'Chile Santiago House Church Planting Support Report',
      excerpt: 'News of a newly started house church planting in the outskirts of Santiago. We share the passionate devotion of the local cooperative pastor and saints.',
      body: [
        'A small house church has been established in a slum area on the outskirts of Santiago, the capital of Chile. Esteban, a local cooperative evangelist, and his family took the first steps of ministry by generously opening their old living room as a place of worship.',
        'As the sound of the Bible began to echo in the streets full of poverty and despair, neighbors gathered one by one, and it has now grown into a worship community of about 10 people. We believe this church, like a small mustard seed, will become the leaven that transforms the entire Santiago slum.'
      ],
      quote: 'Although an old piano and a Bible in the corner of the living room were all they had, it was already a glorious temple filled with the presence of God.',
      prayers: [
        'That Evangelist Esteban\'s house church will become a lighthouse of salvation, delivering the hope of heaven to slum residents.',
        'That a stable place of worship will be prepared to accommodate the growing number of saints and worship safely.',
        'That securing self-supporting finances and the faithful tithing and devotion of local saints will be fully established in their daily lives.'
      ]
    },
    es: {
      date: '01 de marzo de 2026',
      title: 'Apoyo a la Plantación de Iglesias en Casas en Santiago, Chile',
      excerpt: 'Noticias de una iglesia en casa recientemente iniciada en las afueras de Santiago. Compartimos la devoción del pastor y santos locales.',
      body: [
        'Se ha establecido una pequeña iglesia en casa en una zona pobre en las afueras de Santiago, la capital de Chile. Esteban, un evangelista colaborador local, y su familia dieron los primeros pasos del ministerio al abrir generosamente su antigua sala de estar como lugar de culto.',
        'A medida que el sonido de la Biblia comenzaba a resonar en las calles llenas de pobreza y desesperanza, los vecinos se reunieron uno por uno, y ahora se ha convertido en una comunidad de adoración de unas 10 personas. Creemos que esta iglesia, como una pequeña semilla de mostaza, se convertirá en la levadura que transforme todo el suburbio de Santiago.'
      ],
      quote: 'Aunque un piano viejo y una Biblia en la esquina de la sala de estar eran todo lo que tenían, ya era un templo glorioso lleno de la presencia de Dios.',
      prayers: [
        'Que la iglesia en casa del evangelista Esteban se convierta en un faro de salvación, llevando la esperanza del cielo a los residentes de los suburbios.',
        'Que se prepare un lugar estable para acomodar al creciente número de santos y adorar de manera segura.',
        'Que se establezca plenamente la obtención de finanzas autosuficientes y el diezmo fiel y devoción de los santos locales.'
      ]
    },
    pt: {
      date: '01 de março de 2026',
      title: 'Relatório sobre Apoio à Plantação de Igrejas nos Lares em Santiago, Chile',
      excerpt: 'Notícias de uma igreja em casa recém-iniciada nos arredores de Santiago. Compartilhamos a devoção apaixonada do pastor e santos locais.',
      body: [
        'Uma pequena igreja em casa foi estabelecida em uma área carente na periferia de Santiago, capital do Chile. Esteban, um evangelista colaborador local, e sua família deram os primeiros passos do ministério ao abrir generosamente sua antiga sala de estar como local de culto.',
        'À medida que o som da Bíblia começava a ecoar nas ruas cheias de pobreza e desespero, os vizinhos se reuniram um a um, e agora cresceu para uma comunidade de adoração de cerca de 10 pessoas. Acreditamos que esta igreja, como uma pequena semente de mostarda, se tornará o fermento que transformará toda a favela de Santiago.'
      ],
      quote: 'Embora um piano velho e uma Bíblia no canto da sala fossem tudo o que tinham, já era um templo glorioso cheio da presença de Deus.',
      prayers: [
        'Que a igreja em casa do Evangelista Esteban se torne um farol de salvação, levando a esperança do céu aos moradores da favela.',
        'Que um local estável de culto seja preparado para acomodar o número crescente de santos e adorar com segurança.',
        'Que a obtenção de finanças autossuficientes e o dízimo fiel e devoção dos santos locais sejam totalmente estabelecidos em suas vidas diárias.'
      ]
    }
  },
  7: {
    region: 'General',
    thumbnail: '/images/mock/mock07.webp',
    readTime: '4',
    ko: {
      date: '2026년 2월 15일',
      title: '콜롬비아 보고타 어린이 성경 캠프 개막',
      excerpt: '어려운 환경에 처한 보고타 지역 어린이 100여 명을 초청하여 진행된 성경 캠프의 감격스러운 현장 스케치를 공유합니다.',
      body: [
        '콜롬비아 보고타의 소외 지역 아이들은 마약과 범죄의 위협에 무방비로 노출되어 있습니다. 우리는 이 아이들에게 예수님의 사랑을 전하고 말씀의 뿌리를 내리기 위해 2박 3일간의 집중 어린이 성경 캠프를 개최했습니다.',
        '"하나님의 특별한 보석"이라는 주제로 인형극, 레크리에이션, 그리고 소그룹 성경 공부를 진행했습니다. 처음에는 마음의 문을 닫고 낯설어하던 아이들이 캠프 마지막 날 예수님을 영접하고 눈물로 기도하는 모습은 기적과 같았습니다.'
      ],
      quote: '아이들의 웃음소리가 사라진 메마른 도심에, 하나님의 말씀이 떨어지자 찬양과 기쁨의 노래가 가득 울려 퍼졌습니다.',
      prayers: [
        '캠프를 통해 복음의 씨앗이 심겨진 100여 명의 어린이들이 악한 환경에 휩쓸리지 않고 믿음 안에서 자라도록',
        '아이들이 가정으로 돌아가 부모와 친지들에게 복음을 전하는 꼬마 선교사의 역할을 감당하도록',
        '보고타의 현지 어린이 사역 교사들의 안전과 영적인 충만함이 늘 지속되도록'
      ]
    },
    en: {
      date: 'February 15, 2026',
      title: 'Colombia Bogota Children\'s Bible Camp Opens',
      excerpt: 'We share the touching scenes from the Bible camp held for over 100 children in difficult environments in Bogota.',
      body: [
        'Children in underprivileged areas of Bogota, Colombia, are defenseless against the threats of drugs and crime. We held a 3-day, 2-night intensive children\'s Bible camp to share the love of Jesus with these children and root them in the Word.',
        'Under the theme of "God\'s Special Jewel," we conducted puppet shows, recreation, and small-group Bible studies. It was a miracle to see children, who were unfamiliar and closed their hearts at first, accept Jesus and pray in tears on the last day of camp.'
      ],
      quote: 'In the dry city center where children\'s laughter had disappeared, when the Word of God fell, songs of praise and joy filled the air.',
      prayers: [
        'That the 100 children in whom the seeds of the Gospel were planted through the camp will grow in faith without being swept away by the evil environment.',
        'That the children will act as little missionaries, sharing the Gospel with parents and relatives when they return home.',
        'For the ongoing safety and spiritual fullness of the local children\'s ministry teachers in Bogota.'
      ]
    },
    es: {
      date: '15 de febrero de 2026',
      title: 'Campamento Bíblico de Niños en Bogotá, Colombia',
      excerpt: 'Compartimos las conmovedoras escenas del campamento bíblico realizado para más de 100 niños en entornos difíciles en Bogotá.',
      body: [
        'Los niños de las zonas desfavorecidas de Bogotá, Colombia, están indefensos ante las amenazas de las drogas y la delincuencia. Realizamos un campamento bíblico intensivo para niños de 3 días y 2 noches para compartir el amor de Jesús con estos niños y arraigarlos en la Palabra.',
        'Bajo el lema de "La joya especial de Dios", realizamos espectáculos de títeres, recreación y estudios bíblicos en grupos pequeños. Fue un milagro ver a niños, que al principio estaban reacios y tenían el corazón cerrado, aceptar a Jesús y orar entre lágrimas el último día del campamento.'
      ],
      quote: 'En el centro seco de la ciudad donde la risa de los niños había desaparecido, cuando cayó la Palabra de Dios, cantos de alabanza y alegría llenaron el aire.',
      prayers: [
        'Que los 100 niños en quienes se plantaron las semillas del Evangelio a través del campamento crezcan en la fe sin dejarse arrastrar por el entorno delictivo.',
        'Que los niños actúen como pequeños misioneros, compartiendo el Evangelio con padres y parientes cuando regresen a casa.',
        'Por la seguridad continua y la plenitud espiritual de los maestros locales del ministerio de niños en Bogotá.'
      ]
    },
    pt: {
      date: '15 de fevereiro de 2026',
      title: 'Acampamento Bíblico de Crianças em Bogotá, Colômbia',
      excerpt: 'Compartilhamos as cenas emocionantes do acampamento bíblico realizado para mais de 100 crianças em ambientes difíceis em Bogotá.',
      body: [
        'As crianças em áreas carentes de Bogotá, Colômbia, estão indefesas contra as ameaças das drogas e do crime. Realizamos um acampamento bíblico intensivo de 3 dias e 2 noites para compartilhar o amor de Jesus com essas crianças e enraizá-las na Palavra.',
        'Sob o tema "A Joia Especial de Deus", realizamos shows de fantoches, recreação e estudos bíblicos em pequenos grupos. Foi um milagre ver crianças, que antes eram ariscas e tinham o coração fechado, aceitarem Jesus e orarem em lágrimas no último dia do acampamento.'
      ],
      quote: 'No centro seco da cidade, onde o riso das crianças havia desaparecido, quando caiu a Palavra de Deus, cânticos de louvor e alegria encheram o ar.',
      prayers: [
        'Que as 100 crianças em quem as sementes do Evangelho foram plantadas através do acampamento cresçam na fé sem serem arrastadas pelo ambiente maligno.',
        'Que as crianças atuem como pequenos missionários, compartilhando o Evangelho com pais e parentes quando voltarem para casa.',
        'Pela segurança contínua e plenitude espiritual dos professores locais do ministério infantil em Bogotá.'
      ]
    }
  },
  8: {
    region: 'General',
    thumbnail: '/images/mock/mock08.webp',
    readTime: '5',
    ko: {
      date: '2026년 1월 28일',
      title: '에콰도르 키토 청년 제자양육 훈련 수료식',
      excerpt: '키토 지역 대학생들을 대상으로 6개월간 진행된 일대일 제자양육 과정의 수료식 소식입니다. 헌신된 증인들의 고백을 들어보세요.',
      body: [
        '에콰도르의 수도 키토에서 청년 리더를 양성하기 위한 6개월간의 일대일 제자양육 과정이 완료되어 영광스러운 수료식을 가졌습니다. 이번에 수료한 8명의 대학생들은 매주 깊은 말씀 공부와 삶의 적용을 실천해 왔습니다.',
        '수료식에서 각 청년들은 자신들의 불신앙과 좌절을 극복하고, 하나님의 부르심에 어떻게 순종하기로 결단했는지 고백했습니다. 이제 이들은 단순한 수료생이 아니라, 다음 학기에 또 다른 청년들을 양육할 일대일 멘토로 나섭니다.'
      ],
      quote: '훈련받은 한 명의 청년이 또 다른 청년을 세우는 자립적 제자 배가의 비전이 드디어 키토 땅에서 싹을 틔웠습니다.',
      prayers: [
        '수료한 8명의 대학생들이 삶의 현장에서 예수님의 신실한 증인으로 살아가며 타협하지 않도록',
        '이번 학기에 새로운 청년 동역자들을 찾아 일대일 제자양육을 시작할 때, 지혜와 사랑을 더해 주시도록',
        '청년 사역을 적극 후원하고 기도로 지원해주는 배후의 중보 그룹이 활성화되도록'
      ]
    },
    en: {
      date: 'January 28, 2026',
      title: 'Ecuador Quito Youth Discipleship Graduation',
      excerpt: 'News of the graduation ceremony for the 6-month one-on-one discipleship training course held for college students in Quito. Listen to the testimonies of the dedicated witnesses.',
      body: [
        'A glorious graduation ceremony was held in Quito, the capital of Ecuador, after completing a 6-month one-on-one discipleship training course to raise young leaders. The 8 college students who graduated this time practiced deep Word study and life application every week.',
        'At the graduation ceremony, each young person confessed how they overcame their unbelief and frustration and decided to obey God\'s calling. Now, they are not just graduates, but will act as one-on-one mentors to nurture other young people next semester.'
      ],
      quote: 'The vision of self-supporting discipleship multiplication, where one trained youth raises another youth, has finally sprouted in the land of Quito.',
      prayers: [
        'That the 8 graduated college students will live as faithful witnesses of Jesus in their daily lives without compromise.',
        'That wisdom and love will be added to them when they search for new youth partners and start one-on-one discipleship training this semester.',
        'That the background intercessor group that actively supports and prays for youth ministry will be activated.'
      ]
    },
    es: {
      date: '28 de enero de 2026',
      title: 'Ceremonia de Graduación del Discipulado de Jóvenes en Quito, Ecuador',
      excerpt: 'Noticias de la ceremonia de graduación del discipulado uno a uno de 6 meses para estudiantes universitarios en Quito. Escuche los testimonios de los dedicados testigos.',
      body: [
        'Se llevó a cabo una gloriosa ceremonia de graduación en Quito, la capital de Ecuador, tras completar un curso de discipulado uno a uno de 6 meses para formar líderes jóvenes. Los 8 estudiantes universitarios que se graduaron esta vez practicaron el estudio profundo de la Palabra y la aplicación en la vida diaria cada semana.',
        'En la ceremonia de graduación, cada joven confesó cómo superó su incredulidad y frustración y decidió obedecer el llamado de Dios. Ahora, no son solo graduados, sino que actuarán como mentores uno a uno para formar a otros jóvenes el próximo semestre.'
      ],
      quote: 'La visión de la multiplicación de discípulos autosuficientes, donde un joven capacitado forma a otro joven, finalmente ha brotado en la tierra de Quito.',
      prayers: [
        'Que los 8 estudiantes universitarios graduados vivan como testigos fieles de Jesús en sus vidas diarias sin comprometerse.',
        'Que se les añada sabiduría y amor cuando busquen nuevos compañeros jóvenes y comiencen el discipulado uno a uno este semestre.',
        'Que se active el grupo de intercesión que apoya activamente y ora por el ministerio de jóvenes.'
      ]
    },
    pt: {
      date: '28 de janeiro de 2026',
      title: 'Cerimônia de Graduação do Discipulado de Jovens em Quito, Equador',
      excerpt: 'Notícias da cerimônia de graduação do curso de discipulado um a um de 6 meses realizado para estudantes universitários em Quito. Ouça os testemunhos das testemunhas dedicadas.',
      body: [
        'Uma gloriosa cerimônia de graduação foi realizada em Quito, capital do Equador, após a conclusão de um curso de discipulado um a um de 6 meses para treinar jovens líderes. Os 8 estudantes universitários que se graduaram praticaram estudo profundo da Palavra e aplicação na vida diária a cada semana.',
        'Na cerimônia de graduação, cada jovem confessou como superou sua incredulidade e frustração e decidiu obedecer ao chamado de Deus. Agora, eles não são apenas graduados, mas atuarão como mentores um a um para treinar outros jovens no próximo semestre.'
      ],
      quote: 'A visão da multiplicação autossuficiente de discípulos, onde um jovem treinado levanta outro jovem, finalmente brotou na terra de Quito.',
      prayers: [
        'Que os 8 estudantes universitários graduados vivam como testemunhas fiéis de Jesus em suas vidas diárias sem compromissos.',
        'Que sabedoria e amor lhes sejam concedidos quando buscarem novos jovens parceiros e iniciarem o discipulado um a um este semestre.',
        'Que o grupo de intercessão que apoia ativamente e ora pelo ministério de jovens seja ativado.'
      ]
    }
  }
};

const localNewsletters = ref([]);

// Computed merged articles content mapping to dynamically support user-written articles
const mergedArticlesContent = computed(() => {
  const merged = { ...articlesContent };
  
  // Merge custom newsletters from local storage
  localNewsletters.value.forEach(item => {
    merged[item.id] = {
      region: item.region,
      thumbnail: item.thumbnail,
      readTime: item.readTime,
      ko: item.ko,
      en: item.en,
      es: item.es,
      pt: item.pt
    };
  });
  
  return merged;
});

// Computed localized newsletters array for card grid display
const mockNewsletters = computed(() => {
  const lang = locale.value || 'ko';
  return Object.keys(mergedArticlesContent.value).map(idStr => {
    const id = parseInt(idStr);
    const rawArticle = mergedArticlesContent.value[id];
    const localized = rawArticle[lang] || rawArticle['ko'];
    return {
      id,
      region: rawArticle.region,
      thumbnail: rawArticle.thumbnail,
      readTime: rawArticle.readTime,
      date: localized.date,
      title: localized.title,
      excerpt: localized.excerpt
    };
  });
});

// Computed: Search and Filter logic
const filteredItems = computed(() => {
  return mockNewsletters.value.filter(item => {
    // 1. Region filter
    const matchesRegion = activeFilter.value === 'all' || item.region.toLowerCase() === activeFilter.value;
    
    // 2. Search query filter
    const matchesSearch = !searchQuery.value || 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      item.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase());
      
    return matchesRegion && matchesSearch;
  });
});

// Computed: Sliced items based on pagination limit
const visibleItems = computed(() => {
  return filteredItems.value.slice(0, visibleCount.value);
});

// Computed: Whether there are more items to load
const hasMoreItems = computed(() => {
  return visibleCount.value < filteredItems.value.length;
});

// Action: load 3 more items
const loadMore = () => {
  visibleCount.value += 3;
};

// Open article modal
const openArticle = (id) => {
  selectedArticleId.value = id;
  isModalOpen.value = true;
  
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
  if ($lenis) {
    $lenis.stop();
  }
};

// Close article modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedArticleId.value = null;
  
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
  if ($lenis) {
    $lenis.start();
  }
};

// Modal Navigation
const navigateToArticle = (id) => {
  selectedArticleId.value = id;
  // Scroll the modal scroll container back to top
  if (typeof document !== 'undefined') {
    const scrollEl = document.querySelector('.modal-scroll-container');
    if (scrollEl) {
      scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};

// Modal CTA Routing
const handleCtaClick = () => {
  closeModal();
  router.push(localePath('/') + '#contact');
};

// Current article detailed view data
const currentArticle = computed(() => {
  if (!selectedArticleId.value) return null;
  const id = selectedArticleId.value;
  const rawArticle = mergedArticlesContent.value[id];
  if (!rawArticle) return null;
  const lang = locale.value || 'ko';
  const localized = rawArticle[lang] || rawArticle['ko'];
  return {
    id,
    region: rawArticle.region,
    thumbnail: rawArticle.thumbnail,
    readTime: rawArticle.readTime,
    date: localized.date,
    title: localized.title,
    excerpt: localized.excerpt,
    body: localized.body,
    quote: localized.quote,
    prayers: localized.prayers
  };
});

// Navigation: index within current filtered items
const prevArticleId = computed(() => {
  if (!selectedArticleId.value) return null;
  const currentId = selectedArticleId.value;
  const list = filteredItems.value;
  const index = list.findIndex(item => item.id === currentId);
  if (index > 0) {
    return list[index - 1].id;
  }
  return null;
});

const nextArticleId = computed(() => {
  if (!selectedArticleId.value) return null;
  const currentId = selectedArticleId.value;
  const list = filteredItems.value;
  const index = list.findIndex(item => item.id === currentId);
  if (index !== -1 && index < list.length - 1) {
    return list[index + 1].id;
  }
  return null;
});

// Watch route query to support direct URLs with modal (e.g. /newsletter?id=3)
watch(() => route.query.id, (newId) => {
  if (newId) {
    const id = parseInt(newId);
    if (id && mergedArticlesContent.value[id]) {
      openArticle(id);
    }
  } else if (isModalOpen.value) {
    closeModal();
  }
}, { immediate: true });

// SEO Head setup
useHead({
  title: `${t('newsletter.subpage_title')} | Vision Thru the Bible`,
  meta: [
    { name: 'description', content: t('newsletter.subpage_subtitle') }
  ]
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('custom_newsletters');
    if (stored) {
      try {
        localNewsletters.value = JSON.parse(stored);
      } catch (e) {}
    }
  }


});

onUnmounted(() => {
  // Ensure scroll is unlocked when leaving page
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
  if ($lenis) {
    $lenis.start();
  }
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Modal Transitions */
.modal-fade-enter-active {
  transition: opacity 0.35s ease;
}
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active > div:last-child {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
}
.modal-fade-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from {
  opacity: 0;
}
.modal-fade-enter-from > div:last-child {
  opacity: 0;
  transform: scale(0.95) translateY(30px);
}

.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.95) translateY(30px);
}

/* Custom scrollbar for modal body */
.modal-body-scroll::-webkit-scrollbar {
  width: 6px;
}
.modal-body-scroll::-webkit-scrollbar-track {
  background: #F5EBE0;
  border-radius: 10px;
}
.modal-body-scroll::-webkit-scrollbar-thumb {
  background: #D7C4B7;
  border-radius: 10px;
}
.modal-body-scroll::-webkit-scrollbar-thumb:hover {
  background: #E87A5D;
}
</style>
