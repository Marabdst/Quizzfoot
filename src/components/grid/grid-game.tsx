"use client";

import { useEffect, useState } from "react";
import { useGridStore } from "@/lib/grid-store";
import { GridTileCard } from "./grid-tile";
import { GridPlayerCard } from "./grid-player-card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Share2, Trophy, Clock } from "lucide-react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";

function CountdownToMidnight() {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
            tomorrow.setUTCHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();

            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${h}h ${m}m ${s}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return <span className="font-mono text-xl font-bold">{timeLeft}</span>;
}

export function GridGame() {
    const { grid, deck, currentPlayerIndex, score, mistakes, status, timer, initDaily, assignPlayer, skipPlayer, tickTimer } = useGridStore();

    const [errorTileId, setErrorTileId] = useState<string | null>(null);

    useEffect(() => {
        initDaily();
    }, [initDaily]);

    // Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'playing') {
            interval = setInterval(tickTimer, 1000);
        }
        return () => clearInterval(interval);
    }, [status, tickTimer]);

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

        const currentPlayer = deck[currentPlayerIndex];
        const tile = grid.find(t => t.id === tileId);
        if (!tile || !currentPlayer) return;

        const isCorrect = tile.category.rule(currentPlayer);

        if (isCorrect) {
            assignPlayer(tileId);
        } else {
            setErrorTileId(tileId);
            setTimeout(() => setErrorTileId(null), 500);
            assignPlayer(tileId);
        }
    };

    const currentPlayer = deck[currentPlayerIndex];
    const isGameOver = status === 'won' || status === 'lost';

    // Format Timer MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentPlayer && !isGameOver && status === 'playing') {
        return <div className="p-10 text-center">Plus de joueurs !</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 p-4">

            {/* HEADER: Score, Title, Timer, Mistakes */}
            <div className="w-full grid grid-cols-3 items-center bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex flex-col items-start gap-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase">Score</span>
                    <span className="text-2xl font-black text-primary">{score}/16</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent hidden sm:block">
                        MERCATO GRID
                    </h1>
                    <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timer < 30 ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
                        <Clock className="w-4 h-4" />
                        {formatTime(timer)}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase">Erreurs</span>
                    <span className={mistakes > 0 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                        {mistakes}
                    </span>
                </div>
            </div>

            {/* MAIN GAME AREA */}
            <div className="w-full grid lg:grid-cols-[1fr_350px] gap-8 items-start">

                {/* THE GRID */}
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

                {/* ACTIVE PLAYER CARD */}
                <div className="order-1 lg:order-2 w-full flex flex-col gap-4">
                    {isGameOver ? (
                        <div className="bg-card border-2 border-primary rounded-xl p-8 text-center space-y-4 animate-in fade-in zoom-in">
                            <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
                            <h2 className="text-3xl font-black">
                                {status === 'won' ? "GRID COMPLETED!" : "GAME OVER"}
                            </h2>
                            <p className="text-muted-foreground">
                                {status === 'lost' && timer <= 0 ? "Temps écoulé !" : `Score final: ${score}/16`} <br />
                                Erreurs: {mistakes}
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={() => window.location.reload()}>
                                    <RefreshCw className="w-4 h-4 mr-2" /> Actualiser
                                </Button>
                                <Button variant="outline">
                                    <Share2 className="w-4 h-4 mr-2" /> Partager
                                </Button>
                            </div>

                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Prochaine grille dans</p>
                                <CountdownToMidnight />
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
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
