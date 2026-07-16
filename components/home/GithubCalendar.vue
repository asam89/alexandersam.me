<template>
  <div class="bg-gray-800 border-t border-b border-dashed border-gray-700">
    <div data-aos="fade-up" class="max-w-7xl mx-auto border-l border-r border-dashed border-gray-700 py-6 px-4">
      <div class="text-center mb-4">
        <p class="text-xs leading-6 text-indigo-600 font-semibold tracking-wide lowercase">{{ $t('githubCalendar.subtext') }}</p>
        <a :href="`https://github.com/${$config.social.github}`" target="_blank" rel="noreferrer" class="mt-2 text-3xl hover:text-hot-pink leading-8 font-extrabold tracking-tight text-gray-500">{{ $t('githubCalendar.header') }}</a>
      </div>

      <div v-if="loading" class="text-center text-gray-500 py-8">Loading contributions...</div>

      <div v-else class="overflow-x-auto">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">{{ totalContributions }} contributions in the last 3 months</span>
          <a :href="`https://github.com/${$config.social.github}`" target="_blank" rel="noreferrer" class="text-xs text-gray-500 hover:text-indigo-500">@{{ $config.social.github }}</a>
        </div>

        <div class="flex gap-0.5">
          <div v-for="(week, wIndex) in weeks" :key="wIndex" class="flex flex-col gap-0.5">
            <div v-for="(day, dIndex) in week" :key="dIndex"
                 class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm cursor-pointer"
                 :class="getLevelClass(day.level)"
                 :title="day.date ? `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}` : ''">
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end mt-2 space-x-1">
          <span class="text-xs text-gray-500 mr-1">Less</span>
          <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-gray-900"></div>
          <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-green-900"></div>
          <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-green-700"></div>
          <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-green-500"></div>
          <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-green-400"></div>
          <span class="text-xs text-gray-500 ml-1">More</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weeks: [],
      totalContributions: 0,
      loading: true
    }
  },
  async mounted() {
    try {
      const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${this.$config.social.github}?y=last`)
      const data = await res.json()
      const recent = this.lastThreeMonths(data.contributions)
      this.processContributions(recent)
      this.totalContributions = recent.reduce((sum, d) => sum + d.count, 0)
    } catch (e) {
      console.error('Failed to load GitHub calendar:', e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    lastThreeMonths(contributions) {
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - 3)
      cutoff.setHours(0, 0, 0, 0)
      return contributions.filter(d => new Date(d.date) >= cutoff)
    },
    processContributions(contributions) {
      const weeks = []
      let currentWeek = []

      // Fill in leading empty days for the first week
      if (contributions.length > 0) {
        const firstDay = new Date(contributions[0].date).getDay()
        for (let i = 0; i < firstDay; i++) {
          currentWeek.push({ count: 0, level: -1, date: null })
        }
      }

      contributions.forEach(day => {
        currentWeek.push(day)
        if (currentWeek.length === 7) {
          weeks.push(currentWeek)
          currentWeek = []
        }
      })

      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push({ count: 0, level: -1, date: null })
        }
        weeks.push(currentWeek)
      }

      this.weeks = weeks
    },
    getLevelClass(level) {
      switch (level) {
        case -1: return 'bg-transparent'
        case 0: return 'bg-gray-900'
        case 1: return 'bg-green-900'
        case 2: return 'bg-green-700'
        case 3: return 'bg-green-500'
        case 4: return 'bg-green-400'
        default: return 'bg-gray-900'
      }
    }
  }
}
</script>
