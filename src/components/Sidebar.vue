<template>
  <aside
    class="fixed top-[52px] left-0 bottom-0 w-60 z-40 flex flex-col
           bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
           transition-transform duration-200 overflow-y-auto"
    :class="store.sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Navigation -->
    <div class="p-3">
      <p class="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-2 mb-1">Menu</p>
      <RouterLink to="/" class="sidebar-item" active-class="" exact-active-class="" :class="{ active: route.path === '/' && !store.activeCategory && !store.activeTag }" @click="resetFilters">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        All Posts
        <span class="ml-auto text-xs text-gray-400">{{ store.posts.length }}</span>
      </RouterLink>
    </div>

    <hr class="border-gray-200 dark:border-gray-800 mx-3" />

    <!-- Categories -->
    <div v-if="store.allCategories.length > 0" class="p-3">
      <p class="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-2 mb-1">Categories</p>
      <div v-for="cat in store.allCategories" :key="cat.category">
        <!-- Parent category -->
        <button
          @click="selectCategory(cat.category)"
          class="sidebar-item w-full text-left"
          :class="{ active: isParentActive(cat.category) }"
        >
          <svg
            v-if="cat.subCategories.length > 0"
            class="w-3 h-3 transition-transform"
            :class="expandedCategories.has(cat.category) ? 'rotate-90' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
          {{ cat.category }}
          <span class="ml-auto text-xs text-gray-400">{{ cat.count }}</span>
        </button>
        <!-- Sub categories -->
        <div v-if="cat.subCategories.length > 0 && expandedCategories.has(cat.category)" class="ml-4">
          <button
            v-for="sub in cat.subCategories"
            :key="sub.sub"
            @click="selectSubCategory(cat.category, sub.sub)"
            class="sidebar-item w-full text-left"
            :class="{ active: store.activeCategory === `${cat.category}/${sub.sub}` }"
          >
            <span class="w-3 h-3 flex items-center justify-center text-gray-300 dark:text-gray-600">└</span>
            {{ sub.sub }}
            <span class="ml-auto text-xs text-gray-400">{{ sub.count }}</span>
          </button>
        </div>
      </div>
    </div>

    <hr v-if="store.allCategories.length > 0" class="border-gray-200 dark:border-gray-800 mx-3" />

    <!-- Tags -->
    <div v-if="store.allTags.length > 0" class="p-3">
      <p class="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-2 mb-2">Tags</p>
      <div class="flex flex-wrap gap-1.5 px-2">
        <button
          v-for="t in store.allTags"
          :key="t.tag"
          @click="selectTag(t.tag)"
          class="px-2 py-0.5 text-xs rounded-full border transition-colors"
          :class="store.activeTag === t.tag
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'"
        >
          #{{ t.tag }}
          <span class="text-[10px] opacity-70">{{ t.count }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '../stores/useBlogStore.js'

const store = useBlogStore()
const route = useRoute()
const router = useRouter()

const expandedCategories = ref(new Set())

watch(() => store.activeCategory, (val) => {
  if (val) {
    const parent = val.split('/')[0]
    expandedCategories.value.add(parent)
  }
}, { immediate: true })

// parent is active when activeCategory equals parent or starts with "parent/"
function isParentActive(parent) {
  return store.activeCategory === parent || store.activeCategory.startsWith(parent + '/')
}

function resetFilters() {
  store.activeTag = ''
  store.activeCategory = ''
}

function selectTag(tag) {
  if (store.activeTag === tag) {
    store.activeTag = ''
  } else {
    store.activeTag = tag
    store.activeCategory = ''
  }
  router.push('/')
}

function selectCategory(cat) {
  if (isParentActive(cat) && !store.activeCategory.includes('/')) {
    store.activeCategory = ''
    expandedCategories.value.delete(cat)
  } else {
    store.activeCategory = cat
    store.activeTag = ''
    expandedCategories.value.add(cat)
  }
  router.push('/')
}

function selectSubCategory(parent, sub) {
  const full = `${parent}/${sub}`
  if (store.activeCategory === full) {
    store.activeCategory = parent
  } else {
    store.activeCategory = full
    store.activeTag = ''
    expandedCategories.value.add(parent)
  }
  router.push('/')
}
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300
         hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer no-underline w-full;
}
.sidebar-item.active {
  @apply bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium;
}
</style>
