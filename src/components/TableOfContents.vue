<template>
  <nav v-if="headings.length > 0" class="toc">
    <p class="toc-title">목차</p>
    <ul>
      <li
        v-for="heading in headings"
        :key="heading.id"
        :class="[
          'toc-item',
          `toc-level-${heading.level}`,
          activeId === heading.id ? 'toc-active' : ''
        ]"
      >
        <a :href="`#${heading.id}`" @click.prevent="scrollTo(heading.id)">
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  headings: {
    type: Array,
    default: () => []
  }
})

const activeId = ref('')

let observer = null

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function setupObserver() {
  if (observer) observer.disconnect()

  const ids = props.headings.map(h => h.id)
  const elements = ids.map(id => document.getElementById(id)).filter(Boolean)

  if (elements.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
          break
        }
      }
    },
    { rootMargin: '-20px 0px -70% 0px', threshold: 0 }
  )

  elements.forEach(el => observer.observe(el))
}

onMounted(() => setupObserver())
onUnmounted(() => observer?.disconnect())
watch(() => props.headings, () => {
  setTimeout(setupObserver, 100)
}, { deep: true })
</script>

<style scoped>
.toc {
  position: sticky;
  top: 72px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 0 0 1rem 1rem;
  border-left: 1px solid #e5e7eb;
  font-size: 13px;
  min-width: 180px;
  max-width: 220px;
}

.dark .toc {
  border-color: #374151;
}

.toc-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin-bottom: 0.6rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item a {
  display: block;
  padding: 3px 0;
  color: #6b7280;
  text-decoration: none;
  line-height: 1.4;
  transition: color 0.15s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-item a:hover {
  color: #3b82f6;
}

.toc-active a {
  color: #3b82f6;
  font-weight: 500;
}

.toc-level-1 a { font-weight: 500; color: #4b5563; }
.toc-level-2 a { padding-left: 0.75rem; }
.toc-level-3 a { padding-left: 1.5rem; font-size: 12px; }

.dark .toc-item a { color: #6b7280; }
.dark .toc-item a:hover { color: #60a5fa; }
.dark .toc-active a { color: #60a5fa; }
.dark .toc-level-1 a { color: #9ca3af; }
</style>
