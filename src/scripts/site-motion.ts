import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (hero) {
    const intro = hero.querySelector('.hero-copy');
    const supportingCopy = hero.querySelector('.hero-right-copy');
    const hands = hero.querySelectorAll('.hero-hands img');
    const details = hero.querySelectorAll('.care-panel, .service-pills, .feedback');

    const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (intro) {
      entrance.fromTo(intro, { autoAlpha: 0, y: 26 }, {
        autoAlpha: 1, y: 0, duration: 0.85, clearProps: 'opacity,visibility,transform',
      });
    }
    if (supportingCopy) {
      entrance.fromTo(supportingCopy, { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1, y: 0, duration: 0.7, clearProps: 'opacity,visibility,transform',
      }, '-=0.52');
    }
    if (hands.length) {
      entrance.fromTo(hands, (index) => ({
        autoAlpha: 0,
        y: 20,
        scale: 0.985,
        x: index === 0 ? -window.innerWidth : window.innerWidth,
      }), {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        x: 0,
        duration: 1.55,
        stagger: 0.12,
      }, '-=0.68');

      // The hands separate as the hero scrolls away, then return together
      // automatically when the visitor scrolls back up.
      gsap.to(hands, {
        // Use the independent CSS translate property so this scroll effect
        // cannot overwrite the GSAP transform used by the entrance animation.
        '--scroll-x': (index) => index === 0 ? '-14%' : '14%',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
    }
    if (details.length) {
      entrance.fromTo(details, { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.09,
        clearProps: 'opacity,visibility,transform',
      }, '-=0.62');
    }
  }

  const revealSelectors = [
    'main section:not(.hero):not(.section-two) h2',
    '.services-header',
    '.service-card',
    '.why-card',
    '.stat',
    '.visual-panel',
    '.trust-message',
    '.trust-image',
    '.people-copy-card',
    '.reviews-heading',
    '.reviews-proof',
    '.featured-review',
    '.services-hero__copy',
    '.services-hero__visual',
    '.doctors-hero__content',
    '.doctors-intro',
    '.clinical-focus__grid > *',
    '.about-hero__inner',
    '.about-story__copy',
    '.about-capabilities__heading',
    '.capability-grid > *',
  ];

  const revealTargets = new Set<Element>();
  revealSelectors.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      if (!element.closest('.hero, .section-two, .panorama-carousel')) revealTargets.add(element);
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      observer.unobserve(element);
      gsap.fromTo(element,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          delay: Math.min(Number(element.dataset.motionIndex || 0) * 0.055, 0.22),
          clearProps: 'opacity,visibility,transform',
        },
      );
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  revealTargets.forEach((element) => {
    const siblings = element.parentElement
      ? Array.from(element.parentElement.children).filter((child) => revealTargets.has(child))
      : [];
    (element as HTMLElement).dataset.motionIndex = String(Math.max(0, siblings.indexOf(element)));
    revealObserver.observe(element);
  });
}