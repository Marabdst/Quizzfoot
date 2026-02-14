import { motion } from "framer-motion";
import { GridTile } from "@/types/grid";
import { cn } from "@/lib/utils";
import { Check, X, Lock } from "lucide-react";
import { GRID_PLAYERS } from "@/data/grid-data";

interface GridTileProps {
    tile: GridTile;
    onClick: (id: string) => void;
    isActive: boolean;
}

export function GridTileCard({ tile, onClick, isActive }: GridTileProps) {
    // Find assigned player details if any
    const assignedPlayer = tile.assignedPlayerId
        ? GRID_PLAYERS.find(p => p.id === tile.assignedPlayerId)
        : null;

    const isLocked = tile.isLocked;
    const isCorrect = tile.isCorrect === true;
    const isError = tile.isCorrect === false; // If we supported showing errors persistently

    return (
        <motion.button
            whileHover={!isLocked && isActive ? { scale: 1.02 } : {}}
            whileTap={!isLocked && isActive ? { scale: 0.98 } : {}}
            onClick={() => onClick(tile.id)}
            disabled={isLocked || !isActive}
            className={cn(
                "relative w-full aspect-square rounded-lg border-2 p-2 flex flex-col items-center justify-center text-center transition-all duration-200",
                // IDLE STATE
                !isLocked && "bg-secondary/20 border-border hover:border-primary/50 hover:bg-secondary/40",
                // LOCKED / CORRECT
                isLocked && "bg-green-500/10 border-green-500/50",
                // ERROR (Flash state handled by parent usually, but here for completeness)
                isError && "bg-red-500/10 border-red-500/50",
                // LOCKED Text
                isLocked ? "cursor-default" : "cursor-pointer"
            )}
        >
            {/* Category Label */}
            <span className={cn(
                "text-xs sm:text-sm font-bold leading-tight",
                isLocked ? "text-green-400 opacity-50 text-[10px]" : "text-foreground"
            )}>
                {tile.category.icon && (
                    tile.category.type === 'country' ? (
                        <img
                            src={`https://flagcdn.com/w40/${tile.category.icon}.png`}
                            alt={tile.category.label}
                            className="w-6 h-4 object-cover rounded-sm mb-1 mx-auto"
                        />
                    ) : (
                        <div className="text-xl mb-1">{tile.category.icon}</div>
                    )
                )}
                {tile.category.label}
            </span>

            {/* Assigned Player Overlay */}
            {assignedPlayer && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg p-1"
                >
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <span className="text-xl">✅</span>
                        <span className="text-xs font-bold text-center crop whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">
                            {assignedPlayer.name}
                        </span>
                    </div>
                </motion.div>
            )}

            {/* Lock Icon */}
            {isLocked && !assignedPlayer && (
                <Lock className="w-4 h-4 text-green-500 absolute top-1 right-1" />
            )}
        </motion.button>
    );
}
