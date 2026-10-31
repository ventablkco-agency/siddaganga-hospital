export const visualQaConfig = {
  // Add every important public route here as the site grows.
  routes: [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about/' },
    { name: 'services', path: '/services/' },
    { name: 'doctors', path: '/doctors/' },
    { name: 'contact', path: '/contact/' },
  ],

  // These are the reference widths we use for responsive review.
  viewports: [
    { name: '1440x720', width: 1440, height: 720 },
    { name: '1024x720', width: 1024, height: 720 },
    { name: '820x1040', width: 820, height: 1040 },
    { name: '768x1040', width: 768, height: 1040 },
    { name: '425x1360', width: 425, height: 1360 },
    { name: '390x1360', width: 390, height: 1360 },
    { name: '375x1360', width: 375, height: 1360 },
    { name: '360x1360', width: 360, height: 1360 },
    { name: '320x1399', width: 320, height: 1399 },
  ],

  // Full-page captures are intentionally limited so CI artifacts stay useful.
  fullPageViewports: new Set(['1440x720', '390x1360']),

  // Set to true only after a design is approved and committed as a baseline.
  visualRegression: process.env.VISUAL_REGRESSION === 'true',

  // Optional selectors for sections that deserve focused screenshots.
  // Example: { name: 'hero', selector: '[data-visual="hero"]' }
  focusSelectors: [
    { name: 'hero', selector: '.hero' },
    { name: 'about', selector: '.section-two' },
    { name: 'services', selector: '.services-section' },
    { name: 'why-us', selector: '.why-section' },
    { name: 'doctors', selector: '.doctors-section' },
    { name: 'gallery', selector: '.gallery-section' },
    { name: 'reviews', selector: '.reviews-section' },
    { name: 'footer', selector: '.site-footer' },
  ],
};
