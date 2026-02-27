<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full"></div>
    </div>

    <!-- 404 state -->
    <div v-else-if="!postContent" class="max-w-3xl mx-auto px-6 py-16 text-center">
      <div class="text-4xl mb-3">😕</div>
      <p class="text-gray-500 dark:text-gray-400 mb-4">Post not found</p>
      <RouterLink to="/" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">← Back to home</RouterLink>
    </div>

    <!-- Post content -->
    <div v-else class="max-w-3xl mx-auto px-6 py-8">
      <!-- Back button -->
      <RouterLink to="/" class="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-8 no-underline">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back
      </RouterLink>

      <!-- Post header -->
      <header class="mb-8">
        <span v-if="meta.category" class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ meta.category }}</span>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1 mb-3 leading-tight">{{ meta.title }}</h1>
        <div class="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-600 flex-wrap">
          <time>{{ formatDate(meta.date) }}</time>
          <span v-if="readingTime">· {{ readingTime }} min read</span>
          <span v-if="meta.author">· {{ meta.author }}</span>
        </div>
        <div v-if="meta.tags && meta.tags.length" class="flex flex-wrap gap-1.5 mt-3">
          <span
            v-for="tag in meta.tags"
            :key="tag"
            class="px-2 py-0.5 text-xs rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          >#{{ tag }}</span>
        </div>
      </header>

      <hr class="border-gray-100 dark:border-gray-800 mb-8" />

      <!-- Rendered markdown -->
      <div
        class="markdown-body text-gray-800 dark:text-gray-200"
        v-html="renderedContent"
      />

      <hr class="border-gray-100 dark:border-gray-800 mt-12 mb-6" />

      <!-- Footer nav -->
      <div class="text-sm">
        <RouterLink to="/" class="text-gray-400 dark:text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">
          ← All Posts
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/useBlogStore.js'
import { parseMarkdown, parseFrontmatter } from '../utils/markdown.js'
import 'highlight.js/styles/github-dark.css'

const route = useRoute()
const store = useBlogStore()

const loading = ref(true)
const postContent = ref(null)
const meta = ref({})
const renderedContent = ref('')
const readingTime = ref(0)

function getPostPath() {
  const { category, year, month, slug } = route.params
  if (category && year && month && slug) {
    return `${category}/${year}/${month}/${slug}`
  }
  // Fallback: find path from posts list
  return store.getPostPath(route.params.slug)
}

async function loadPost() {
  loading.value = true
  const path = getPostPath()
  const raw = await store.fetchPost(path)
  if (raw) {
    const { meta: parsedMeta, content } = parseFrontmatter(raw)
    meta.value = parsedMeta
    renderedContent.value = parseMarkdown(content)
    postContent.value = content
    const words = content.split(/\s+/).length
    readingTime.value = Math.ceil(words / 200)
  } else {
    postContent.value = null
  }
  loading.value = false
}

onMounted(() => loadPost())
watch(() => route.params, () => loadPost(), { deep: true })

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
