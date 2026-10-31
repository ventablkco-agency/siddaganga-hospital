import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const nav = navigator as Navigator & { deviceMemory?: number };
const isLiteDevice =
  (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
  (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4);
const all = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));

if (motionPreference.matches) {
  document.documentElement.classList.add('motion-reduced');
} else {
  document.documentElement.classList.add(isLiteDevice ? 'motion-lite' : 'motion-full');

  const ambientLoops = all('.medical-ticker__track, .footer-retro-grid .retro-grid__plane');
  let ambientObserver: IntersectionObserver | undefined;

  const motionContext = gsap.context(() => {
    // HERO — human connection, not a high-speed tech-style entrance.
    const hero = document.querySelector<HTMLElement>('.hero');
    if (hero) {
      const frame = hero.querySelector<HTMLElement>('.hero__frame');
      const copy = hero.querySelector<HTMLElement>('.hero-copy');
      const sideCopy = hero.querySelector<HTMLElement>('.hero-right-copy');
      const hands = all('.hero-hands img').filter((element) => element.getClientRects().length > 0);
      const whiteFields = gsap.utils
        .toArray<SVGElement>('.hero-white')
        .filter((element) => getComputedStyle(element).display !== 'none');

      const entrance = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.08 });
      if (whiteFields.length) {
        entrance.from(whiteFields, {
          scaleX: 0.975,
          transformOrigin: 'left center',
          duration: 1.05,
          stagger: 0.04,
          ease: 'power2.inOut',
        }, 0);
      }
      if (copy) entrance.from(copy, { y: 20, duration: 0.9 }, 0.08);
      if (sideCopy) entrance.from(sideCopy, { y: 16, duration: 0.85 }, 0.24);
      if (hands.length) {
        entrance.from(hands, {
          y: 16,
          scale: 0.985,
          duration: 1.15,
          stagger: 0.07,
          ease: 'expo.out',
        }, 0.14);
      }

      if (frame && !isLiteDevice) {
        gsap.to(frame, {
          scale: 0.992,
          transformOrigin: '50% 0%',
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
      }
      if (hands.length && !isLiteDevice) {
        gsap.to(hands, {
          yPercent: (index) => (index === 0 ? -5 : 4),
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }
    }

    // ABOUT — a composed statement reveal; the background geometry drifts slowly.
    const aboutContent = document.querySelector<HTMLElement>('.section-two__content');
    if (aboutContent) {
      gsap.from(aboutContent, {
        y: 20,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.section-two', start: 'top 78%', once: true },
      });
    }

    if (!isLiteDevice) {
      all('.section-two__geometry--left, .section-two__geometry--right').forEach((shape, index) => {
        const drift = gsap.to(shape, {
          y: index === 0 ? -12 : 12,
          duration: 8 + index,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          paused: true,
        });
        ScrollTrigger.create({
          trigger: '.section-two',
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? drift.play() : drift.pause()),
        });
      });
    }

    // SERVICES — editorial heading first, then one deliberate card sequence.
    const servicesHeader = document.querySelector<HTMLElement>('.services-header');
    if (servicesHeader) {
      gsap.from(servicesHeader, {
        y: 20,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services-section', start: 'top 76%', once: true },
      });
    }

    const serviceCards = all('.service-card');
    if (serviceCards.length) {
      gsap.from(serviceCards, {
        y: 22,
        duration: 0.72,
        stagger: 0.075,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true },
      });
      if (!isLiteDevice) {
        serviceCards.forEach((card) => {
          const image = card.querySelector<HTMLElement>('.service-image');
          if (!image) return;
          gsap.from(image, {
            scale: 1.055,
            duration: 1.05,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 86%', once: true },
          });
        });
      }
    }

    const essentialItems = all('.essential-item');
    if (essentialItems.length) {
      gsap.from(essentialItems, {
        y: 12,
        duration: 0.55,
        stagger: 0.045,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.essential-services', start: 'top 88%', once: true },
      });
    }

    // WHY US — photograph has a slow desktop-only drift; facts reveal as a group.
    const visualCopy = document.querySelector<HTMLElement>('.visual-copy');
    if (visualCopy) {
      gsap.from(visualCopy, {
        y: 18,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.why-section', start: 'top 78%', once: true },
      });
    }

    const stats = all('.stats-grid .stat');
    if (stats.length) {
      gsap.from(stats, {
        y: 16,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.stats-grid', start: 'top 84%', once: true },
      });
    }

    const whyImage = document.querySelector<HTMLElement>('.visual-panel img');
    if (whyImage && !isLiteDevice && window.matchMedia('(min-width: 801px)').matches) {
      gsap.to(whyImage, {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.visual-panel',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.65,
        },
      });
    }

    // PEOPLE — reveal the trust statement and selector, never the card transforms.
    const peopleElements = all('.trust-message, .trust-image, .trust-appointment, .people-copy-card, .depth-stage');
    if (peopleElements.length) {
      gsap.from(peopleElements, {
        y: 18,
        duration: 0.72,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.doctors-section', start: 'top 78%', once: true },
      });
    }

    // GALLERY — the existing 3D rail exclusively owns every gallery-card transform.
    const galleryHeading = document.querySelector<HTMLElement>('.gallery-heading');
    const galleryCarousel = document.querySelector<HTMLElement>('.panorama-carousel');
    const galleryMeta = document.querySelector<HTMLElement>('.gallery-meta');
    [galleryHeading, galleryCarousel, galleryMeta].forEach((element, index) => {
      if (!element) return;
      gsap.from(element, {
        y: index === 1 ? 14 : 18,
        duration: 0.78,
        delay: index === 1 ? 0.08 : 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-section', start: 'top 76%', once: true },
      });
    });

    // REVIEWS — section entrance only; review content transitions are owned by its renderer.
    const reviewHeading = document.querySelector<HTMLElement>('.reviews-heading');
    const reviewCard = document.querySelector<HTMLElement>('.featured-review');
    const reviewDots = document.querySelector<HTMLElement>('.review-dots');
    [reviewHeading, reviewCard, reviewDots].forEach((element, index) => {
      if (!element) return;
      gsap.from(element, {
        y: index === 1 ? 20 : 14,
        duration: 0.78,
        delay: index * 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.reviews-section', start: 'top 78%', once: true },
      });
    });

    // FOOTER — a measured close, with no per-character DOM splitting.
    const footerKicker = document.querySelector<HTMLElement>('.footer-kicker');
    const footerTitle = document.querySelector<HTMLElement>('.footer-cta h2');
    const footerCopy = document.querySelector<HTMLElement>('.footer-cta p');
    const footerButton = document.querySelector<HTMLElement>('.footer-cta .icon-slide-button');
    [footerKicker, footerTitle, footerCopy, footerButton].forEach((element, index) => {
      if (!element) return;
      gsap.from(element, {
        y: 16,
        duration: 0.7,
        delay: index * 0.055,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-cta', start: 'top 82%', once: true },
      });
    });

    const footerTop = document.querySelector<HTMLElement>('.footer-top');
    const wordmark = document.querySelector<HTMLElement>('.footer-wordmark');
    [footerTop, wordmark].forEach((element, index) => {
      if (!element) return;
      gsap.from(element, {
        y: index === 1 ? 14 : 18,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    });
  });

  // The existing CSS ticker is paused outside the viewport; no duplicate tween.
  if (ambientLoops.length && 'IntersectionObserver' in window) {
    ambientObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as HTMLElement).style.animationPlayState =
            entry.isIntersecting ? 'running' : 'paused';
        });
      },
      { threshold: 0.01 },
    );
    ambientLoops.forEach((element) => ambientObserver?.observe(element));
  }

  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') refresh();
  else window.addEventListener('load', refresh, { once: true });

  window.addEventListener('pagehide', () => {
    ambientObserver?.disconnect();
    motionContext.revert();
  }, { once: true });
}
