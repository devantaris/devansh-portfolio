# Tech Debt & Concerns

- **Performance Overheads:** The site utilizes Three.js, Spline, GSAP, and Framer Motion simultaneously. Combined, these heavy animation libraries can cause massive bloat and crash older mobile hardware.
- **Mobile Fallbacks:** Some WebGL effects (like UnrealBloomPass) and the CustomCursor have been manually stripped from mobile viewers to prevent crashes. Future 3D additions need strict `isMobile` checks.
- **Bundle Size:** Shipping multiple major 3D/Animation libraries will result in large initial load times. Should investigate dynamic imports (`next/dynamic`) for massive components like Spline if not above the fold.
