# Homepage motion direction — Siddaganga Hospital

## Creative direction

**Human connection, expressed with clinical precision.** Motion should feel calm, assured and considered: soft entrances, restrained depth, deliberate pacing and short transitions that clarify state. The hands in the hero are the emotional centre. Everything below supports the same idea: specialist care that is capable without feeling cold.

Avoid generic SaaS motion: no constant floating cards, cursor-following 3D tilt, excessive blur, bouncing icons, artificial counters or long pinned scroll sequences.

## Section-by-section choreography

| Page area | Motion treatment | Timing / trigger | Guardrails |
|---|---|---|---|
| Hero | White field settles first; headline and primary copy rise 20px; supporting copy follows; hands settle from a small scale/y offset. Hands drift vertically at different rates during natural hero scroll. | 0.85–1.15s entrance; subtle scrub across hero scroll. | No large horizontal hand travel, pinning or layout animation. Parallax disabled on lite devices. |
| Medical ticker | Existing continuous horizontal ticker remains the only animation in this strip. | Existing 34s linear loop. | Pause offscreen; stop under reduced motion. |
| About / care statement | One composed 20px rise for text and CTA; background hex geometry drifts slowly in opposite directions. | 0.85s reveal; 8–9s ambient loop while visible. | Ambient motion pauses offscreen; no blur or letter splitting. |
| Medical services | Header arrives first; six cards enter as one staggered sequence. Each image receives a restrained scale settle. Existing hover/focus treatment remains in charge of the card. | 0.72s reveal, 75ms stagger; 1.05s image settle. | Never animate card transform with GSAP; preserve CSS hover/focus ownership. No pointer tilt. |
| Why Siddaganga | Image-led panel and heading reveal; desktop image has small vertical parallax. Four facts enter in a short stagger. | 0.65–0.75s; parallax only while image is in view. | Do not count up factual values. Preserve 15+, 6+, 4.5 and 24×7 exactly. Disable parallax on mobile/lite devices. |
| Doctors | Trust image, statement, intro card and carousel stage reveal as a group. Existing doctor carousel owns all card transforms, depth, opacity and selection state. | 0.72s section reveal; existing 700ms card transition. | Global motion never writes to doctor-card transforms/opacity. Inactive cards stay hidden from assistive technology. Reduced motion removes transition delay. |
| Hospital gallery | Heading and carousel stage reveal; existing panorama rail owns 3D card placement. Caption title/subtitle crossfade on slide changes. | 0.78s section reveal; 220ms caption change; existing 680ms rail movement. | No GSAP writes to panorama-card. Keep keyboard, button and drag controls intact. |
| Patient reviews | Heading, featured review and dots enter in sequence. Review identity and quote crossfade when selected review changes. | 0.78s section reveal; 200ms content transition. | Component renderer owns review text. No mutation observer or repeated animation per DOM mutation. |
| Footer | Kicker, headline, copy and CTA rise in order; footer navigation and large wordmark close the page quietly. | 0.7–0.85s; 55ms stagger for CTA stack. | No per-character DOM splitting or expensive text filters. |

## Engineering rules

1. Single property owner: a carousel owns its card transforms; GSAP may animate its section wrapper, never internal cards.
2. Progressive enhancement: source HTML remains visible. Essential content never depends on JavaScript to appear.
3. Compositor-first: animate transform and opacity; never animate layout dimensions, top, left, margins or large shadows on scroll.
4. No permanent layer promotion: avoid broad will-change declarations.
5. Viewport-aware loops: ambient animation pauses offscreen. ScrollTrigger instances revert on page navigation.
6. Reduced motion: GSAP does not initialize when prefers-reduced-motion is reduce; CSS ticker, gallery, doctor and review transitions are also suppressed.
7. Lite devices: remove parallax and ambient geometry drift; retain only short, low-distance reveals.
8. Interaction integrity: keyboard navigation, pointer/touch selection, carousel state and focus indicators remain usable.

## Verification matrix

Run production build and Playwright at 320, 360, 375, 390, 425, 768, 820, 1024 and 1440 widths. Check normal and reduced motion separately. Verify no page errors, horizontal overflow or broken visible images, and confirm gallery/doctor controls update state.

A successful build and automated checks are necessary but do not replace visual review of desktop, tablet and mobile screenshots. Final visual approval remains a browser QA step.
