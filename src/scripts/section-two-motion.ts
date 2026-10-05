import { gsap } from 'gsap';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  const section = document.querySelector<HTMLElement>('.section-two');
  const eyebrow = section?.querySelector<HTMLElement>('.section-two__eyebrow');
  const heading = section?.querySelector<HTMLElement>('#section-two-title');
  const description = section?.querySelector<HTMLElement>('.section-two__description');
  const cta = section?.querySelector<HTMLElement>('.section-two__cta');
  const geometry = section?.querySelectorAll<HTMLElement>('.section-two__geometry');

  if (section && eyebrow && heading && description && cta) {
    const targets = [eyebrow, heading, description, cta];

    gsap.set(targets, { autoAlpha: 0, y: 24 });

    const reveal = () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55 })
        .to(heading, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.3')
        .to(description, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.42')
        .to(cta, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.32');
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(section);

    if (geometry?.length) {
      gsap.to(geometry, {
        y: 10,
        duration: 7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.8,
      });
    }
  }
}
