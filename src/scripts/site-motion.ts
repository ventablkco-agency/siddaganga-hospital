import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  const hero = document.querySelector<HTMLElement>('.hero');

  if (hero) {
    const intro = hero.querySelector('.hero-copy');
    const supportingCopy = hero.querySelector('.hero-right-copy');
    const hands = hero.querySelectorAll<HTMLElement>('.hero-hands img');
    const details = hero.querySelectorAll('.care-panel, .service-pills, .feedback');
    const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (intro) entrance.fromTo(intro, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.85, clearProps: 'opacity,visibility,transform' });
    if (supportingCopy) entrance.fromTo(supportingCopy, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, clearProps: 'opacity,visibility,transform' }, '-=0.52');

    if (hands.length) {
      entrance.fromTo(hands, {
        autoAlpha: 0, y: 20, scale: 0.985,
        x: (index) => index === 0 ? -window.innerWidth : window.innerWidth,
      }, {
        autoAlpha: 1, y: 0, scale: 1, x: 0, duration: 1.55, stagger: 0.12,
      }, '-=0.68');

      gsap.to(hands, {
        '--scroll-x': (index) => index === 0 ? '-14%' : '14%',
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true },
      });
    }

    if (details.length) entrance.fromTo(details, { autoAlpha: 0, y: 14 }, {
      autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.09,
      clearProps: 'opacity,visibility,transform',
    }, '-=0.62');
  }

  // Below-the-fold content remains visible even if JavaScript is delayed or fails.
  // Animate position only: never toggle opacity or visibility on reveal targets.
  const revealSelectors = [
    'main section:not(.hero):not(.section-two) h2',
    '.services-header', '.service-card', '.why-card', '.stat', '.visual-panel',
    '.trust-message', '.trust-image', '.people-copy-card', '.reviews-heading',
    '.reviews-proof', '.featured-review', '.services-hero__copy',
    '.services-hero__visual', '.doctors-hero__content', '.doctors-intro',
    '.clinical-focus__grid > *', '.about-hero__inner', '.about-story__copy',
    '.about-capabilities__heading', '.capability-grid > *',
  ];

  const targets = new Set<HTMLElement>();
  revealSelectors.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      if (!element.closest('.hero, .section-two, .panorama-carousel')) targets.add(element);
    });
  });

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      currentObserver.unobserve(element);
      const siblings = element.parentElement
        ? Array.from(element.parentElement.children).filter((child) => targets.has(child as HTMLElement))
        : [];
      const index = Math.max(0, siblings.indexOf(element));
      gsap.fromTo(element, { y: 18 }, {
        y: 0, duration: 0.68, delay: Math.min(index * 0.055, 0.2),
        ease: 'power3.out', overwrite: 'auto', clearProps: 'transform',
        immediateRender: false,
      });
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach((element) => observer.observe(element));
}
