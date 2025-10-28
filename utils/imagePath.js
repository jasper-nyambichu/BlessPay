export const imagePaths = {
  // Logos
  logos: {
    main: '/images/logos/logo.png',
    white: '/images/logos/logo-white.png',
    favicon: '/images/logos/favicon.ico',
  },
  
  // Icons
  icons: {
    defaultAvatar: '/images/icons/default-avatar.png',
    placeholder: '/images/icons/placeholder.jpg',
  },
  
  // Backgrounds
  backgrounds: {
    auth: '/images/backgrounds/auth-bg.jpg',
    dashboard: '/images/backgrounds/dashboard-bg.jpg',
    hero: '/images/backgrounds/hero-bg.jpg',
  },
  
  // UI Elements
  ui: {
    pattern: '/images/backgrounds/pattern.svg',
    gradient: '/images/backgrounds/gradient.jpg',
  }
}

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_BASE_URL || ''}${path}`
}