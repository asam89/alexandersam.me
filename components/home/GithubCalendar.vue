<template>
  <div class="bg-gray-800 border-t border-b border-dashed border-gray-700">
    <div data-aos="fade-up" class="max-w-7xl mx-auto border-l border-r border-dashed border-gray-700 py-8 px-4">
      <div class="text-center mb-6">
        <p class="text-xs leading-6 text-indigo-600 font-semibold tracking-wide lowercase">{{ $t('githubCalendar.subtext') }}</p>
        <a :href="profileUrl" target="_blank" rel="noreferrer" class="mt-2 text-3xl hover:text-hot-pink leading-8 font-extrabold tracking-tight text-gray-500">{{ $t('githubCalendar.header') }}</a>
      </div>

      <div v-if="loading" class="text-center text-gray-500 py-8 text-sm">Loading contributions…</div>
      <div v-else-if="error" class="text-center text-gray-500 py-8 text-sm">
        Couldn't load contributions right now. <a :href="profileUrl" target="_blank" rel="noreferrer" class="text-indigo-500 hover:text-indigo-400">See them on GitHub ↗</a>
      </div>

      <template v-else>
        <!-- Range toggle + date span -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="inline-flex rounded-lg bg-gray-900 p-0.5 text-xs" role="tablist" aria-label="Time range">
            <button v-for="r in ranges" :key="r.months" type="button" role="tab" :aria-selected="range === r.months"
                    class="px-3 py-1.5 rounded-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    :class="range === r.months ? 'bg-gray-700 text-gray-100' : 'text-gray-400 hover:text-gray-200'"
                    @click="range = r.months">{{ r.label }}</button>
          </div>
          <span class="text-xs text-gray-400">{{ fmtLong(days[0].date) }} – {{ fmtLong(days[days.length - 1].date) }}</span>
        </div>

        <!-- Stat tiles -->
        <dl class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <div v-for="s in stats" :key="s.label" class="rounded-lg bg-gray-900 px-4 py-3">
            <dt class="text-xs text-gray-400">{{ s.label }}</dt>
            <dd class="mt-1 text-2xl font-bold text-gray-100 tabular-nums">{{ s.value }}</dd>
            <dd class="text-xs text-gray-500 truncate">{{ s.sub }}</dd>
          </div>
        </dl>

        <!-- Heatmap -->
        <div class="relative" @mouseleave="hover = null">
          <div ref="scroller" class="overflow-x-auto pb-1 flex">
            <div class="inline-grid mx-auto" :style="gridStyle" role="grid" :aria-label="`GitHub contributions, ${rangeLabel}`">
              <!-- month labels -->
              <div></div>
              <div v-for="(w, i) in weeks" :key="`m${i}`" class="text-xs text-gray-400 whitespace-nowrap h-5 leading-5 overflow-visible">{{ w.monthLabel }}</div>
              <!-- rows: weekday label + cells -->
              <template v-for="d in 7">
                <div :key="`l${d}`" class="text-xs text-gray-500 pr-2 text-right leading-none flex items-center justify-end" :style="{ height: cellPx + 'px' }">{{ weekdayLabel(d - 1) }}</div>
                <div v-for="(w, i) in weeks" :key="`c${d}-${i}`" :style="{ width: cellPx + 'px', height: cellPx + 'px' }">
                  <button v-if="w.days[d - 1]" type="button"
                          class="block w-full h-full rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                          :class="{ 'ring-1 ring-gray-300': w.days[d - 1].isToday }"
                          :style="{ backgroundColor: color(w.days[d - 1].count) }"
                          :aria-label="tip(w.days[d - 1])"
                          @mouseenter="show($event, w.days[d - 1])" @focus="show($event, w.days[d - 1])" @blur="hover = null"></button>
                </div>
              </template>
            </div>
          </div>

          <div v-if="hover" class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full transform rounded-md bg-gray-100 px-2.5 py-1.5 text-xs text-gray-900 shadow-lg whitespace-nowrap"
               :style="{ left: hover.x + 'px', top: hover.y - 6 + 'px' }">
            <strong class="tabular-nums">{{ hover.day.count }} contribution{{ hover.day.count === 1 ? '' : 's' }}</strong>
            <span class="text-gray-600"> · {{ fmtLong(hover.day.date, true) }}</span>
          </div>
        </div>

        <!-- Legend + profile -->
        <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <a :href="profileUrl" target="_blank" rel="noreferrer" class="hover:text-indigo-400">@{{ $config.social.github }} on GitHub ↗</a>
          <div class="flex items-center gap-1">
            <span class="mr-1">Less</span>
            <span v-for="(c, i) in legend" :key="i" class="inline-block w-3 h-3 rounded-sm" :style="{ backgroundColor: c.color }" :title="c.label"></span>
            <span class="ml-1">More</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// One-hue sequential ramp: brighter = more. Level 0 is a neutral cell a step
// above the section background so empty days still read as days.
const RAMP = ['#2b2e30', '#0e4429', '#006d32', '#26a641', '#39d353']

function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d) // local midnight, avoids the UTC off-by-one
}
const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default {
  data() {
    return {
      all: [],
      loading: true,
      error: false,
      range: 3,
      ranges: [{ months: 3, label: '3 months' }, { months: 6, label: '6 months' }, { months: 12, label: '12 months' }],
      hover: null,
      width: 0,
    }
  },
  computed: {
    profileUrl() {
      return `https://github.com/${this.$config.social.github}`
    },
    rangeLabel() {
      return this.ranges.find(r => r.months === this.range).label
    },
    gap() {
      return this.range === 12 ? 3 : 4
    },
    // Fill the available width; never smaller than 10px (scrolls instead) or larger than 30px.
    cellPx() {
      const n = this.weeks.length || 1
      const fit = Math.floor((this.width - 40 - this.gap * n) / n)
      return Math.max(10, Math.min(30, fit || 12))
    },
    gridStyle() {
      const gap = this.gap
      return {
        gridTemplateColumns: `auto repeat(${this.weeks.length}, ${this.cellPx}px)`,
        columnGap: `${gap}px`,
        rowGap: `${gap}px`,
      }
    },
    days() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const start = new Date(today)
      start.setMonth(start.getMonth() - this.range)
      const todayKey = key(today)
      return this.all
        .map(d => ({ ...d, date: parseDate(d.date) }))
        .filter(d => d.date >= start && d.date <= today)
        .map(d => ({ ...d, isToday: key(d.date) === todayKey }))
    },
    weeks() {
      if (!this.days.length) return []
      const weeks = []
      let week = null
      let lastMonth = -1
      for (const day of this.days) {
        if (!week || day.date.getDay() === 0) {
          week = { days: new Array(7).fill(null), monthLabel: '' }
          weeks.push(week)
        }
        week.days[day.date.getDay()] = day
        // Label the first column that contains a new month (skip a cramped first partial label).
        if (day.date.getMonth() !== lastMonth) {
          const isFirstCol = weeks.length === 1
          if (!(isFirstCol && day.date.getDate() > 20)) week.monthLabel = day.date.toLocaleDateString('en-US', { month: 'short' })
          lastMonth = day.date.getMonth()
        }
      }
      return weeks
    },
    max() {
      return Math.max(0, ...this.days.map(d => d.count))
    },
    stats() {
      const days = this.days
      const total = days.reduce((s, d) => s + d.count, 0)
      const active = days.filter(d => d.count > 0).length
      const best = days.reduce((b, d) => (d.count > (b ? b.count : 0) ? d : b), null)

      let longest = 0
      let run = 0
      for (const d of days) {
        run = d.count > 0 ? run + 1 : 0
        longest = Math.max(longest, run)
      }
      // Current streak: count back from today; an empty today doesn't break it yet.
      let current = 0
      for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].count > 0) current++
        else if (!(i === days.length - 1 && days[i].isToday)) break
      }

      return [
        { label: 'Contributions', value: total.toLocaleString(), sub: `in the last ${this.rangeLabel}` },
        { label: 'Active days', value: active, sub: `${days.length ? Math.round((active / days.length) * 100) : 0}% of days` },
        { label: 'Streak', value: `${current}d`, sub: `longest ${longest}d` },
        { label: 'Busiest day', value: best ? best.count : 0, sub: best ? this.fmtLong(best.date, true) : '—' },
      ]
    },
    legend() {
      return RAMP.map((color, i) => ({ color, label: i === 0 ? 'No contributions' : `Level ${i}` }))
    },
  },
  async mounted() {
    this.measure()
    window.addEventListener('resize', this.measure)
    try {
      const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${this.$config.social.github}?y=last`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      this.all = data.contributions || []
      if (!this.all.length) this.error = true
    } catch (e) {
      console.error('Failed to load GitHub calendar:', e)
      this.error = true
    } finally {
      this.loading = false
      this.$nextTick(this.measure)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.measure)
  },
  methods: {
    measure() {
      this.width = this.$refs.scroller ? this.$refs.scroller.clientWidth : this.$el.clientWidth - 32
    },
    // Quartile-style buckets relative to this range's busiest day, like GitHub.
    color(count) {
      if (!count || !this.max) return RAMP[0]
      const r = count / this.max
      return RAMP[r > 0.75 ? 4 : r > 0.5 ? 3 : r > 0.25 ? 2 : 1]
    },
    weekdayLabel(i) {
      return { 1: 'Mon', 3: 'Wed', 5: 'Fri' }[i] || ''
    },
    fmtLong(date, withWeekday = false) {
      return date.toLocaleDateString('en-US', withWeekday
        ? { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric' })
    },
    tip(day) {
      return `${day.count} contribution${day.count === 1 ? '' : 's'} on ${this.fmtLong(day.date, true)}`
    },
    show(evt, day) {
      const cell = evt.target.getBoundingClientRect()
      const box = this.$el.querySelector('.relative').getBoundingClientRect()
      const x = Math.min(Math.max(cell.left - box.left + cell.width / 2, 110), box.width - 110)
      this.hover = { day, x, y: cell.top - box.top }
    },
  },
}
</script>
