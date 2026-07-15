<template>
  <div class="relative max-w-7xl border-r border-l border-dashed border-gray-700 py-6 mx-auto">
    <div data-aos="fade-up" class="text-center">
      <h2 class="text-2xl tracking-tight font-extrabold text-gray-200">
        {{ $t('projects.header') }}
      </h2>
      <p class="mt-2 px-2 max-w-2xl mx-auto text-sm leading-7 text-gray-400">
        {{ $t('projects.subtext') }}
      </p>
    </div>

    <div data-aos="zoom-in" class="select-none px-4 items-center justify-center sm:justify-start overflow-hidden flex pt-4">
      <nav class="flex flex-wrap items-center justify-center flex-row space-x-2 sm:space-x-4" aria-label="Tabs">
        <button @click="currentTech = tech" :class="{ 'bg-gray-900 text-gray-300': tech === currentTech }" v-for="tech in techs" :key="tech"
                class="flex text-gray-300 focus:outline-none focus:ring-transparent focus:ring-offset-transparent hover:text-hot-pink px-3 py-2 font-medium text-sm rounded-xl">
          {{ tech }}
        </button>
      </nav>
    </div>

    <div data-aos="zoom-in" class="mt-5 gap-4 mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-none">
      <ProjectCard v-for="project in projectsByTechs" :key="project.slug" :project="project" />
    </div>
  </div>
</template>

<script>
const ALL = 'all'

export default {
  head() {
    return {
      title: `projects -- ${this.$config.name}`
    }
  },
  computed: {
    techs() {
      let techs = []
      this.projects.forEach((project) => {
        const techField = project.tech
        if (Array.isArray(techField)) {
          techField.forEach((t) => {
            if (t.trim() !== '') techs.push(t.trim())
          })
        } else if (typeof techField === 'string') {
          techField.split(' ').forEach((tech) => {
            if (tech.trim() !== '') techs.push(tech.trim())
          })
        }
      })
      return [ALL, ...new Set(techs)]
    },
    projectsByTechs() {
      if (this.currentTech === ALL)
        return this.projects
      return this.projects.filter(project => {
        const techField = project.tech
        if (Array.isArray(techField)) {
          return techField.includes(this.currentTech)
        }
        return (techField || '').includes(this.currentTech)
      })
    }
  },
  data() {
    return {
      currentTech: ALL,
      ALL: ALL, // exporting it to template
    }
  },
  async asyncData({ $content }) {
    const fetchDocsLabel = 'fetchAllProjects'
    console.time(fetchDocsLabel)
    const projects = await $content('projects')
      .without(['body', 'toc'])
      .fetch()
    console.timeEnd(fetchDocsLabel)
    // Latest first: sort by `date` desc, falling back to `id` when missing.
    const list = Array.isArray(projects) ? projects : [projects]
    list.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0
      const db = b.date ? new Date(b.date).getTime() : 0
      if (db !== da) return db - da
      return (b.id || 0) - (a.id || 0)
    })
    return {
      projects: list
    }
  }
}
</script>

<style scoped>

</style>
