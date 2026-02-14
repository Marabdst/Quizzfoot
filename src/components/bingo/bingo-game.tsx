"use client";

import { useEffect } from "react";
import { useBingoStore } from "@/lib/bingo-store";
import { BingoGrid } from "./bingo-grid";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, AlertTriangle, Wand2, Share2, Play, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useConfetti } from "@/hooks/use-confetti";

export function BingoGame() {
    const {
        currentLevel,
        status,
        timer,
        score,
        mistakes,
        wildcards,
        initGame,
        validateGrid,
        useWildcard,
        tickTimer,
        resetGame
    } = useBingoStore();

    const confetti = useConfetti();

    // Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'playing') {
            interval = setInterval(tickTimer, 1000);
        }
        return () => clearInterval(interval);
    }, [status, tickTimer]);

    // Win Effect
    useEffect(() => {
        if (status === 'won') {
            confetti();
        }
    }, [status, confetti]);

    if (!currentLevel && status === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Bingo Foot 🎲
                </h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Devine la carrière du joueur ! Coche les indices VRAIS. Attention aux pièges 👻
                </p>
                <div className="flex gap-4">
                    <Button size="lg" onClick={() => initGame(undefined, 'normal')} className="w-40 font-bold text-lg">
                        JOUER
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => initGame(undefined, 'blitz')} className="w-40 font-bold text-lg border-red-500 text-red-500 hover:bg-red-900/10">
                        BLITZ ⚡
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentLevel) return null; // Should not happen

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-6">

            {/* Header Info */}
            <div className="w-full flex justify-between items-center px-4 py-2 bg-card/30 rounded-full border border-border backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-mono font-bold text-xl">{score}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Clock className={timer < 10 ? "text-red-500 animate-pulse" : "text-primary"} />
                    <span className={timer < 10 ? "text-red-500 font-bold font-mono text-xl" : "font-mono text-xl"}>
                        {timer}s
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="font-mono font-bold text-xl">{mistakes}</span>
                </div>
            </div>

            {/* Probability / Life Bar (Visual Feedback) */}
            {status === 'playing' && (
                <Progress value={(timer / 60) * 100} className="h-1 w-full opacity-50" />
            )}

            {/* Player Identity */}
            <div className="text-center space-y-1">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent drop-shadow-lg">
                    {currentLevel.name}
                </h2>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                    {currentLevel.position} • {currentLevel.nationality} • {currentLevel.years_active}
                </p>
            </div>

            {/* THE GRID */}
            <BingoGrid />

            {/* Actions Footer */}
            <div className="flex gap-4 w-full px-4 justify-center">
                {status === 'playing' ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={useWildcard}
                            disabled={wildcards <= 0}
                            className="flex-1 max-w-[150px] border-purple-500/50 text-purple-400 hover:bg-purple-900/20"
                        >
                            <Wand2 className="w-4 h-4 mr-2" />
                            Joker ({wildcards})
                        </Button>

                        <Button
                            size="lg"
                            onClick={validateGrid}
                            className="flex-1 max-w-[200px] bg-green-600 hover:bg-green-700 text-white font-bold text-xl shadow-[0_0_20px_-5px_rgba(22,163,74,0.6)]"
                        >
                            VALIDER
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-4">
                            {status === 'won' ? (
                                <h3 className="text-3xl font-bold text-green-500 mb-2">BINGO ! 🎉</h3>
                            ) : (
                                <h3 className="text-3xl font-bold text-red-500 mb-2">GAME OVER 💀</h3>
                            )}
                            <p className="text-muted-foreground">Score final: <strong className="text-white">{score}</strong></p>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={() => initGame()} size="lg" className="w-40 font-bold">
                                <Play className="w-4 h-4 mr-2" />
                                Rejouer
                            </Button>
                            <Link href="/">
                                <Button variant="ghost">
                                    <Home className="w-4 h-4 mr-2" />
                                    Accueil
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
