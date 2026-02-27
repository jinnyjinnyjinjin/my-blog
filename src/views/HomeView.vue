<template>
  <div class="max-w-3xl mx-auto px-6 py-8">
    <!-- Filter indicators -->
    <div v-if="store.searchQuery || store.activeTag || store.activeCategory" class="flex items-center gap-2 mb-6">
      <span class="text-sm text-gray-500 dark:text-gray-400">Filtering:</span>
      <span v-if="store.searchQuery" class="filter-chip">
        "{{ store.searchQuery }}"
        <button @click="store.searchQuery = ''" class="ml-1 hover:text-red-500">×</button>
      </span>
      <span v-if="store.activeTag" class="filter-chip">
        #{{ store.activeTag }}
        <button @click="store.activeTag = ''" class="ml-1 hover:text-red-500">×</button>
      </span>
      <span v-if="store.activeCategory" class="filter-chip">
        📁 {{ store.activeCategory }}
        <button @click="store.activeCategory = ''" class="ml-1 hover:text-red-500">×</button>
      </span>
    </div>

    <!-- Post count -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ store.searchQuery || store.activeTag || store.activeCategory ? 'Search Results' : 'All Posts' }}
      </h2>
      <span class="text-sm text-gray-400 dark:text-gray-600">{{ store.filteredPosts.length }} posts</span>
    </div>

    <!-- Empty state -->
    <div v-if="store.filteredPosts.length === 0" class="text-center py-16">
      <div class="text-4xl mb-3">📝</div>
      <p class="text-gray-500 dark:text-gray-400 mb-4">No posts found</p>
      <RouterLink to="/write" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium
               bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 no-underline transition-opacity">
        Write your first post
      </RouterLink>
    </div>

    <!-- Post list -->
    <div v-else class="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
      <article
        v-for="post in store.filteredPosts"
        :key="post.slug"
        class="py-6 group cursor-pointer"
        @click="$router.push(`/post/${post.path || post.slug}`)"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <!-- Category badge -->
            <span v-if="post.category" class="inline-block text-xs text-blue-600 dark:text-blue-400 font-medium mb-1.5">
              {{ post.category }}
            </span>

            <!-- Title -->
            <h3 class="text-[17px] font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
              {{ post.title }}
            </h3>

            <!-- Excerpt -->
            <p v-if="post.excerpt" class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
              {{ post.excerpt }}
            </p>

            <!-- Meta: date + tags -->
            <div class="flex items-center gap-3 flex-wrap">
              <time class="text-xs text-gray-400 dark:text-gray-600">{{ formatDate(post.date) }}</time>
              <span v-if="post.readingTime" class="text-xs text-gray-400 dark:text-gray-600">· {{ post.readingTime }} min read</span>
              <div class="flex gap-1.5">
                <span
                  v-for="tag in (post.tags || []).slice(0, 3)"
                  :key="tag"
                  @click.stop="filterByTag(tag)"
                  class="px-1.5 py-0.5 text-[11px] rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400
                         hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useBlogStore } from '../stores/useBlogStore.js'

const store = useBlogStore()
const router = useRouter()

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function filterByTag(tag) {
  store.activeTag = tag
  store.activeCategory = ''
  router.push('/')
}
</script>

<style scoped>
.filter-chip {
  @apply inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800
         text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700;
}
</style>
