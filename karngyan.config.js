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
    linkedin: 'alexander-s-306575278',
    facebook: '',
    twitter: 'ignytechnology',
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
      { name: 'University of Toronto', src: '/images/uoft-logo.png', url: 'https://utoronto.ca' },
      { name: 'Royal Bank of Canada', src: '/images/rbc-logo.png', url: 'https://rbc.com' },
      { name: 'BMO Financial Group', src: '/images/bmo-logo.png', url: 'https://bmo.com' },
      { name: 'Publicis Groupe', src: '/images/publicis-logo.png', url: 'https://publicisgroupe.com' },
      { name: 'Syntax', src: '/images/syntax-logo.png', url: 'https://syntax.com' },
      { name: 'InfoSec Global', src: '/images/infosec-logo.png', url: 'https://www.keyfactor.com/infosecglobal/' },
      { name: 'Isaac Operations', src: '/images/isaac-logo.png', url: 'https://isaacteam.com/' },
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
        iBlogTech: 'cloud · infrastructure · devops',
        haveALook: 'view projects',
        friendlyNeighborhood: 'technical project manager &',
        description: 'builder & dreamer. pmp-certified technical project manager building modern cloud solutions, AI-powered automation, and community impact. founder of ignyte consulting & faezsports.',
        words: ['cloud architect', 'devops lead', 'ai builder', 'pm operator', 'msp founder'],
      },
      githubCalendar: {
        header: 'contributions',
        subtext: 'github calendar heatmap'
      },
      blog: {
        header: 'writing',
        subtext: 'publications on AI, project management, and building tools'
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
        subtext: 'cloud migrations, AI bots, and community platforms'
      },
      recommendations: {
        header: 'recommendations',
        subtext: 'what people say'
      }
    }
  }
}
