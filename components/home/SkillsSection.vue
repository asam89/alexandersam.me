<template>
  <div class="bg-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-4 mb-12">
        <h2 class="text-3xl font-bold text-gray-900">Skills & Tools</h2>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">what I use</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(category, index) in skills" :key="index" class="border border-gray-200 rounded-lg p-6">
          <h3 class="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 font-mono">{{ category.title }}</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(skill, sIndex) in category.items"
              :key="sIndex"
              class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border"
              :class="skill.highlight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-50 text-gray-700 border-gray-200'"
            >
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      skills: [
        {
          title: 'Cloud & Infrastructure',
          items: [
            { name: 'Microsoft Azure', highlight: false },
            { name: 'AWS', highlight: false },
            { name: 'Oracle Cloud (OCI)', highlight: false },
            { name: 'Kubernetes', highlight: false },
            { name: 'Docker', highlight: false },
            { name: 'Terraform', highlight: false },
          ]
        },
        {
          title: 'Enterprise & ERP',
          items: [
            { name: 'SAP S/4HANA', highlight: false },
            { name: 'JD Edwards', highlight: false },
            { name: 'Active Directory', highlight: false },
            { name: 'M365', highlight: false },
            { name: 'IAM', highlight: false },
            { name: 'Zero Trust', highlight: false },
          ]
        },
        {
          title: 'DevOps & Automation',
          items: [
            { name: 'CI/CD', highlight: false },
            { name: 'GitHub Actions', highlight: false },
            { name: 'Python', highlight: false },
            { name: 'Node.js', highlight: false },
            { name: 'Bash', highlight: false },
            { name: 'Tailscale', highlight: false },
          ]
        },
        {
          title: 'AI & LLM',
          items: [
            { name: 'Claude API', highlight: false },
            { name: 'Ollama', highlight: false },
            { name: 'Gemini', highlight: false },
            { name: 'Telegram Bots', highlight: false },
            { name: 'Intent Classification', highlight: false },
          ]
        },
        {
          title: 'Data & Analytics',
          items: [
            { name: 'SQL Server', highlight: false },
            { name: 'PostgreSQL', highlight: false },
            { name: 'SQLite', highlight: false },
            { name: 'ETL', highlight: false },
            { name: 'Event-Driven Architecture', highlight: false },
          ]
        },
        {
          title: 'Project Management',
          items: [
            { name: 'PMP Certified', highlight: true },
            { name: 'Agile / Scrum', highlight: false },
            { name: 'Kanban', highlight: false },
            { name: 'Jira', highlight: false },
            { name: 'Confluence', highlight: false },
          ]
        },
      ]
    }
  }
}
</script>
