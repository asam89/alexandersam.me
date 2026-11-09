<template>
  <div class="relative max-w-7xl border-r border-l border-dashed border-gray-700 py-6 mx-auto">
    <div data-aos="fade-up" class="text-center">
      <h2 class="text-2xl tracking-tight font-extrabold text-gray-200">
        {{ $t('blog.header') }}
      </h2>
      <p class="mt-2 px-2 max-w-2xl mx-auto text-sm leading-7 text-gray-400">
        {{ $t('blog.subtext') }}
      </p>
      <div class="mt-4 flex flex-wrap items-center justify-center gap-2 px-4 text-xs">
        <a v-for="blog in $config.crossPost.externalBlogs" :key="blog.id" :href="blog.url" target="_blank" rel="noopener"
           class="inline-flex items-center gap-1 rounded-full border border-gray-700 px-3 py-1 text-gray-300 hover:border-indigo-500 hover:text-white">
          Also writing at {{ blog.name }} <span aria-hidden="true">↗</span>
        </a>
        <a :href="$config.crossPost.linkedinProfile" target="_blank" rel="noopener"
           class="inline-flex items-center gap-1 rounded-full border border-gray-700 px-3 py-1 text-gray-300 hover:border-indigo-500 hover:text-white">
          Follow on LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <a v-if="$config.crossPost.linkedinCompany" :href="$config.crossPost.linkedinCompany" target="_blank" rel="noopener"
           class="inline-flex items-center gap-1 rounded-full border border-gray-700 px-3 py-1 text-gray-300 hover:border-indigo-500 hover:text-white">
          Ignyte on LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <a href="/feed.xml" class="inline-flex items-center gap-1 rounded-full border border-gray-700 px-3 py-1 text-gray-300 hover:border-indigo-500 hover:text-white">RSS</a>
      </div>
    </div>

    <div data-aos="zoom-in" class="select-none px-4 items-center justify-center sm:justify-start overflow-hidden flex pt-4">
      <nav class="flex flex-wrap items-center justify-center flex-row space-x-2 sm:space-x-4" aria-label="Tabs">
        <button @click="currentCategory = category" :class="{ 'bg-gray-900 text-gray-300': category === currentCategory }" v-for="category in categories" :key="category" class="flex text-gray-300 focus:outline-none focus:ring-transparent focus:ring-offset-transparent hover:text-hot-pink px-3 py-2 font-medium text-sm rounded-xl">
          {{ category }}
        </button>
      </nav>
    </div>

    <div data-aos="zoom-in" class="mt-5 gap-4 mx-4 grid max-w-none lg:grid-cols-3">
      <template v-for="post in postsByCategories">
        <ExternalPostCard v-if="post.external" :key="post.url" :post="post" />
        <BlogCard v-else :key="post.slug" :post="post" />
      </template>
    </div>

  </div>
</template>

<script>
const ALL = 'all'

export default {
  computed: {
    categories() {
      return [ALL, ...new Set(this.posts.map(post => post.category))]
    },
    postsByCategories() {
      if (this.currentCategory === ALL)
        return this.posts
      return this.posts.filter(post => post.category === this.currentCategory)
    }
  },
  data() {
    return {
      currentCategory: ALL,
      ALL: ALL, // exporting it to template
    }
  },
  head() {
    return {
      title: `blog -- ${this.$config.name}`
    }
  },
  async asyncData({ $content }) {
    const fetchDocsLabel = 'fetchAllPosts'
    console.time(fetchDocsLabel)
    const posts = await $content('posts')
      .where({ published: true })
      .without(['body', 'toc', 'dir', 'extension', 'path', 'tags'])
      .sortBy('createdAt', 'desc')
      .fetch()
    // Posts from other blogs (scripts/sync-external-posts.mjs); the folder may be empty.
    const external = await $content('external').fetch().catch(() => [])
    const all = [
      ...posts,
      ...(Array.isArray(external) ? external : [external]).map(p => ({ ...p, category: p.source, createdAt: p.date })),
    ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    console.timeEnd(fetchDocsLabel)
    return { posts: all }
  }
}
</script>

<style scoped>
</style>
