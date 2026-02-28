# Architecture

The application is a single-page portfolio wrapped in a Next.js App Router structure.

## Layers
1. **Routing:** `app/` directory handles the root layout and pages. Uses `app/projects/` for project details.
2. **UI Components:** Reusable primitive components live in `components/ui/` (e.g., buttons, modals).
3. **Section Components:** Major page sections (Hero, About, Projects) live in `components/sections/`.
4. **Global Components:** Backgrounds (Starfield/Nebula) and Navigation exist as top-level components in `components/`.

## Data Flow
- Largely static and client-rendered. Heavy interactive components use `'use client'` to access DOM for WebGL and Framer Motion / GSAP animations.
- Uses React refs for animation timelines rather than standard state, specifically to avoid performance bottlenecks with scroll events.
