import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Keep the homepage hero choreography. Content below the hero stays visible
// in normal document flow: no IntersectionObserver opacity toggles, delayed
// stagger queues, or scroll-triggered reveal animations.
if (!reducedMotion) {
  const hero = document.querySelector<HTMLElement>('.hero');

  if (hero) {
    const intro = hero.querySelector('.hero-copy');
    const supportingCopy = hero.querySelector('.hero-right-copy');
    const hands = hero.querySelectorAll<HTMLElement>('.hero-hands img');
    const details = hero.querySelectorAll('.care-panel, .service-pills, .feedback');

    const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (intro) {
      entrance.fromTo(
        intro,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.85, clearProps: 'opacity,visibility,transform' },
      );
    }

    if (supportingCopy) {
      entrance.fromTo(
        supportingCopy,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, clearProps: 'opacity,visibility,transform' },
        '-=0.52',
      );
    }

    if (hands.length) {
      entrance.fromTo(
        hands,
        {
          autoAlpha: 0,
          y: 20,
          scale: 0.985,
          x: (index) => index === 0 ? -window.innerWidth : window.innerWidth,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          x: 0,
          duration: 1.55,
          stagger: 0.12,
        },
        '-=0.68',
      );

      // Scroll separation uses CSS translate, independently of GSAP transform.
      gsap.to(hands, {
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
      entrance.fromTo(
        details,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.09,
          clearProps: 'opacity,visibility,transform',
        },
        '-=0.62',
      );
    }
  }
}
