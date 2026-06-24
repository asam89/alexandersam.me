// Upload files in static/ So any file static/file.pdf -> /file.pdf is accessible at root

export default {
  name: 'Alex Sam',
  domain: 'alexandersam.me', // add without https:// , used in meta tags and share urls
  image: '/images/alex-avatar.png',
  email: 'asam@ignyteconsulting.com',
  googleAnalyticsV4: {
    enabled: false,
    id: ''
  },
  plausibleAnalytics: {
    enabled: false,
    domain: 'alexandersam.me',
    trackLocalhost: false,
    apiHost: ''
  },
  // disable firebase - no comments/likes needed for now
  firebase: {
    enabled: false
  },
  social: {
    github: 'asam89',
    linkedin: 'alexandersam',
    facebook: '',
    twitter: '',
    instagram: '',
    codestats: ''
  },
  buyMeACoffee: {
    enabled: false,
    url: ''
  },
  projects: {
    enabled: true,
  },
  blog: {
    enabled: true,
  },
  resume: {
    enabled: false,
    pdfUrl: ''
  },
  uses: {
    enabled: false,
    meta: []
  },
  workedAt: {
    enabled: true,
    meta: [
      { name: 'Ignyte Consulting', src: '/images/ignyte-logo.png', url: 'https://ignyteconsulting.com' },
    ]
  },
  recommendations: {
    enabled: false,
    meta: []
  },
  loadingIndicator: {
    name: 'pulse'
  },
  laguageSwitcher: {
    enabled: false,
  },
  strings: {
    en_US: {
      download: 'download',
      nav: {
        home: 'home',
        blog: 'blog',
        projects: 'projects',
        uses: 'uses',
        resume: 'résumé',
        buyMeACoffee: 'buy me a coffee',
        signIn: 'sign in',
        signOut: 'sign out'
      },
      hero: {
        iBlogTech: 'i build things',
        haveALook: 'see my projects',
        friendlyNeighborhood: 'software engineer &',
        description: 'i am a software engineer and founder of ignyte consulting. i build AI-powered platforms, sports management tools, and automation bots. always shipping, always learning.',
        words: ['consultant', 'builder', 'engineer', 'architect', 'creator'],
      },
      githubCalendar: {
        header: 'contributions',
        subtext: 'github calendar heatmap'
      },
      blog: {
        header: 'blog',
        subtext: 'thoughts on building software, AI, and shipping products'
      },
      recentBlog: {
        header: 'recent posts',
        subtext: 'latest updates and thoughts'
      },
      uses: {
        header: 'uses',
        subtext: 'tools and setup'
      },
      projects: {
        header: 'projects',
        subtext: 'things i\'ve built — platforms, bots, and tools that solve real problems'
      },
      recommendations: {
        header: 'recommendations',
        subtext: 'what people say'
      }
    }
  }
}
