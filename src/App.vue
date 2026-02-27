<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <Navbar />
    <div class="flex flex-1 overflow-hidden" style="padding-top: 52px">
      <Sidebar />
      <main
        class="flex-1 overflow-y-auto transition-all duration-200"
        :class="store.sidebarOpen ? 'ml-60' : 'ml-0'"
      >
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import { useBlogStore } from './stores/useBlogStore.js'

const store = useBlogStore()

onMounted(() => {
  store.fetchPosts()
})
</script>
