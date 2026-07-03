<template>
  <div class="bg-gray-800 py-16 border-t border-b border-dashed border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="text-indigo-400 text-sm font-medium uppercase tracking-wide">credentials</p>
        <h2 class="text-3xl font-bold text-white mt-1">Certifications</h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        <div v-for="(cert, index) in certifications" :key="index"
             class="flex flex-col items-center text-center group">
          <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-3 border-2 transition-colors"
               :class="cert.borderColor">
            <span class="text-2xl sm:text-3xl font-bold" :class="cert.textColor">{{ cert.icon }}</span>
          </div>
          <p class="text-white font-semibold text-sm">{{ cert.name }}</p>
          <p class="text-gray-500 text-xs mt-1">{{ cert.org }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      certifications: [
        {
          name: 'PMP',
          icon: 'PMP',
          org: 'Project Management Institute',
          borderColor: 'border-blue-500 bg-blue-500/10',
          textColor: 'text-blue-400'
        },
        {
          name: 'CSM',
          icon: 'CSM',
          org: 'Scrum Alliance',
          borderColor: 'border-green-500 bg-green-500/10',
          textColor: 'text-green-400'
        },
        {
          name: 'Azure Expert',
          icon: 'AZ',
          org: 'Microsoft Azure Architect',
          borderColor: 'border-cyan-500 bg-cyan-500/10',
          textColor: 'text-cyan-400'
        },
        {
          name: 'AWS SA',
          icon: 'AWS',
          org: 'Solutions Architect',
          borderColor: 'border-yellow-500 bg-yellow-500/10',
          textColor: 'text-yellow-400'
        },
        {
          name: 'CCNA',
          icon: 'CC',
          org: 'Cisco Networking',
          borderColor: 'border-red-500 bg-red-500/10',
          textColor: 'text-red-400'
        },
      ]
    }
  }
}
</script>
