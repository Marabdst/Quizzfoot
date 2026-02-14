"use client";

import { motion } from "framer-motion";
import { BingoTile } from "@/types/bingo";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface BingoCardProps {
    tile: BingoTile;
    onToggle: (id: string) => void;
    showResult: boolean;
    disabled: boolean;
}

export function BingoCard({ tile, onToggle, showResult, disabled }: BingoCardProps) {
    const isSelected = tile.isSelected;
    const isCorrect = tile.isCorrect;
    const isRevealedTrap = tile.isRevealed; // Wildcard effect

    // Visual State
    let bgClass = "bg-card/50 hover:bg-card/80";
    let borderClass = "border-border";
    let icon = null;

    if (showResult) {
        if (isCorrect) {
            bgClass = isSelected ? "bg-green-500/20" : "bg-green-500/10 opacity-70"; // Selected Correct vs Missed
            borderClass = "border-green-500";
            icon = <Check className="w-4 h-4 text-green-500" />;
        } else {
            bgClass = isSelected ? "bg-red-500/20" : "bg-card/30 opacity-50"; // Selected Error vs Ignored Trap
            borderClass = isSelected ? "border-red-500" : "border-transparent";
            icon = isSelected ? <X className="w-4 h-4 text-red-500" /> : null;
        }
    } else {
        // In Game
        if (isRevealedTrap) {
            bgClass = "bg-red-900/10 opacity-30 cursor-not-allowed"; // Wildcard removed trap
            borderClass = "border-transparent";
        } else if (isSelected) {
            bgClass = "bg-primary/20";
            borderClass = "border-primary shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]";
        }
    }

    return (
        <motion.button
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={!disabled && !isRevealedTrap ? { scale: 1.02 } : {}}
            whileTap={!disabled && !isRevealedTrap ? { scale: 0.95 } : {}}
            onClick={() => !isRevealedTrap && onToggle(tile.id)}
            disabled={disabled || (isRevealedTrap ?? false)}
            className={cn(
                "relative flex items-center justify-center p-2 sm:p-4 text-center border-2 rounded-xl transition-colors duration-200 min-h-[80px] sm:min-h-[100px]",
                bgClass,
                borderClass
            )}
        >
            <span className={cn(
                "text-xs sm:text-sm font-medium leading-tight",
                isRevealedTrap && "line-through text-muted-foreground"
            )}>
                {tile.content}
            </span>

            {/* Type Badge (Optional) */}
            <span className="absolute top-1 right-1 text-[10px] text-muted-foreground opacity-50 uppercase tracking-tighter">
                {tile.type}
            </span>

            {/* Result Icon */}
            {showResult && icon && (
                <div className="absolute top-1 left-1">
                    {icon}
                </div>
            )}
        </motion.button>
    );
}
