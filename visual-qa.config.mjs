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
    { name: '320x844', width: 320, height: 844 },
    { name: '375x812', width: 375, height: 812 },
    { name: '390x844', width: 390, height: 844 },
    { name: '430x932', width: 430, height: 932 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '1024x900', width: 1024, height: 900 },
    { name: '1440x900', width: 1440, height: 900 },
  ],

  // Full-page captures are intentionally limited so CI artifacts stay useful.
  fullPageViewports: new Set(['375x812', '1440x900']),

  // Set to true only after a design is approved and committed as a baseline.
  visualRegression: process.env.VISUAL_REGRESSION === 'true',

  // Optional selectors for sections that deserve focused screenshots.
  // Example: { name: 'hero', selector: '[data-visual="hero"]' }
  focusSelectors: [],
};
