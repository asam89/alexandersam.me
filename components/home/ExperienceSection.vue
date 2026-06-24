<template>
  <div class="bg-gray-800 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12">
        <p class="text-indigo-400 text-sm font-medium uppercase tracking-wide">career timeline</p>
        <h2 class="text-3xl font-bold text-white mt-1">Experience</h2>
      </div>
      <div class="space-y-8">
        <div v-for="(job, index) in experience" :key="index" class="relative pl-8 border-l-2 border-gray-700">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-indigo-600"></div>
          <div class="pb-8">
            <div class="flex flex-wrap items-baseline gap-2">
              <h3 class="text-lg font-semibold text-white">{{ job.title }}</h3>
              <span class="text-gray-400 text-sm">·</span>
              <span class="text-indigo-400 text-sm font-medium">{{ job.company }}</span>
            </div>
            <p class="text-gray-500 text-sm mt-1">{{ job.period }} · {{ job.location }}</p>
            <p class="text-gray-300 text-sm mt-3">{{ job.summary }}</p>
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
      experience: [
        {
          title: 'Student Information Systems Portfolio Manager',
          company: 'University of Toronto',
          period: 'Sep 2024 – Present',
          location: 'Toronto, ON',
          summary: 'Leading SAFe/Agile adoption across the SIS portfolio. Achieved 20% improvement in sprint predictability. Managing microservices modernization and enterprise data architecture transformation.'
        },
        {
          title: 'IT Manager',
          company: 'Syntax',
          period: 'Apr 2024 – Aug 2024',
          location: 'Remote',
          summary: 'Managed global IT team of 25 supporting 800+ endpoints. Led M365 tenant migrations, Azure AD implementations, and Intune device compliance rollouts.'
        },
        {
          title: 'Senior Technical Project Manager',
          company: 'Royal Bank of Canada (RBC)',
          period: 'Dec 2019 – Feb 2024',
          location: 'Toronto, ON',
          summary: 'Delivered $52M Next-Gen SIEM Migration (Splunk & Azure Sentinel) with 20TB/day log ingestion. Led $5M QRadar SIEM Refresh across 15 data centres. Managed 79-appliance Cisco Firepower IPS refresh.'
        },
        {
          title: 'Senior Business Systems Analyst / Project Manager',
          company: 'BMO Financial Group',
          period: 'Jan 2019 – Nov 2019',
          location: 'Toronto, ON',
          summary: 'Led $5M GitHub Enterprise Migration for 20,000 users and 100,000+ repositories. Coordinated vendor management, RFP development, and contract negotiation for DevOps tooling.'
        },
        {
          title: 'Program Manager',
          company: 'Publicis Groupe',
          period: 'Oct 2015 – May 2017',
          location: 'Toronto, ON',
          summary: 'Managed portfolio of IT projects supporting marketing technology platforms. Budgets ranging from $100K to $2M with multi-team coordination.'
        },
      ]
    }
  }
}
</script>
