# Coding Conventions

- **Next.js:** Uses the modern App Router (`app/`).
- **Client Components:** Components that need browser APIs (window, DOM, hooks like `useState`, `useRef`, animations) must begin with `'use client'`.
- **TypeScript:** Strict type checking configured. Props and internal state should have interface definitions.
- **Styling:** Tailwind CSS class-based styling. Use `cn()` utility (`clsx` + `tailwind-merge`) from `lib/utils` for dynamic class names.
- **Performance:** Avoid `useState` for raw scroll events. Use `framer-motion`'s `useScroll` / `useTransform` or `gsap`'s `ScrollTrigger` to bind directly to WebGL or DOM styles to prevent React re-renders on every frame.
