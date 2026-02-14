import { motion } from "framer-motion";
import { GridPlayer } from "@/types/grid";
import { cn } from "@/lib/utils";
import { User, SkipForward } from "lucide-react";

interface GridPlayerCardProps {
    player: GridPlayer;
    remainingCount: number;
    onSkip?: () => void;
    className?: string;
}

export function GridPlayerCard({ player, remainingCount, onSkip, className }: GridPlayerCardProps) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={player.id}
            className={cn(
                "relative w-full max-w-sm mx-auto bg-card border-2 border-primary/20 rounded-xl p-6 shadow-xl flex flex-col items-center gap-4",
                className
            )}
        >
            <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <User className="w-3 h-3" />
                <span>{remainingCount} restants</span>
            </div>

            {/* Avatar Placeholder */}
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20 overflow-hidden">
                {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl">⚽</span>
                )}
            </div>

            <div className="text-center space-y-1">
                <h3 className="text-2xl font-black tracking-tight text-primary">
                    {player.name}
                </h3>
                {/* Nationality hidden for difficulty */}
            </div>

            {/* SKIP BUTTON */}
            {onSkip && (
                <button
                    onClick={onSkip}
                    className="mt-2 flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                    <SkipForward className="w-4 h-4" />
                    PASSER CE JOUEUR
                </button>
            )}

            {/* Decorative Elements */}
            <div className="absolute inset-0 border-2 border-primary/5 rounded-xl pointer-events-none" />
        </motion.div>
    );
}
