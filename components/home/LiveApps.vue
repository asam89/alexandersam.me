<template>
  <div class="bg-gray-900 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <p class="text-indigo-400 text-sm font-medium uppercase tracking-wide">what I'm building</p>
        <h2 class="text-3xl font-bold text-white mt-1">Live Apps & Hobbies</h2>
        <p class="text-gray-400 text-sm mt-2">Side projects that are live in production right now.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a v-for="(app, index) in apps" :key="index"
           :href="app.url" target="_blank" rel="noreferrer"
           class="group block border border-gray-700 rounded-lg p-6 hover:border-indigo-500 transition-colors">
          <div class="flex items-center space-x-3 mb-3">
            <span class="text-2xl">{{ app.icon }}</span>
            <h3 class="text-white font-semibold text-lg group-hover:text-indigo-400 transition-colors">{{ app.name }}</h3>
            <span v-if="app.live" class="ml-auto flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <p class="text-gray-400 text-sm mb-3">{{ app.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="(tag, tIndex) in app.tags" :key="tIndex"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
              {{ tag }}
            </span>
          </div>
          <p class="text-indigo-400 text-xs mt-3 font-mono">{{ app.domain }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apps: [
        {
          name: 'FaezSports Leagues',
          icon: '⚽',
          url: 'https://leagues.faezsports.com',
          domain: 'leagues.faezsports.com',
          description: 'AI-powered sports league hosting — manage tournaments, track stats, run registrations with Claude AI setup.',
          tags: ['Next.js', 'Prisma', 'Claude API', 'Stripe'],
          live: true
        },
        {
          name: 'Fit-ness.ca',
          icon: '💪',
          url: 'https://fit-ness.ca',
          domain: 'fit-ness.ca',
          description: 'Personal fitness tracking app for workout planning, progress metrics, and building consistent habits.',
          tags: ['Web App', 'Fitness', 'Tracking'],
          live: true
        },
        {
          name: 'Mark-It',
          icon: '📣',
          url: 'https://github.com/asam89/mark-it',
          domain: 'public IP',
          description: 'Autonomous marketing tool for SMBs — AI-generated content, campaign management, and analytics.',
          tags: ['Python', 'AI Agents', 'Marketing'],
          live: true
        },
        {
          name: 'MyCareer Builder',
          icon: '🎯',
          url: 'https://github.com/asam89/career-dev-bot',
          domain: 'github.com/asam89/career-dev-bot',
          description: 'AI career automation — job scanning, tailored resumes, cover letters, and application pipeline tracking.',
          tags: ['FastAPI', 'Claude API', 'Playwright'],
          live: false
        },
        {
          name: 'Finance Bot',
          icon: '📈',
          url: 'https://github.com/asam89/contrarian-finance-bot',
          domain: 'github.com/asam89/contrarian-finance-bot',
          description: 'Contrarian investment signals and market analysis delivered via Telegram bot.',
          tags: ['Python', 'Telegram', 'Finance'],
          live: false
        },
        {
          name: 'Ignyte Consulting',
          icon: '🔥',
          url: 'https://www.ignyteconsulting.com',
          domain: 'ignyteconsulting.com',
          description: 'My MSP — cloud infrastructure, DevOps automation, and IT consulting for SMBs.',
          tags: ['Azure', 'AWS', 'Consulting'],
          live: true
        },
      ]
    }
  }
}
</script>
