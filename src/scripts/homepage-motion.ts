import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const nav = navigator as Navigator & { deviceMemory?: number };
const lite = (nav.deviceMemory ?? 8) <= 4 || (nav.hardwareConcurrency ?? 8) <= 4;

if (reduced) {
  document.documentElement.classList.add('motion-reduced');
} else {
  document.documentElement.classList.add(lite ? 'motion-lite' : 'motion-full');

  // Hero entrance and scroll choreography. No content is hidden before JS runs.
  const hero = document.querySelector<HTMLElement>('.hero');
  if (hero) {
    const frame = hero.querySelector<HTMLElement>('.hero__frame');
    const body = hero.querySelector<HTMLElement>('.hero-body');
    const copy = hero.querySelector<HTMLElement>('.hero-copy');
    const sideCopy = hero.querySelector<HTMLElement>('.hero-right-copy');
    const hands = gsap.utils.toArray<HTMLElement>('.hero-hands img');
    const details = gsap.utils.toArray<HTMLElement>('.service-pills, .care-panel, .feedback');
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (body) intro.from(body.querySelectorAll('.hero-white'), {
      clipPath: 'inset(0 100% 0 0)', duration: 1.05, stagger: 0.08, ease: 'power2.inOut',
    }, 0);
    if (copy) intro.from(copy, { y: 30, duration: 1.05 }, 0.08);
    if (sideCopy) intro.from(sideCopy, { y: 22, duration: 0.9 }, 0.28);
    if (hands.length) intro.from(hands, {
      x: (i) => i === 0 ? -window.innerWidth * 0.72 : window.innerWidth * 0.72,
      rotation: (i) => i === 0 ? -3 : 3, duration: 1.65, stagger: 0.1, ease: 'expo.out',
    }, 0.12);
    if (details.length) intro.from(details, { y: 20, duration: 0.7, stagger: 0.09 }, 0.72);

    if (!lite && frame && hands.length) {
      gsap.to(hands, {
        x: (i) => i === 0 ? '-40vw' : '40vw',
        rotation: (i) => i === 0 ? -2 : 2,
        scale: 1.035, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.65, invalidateOnRefresh: true },
      });
      gsap.to(frame, {
        scale: 0.975, transformOrigin: '50% 0%', ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    }
  }

  // Section-specific reveals; transform only, so all text remains readable without JS.
  const groups = [
    '.services-header, .services-heading',
    '.service-card',
    '.why-card, .visual-panel',
    '.stat',
    '.trust-message, .trust-image',
    '.people-copy-card',
    '.reviews-heading, .reviews-proof',
    '.featured-review',
    '.gallery-heading',
    '.footer-cta h2, .footer-cta p, .footer-cta .footer-kicker',
  ];
  groups.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((el, index) => {
      if (el.closest('.hero')) return;
      gsap.from(el, {
        y: lite ? 14 : 26, duration: lite ? 0.55 : 0.8,
        delay: selector.includes('service-card') ? Math.min(index * 0.07, 0.28) : 0,
        ease: 'power3.out', clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  });

  // Services: reveal the image itself, not the card whose hover CSS is already tuned.
  document.querySelectorAll<HTMLElement>('.service-card').forEach((card) => {
    const image = card.querySelector<HTMLElement>('.service-image, img');
    if (image && !lite) gsap.from(image, {
      clipPath: 'inset(0 0 100% 0)', scale: 1.12, duration: 1.05, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 86%', once: true },
    });
    if (finePointer && !lite) {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: px * 5, rotateX: py * -5, duration: 0.35, ease: 'power2.out', overwrite: true });
        if (image) gsap.to(image, { x: px * -7, y: py * -7, duration: 0.4, overwrite: true });
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
        if (image) gsap.to(image, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
      });
    }
  });

  // Count numeric stat values once they enter the viewport.
  document.querySelectorAll<HTMLElement>('.stat').forEach((stat) => {
    const node = stat.querySelector<HTMLElement>('strong, .stat-number');
    if (!node) return;
    const initial = node.textContent?.trim() ?? '';
    const match = initial.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;
    const value = { current: 0 };
    const target = Number(match[1]);
    gsap.to(value, {
      current: target, duration: 1.3, ease: 'power2.out',
      scrollTrigger: { trigger: stat, start: 'top 88%', once: true },
      onUpdate: () => { node.textContent = value.current.toFixed(match[1].includes('.') ? 1 : 0) + match[2]; },
    });
  });

  // Pause decorative loops when their section is outside the viewport.
  document.querySelectorAll<HTMLElement>('.section-two__geometry').forEach((shape) => {
    const tween = gsap.to(shape, { y: 12, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true });
    ScrollTrigger.create({
      trigger: shape.closest('.section-two') ?? shape,
      start: 'top bottom', end: 'bottom top',
      onEnter: () => tween.play(), onEnterBack: () => tween.play(),
      onLeave: () => tween.pause(), onLeaveBack: () => tween.pause(),
    });
  });
  const ambient = document.querySelectorAll<HTMLElement>('.medical-ticker, .ticker-track, .footer-retro-grid, .retro-grid');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      (target as HTMLElement).style.animationPlayState = isIntersecting ? 'running' : 'paused';
    });
  });
  ambient.forEach((el) => observer.observe(el));

  // Preserve the existing carousel/gallery logic; animate only the state it already exposes.
  // The doctors carousel owns its transforms; do not write to its card transform property.
  const review = document.querySelector<HTMLElement>('[data-review-card]');
  if (review) {
    const reviewObserver = new MutationObserver(() => {
      gsap.fromTo(review, { y: 12 }, { y: 0, duration: 0.42, ease: 'power3.out', overwrite: true });
      const copy = review.querySelector<HTMLElement>('.review-copy');
      if (copy) gsap.fromTo(copy, { y: 9 }, { y: 0, duration: 0.48, ease: 'power3.out', overwrite: true });
    });
    reviewObserver.observe(review, { childList: true, characterData: true, subtree: true });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  window.addEventListener('pagehide', () => {
    observer.disconnect();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, { once: true });
}
