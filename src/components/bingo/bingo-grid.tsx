"use client";

import { useBingoStore } from "@/lib/bingo-store";
import { BingoCard } from "./bingo-card";
import { motion } from "framer-motion";

export function BingoGrid() {
    const { grid, toggleTile, status } = useBingoStore();

    const showResult = status === 'won' || status === 'lost';
    const isPlaying = status === 'playing';

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mx-auto p-4">
            {grid.map((tile, index) => (
                <BingoCard
                    key={tile.id}
                    tile={tile}
                    onToggle={toggleTile}
                    showResult={showResult}
                    disabled={!isPlaying}
                />
            ))}
        </div>
    );
}
