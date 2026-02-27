<template>
  <nav class="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center px-4 gap-3
              bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
    <!-- Sidebar toggle -->
    <button
      @click="store.toggleSidebar()"
      class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title="Toggle sidebar"
    >
      <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <!-- Logo / Blog title -->
    <RouterLink to="/" class="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline text-[15px]">
      {{ blogTitle }}
    </RouterLink>

    <div class="flex-1" />

    <!-- Search bar -->
    <div class="relative hidden sm:block">
      <input
        v-model="store.searchQuery"
        type="text"
        placeholder="Search posts..."
        class="w-48 h-8 pl-8 pr-3 text-sm rounded-md border border-gray-200 dark:border-gray-700
               bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300
               focus:outline-none focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500
               placeholder-gray-400 dark:placeholder-gray-600 transition-all
               focus:w-64"
      />
      <svg class="absolute left-2 top-1.5 w-4 h-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    </div>

    <!-- Dark mode toggle -->
    <button
      @click="store.toggleDarkMode()"
      class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      :title="store.darkMode ? 'Light mode' : 'Dark mode'"
    >
      <svg v-if="store.darkMode" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
      <svg v-else class="w-5 h-5 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
    </button>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useBlogStore } from '../stores/useBlogStore.js'

const store = useBlogStore()
const blogTitle = 'The Draft'
</script>
