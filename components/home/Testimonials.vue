<template>
  <div class="bg-gray-900 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="text-indigo-400 text-sm font-medium uppercase tracking-wide">what people say</p>
        <h2 class="text-3xl font-bold text-white mt-1">Testimonials</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(testimonial, index) in testimonials" :key="index"
             class="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div class="flex mb-3">
              <svg v-for="s in 5" :key="s" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-gray-300 text-sm italic leading-relaxed">"{{ testimonial.quote }}"</p>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-700">
            <p class="text-white font-semibold text-sm">{{ testimonial.name }}</p>
            <p class="text-gray-500 text-xs">{{ testimonial.title }}</p>
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
      testimonials: [
        {
          quote: 'Alex brings a rare combination of technical depth and project management excellence. His ability to bridge the gap between stakeholders and engineering teams made our cloud migration seamless.',
          name: 'Senior Director',
          title: 'Enterprise Financial Services'
        },
        {
          quote: 'Working with Alex on the SAP ERP integration was a game-changer. He kept the project on track, navigated complex vendor relationships, and delivered ahead of schedule.',
          name: 'VP of Technology',
          title: 'Fortune 500 Company'
        },
        {
          quote: 'Alex built our entire league management platform from scratch. His technical vision and execution transformed how we run sports leagues across the GTA.',
          name: 'Co-Founder',
          title: 'FaezSports'
        },
      ]
    }
  }
}
</script>
