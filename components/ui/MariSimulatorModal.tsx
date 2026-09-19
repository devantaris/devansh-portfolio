'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface MariSimulatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MariSimulatorModal({ isOpen, onClose }: MariSimulatorModalProps) {
    const [amount, setAmount] = useState<number>(450);
    const [velocity, setVelocity] = useState<number>(12);
    const [entropy, setEntropy] = useState<number>(0.35);
    const [anomaly, setAnomaly] = useState<number>(1.8);

    // Compute decision based on the MARI framework logic
    const evaluation = useMemo(() => {
        // Feature risk calculation
        const baseRisk = (amount / 3000) * 0.35 + (velocity / 40) * 0.25 + entropy * 0.25 + (anomaly / 5) * 0.15;
        const normalizedRisk = Math.min(Math.max(baseRisk, 0.02), 0.99);

        // Stage 1: XGBoost Fast Router
        const v1Confidence = Math.abs(normalizedRisk - 0.5) * 2;
        const v1Novelty = entropy > 0.65 || anomaly > 3.2;

        let verdict: 'ACCEPT' | 'DECLINE' | 'DEFER_SHAP' = 'ACCEPT';
        let stageReached = 'V1';
        let shapReason = '';

        if (normalizedRisk < 0.28 && !v1Novelty) {
            verdict = 'ACCEPT';
            stageReached = 'V1_ROUTER';
        } else if (normalizedRisk > 0.78 && !v1Novelty) {
            verdict = 'DECLINE';
            stageReached = 'V1_ROUTER';
            shapReason = 'High transactional velocity with out-of-distribution transfer amount';
        } else {
            // Stage 2: Calibrated SVM for epistemic resolution
            stageReached = 'V2_CALIBRATED_SVM';
            const svmCertainty = 1 - (entropy * 0.6);

            if (svmCertainty > 0.72 && normalizedRisk > 0.62) {
                verdict = 'DECLINE';
                shapReason = 'Epistemic uncertainty resolved via calibrated support vectors';
            } else {
                // Stage 3: Dempster-Shafer belief fusion
                stageReached = 'V3_DEMPSTER_SHAFER';
                const bpaFraud = normalizedRisk * 0.65;
                const bpaLegit = (1 - normalizedRisk) * 0.65;
                const bpaIgnorance = 1 - (bpaFraud + bpaLegit);

                if (bpaFraud > 0.55 && bpaIgnorance < 0.20) {
                    verdict = 'DECLINE';
                    shapReason = 'Multi-source belief mass concentrated on fraudulent profile';
                } else if (bpaLegit > 0.55 && bpaIgnorance < 0.20) {
                    verdict = 'ACCEPT';
                } else {
                    // Stage 4: Structured SHAP deferral (replaces human queue with machine-readable codes)
                    verdict = 'DEFER_SHAP';
                    stageReached = 'V4_STRUCTURED_DEFERRAL';
                    shapReason = `SHAP Reason: Top feature contributions [entropy: +${(entropy * 0.42).toFixed(2)}, anomaly_score: +${(anomaly * 0.28).toFixed(2)}]`;
                }
            }
        }

        // Deterministic pseudo-latency from the inputs — keeps the useMemo pure
        const latencySeed = ((amount * 31 + velocity * 17 + entropy * 97 + anomaly * 53) % 14);
        const simulatedLatency = (32 + latencySeed).toFixed(1);

        return {
            normalizedRisk: (normalizedRisk * 100).toFixed(1),
            v1Confidence: (v1Confidence * 100).toFixed(1),
            stageReached,
            verdict,
            shapReason,
            latency: simulatedLatency,
        };
    }, [amount, velocity, entropy, anomaly]);

    const handleReset = () => {
        setAmount(450);
        setVelocity(12);
        setEntropy(0.35);
        setAnomaly(1.8);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed left-[50%] top-[50%] z-[101] w-full max-w-[820px] translate-x-[-50%] translate-y-[-50%] p-4 max-h-[92vh] overflow-y-auto"
                    >
                        <div
                            style={{
                                borderRadius: '16px',
                                border: '1px solid rgba(0, 245, 255, 0.2)',
                                background: 'rgba(5, 6, 12, 0.96)',
                                backdropFilter: 'blur(30px)',
                                boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 245, 255, 0.08)',
                                padding: 'clamp(24px, 4vw, 36px)',
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#fff', margin: 0 }}>
                                            MARI // STAGED UNCERTAINTY-AWARE DECISION ENGINE
                                        </h3>
                                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>
                                            IEEE TDSC TARGETED MANUSCRIPT // 284K+ TRANSACTIONS // 100% DECLINE PRECISION
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-zinc-400 hover:text-white transition-colors p-1 rounded-md"
                                    aria-label="Close modal"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Main Grid: Parameters + Evaluation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Interactive Transaction Sliders */}
                                <div className="flex flex-col gap-5">
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
                                        TRANSACTION TELEMETRY INPUTS
                                    </span>

                                    {/* Amount Slider */}
                                    <div className="flex flex-col gap-2 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-zinc-400">Transaction Value ($)</span>
                                            <span className="text-white font-bold">${amount}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="5000"
                                            step="10"
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            className="accent-cyan-400 cursor-pointer"
                                        />
                                    </div>

                                    {/* Velocity Slider */}
                                    <div className="flex flex-col gap-2 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-zinc-400">Velocity (Txns/Hr)</span>
                                            <span className="text-white font-bold">{velocity} tx/hr</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            value={velocity}
                                            onChange={(e) => setVelocity(Number(e.target.value))}
                                            className="accent-cyan-400 cursor-pointer"
                                        />
                                    </div>

                                    {/* Entropy Score */}
                                    <div className="flex flex-col gap-2 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-zinc-400">Novelty & Geo Entropy</span>
                                            <span className="text-white font-bold">{entropy.toFixed(2)}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.0"
                                            max="1.0"
                                            step="0.05"
                                            value={entropy}
                                            onChange={(e) => setEntropy(Number(e.target.value))}
                                            className="accent-cyan-400 cursor-pointer"
                                        />
                                    </div>

                                    {/* Anomaly Z-Score */}
                                    <div className="flex flex-col gap-2 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-zinc-400">Isolation Forest Anomaly Deviation</span>
                                            <span className="text-white font-bold">{anomaly.toFixed(1)}σ</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="5.0"
                                            step="0.1"
                                            value={anomaly}
                                            onChange={(e) => setAnomaly(Number(e.target.value))}
                                            className="accent-cyan-400 cursor-pointer"
                                        />
                                    </div>

                                    <button
                                        onClick={handleReset}
                                        className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-400 hover:text-white py-2 border border-white/10 hover:border-white/20 rounded-md transition-colors"
                                    >
                                        <RefreshCw size={12} /> Reset Benchmark Baseline
                                    </button>
                                </div>

                                {/* Right Column: Live Staged Decision Verdict */}
                                <div className="flex flex-col justify-between bg-black/40 p-5 rounded-xl border border-white/10">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                                                PIPELINE ROUTING STATUS
                                            </span>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-cyan)' }}>
                                                LATENCY: {evaluation.latency}ms
                                            </span>
                                        </div>

                                        {/* Verdict Pill */}
                                        <div className="text-center py-5 rounded-lg border flex flex-col items-center gap-2"
                                            style={{
                                                borderColor: evaluation.verdict === 'ACCEPT' ? '#10b981' : evaluation.verdict === 'DECLINE' ? '#ef4444' : '#f59e0b',
                                                background: evaluation.verdict === 'ACCEPT' ? 'rgba(16, 185, 129, 0.08)' : evaluation.verdict === 'DECLINE' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                                            }}
                                        >
                                            {evaluation.verdict === 'ACCEPT' && <CheckCircle2 className="text-emerald-400" size={32} />}
                                            {evaluation.verdict === 'DECLINE' && <ShieldAlert className="text-red-400" size={32} />}
                                            {evaluation.verdict === 'DEFER_SHAP' && <AlertTriangle className="text-amber-400" size={32} />}

                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 800, letterSpacing: '0.08em', color: evaluation.verdict === 'ACCEPT' ? '#10b981' : evaluation.verdict === 'DECLINE' ? '#ef4444' : '#f59e0b' }}>
                                                VERDICT: {evaluation.verdict}
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>
                                                EXIT LAYER: {evaluation.stageReached}
                                            </div>
                                        </div>

                                        {/* Stage Breakdown Matrix */}
                                        <div className="flex flex-col gap-2 font-mono text-xs">
                                            <div className="flex justify-between py-1 border-b border-white/5 text-zinc-300">
                                                <span>Risk Intensity Index:</span>
                                                <span className="text-white font-bold">{evaluation.normalizedRisk}%</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-white/5 text-zinc-300">
                                                <span>V1 Model Confidence:</span>
                                                <span className="text-white font-bold">{evaluation.v1Confidence}%</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-white/5 text-zinc-300">
                                                <span>DECLINE Precision:</span>
                                                <span className="text-emerald-400 font-bold">100.0% (Zero False Blocks)</span>
                                            </div>
                                            <div className="flex justify-between py-1 text-zinc-300">
                                                <span>Brier Error Reduction:</span>
                                                <span className="text-cyan-400 font-bold">-74.4% (Isotonic Calibrated)</span>
                                            </div>
                                        </div>

                                        {/* Reason box if any */}
                                        {evaluation.shapReason && (
                                            <div className="p-3 rounded bg-white/[0.03] border border-white/5 text-[11px] font-mono text-zinc-300">
                                                <span className="text-cyan-400 block font-bold mb-1">{'//'} EXPLANATION VECTOR:</span>
                                                {evaluation.shapReason}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                                        <a
                                            href="https://mari-alpha.vercel.app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                                        >
                                            mari-alpha.vercel.app ↗
                                        </a>
                                        <span className="text-[10px] font-mono text-zinc-500">
                                            PAPER IN PREPARATION (IEEE TDSC)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
