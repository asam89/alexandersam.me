<template>
  <div class="bg-gray-900 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 text-center">
        <p class="text-indigo-400 text-sm font-medium uppercase tracking-wide">let's connect</p>
        <h2 class="text-3xl font-bold text-white mt-1">Social</h2>
        <p class="text-gray-400 text-sm mt-2">Follow along for project updates, tech insights, and building in public.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- LinkedIn Profile Card -->
        <div class="border border-gray-700 rounded-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 h-20"></div>
          <div class="p-6 -mt-10">
            <div class="flex items-end space-x-4 mb-4">
              <div class="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center flex-shrink-0">
                <span class="text-2xl font-bold text-blue-400">AS</span>
              </div>
              <div class="pb-1">
                <h3 class="text-white font-bold text-lg">Alexander Sam</h3>
                <p class="text-gray-400 text-sm">Technical Project Manager</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm mb-4">Builder & dreamer. PMP-certified TPM building cloud solutions, AI automation, and community impact. Founder of Ignyte Consulting & FaezSports.</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Cloud Architecture</span>
              <span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">AI/ML</span>
              <span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Project Management</span>
              <span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">DevOps</span>
            </div>
            <a href="https://linkedin.com/in/alexandersam" target="_blank" rel="noreferrer"
               class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </div>

        <!-- X / Twitter Card -->
        <div class="border border-gray-700 rounded-lg overflow-hidden">
          <div class="bg-gradient-to-r from-gray-900 to-gray-800 h-20 flex items-center justify-center">
            <svg class="h-8 w-8 text-white opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <div class="p-6 -mt-10">
            <div class="flex items-end space-x-4 mb-4">
              <div class="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center flex-shrink-0">
                <span class="text-2xl font-bold text-white">AS</span>
              </div>
              <div class="pb-1">
                <h3 class="text-white font-bold text-lg">Alexander Sam</h3>
                <p class="text-gray-400 text-sm" v-if="$config.social.twitter">@{{ $config.social.twitter }}</p>
                <p class="text-gray-500 text-sm italic" v-else>Coming soon</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm mb-4">Thoughts on AI, automation, cloud infrastructure, and building products in public. Real-time updates on what I'm shipping.</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">#BuildInPublic</span>
              <span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">#AI</span>
              <span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">#CloudOps</span>
              <span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">#TPM</span>
            </div>
            <a :href="twitterUrl" target="_blank" rel="noreferrer"
               class="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Follow on X</span>
            </a>
          </div>
        </div>
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
