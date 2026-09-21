import { Project } from '@/lib/content';

/**
 * Creates an offscreen HTML5 canvas initialized with the project HUD dimensions (38:22 ratio).
 */
export function createProjectHudCanvas(width = 1520, height = 880): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

/**
 * Safe rounded rectangle helper with fallback.
 */
function drawRoundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    fill = true,
    stroke = false
) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, radius);
    } else {
        ctx.rect(x, y, w, h);
    }
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

/**
 * Primary project HUD dispatcher onto a 2D canvas context.
 * Renders cosmic-luxury, editorial-grade architecture diagrams for each project.
 */
export function renderProjectHud(
    ctx: CanvasRenderingContext2D,
    project: Project,
    width: number,
    height: number,
    time = 0
): void {
    const color = project.color || '#00e5ff';

    // 1. Deep Space Obsidian Background
    ctx.fillStyle = '#030307';
    ctx.fillRect(0, 0, width, height);

    // 2. Soft Ambient Radial Illumination
    const bgGlow = ctx.createRadialGradient(width * 0.5, height * 0.45, 20, width * 0.5, height * 0.45, width * 0.65);
    bgGlow.addColorStop(0, `${color}12`);
    bgGlow.addColorStop(0.5, `${color}04`);
    bgGlow.addColorStop(1, 'rgba(3, 3, 7, 0)');
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Subtle Atmospheric Dot Matrix (clean luxury grid, not harsh scanlines)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    const dotSpacing = 44;
    for (let x = 32; x < width - 32; x += dotSpacing) {
        for (let y = 32; y < height - 32; y += dotSpacing) {
            ctx.fillRect(x, y, 1.5, 1.5);
        }
    }

    // 4. Outer Glassmorphic Border with Editorial Corner Accents
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    drawRoundRect(ctx, 8, 8, width - 16, height - 16, 12, false, true);

    // Subtle corner brackets
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const bLen = 14;
    // Top-left
    ctx.beginPath(); ctx.moveTo(8, 8 + bLen); ctx.lineTo(8, 8); ctx.lineTo(8 + bLen, 8); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(width - 8 - bLen, 8); ctx.lineTo(width - 8, 8); ctx.lineTo(width - 8, 8 + bLen); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(8, height - 8 - bLen); ctx.lineTo(8, height - 8); ctx.lineTo(8 + bLen, height - 8); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(width - 8 - bLen, height - 8); ctx.lineTo(width - 8, height - 8); ctx.lineTo(width - 8, height - 8 - bLen); ctx.stroke();

    // 5. Luxury Architectural Window Header Bar
    const headerH = 64;
    ctx.fillStyle = 'rgba(10, 10, 18, 0.7)';
    ctx.fillRect(9, 9, width - 18, headerH);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(9, headerH + 9);
    ctx.lineTo(width - 9, headerH + 9);
    ctx.stroke();

    // Three subtle celestial pips
    const pipY = headerH / 2 + 9;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(36 + i * 16, pipY, 3, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? color : 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
    }

    // Editorial Project Title & Discipline Tag
    ctx.font = '300 18px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(project.name, 98, pipY + 6);

    ctx.font = '400 11px "Space Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText(`—  ${project.impact}`, 98 + ctx.measureText(project.name).width + 16, pipY + 5);

    // Right-aligned Luxury Status Pills
    const pillX = width - 360;
    ctx.fillStyle = `${color}15`;
    ctx.strokeStyle = `${color}40`;
    drawRoundRect(ctx, pillX, pipY - 14, 130, 28, 14, true, true);
    ctx.font = '600 10.5px "Space Mono", monospace';
    ctx.fillStyle = color;
    ctx.fillText('LIVE ARCHITECTURE', pillX + 14, pipY + 4);

    const techPillX = width - 215;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundRect(ctx, techPillX, pipY - 14, 180, 28, 14, true, true);
    ctx.font = '400 10.5px "Space Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`${project.tech[0]} · ${project.tech[1] || 'Engine'}`, techPillX + 16, pipY + 4);

    // 6. Project Visual Canvas Router
    const contentY = headerH + 20;
    const contentW = width - 40;
    const contentH = height - contentY - 20;
    const startX = 20;

    ctx.save();
    switch (project.id) {
        case 'mari':
            renderMariVisual(ctx, startX, contentY, contentW, contentH, color, time);
            break;
        case 'edusupervision':
            renderEduSupervisionDashboard(ctx, startX, contentY, contentW, contentH, color, time);
            break;
        case 'cryptoflow':
            renderCryptoFlowPipeline(ctx, startX, contentY, contentW, contentH, color, time);
            break;
        case 'satyalabel':
            renderSatyaLabelMobileAndMap(ctx, startX, contentY, contentW, contentH, color, time);
            break;
        default:
            renderGenericProjectVisual(ctx, project, startX, contentY, contentW, contentH, color, time);
            break;
    }
    ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MARI — Staged Uncertainty-Aware Decisioning Pipeline
// ─────────────────────────────────────────────────────────────────────────────
function renderMariVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    time: number
) {
    // Top Banner
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('STAGED UNCERTAINTY-AWARE DECISION ENGINE  ·  284,192 TRANSACTIONS EVALUATED', x + 12, y + 18);

    // 5 Luxury Metric Cards
    const metrics = [
        { label: 'DECLINE PRECISION', val: '100.0%', sub: 'Zero false blocks', accent: color },
        { label: 'FRAUD RECALL', val: '86.73%', sub: 'True positive rate', accent: '#ffffff' },
        { label: 'MANUAL QUEUE', val: '0 Pending', sub: '100% automated deferral', accent: '#a0ff60' },
        { label: 'INFERENCE LATENCY', val: '<100ms', sub: 'FastAPI async pipeline', accent: '#ffffff' },
        { label: 'EPISTEMIC RESOLUTION', val: '99.2%', sub: 'Dempster-Shafer fusion', accent: color },
    ];
    const mCardW = (w - 32) / metrics.length;
    metrics.forEach((m, i) => {
        const mx = x + 4 + i * (mCardW + 6);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        drawRoundRect(ctx, mx, y + 32, mCardW, 58, 6, true, true);

        ctx.font = '500 9.5px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillText(m.label, mx + 12, y + 49);

        ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = m.accent;
        ctx.fillText(m.val, mx + 12, y + 71);

        ctx.font = '400 9.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillText(m.sub, mx + 12, y + 84);
    });

    // 4 Architecture Stage Cards
    const stageY = y + 106;
    const stageH = h - 230;
    const stages = [
        {
            num: '01',
            title: 'XGBoost Novelty Router',
            desc: 'Isolation Forest boundary check',
            stat: 'Abstention: 8.9%',
        },
        {
            num: '02',
            title: 'Calibrated SVM Resolver',
            desc: 'Isotonic regression probability',
            stat: 'Brier Score: -74.4%',
        },
        {
            num: '03',
            title: 'Dempster-Shafer Fusion',
            desc: '3-Source belief mass synthesis',
            stat: 'Ignorance: <5%',
        },
        {
            num: '04',
            title: 'SHAP Attribution Engine',
            desc: 'Explainable reason code tree',
            stat: 'Queue: 0 Deferral',
        },
    ];

    const cardW = (w - 72) / 4;
    stages.forEach((st, i) => {
        const cx = x + 4 + i * (cardW + 22);

        // Glass Card Body
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        drawRoundRect(ctx, cx, stageY, cardW, stageH, 8, true, true);

        // Card Header
        ctx.fillStyle = `${color}12`;
        drawRoundRect(ctx, cx + 1, stageY + 1, cardW - 2, 42, 7, true, false);

        ctx.font = '700 11px "Space Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(st.num, cx + 14, stageY + 26);

        ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(st.title, cx + 38, stageY + 26);

        ctx.font = '400 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.fillText(st.desc, cx + 14, stageY + 64);

        // Metric Pill inside card
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        drawRoundRect(ctx, cx + 14, stageY + 76, cardW - 28, 28, 4, true, false);
        ctx.font = '500 10.5px "Space Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(st.stat, cx + 22, stageY + 94);

        // Elegant Dynamic Vector Artworks for each stage
        const artY = stageY + 120;
        const artH = stageH - 134;

        if (i === 0) {
            // Stage 1: Smooth Decision Contour Map
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            drawRoundRect(ctx, cx + 14, artY, cardW - 28, artH, 6, true, false);

            // Flowing probability curves
            for (let c = 0; c < 3; c++) {
                ctx.beginPath();
                ctx.strokeStyle = `${color}${c === 0 ? '50' : '20'}`;
                ctx.lineWidth = 1.5;
                for (let px = 0; px < cardW - 28; px += 4) {
                    const py = artY + 30 + c * 40 + Math.sin((px * 0.04) + time + c) * 16;
                    if (px === 0) ctx.moveTo(cx + 14 + px, py);
                    else ctx.lineTo(cx + 14 + px, py);
                }
                ctx.stroke();
            }

            // Scatter points
            for (let p = 0; p < 16; p++) {
                const px = cx + 22 + ((p * 43) % (cardW - 44));
                const py = artY + 20 + ((p * 37) % (artH - 40));
                const isOutlier = p === 7 || p === 13;
                ctx.fillStyle = isOutlier ? '#ff5577' : color;
                ctx.beginPath();
                ctx.arc(px, py, isOutlier ? 3 : 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (i === 1) {
            // Stage 2: Smooth Isotonic Probability S-Curve
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            drawRoundRect(ctx, cx + 14, artY, cardW - 28, artH, 6, true, false);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            const curveW = cardW - 28;
            for (let px = 0; px <= curveW; px++) {
                const normX = px / curveW;
                // Logistic sigmoid shape
                const normY = 1 / (1 + Math.exp(-(normX - 0.5) * 8));
                const py = artY + artH - 24 - normY * (artH - 48);
                if (px === 0) ctx.moveTo(cx + 14 + px, py);
                else ctx.lineTo(cx + 14 + px, py);
            }
            ctx.stroke();

            // Calibration Confidence Interval Ribbon
            ctx.fillStyle = `${color}18`;
            ctx.beginPath();
            for (let px = 0; px <= curveW; px++) {
                const normX = px / curveW;
                const normY = 1 / (1 + Math.exp(-(normX - 0.5) * 8));
                const py = artY + artH - 24 - normY * (artH - 48);
                if (px === 0) ctx.moveTo(cx + 14 + px, py - 12);
                else ctx.lineTo(cx + 14 + px, py - 12);
            }
            for (let px = curveW; px >= 0; px--) {
                const normX = px / curveW;
                const normY = 1 / (1 + Math.exp(-(normX - 0.5) * 8));
                const py = artY + artH - 24 - normY * (artH - 48);
                ctx.lineTo(cx + 14 + px, py + 12);
            }
            ctx.closePath();
            ctx.fill();
        } else if (i === 2) {
            // Stage 3: Belief Mass Distribution Meters
            const bpa = [
                { name: 'Belief (Fraud Mass)', val: 0.86, c: '#ff5577' },
                { name: 'Plausibility Bound', val: 0.94, c: color },
                { name: 'Epistemic Uncertainty', val: 0.08, c: '#ffaa00' },
            ];
            bpa.forEach((bp, bi) => {
                const by = artY + 16 + bi * 52;
                ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fillText(bp.name, cx + 16, by);

                ctx.font = '600 11px "Space Mono", monospace';
                ctx.fillStyle = bp.c;
                ctx.fillText(`${(bp.val * 100).toFixed(0)}%`, cx + cardW - 55, by);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
                drawRoundRect(ctx, cx + 16, by + 8, cardW - 32, 12, 6, true, false);

                ctx.fillStyle = bp.c;
                drawRoundRect(ctx, cx + 16, by + 8, (cardW - 32) * bp.val, 12, 6, true, false);
            });
        } else if (i === 3) {
            // Stage 4: SHAP Waterfall Attribution Bars
            const shaps = [
                { feat: 'Velocity Spike (1h)', val: '+0.42', pos: true },
                { feat: 'Geographic Jump', val: '+0.31', pos: true },
                { feat: 'Device Fingerprint', val: '-0.38', pos: false },
                { feat: 'Repayment Credibility', val: '-0.24', pos: false },
            ];
            shaps.forEach((sh, si) => {
                const sy = artY + 12 + si * 40;
                ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                ctx.fillText(sh.feat, cx + 16, sy + 14);

                const barX = cx + cardW - 90;
                ctx.fillStyle = sh.pos ? '#ff5577' : color;
                drawRoundRect(ctx, barX, sy + 4, Math.abs(parseFloat(sh.val)) * 80, 14, 3, true, false);

                ctx.font = '600 10.5px "Space Mono", monospace';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(sh.val, barX + 6, sy + 16);
            });
        }

        // Elegant flowing Bézier connector to next stage
        if (i < stages.length - 1) {
            const startX = cx + cardW;
            const endX = cx + cardW + 22;
            const midY = stageY + stageH * 0.45;

            ctx.strokeStyle = `${color}40`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(startX, midY);
            ctx.lineTo(endX, midY);
            ctx.stroke();

            // Smooth pulsing energy particle
            const prog = (time * 0.8 + i * 0.25) % 1;
            const partX = startX + prog * (endX - startX);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(partX, midY, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Bottom Editorial Audit Summary (clean luxury dossier)
    const auditY = stageY + stageH + 14;
    const auditH = h - (auditY - y);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundRect(ctx, x + 4, auditY, w - 8, auditH, 8, true, true);

    ctx.font = '600 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = color;
    ctx.fillText('ACTIVE INFERENCE DECISION AUDIT  ·  SUB-100MS EVALUATION LOG', x + 20, auditY + 22);

    const auditRows = [
        { id: 'TXN-90281', flow: 'Novelty Cleared → Isotonic SVM Calibrated → Accepted', lat: '42ms', status: 'ACCEPTED' },
        { id: 'TXN-90282', flow: 'Epistemic Uncertainty → Dempster-Shafer 3-Source Fusion → Resolved', lat: '64ms', status: 'VERIFIED' },
        { id: 'TXN-90283', flow: 'Velocity Anomaly → SHAP Reason Codes Attributed → Zero False Declines', lat: '88ms', status: 'ISOLATED' },
    ];
    auditRows.forEach((row, ri) => {
        const ry = auditY + 46 + ri * 24;
        ctx.font = '500 11px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillText(row.id, x + 20, ry);

        ctx.font = '400 11.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(row.flow, x + 120, ry);

        ctx.font = '500 10.5px "Space Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(row.lat, x + w - 160, ry);

        ctx.fillStyle = row.status === 'ISOLATED' ? '#ff5577' : '#a0ff60';
        ctx.fillText(row.status, x + w - 80, ry);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EduSupervision — Modern AI Institutional Evaluation Platform
// ─────────────────────────────────────────────────────────────────────────────
function renderEduSupervisionDashboard(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    time: number
) {
    // Top Row: 4 Metric Cards
    const widgets = [
        { label: 'MONITORED EDUCATORS', val: '1,420', sub: '+14% active institutional cohort' },
        { label: 'AI-EVALUATED SESSIONS', val: '8,840', sub: '99.4% automated rubric grading' },
        { label: 'SEMANTIC RELEVANCE', val: '0.942', sub: 'pgvector cosine embedding match' },
        { label: 'ASYNC CELERY WORKERS', val: 'Active', sub: 'Redis task broker healthy' },
    ];
    const wW = (w - 30) / 4;
    widgets.forEach((wg, i) => {
        const wx = x + 4 + i * (wW + 10);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        drawRoundRect(ctx, wx, y + 4, wW, 68, 8, true, true);

        ctx.font = '500 10px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillText(wg.label, wx + 16, y + 24);

        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = i === 2 ? color : '#ffffff';
        ctx.fillText(wg.val, wx + 16, y + 49);

        ctx.font = '400 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = color;
        ctx.fillText(wg.sub, wx + 16, y + 64);
    });

    // Main 2-Column Dashboard Split
    const mainY = y + 84;
    const mainH = h - 94;
    const colW = (w - 20) / 2;

    // LEFT CARD: High-Dimensional pgvector Constellation Space
    const leftX = x + 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundRect(ctx, leftX, mainY, colW, mainH, 8, true, true);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('High-Dimensional Semantic Retrieval (pgvector 1536-dim)', leftX + 20, mainY + 28);

    // Simulated Cosine Search Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.strokeStyle = `${color}35`;
    drawRoundRect(ctx, leftX + 20, mainY + 42, colW - 40, 36, 6, true, true);
    ctx.font = '400 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText('🔍  "Inquiry-based STEM lesson plan rubric compliance & formative check"', leftX + 34, mainY + 65);

    // Vector Constellation Visualization Canvas
    const constY = mainY + 90;
    const constH = mainH - 240;
    ctx.fillStyle = '#020205';
    drawRoundRect(ctx, leftX + 20, constY, colW - 40, constH, 6, true, false);

    // Render nodes & connections
    const nodes = [
        { x: 0.25, y: 0.35, cluster: 0 }, { x: 0.32, y: 0.28, cluster: 0 }, { x: 0.28, y: 0.45, cluster: 0 },
        { x: 0.65, y: 0.40, cluster: 1 }, { x: 0.72, y: 0.48, cluster: 1 }, { x: 0.68, y: 0.32, cluster: 1 },
        { x: 0.48, y: 0.75, cluster: 2 }, { x: 0.55, y: 0.80, cluster: 2 }, { x: 0.42, y: 0.70, cluster: 2 },
    ];
    // Force lines
    ctx.strokeStyle = `${color}25`;
    ctx.lineWidth = 1;
    nodes.forEach((n1, i) => {
        nodes.forEach((n2, j) => {
            if (i < j && n1.cluster === n2.cluster) {
                const nx1 = leftX + 20 + (colW - 40) * n1.x;
                const ny1 = constY + constH * n1.y;
                const nx2 = leftX + 20 + (colW - 40) * n2.x;
                const ny2 = constY + constH * n2.y;
                ctx.beginPath();
                ctx.moveTo(nx1, ny1);
                ctx.lineTo(nx2, ny2);
                ctx.stroke();
            }
        });
    });
    // Node dots
    nodes.forEach((n, i) => {
        const nx = leftX + 20 + (colW - 40) * n.x;
        const ny = constY + constH * n.y;
        ctx.fillStyle = i === 1 ? '#ffffff' : color;
        ctx.beginPath();
        ctx.arc(nx, ny, i === 1 ? 5 : 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Matches Dossier below constellation
    const matchY = constY + constH + 16;
    const matches = [
        { title: 'Classroom_Observation_Sec4.pdf', score: '98.2%', tag: 'AUTHENTIC' },
        { title: 'LessonPlan_Physics_Thermodynamics.docx', score: '94.6%', tag: 'VALIDATED' },
        { title: 'Curriculum_Standard_Alignment_v2.pdf', score: '91.8%', tag: 'COMPLIANT' },
    ];
    matches.forEach((m, mi) => {
        const my = matchY + mi * 38;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        drawRoundRect(ctx, leftX + 20, my, colW - 40, 32, 4, true, true);

        ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(m.title, leftX + 32, my + 20);

        ctx.font = '600 11px "Space Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(m.score, leftX + colW - 90, my + 20);
    });

    // RIGHT CARD: Teacher Competency 5-Axis Radar Chart & Worker Telemetry
    const rightX = leftX + colW + 12;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundRect(ctx, rightX, mainY, colW, mainH, 8, true, true);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Institutional Competency Polygon & Async Pipeline', rightX + 20, mainY + 28);

    // Beautiful 5-Axis Radar Chart
    const rCX = rightX + colW * 0.5;
    const rCY = mainY + 160;
    const rRadius = 90;
    const axes = ['Curriculum', 'Pedagogy', 'Formative Check', 'Inclusivity', 'Engagement'];
    const values = [0.92, 0.88, 0.95, 0.84, 0.90];

    // Concentric Web
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    [0.33, 0.66, 1.0].forEach((scale) => {
        ctx.beginPath();
        axes.forEach((_, ai) => {
            const angle = (Math.PI * 2 / 5) * ai - Math.PI / 2;
            const px = rCX + Math.cos(angle) * rRadius * scale;
            const py = rCY + Math.sin(angle) * rRadius * scale;
            if (ai === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();
    });

    // Radar Axis Lines
    axes.forEach((label, ai) => {
        const angle = (Math.PI * 2 / 5) * ai - Math.PI / 2;
        const px = rCX + Math.cos(angle) * rRadius;
        const py = rCY + Math.sin(angle) * rRadius;
        ctx.beginPath();
        ctx.moveTo(rCX, rCY);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        const lx = rCX + Math.cos(angle) * (rRadius + 18);
        const ly = rCY + Math.sin(angle) * (rRadius + 14);
        ctx.fillText(label, lx - 24, ly);
    });

    // Radar Data Polygon Fill
    ctx.fillStyle = `${color}28`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    axes.forEach((_, ai) => {
        const angle = (Math.PI * 2 / 5) * ai - Math.PI / 2;
        const dist = rRadius * values[ai];
        const px = rCX + Math.cos(angle) * dist;
        const py = rCY + Math.sin(angle) * dist;
        if (ai === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Async Worker Pool Telemetry below radar
    const workerY = mainY + 285;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    drawRoundRect(ctx, rightX + 20, workerY, colW - 40, mainH - 305, 6, true, true);

    ctx.font = '600 11.5px "Space Mono", monospace';
    ctx.fillStyle = color;
    ctx.fillText('ASYNC CELERY POOL & REDIS BROKER:', rightX + 32, workerY + 24);

    const workers = [
        'Worker 01: OCR Classroom Ingest — 94 docs/min (Active)',
        'Worker 02: pgvector Embedding Matrix Batch — 0 Backlog',
        'Worker 03: Automated Rubric Scorecard Generator — Operational',
        'PgBouncer: 32/50 Connections (PostgreSQL 16 Enterprise)',
    ];
    workers.forEach((wMsg, wi) => {
        ctx.font = '400 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`●  ${wMsg}`, rightX + 32, workerY + 50 + wi * 22);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CryptoFlow — Multimodal Medical Cryptographic Pipeline
// ─────────────────────────────────────────────────────────────────────────────
function renderCryptoFlowPipeline(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    time: number
) {
    // Title
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('END-TO-END MULTIMODAL MEDICAL ENCRYPTION PIPELINE (124.8 MB/s · <0.1% SERIALIZATION OVERHEAD)', x + 12, y + 18);

    // 5 Architectural Stages
    const pipeY = y + 36;
    const pipeH = h - 170;
    const stages = [
        { title: '01. DICOM Ingest', type: 'High-Res CT Stream', detail: '16-bit Grayscale Axial' },
        { title: '02. Zero-Copy Chunk', type: 'Binary Serialization', detail: '<0.1% overhead container' },
        { title: '03. AES-256-GCM', type: 'Hardware Core', detail: '124.8 MB/s throughput' },
        { title: '04. Cross-Modal HMAC', type: 'Anti-Splicing SHA-256', detail: 'Patient identity locked' },
        { title: '05. RSA-OAEP Key Wrap', type: 'Transit Envelope', detail: 'Zero-trust verified' },
    ];

    const colW = (w - 80) / 5;
    stages.forEach((st, i) => {
        const sx = x + 4 + i * (colW + 18);

        // Stage Card
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        drawRoundRect(ctx, sx, pipeY, colW, pipeH, 8, true, true);

        // Header
        ctx.fillStyle = `${color}14`;
        drawRoundRect(ctx, sx + 1, pipeY + 1, colW - 2, 40, 7, true, false);

        ctx.font = '600 12px "Space Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(st.title, sx + 12, pipeY + 25);

        ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(st.type, sx + 12, pipeY + 60);

        ctx.font = '400 10.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(st.detail, sx + 12, pipeY + 78);

        // Graphical Visuals inside each stage
        const artY = pipeY + 98;
        const artH = pipeH - 114;

        if (i === 0) {
            // Stage 1: Clean Medical DICOM Scan Viewport
            ctx.fillStyle = '#020205';
            drawRoundRect(ctx, sx + 10, artY, colW - 20, artH, 6, true, false);

            const cX = sx + colW * 0.5;
            const cY = artY + artH * 0.48;

            // Concentric anatomical contours
            ctx.strokeStyle = `${color}40`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cX, cY, 44, 0, Math.PI * 2);
            ctx.arc(cX, cY, 30, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.beginPath();
            ctx.ellipse(cX, cY, 32, 38, 0, 0, Math.PI * 2);
            ctx.fill();

            // Crosshair
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cX - 48, cY); ctx.lineTo(cX + 48, cY);
            ctx.moveTo(cX, cY - 48); ctx.lineTo(cX, cY + 48);
            ctx.stroke();

            ctx.font = '500 10px "Space Mono", monospace';
            ctx.fillStyle = color;
            ctx.fillText('SLICE #048 // AXIAL CT', sx + 16, artY + artH - 14);
        } else if (i === 1) {
            // Stage 2: Memory Chunks Layout
            for (let b = 0; b < 5; b++) {
                const by = artY + 12 + b * 42;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
                ctx.strokeStyle = `${color}30`;
                drawRoundRect(ctx, sx + 10, by, colW - 20, 32, 4, true, true);

                ctx.font = '500 10px "Space Mono", monospace';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`BLOCK_0${b + 1} · 64KB`, sx + 20, by + 20);
            }
        } else if (i === 2) {
            // Stage 3: AES-256 Core Chip & Cipher Stream
            ctx.fillStyle = '#020205';
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            drawRoundRect(ctx, sx + 10, artY + 10, colW - 20, 68, 6, true, true);

            ctx.font = '700 14px "Space Mono", monospace';
            ctx.fillStyle = color;
            ctx.fillText('AES-256-GCM', sx + 20, artY + 38);

            ctx.font = '500 10.5px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('124.8 MB/s Live Rate', sx + 20, artY + 60);

            // Ciphertext hex stream
            const hexes = ['8F 4A 2B 9C D1', '3A E0 71 5F 8B', '2E 99 CC 14 EA'];
            hexes.forEach((hx, hi) => {
                ctx.font = '400 10px "Space Mono", monospace';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.fillText(hx, sx + 20, artY + 110 + hi * 26);
            });
        } else if (i === 3) {
            // Stage 4: Anti-Splicing HMAC Lock
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            drawRoundRect(ctx, sx + 10, artY + 10, colW - 20, 80, 6, true, true);

            ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = color;
            ctx.fillText('ANTI-SPLICING LOCK', sx + 18, artY + 38);

            ctx.font = '400 10.5px "Space Mono", monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('HMAC_SHA256 (DICOM ⋈ EHR)', sx + 18, artY + 60);

            ctx.fillStyle = '#a0ff60';
            ctx.fillText('✓ ZERO INTEGRITY BREACH', sx + 18, artY + 120);
        } else if (i === 4) {
            // Stage 5: Asymmetric Envelope
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            drawRoundRect(ctx, sx + 10, artY + 10, colW - 20, 80, 6, true, true);

            ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = color;
            ctx.fillText('RSA-OAEP 2048 ENVELOPE', sx + 18, artY + 38);

            ctx.font = '400 10.5px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText('Zero-Trust Gateway Ready', sx + 18, artY + 60);
            ctx.fillText('Peer-to-Peer Verified', sx + 18, artY + 120);
        }

        // Connecting flow pipe
        if (i < stages.length - 1) {
            const cX1 = sx + colW;
            const cX2 = sx + colW + 18;
            const cY = pipeY + pipeH * 0.45;

            ctx.strokeStyle = `${color}40`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cX1, cY);
            ctx.lineTo(cX2, cY);
            ctx.stroke();

            const pProg = (time * 0.9 + i * 0.2) % 1;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cX1 + pProg * (cX2 - cX1), cY, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Bottom Performance Metrics
    const bottomY = pipeY + pipeH + 16;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundRect(ctx, x + 4, bottomY, w - 8, h - (bottomY - y), 8, true, true);

    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = color;
    ctx.fillText('CRYPTOGRAPHIC GUARANTEES & BENCHMARKS:', x + 20, bottomY + 24);

    const benches = [
        'AES-NI Vector Acceleration Active  ·  Zero Memory Reallocation',
        'Cross-Modal Verification: Splicing / swap attacks mathematically impossible',
        'End-to-End Latency: <1.4ms per 64KB multi-slice payload',
    ];
    benches.forEach((bn, bi) => {
        ctx.font = '400 11.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillText(`—  ${bn}`, x + 20, bottomY + 50 + bi * 22);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SatyaLabel — Smartphone Mobile Client & PostGIS Spatial Heatmap
// ─────────────────────────────────────────────────────────────────────────────
function renderSatyaLabelMobileAndMap(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    time: number
) {
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('SATYALABEL AI  ·  FLUTTER MOBILE INSPECTOR  &  POSTGIS GEOSPATIAL AUDIT HEATMAP', x + 12, y + 18);

    // ── LEFT COLUMN: Premium Smartphone Device Frame ──
    const phoneW = 320;
    const phoneH = h - 40;
    const phoneX = x + 16;
    const phoneY = y + 32;

    // Phone Outer Chassis (Curved Titanium Bezel)
    ctx.fillStyle = '#101016';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2.5;
    drawRoundRect(ctx, phoneX, phoneY, phoneW, phoneH, 30, true, true);

    // Screen Glass
    const scX = phoneX + 10;
    const scY = phoneY + 10;
    const scW = phoneW - 20;
    const scH = phoneH - 20;
    ctx.fillStyle = '#050509';
    drawRoundRect(ctx, scX, scY, scW, scH, 22, true, false);

    // Notch
    ctx.fillStyle = '#000000';
    drawRoundRect(ctx, scX + (scW - 80) / 2, scY + 6, 80, 16, 8, true, false);

    // Mobile App Header
    ctx.font = '600 12.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SatyaLabel Mobile', scX + 16, scY + 44);

    ctx.font = '500 10px "Space Mono", monospace';
    ctx.fillStyle = color;
    ctx.fillText('OCR ACTIVE', scX + scW - 85, scY + 44);

    // Camera Viewfinder Box
    const camY = scY + 54;
    const camH = scH - 180;
    ctx.fillStyle = '#0a0a14';
    ctx.strokeStyle = `${color}35`;
    drawRoundRect(ctx, scX + 8, camY, scW - 16, camH, 8, true, true);

    // OCR Bounding Boxes on Product Package
    const ocrBoxes = [
        { label: 'NET QTY: 500g', conf: '99.4%', y: camY + 28 },
        { label: 'MRP: ₹149.00 INCL TAX', conf: '98.8%', y: camY + 70 },
        { label: 'MFG DATE: 08/2026', conf: '99.1%', y: camY + 112 },
        { label: 'FSSAI LIC: 10014011002231', conf: '99.9%', y: camY + 154 },
    ];

    ocrBoxes.forEach((bx) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        drawRoundRect(ctx, scX + 16, bx.y, scW - 32, 32, 4, true, true);

        ctx.font = '600 10px "Space Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(bx.label, scX + 24, bx.y + 16);

        ctx.font = '500 9px "Space Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(`✓ PASS (${bx.conf})`, scX + 24, bx.y + 27);
    });

    // Smooth laser scan bar
    const laserFraction = (Math.sin(time * 2.2) + 1) / 2;
    const laserY = camY + 12 + laserFraction * (camH - 24);
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scX + 12, laserY);
    ctx.lineTo(scX + scW - 12, laserY);
    ctx.stroke();

    // Compliance Verdict Toast
    const toastY = camY + camH + 12;
    ctx.fillStyle = 'rgba(160, 255, 96, 0.12)';
    ctx.strokeStyle = '#a0ff60';
    drawRoundRect(ctx, scX + 8, toastY, scW - 16, 40, 6, true, true);
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#a0ff60';
    ctx.fillText('LEGAL VERDICT: 100% COMPLIANT', scX + 18, toastY + 18);
    ctx.font = '400 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Legal Metrology Act §6(1) Verified', scX + 18, toastY + 32);

    // ── RIGHT COLUMN: Dark Luxury PostGIS Spatial Heatmap ──
    const mapX = phoneX + phoneW + 28;
    const mapW = w - (mapX - x) - 10;
    const mapY = y + 32;
    const mapH = h - 40;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundRect(ctx, mapX, mapY, mapW, mapH, 8, true, true);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('PostGIS Spatial Geodatabase Compliance Heatmap', mapX + 20, mapY + 28);

    // Simulated Map Area
    const mapCanvasY = mapY + 44;
    const mapCanvasH = mapH - 140;
    ctx.fillStyle = '#030308';
    drawRoundRect(ctx, mapX + 12, mapCanvasY, mapW - 24, mapCanvasH, 6, true, false);

    // Subtle lat/long coordinate grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    for (let lx = mapX + 12; lx < mapX + mapW - 12; lx += 70) {
        ctx.beginPath(); ctx.moveTo(lx, mapCanvasY); ctx.lineTo(lx, mapCanvasY + mapCanvasH); ctx.stroke();
    }
    for (let ly = mapCanvasY; ly < mapCanvasY + mapCanvasH; ly += 60) {
        ctx.beginPath(); ctx.moveTo(mapX + 12, ly); ctx.lineTo(mapX + mapW - 12, ly); ctx.stroke();
    }

    // Glowing Spatial Inspection Clusters
    const hotspots = [
        { name: 'Northern Commercial Hub (Delhi NCR)', xR: 0.35, yR: 0.32, r: 75, scans: '412 audited' },
        { name: 'Western Trade Center (Mumbai)', xR: 0.28, yR: 0.65, r: 85, scans: '584 audited' },
        { name: 'Southern Tech Hub (Bengaluru)', xR: 0.52, yR: 0.78, r: 68, scans: '320 audited' },
        { name: 'Eastern Distribution (Kolkata)', xR: 0.76, yR: 0.45, r: 70, scans: '290 audited' },
    ];

    hotspots.forEach((hs) => {
        const hx = mapX + 12 + (mapW - 24) * hs.xR;
        const hy = mapCanvasY + mapCanvasH * hs.yR;

        const grad = ctx.createRadialGradient(hx, hy, 4, hx, hy, hs.r);
        grad.addColorStop(0, `${color}60`);
        grad.addColorStop(0.5, 'rgba(160, 255, 96, 0.25)');
        grad.addColorStop(1, 'rgba(160, 255, 96, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(hx, hy, hs.r, 0, Math.PI * 2);
        ctx.fill();

        // Pin
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(hs.name, hx + 10, hy - 4);

        ctx.font = '400 10px "Space Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(hs.scans, hx + 10, hy + 12);
    });

    // Map Telemetry Footer
    const mapFootY = mapCanvasY + mapCanvasH + 16;
    ctx.font = '500 11px "Space Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('POSTGIS ST_DWITHIN SPATIAL QUERY: 12ms  ·  GEOMETRY TYPE: MULTIPOLYGON (EPSG:4326)', mapX + 16, mapFootY + 16);
    ctx.fillText('SYNCHRONIZATION: 100% OFF-LINE RESILIENT SQLITE CACHE WITH AUTO-RECONCILIATION', mapX + 16, mapFootY + 36);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Generic Project Visual (Fallback for future projects)
// ─────────────────────────────────────────────────────────────────────────────
function renderGenericProjectVisual(
    ctx: CanvasRenderingContext2D,
    project: Project,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    time: number
) {
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText(`${project.name.toUpperCase()}  ·  SYSTEM ARCHITECTURE BLUEPRINT`, x + 12, y + 18);

    // 3 Metric Cards
    const mCardW = (w - 24) / 3;
    project.specs.slice(0, 3).forEach((spec, i) => {
        const mx = x + 4 + i * (mCardW + 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        drawRoundRect(ctx, mx, y + 36, mCardW, 74, 8, true, true);

        ctx.font = '600 11px "Space Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(`SPECIFICATION 0${i + 1}`, mx + 16, y + 56);

        ctx.font = '400 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(spec.slice(0, 48) + '…', mx + 16, y + 80);
    });

    // Central Blueprint Area
    const bpY = y + 126;
    const bpH = h - 136;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundRect(ctx, x + 4, bpY, w - 8, bpH, 8, true, true);

    const cX = x + w * 0.5;
    const cY = bpY + bpH * 0.5;

    // Glowing orbital rings
    for (let r = 0; r < 3; r++) {
        ctx.strokeStyle = `${color}${r === 0 ? '40' : '15'}`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cX, cY, 60 + r * 50, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.font = '300 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(project.name, cX, cY - 8);

    ctx.font = '400 12px "Space Mono", monospace';
    ctx.fillStyle = color;
    ctx.fillText(project.impact, cX, cY + 22);
    ctx.textAlign = 'left';
}
