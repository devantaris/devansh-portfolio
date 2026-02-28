# Devansh Kumar - Cosmic Portfolio 🌌

Welcome to the source code for my interactive, hardware-accelerated personal portfolio. 

This project goes beyond a standard static site—it is designed as a dynamic, "cosmic terminal" experience. It heavily utilizes WebGL shaders, particle systems, and hardware-accelerated scroll animations to create a deeply immersive interface that performs flawlessly from high-end desktops down to aging mobile hardware.

## ✨ Features

- **Hardware-Accelerated WebGL Backgrounds:** Features a highly optimized `StarfieldBackground` utilizing pure Three.js buffer geometries and custom shader materials (running at forced `highp` precision on mobile to prevent Unix timestamp float overflows).
- **GSAP & Framer Motion Integration:** Scroll events bypass React's standard thread using Framer Motion's `useScroll` hooks for zero-latency DOM manipulation.
- **Glassmorphic UI Elements:** Custom Modals, Navigations, and Bento Grids layered with backdrop filters and precise negative space design.
- **Dynamic 3D Spline Routing:** Integrated `@splinetool/react-spline` for interactive 3D assets.
- **Mobile-First Hardware Tiering:** The application detects processing capabilities and gracefully degrades extreme visual effects (like WebGL `UnrealBloomPass` layers and high star counts) on mobile to maintain 60 FPS without crashing.

## 🛠 Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Library:** React 19.2.3 & TypeScript 5+
- **Styling:** Tailwind CSS v4
- **3D & Canvas:** Three.js, React-Three-Fiber, React-Three-Drei
- **Animation:** Framer Motion, GSAP
- **Agent Orchestration:** [GSD](https://github.com/gsd-build/get-shit-done) context tools configured. 

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live Cosmic Terminal.

## 🧹 Project Architecture & GSD Context

This repository utilizes the **GSD Meta-Prompting System**. Dedicated `.planning/codebase` documents exist to provide context maps for Orchestrator Agents (like Claude Code or Gemini). 

*See `.planning/codebase/ARCHITECTURE.md` for full component layering logic.*

## 📬 Contact

- **Website:** [devansh.qzz.io](https://devansh.qzz.io)
- **LinkedIn:** [Devansh Kumar](https://www.linkedin.com/in/devansh-kumar-3b3701217/)
- **GitHub:** [@devantaris](https://github.com/devantaris)
