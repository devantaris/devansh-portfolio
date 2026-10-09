# Devansh Kumar — Portfolio v2026.D

A multi-mode interactive portfolio. Not just a site — a system with distinct entry points depending on who you are.

## 🚪 Entry Points

| Route | Description |
|---|---|
| `/` | Terminal identity gate — *"who are you?"* |
| `/blueprint.html` | Blueprint v2 — full engineering portfolio (systems drawing aesthetic) |
| `/universe` | WebGL navigable star system — projects as planets |
| `/stderr` | Post-apocalyptic terminal game |
| `/projects` | Classic projects index |

The root (`/`) opens a terminal-style landing that asks visitors to identify themselves — **Recruiter**, **Explorer**, or **Friend** — then routes them to the appropriate experience with keyboard nav (`[1][2][3]`, arrow keys, Enter, Esc).

## ✨ Features

- **Blueprint v2** (`public/blueprint.html`): Single-file animated engineering portfolio. GSAP entry animations, isometric block diagram with live packet routing, uncertainty waveform SVG, dark/light theme toggle, cursor trail, count-up stat counters, 6 sheets of content.
- **Terminal Landing** (`public/landing.html`): Animated typewriter boot sequence, three visitor paths with secondary sub-options and spinner routing transitions.
- **Hardware-Accelerated WebGL Backgrounds:** Optimized `StarfieldBackground` with Three.js buffer geometries and custom shader materials.
- **GSAP & Framer Motion Integration:** Zero-latency scroll animations.
- **Mobile-First Hardware Tiering:** Graceful degradation on mobile to maintain 60 FPS.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **Library:** React 19 & TypeScript 5+
- **Styling:** Tailwind CSS v4 + Blueprint grid (DM Mono + Archivo)
- **3D & Canvas:** Three.js, React-Three-Fiber
- **Animation:** GSAP 3, Framer Motion
- **Blueprint Engine:** Vanilla JS + SVG + CSS custom properties

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land at the terminal identity gate.

## 📬 Contact

- **Email:** [work.devanshkumar@gmail.com](mailto:work.devanshkumar@gmail.com)
- **LinkedIn:** [Devansh Kumar](https://www.linkedin.com/in/devansh-kumar-3b3701217/)
- **GitHub:** [@devantaris](https://github.com/devantaris)
- **Scholar:** [Google Scholar](https://scholar.google.com/citations?user=K6k6CfcAAAAJ)
