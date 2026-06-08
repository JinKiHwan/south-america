import { defineEventHandler, readBody } from 'h3';

// Helper to translate text using the MyMemory Translation API
async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return '';
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=ko|${targetLang}`;
    // Fetch with a 5-second timeout to prevent blocking
    const res = await $fetch<any>(url, { timeout: 5000 });
    if (res?.responseData?.translatedText) {
      // Decode HTML entities if any
      let translated = res.responseData.translatedText;
      translated = translated
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      return translated;
    }
    throw new Error('Empty response');
  } catch (err) {
    console.warn(`Translation to ${targetLang} failed for text: "${text.substring(0, 15)}...". Error:`, err);
    // Smart fallback: return original text with a marker so the user can easily see and edit it
    return `[${targetLang.toUpperCase()} Translation Fallback] ${text}`;
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, excerpt, bodyText, prayers } = body;

    const targetLangs = ['en', 'es', 'pt'];
    const translations: any = {};

    // Process translations in parallel or sequence. 
    // Sequence is safer for free API rate limits, but we can do parallel with Promise.all
    for (const lang of targetLangs) {
      // 1. Title
      const translatedTitle = await translateText(title || '', lang);
      
      // 2. Excerpt
      const translatedExcerpt = await translateText(excerpt || '', lang);
      
      // 3. Body paragraphs
      const paragraphs = (bodyText || '')
        .split('\n')
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);
        
      const translatedParagraphs = [];
      for (const p of paragraphs) {
        translatedParagraphs.push(await translateText(p, lang));
      }

      // 4. Prayers list
      const translatedPrayers = [];
      for (const prayer of (prayers || [])) {
        if (prayer && prayer.trim()) {
          translatedPrayers.push(await translateText(prayer, lang));
        }
      }

      translations[lang] = {
        title: translatedTitle,
        excerpt: translatedExcerpt,
        body: translatedParagraphs,
        prayers: translatedPrayers
      };
    }

    return {
      success: true,
      translations
    };
  } catch (error: any) {
    console.error('Translation handler error:', error);
    return {
      success: false,
      error: error.message || 'Failed to translate content'
    };
  }
});
