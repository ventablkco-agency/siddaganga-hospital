import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector<HTMLElement>('.hero');
const patientHand = hero?.querySelector<HTMLElement>('.patient-hand');
const clinicianHand = hero?.querySelector<HTMLElement>('.clinician-hand');

if (hero && patientHand && clinicianHand) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!reducedMotion.matches) {
    const spreadDistance = () => {
      const width = window.innerWidth;

      if (width <= 699) return Math.min(26, width * 0.07);
      if (width <= 900) return Math.min(54, width * 0.07);

      return Math.min(112, width * 0.075);
    };

    const scrollRange = () =>
      Math.max(hero.offsetHeight * 0.85, window.innerHeight * 0.65);

    const context = gsap.context(() => {
      gsap.to(patientHand, {
        x: () => -spreadDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => `+=${scrollRange()}`,
          scrub: 1.6,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(clinicianHand, {
        x: () => spreadDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => `+=${scrollRange()}`,
          scrub: 1.6,
          invalidateOnRefresh: true,
        },
      });
    }, hero);

    window.addEventListener('pagehide', () => context.revert(), { once: true });
  }
}
