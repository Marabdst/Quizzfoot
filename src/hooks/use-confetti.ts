"use client";

import { useCallback } from "react";

export function useConfetti() {
    const fire = useCallback(async () => {
        if (typeof window === "undefined") return;
        const confetti = (await import("canvas-confetti")).default;

        // First burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#22C55E", "#16A34A", "#FFD700", "#FFA500", "#FF6347"],
        });

        // Second burst after delay
        setTimeout(() => {
            confetti({
                particleCount: 60,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#22C55E", "#16A34A", "#FFD700"],
            });
            confetti({
                particleCount: 60,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#22C55E", "#16A34A", "#FFD700"],
            });
        }, 250);
    }, []);

    return fire;
}
