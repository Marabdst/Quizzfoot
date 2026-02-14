"use client";

import { useEffect, useState } from "react";
import { useGridStore } from "@/lib/grid-store";
import { GridTileCard } from "./grid-tile";
import { GridPlayerCard } from "./grid-player-card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Share2, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";

export function GridGame() {
    const { grid, deck, currentPlayerIndex, score, mistakes, status, initDaily, assignPlayer, skipPlayer, resetGame } = useGridStore();

    // Local state for error feedback on tiles
    const [errorTileId, setErrorTileId] = useState<string | null>(null);

    useEffect(() => {
        initDaily();
    }, [initDaily]);

    useEffect(() => {
        if (status === 'won') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [status]);

    const handleTileClick = (tileId: string) => {
        if (status !== 'playing') return;

        // Check if correct first (without modifying store yet, to show animation?)
        // Actually store handles logic. But if we want Shake effect...
        // The store doesn't expose "check" without "assign".
        // We can just rely on store logic but we need to know if it failed.
        // Store does `mistakes + 1` if failed.
        // Let's check locally for UI effect.
        const currentPlayer = deck[currentPlayerIndex];
        const tile = grid.find(t => t.id === tileId);
        if (!tile || !currentPlayer) return;

        const isCorrect = tile.category.rule(currentPlayer);

        if (isCorrect) {
            assignPlayer(tileId);
        } else {
            // Trigger Error Animation
            setErrorTileId(tileId);
            setTimeout(() => setErrorTileId(null), 500);
            assignPlayer(tileId); // Will increment mistakes
        }
    };

    const currentPlayer = deck[currentPlayerIndex];
    const isGameOver = status === 'won' || status === 'lost';

    if (!currentPlayer && !isGameOver && status === 'playing') {
        // Deck empty but not won? -> Lost (handled by store usually, but let's be safe)
        return <div className="p-10 text-center">Plus de joueurs !</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 p-4">

            {/* HEADER: Score & Status */}
            <div className="w-full flex justify-between items-center bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-bold uppercase">Score</span>
                    <span className="text-2xl font-black text-primary">{score}/16</span>
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        MERCATO GRID
                    </h1>
                    <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground font-bold uppercase">Erreurs</span>
                    <span className={mistakes > 0 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                        {mistakes}
                    </span>
                </div>
            </div>

            {/* MAIN GAME AREA */}
            <div className="w-full grid lg:grid-cols-[1fr_350px] gap-8 items-start">

                {/* THE GRID (Left on Desktop, Bottom on Mobile) */}
                <div className="order-2 lg:order-1">
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 aspect-square w-full">
                        <AnimatePresence>
                            {grid.map((tile) => (
                                <motion.div
                                    key={tile.id}
                                    animate={errorTileId === tile.id ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    <GridTileCard
                                        tile={tile}
                                        onClick={handleTileClick}
                                        isActive={status === 'playing' && !isGameOver}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ACTIVE PLAYER CARD (Right on Desktop, Top on Mobile) */}
                <div className="order-1 lg:order-2 w-full flex flex-col gap-4">
                    {isGameOver ? (
                        <div className="bg-card border-2 border-primary rounded-xl p-8 text-center space-y-4 animate-in fade-in zoom-in">
                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
                            <h2 className="text-3xl font-black">
                                {status === 'won' ? "GRID COMPLETED!" : "GAME OVER"}
                            </h2>
                            <p className="text-muted-foreground">
                                Score final: {score}/16 <br />
                                Erreurs: {mistakes}
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={() => window.location.reload()}>
                                    <RefreshCw className="w-4 h-4 mr-2" /> Rejouer
                                </Button>
                                <Button variant="outline">
                                    <Share2 className="w-4 h-4 mr-2" /> Partager
                                </Button>
                            </div>
                        </div>
                    ) : (
                        currentPlayer && (
                            <GridPlayerCard
                                player={currentPlayer}
                                remainingCount={deck.length - currentPlayerIndex}
                                onSkip={skipPlayer}
                            />
                        )
                    )}

                    {/* Helper Text */}
                    {!isGameOver && (
                        <div className="bg-secondary/30 p-4 rounded-lg text-xs text-muted-foreground text-center">
                            <p>👇 Clique sur une case pour placer le joueur.</p>
                            <p>⚠️ Une erreur = le joueur reste mais le compteur augmente.</p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
