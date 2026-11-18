<template>
  <div class="relative bg-gray-800 overflow-hidden">
    <div class="relative">
      <main class="">
        <div class="mx-auto py-8 max-w-7xl border-l border-r border-dashed border-gray-700">
          <div data-aos="zoom-in" class="lg:grid lg:grid-cols-12">
            <div class="px-4 sm:px-6 lg:border-r lg:border-dashed lg:border-gray-700 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
              <div>
                <nuxt-link v-if="$config.blog.enabled" :to="localePath('/blog')" class="group inline-flex hover:bg-black items-center text-white bg-gray-900 rounded-full p-0.5 pr-2 sm:text-base lg:text-sm xl:text-base hover:text-gray-200">
                  <span class="px-3 py-0.5 text-white text-xs font-semibold leading-5 tracking-wide bg-indigo-600 rounded-full">{{ $t('hero.iBlogTech') }}</span>
                  <span class="ml-4 text-xs">{{$t('hero.haveALook')}}</span>
                  <svg class="transition duration-500 transform block group-hover:rotate-180 hover-arrow ml-2 w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </nuxt-link>
                <h1 class="mt-4 text-3xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-3xl xl:text-3xl">
                  <span class="md:block">{{ $t('hero.friendlyNeighborhood') }}</span>
                  <div>
                    <vue-typer :text="$t('hero.words')"></vue-typer>
                  </div>
                </h1>
                <p class="mt-3 text-base text-gray-300 sm:mt-5">
                  {{ $t('hero.description') }}
                </p>
                <p v-if="$config.workedAt.enabled" class="mt-8 text-sm text-white lowercase tracking-wide font-semibold sm:mt-10">Worked with</p>
                <div v-if="$config.workedAt.enabled" class="mt-5 w-full sm:mx-auto lg:ml-0">
                  <div class="flex flex-wrap gap-3 items-center">
                    <div v-for="(firm, index) in $config.workedAt.meta" :key="index">
                      <a :href="firm.url" target="_blank" rel="noreferrer" class="flex items-center justify-center bg-white rounded-lg p-2 hover:shadow-lg transition-shadow">
                        <img :src="firm.src" class="h-10 sm:h-14" :alt="firm.name"/>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-8 px-5 sm:mt-16 lg:mt-0 lg:col-span-6 lg:pl-10 xl:pl-16 flex flex-col items-center lg:items-start lg:justify-center">
              <img class="rounded-md h-80" :src="$config.image" :alt="$config.name">
              <template v-if="$config.founded && $config.founded.enabled">
                <p class="mt-8 text-sm text-white lowercase tracking-wide font-semibold">Founded</p>
                <div class="mt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <a v-for="venture in $config.founded.meta" :key="venture.name" :href="venture.url" target="_blank" rel="noopener"
                     :title="venture.name" :aria-label="venture.name"
                     class="block h-14 w-14 sm:h-16 sm:w-16 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:ring-2 hover:ring-indigo-500 transition">
                    <img v-if="!missing[venture.name]" :src="venture.src" :alt="venture.name" class="h-full w-full object-cover" @error="$set(missing, venture.name, true)">
                    <span v-else class="h-full w-full flex items-center justify-center bg-indigo-600 px-1 text-center text-[10px] sm:text-xs font-bold leading-tight text-white">{{ venture.name }}</span>
                  </a>
                </div>
              </template>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      missing: {}
    }
  },
  methods: {
  }
}
</script>

<style scoped>
>>> .vue-typer .custom.char {
  @apply text-indigo-600;
}
>>> .vue-typer .custom.char.selected {
  @apply bg-indigo-600 text-white;
}

>>> .vue-typer .custom.caret {
  width: 5px;
  @apply bg-indigo-600;
}

.hover-arrow {
  position: relative;
  stroke-width: 1px;
}
</style>
