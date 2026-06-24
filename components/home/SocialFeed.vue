<template>
  <div class="bg-gray-900 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <p class="text-indigo-400 text-sm font-medium uppercase tracking-wide">connect with me</p>
        <h2 class="text-3xl font-bold text-white mt-1">Social</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- LinkedIn -->
        <a href="https://linkedin.com/in/alexandersam" target="_blank" rel="noreferrer"
           class="group block border border-gray-700 rounded-lg p-6 hover:border-indigo-500 transition-colors">
          <div class="flex items-center space-x-3 mb-3">
            <svg class="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span class="text-white font-semibold text-lg">LinkedIn</span>
            <svg class="h-4 w-4 text-gray-500 group-hover:text-indigo-400 transition-colors ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <p class="text-gray-400 text-sm">Follow for project management insights, cloud architecture posts, and career updates.</p>
          <p class="text-indigo-400 text-sm mt-2 font-medium">@alexandersam</p>
        </a>

        <!-- X / Twitter -->
        <a :href="twitterUrl" target="_blank" rel="noreferrer"
           class="group block border border-gray-700 rounded-lg p-6 hover:border-indigo-500 transition-colors">
          <div class="flex items-center space-x-3 mb-3">
            <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span class="text-white font-semibold text-lg">X (Twitter)</span>
            <svg class="h-4 w-4 text-gray-500 group-hover:text-indigo-400 transition-colors ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <p class="text-gray-400 text-sm">Thoughts on AI, automation, and building in public. Follow for real-time updates.</p>
          <p class="text-indigo-400 text-sm mt-2 font-medium" v-if="$config.social.twitter">@{{ $config.social.twitter }}</p>
          <p class="text-gray-500 text-sm mt-2 italic" v-else>Handle coming soon</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    twitterUrl() {
      return this.$config.social.twitter
        ? `https://x.com/${this.$config.social.twitter}`
        : 'https://x.com'
    }
  }
}
</script>
