<template>
  <a :href="post.url" target="_blank" rel="noopener"
     class="flex transition duration-700 ease-in-out transform hover:translate-y-0.5 hover:scale-105 flex-col rounded-xl shadow-lg overflow-hidden">
    <div class="flex-1 bg-gray-900 p-5 flex flex-col justify-between border border-dashed border-gray-700 rounded-xl">
      <div class="flex-1">
        <p class="text-xs font-medium text-indigo-400">{{ post.source }} <span aria-hidden="true">↗</span></p>
        <h3 class="mt-0.5 text-md leading-7 font-semibold text-gray-200">{{ post.title }}</h3>
        <p v-if="post.description" class="mt-2 text-xs text-gray-400">{{ post.description }}</p>
      </div>
      <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
        <time v-if="post.date" :datetime="post.date">
          {{ new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
        </time>
        <span class="text-gray-500">Read on {{ post.source }}</span>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    post: { type: Object, required: true }
  }
}
</script>
