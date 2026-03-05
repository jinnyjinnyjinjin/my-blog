import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref([])
  const darkMode = ref(localStorage.getItem('darkMode') === 'true')
  const searchQuery = ref('')
  const activeTag = ref('')
  const activeCategory = ref('')
  const sidebarOpen = ref(true)

  // Apply dark mode on init
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', darkMode.value)
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  async function fetchPosts() {
    try {
      const base = import.meta.env.BASE_URL
      const res = await fetch(`${base}posts/posts.json`)
      const data = await res.json()
      const isDev = import.meta.env.DEV
      const filtered = isDev ? data : data.filter(p => !p.draft)
      posts.value = filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (e) {
      console.error('Failed to fetch posts:', e)
      posts.value = []
    }
  }

  async function fetchPost(slugOrPath) {
    try {
      const base = import.meta.env.BASE_URL
      // Support both path (category/year/month/slug) and legacy slug
      const res = await fetch(`${base}posts/${slugOrPath}.md`)
      if (!res.ok) throw new Error('Not found')
      return await res.text()
    } catch (e) {
      return null
    }
  }

  // Find post by slug and return its full path
  function getPostPath(slug) {
    const post = posts.value.find(p => p.slug === slug)
    return post?.path || slug
  }

  const filteredPosts = computed(() => {
    let result = posts.value
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeTag.value) {
      result = result.filter(p => (p.tags || []).includes(activeTag.value))
    }
    if (activeCategory.value) {
      result = result.filter(p => p.category === activeCategory.value)
    }
    return result
  })

  const allTags = computed(() => {
    const tagMap = {}
    posts.value.forEach(p => {
      (p.tags || []).forEach(t => {
        tagMap[t] = (tagMap[t] || 0) + 1
      })
    })
    return Object.entries(tagMap).map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  })

  const allCategories = computed(() => {
    const catMap = {}
    posts.value.forEach(p => {
      if (p.category) {
        catMap[p.category] = (catMap[p.category] || 0) + 1
      }
    })
    return Object.entries(catMap).map(([category, count]) => ({ category, count }))
  })

  return {
    posts,
    darkMode,
    searchQuery,
    activeTag,
    activeCategory,
    sidebarOpen,
    filteredPosts,
    allTags,
    allCategories,
    toggleDarkMode,
    toggleSidebar,
    fetchPosts,
    fetchPost,
    getPostPath,
  }
})
