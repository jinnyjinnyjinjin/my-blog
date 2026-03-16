<template>
  <div ref="container" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useBlogStore } from '../stores/useBlogStore.js'

const store = useBlogStore()
const container = ref(null)

function getTheme() {
  return store.darkMode ? 'dark' : 'light'
}

function loadGiscus() {
  if (!container.value) return

  // Remove existing giscus iframe if present
  container.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'jinnyjinnyjinjin/my-blog')
  script.setAttribute('data-repo-id', 'R_kgDORaKVqQ')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDORaKVqc4C4fF3')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '1')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', getTheme())
  script.setAttribute('data-lang', 'ko')
  script.setAttribute('data-loading', 'lazy')
  script.crossOrigin = 'anonymous'
  script.async = true

  container.value.appendChild(script)
}

function updateTheme() {
  const iframe = document.querySelector('iframe.giscus-frame')
  if (iframe) {
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: getTheme() } } },
      'https://giscus.app'
    )
  }
}

onMounted(() => loadGiscus())

watch(() => store.darkMode, () => updateTheme())
</script>
