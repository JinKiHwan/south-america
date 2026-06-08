<template>
  <div class="tiptap-wrap">
    <!-- Toolbar: editor가 초기화된 후에만 렌더링 -->
    <div v-if="editor" class="tiptap-toolbar">
      <!-- Text Style -->
      <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" title="굵게 (Bold)" aria-label="Bold">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 11.8c.9-.7 1.4-1.7 1.4-2.8C17 6.2 14.8 4 12 4H6v16h6.5c2.6 0 4.5-2.1 4.5-4.5 0-1.5-.8-2.8-1.9-3.7zM9 7h3c1.1 0 2 .9 2 2s-.9 2-2 2H9V7zm3.5 10H9v-4h3.5c1.4 0 2.5 1.1 2.5 2.5S13.9 17 12.5 17z"/></svg>
      </button>
      <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" title="기울임 (Italic)" aria-label="Italic">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 4v2h2.2L9.8 18H7.5v2h7v-2h-2.2l3.9-12h2.3V4z"/></svg>
      </button>
      <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }" title="밑줄 (Underline)" aria-label="Underline">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.3 0 6-2.7 6-6V3h-2.5v8c0 1.9-1.6 3.5-3.5 3.5S8.5 12.9 8.5 11V3H6v8c0 3.3 2.7 6 6 6zm-7 2v2h14v-2H5z"/></svg>
      </button>

      <span class="tiptap-divider"></span>

      <!-- Headings -->
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" title="제목 2 (H2)" aria-label="H2">
        <span style="font-size: 11px; font-weight: 700; letter-spacing: -0.03em;">H2</span>
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" title="제목 3 (H3)" aria-label="H3">
        <span style="font-size: 11px; font-weight: 700; letter-spacing: -0.03em;">H3</span>
      </button>

      <span class="tiptap-divider"></span>

      <!-- Lists -->
      <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" title="글머리 기호 목록" aria-label="Bullet List">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
      </button>
      <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" title="번호 매기기 목록" aria-label="Ordered List">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
      </button>

      <span class="tiptap-divider"></span>

      <!-- Quote & HR -->
      <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" title="인용구 (Blockquote)" aria-label="Blockquote">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
      </button>
      <button type="button" @click="editor.chain().focus().setHorizontalRule().run()" title="구분선 (HR)" aria-label="Horizontal Rule">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
      </button>

      <span class="tiptap-divider"></span>

      <!-- Undo / Redo -->
      <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" title="실행 취소 (Undo)" aria-label="Undo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
      </button>
      <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" title="다시 실행 (Redo)" aria-label="Redo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
      </button>
    </div>

    <!-- Editor Content Area -->
    <EditorContent v-if="editor" :editor="editor" class="tiptap-content" />

    <!-- SSR fallback placeholder -->
    <div v-else class="tiptap-ssr-placeholder">에디터를 불러오는 중...</div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '내용을 입력하세요.',
  },
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  editorProps: {
    attributes: {
      class: 'tiptap-editor-inner',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
});

// Sync external changes (e.g. reset)
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && editor.value.getHTML() !== val) {
      editor.value.commands.setContent(val || '', false);
    }
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
.tiptap-wrap {
  border: 1px solid #E8E3DD;
  border-radius: 12px;
  overflow: hidden;
  background-color: #FDFBF9;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.tiptap-wrap:focus-within {
  border-color: #E87A5D;
  box-shadow: 0 0 0 3px rgba(232, 122, 93, 0.12);
}

/* Toolbar */
.tiptap-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: 8px 10px;
  border-bottom: 1px solid #E8E3DD;
  background-color: #F5EFE8;
}
.tiptap-toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #7A7571;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.tiptap-toolbar button:hover:not(:disabled) {
  background-color: rgba(232, 122, 93, 0.1);
  color: #E87A5D;
}
.tiptap-toolbar button.is-active {
  background-color: rgba(232, 122, 93, 0.15);
  color: #E87A5D;
}
.tiptap-toolbar button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.tiptap-divider {
  display: block;
  width: 1px;
  height: 20px;
  background-color: #E8E3DD;
  margin: 0 4px;
  flex-shrink: 0;
}

/* SSR placeholder */
.tiptap-ssr-placeholder {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #B8B0A8;
}
</style>

<style>
/* Global: Tiptap editor inner styles (not scoped because EditorContent is external) */
.tiptap-editor-inner {
  min-height: 200px;
  padding: 14px 16px;
  font-size: 14px;
  line-height: 1.75;
  color: #171717;
  outline: none;
  font-family: 'Noto Sans KR', sans-serif;
}

.tiptap-editor-inner p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #B8B0A8;
  pointer-events: none;
  height: 0;
  font-size: 14px;
}

.tiptap-editor-inner h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 1.2em 0 0.4em;
  color: #171717;
  line-height: 1.3;
}
.tiptap-editor-inner h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 1em 0 0.3em;
  color: #171717;
  line-height: 1.3;
}
.tiptap-editor-inner p {
  margin: 0 0 0.8em;
}
.tiptap-editor-inner p:last-child {
  margin-bottom: 0;
}
.tiptap-editor-inner strong {
  font-weight: 700;
}
.tiptap-editor-inner em {
  font-style: italic;
}
.tiptap-editor-inner u {
  text-decoration: underline;
}
.tiptap-editor-inner ul {
  padding-left: 1.5em;
  margin: 0.6em 0;
  list-style-type: disc;
}
.tiptap-editor-inner ol {
  padding-left: 1.5em;
  margin: 0.6em 0;
  list-style-type: decimal;
}
.tiptap-editor-inner li {
  margin: 0.2em 0;
}
.tiptap-editor-inner blockquote {
  border-left: 3px solid #E87A5D;
  margin: 1em 0;
  padding: 0.5em 1em;
  color: #5A5350;
  font-style: italic;
  background-color: rgba(232, 122, 93, 0.05);
  border-radius: 0 8px 8px 0;
}
.tiptap-editor-inner hr {
  border: none;
  border-top: 1px solid #E8E3DD;
  margin: 1.2em 0;
}
</style>
