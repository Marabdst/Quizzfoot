import { create } from 'zustand';
import { BingoPlayer, BingoTile, GameState, GameStatus } from '@/types/bingo';
import { BINGO_PLAYERS, generateBingoGrid } from '@/data/bingo-data';

interface BingoStore extends GameState {
    initGame: (playerId?: string, mode?: 'normal' | 'hardcore' | 'blitz') => void;
    toggleTile: (tileId: string) => void;
    validateGrid: () => void;
    useWildcard: () => void;
    tickTimer: () => void;
    resetGame: () => void;
}

const INITIAL_STATE: GameState = {
    currentLevel: null,
    grid: [],
    status: 'idle',
    score: 0,
    timer: 60,
    mistakes: 0,
    wildcards: 1,
    streak: 0,
};

export const useBingoStore = create<BingoStore>((set, get) => ({
    ...INITIAL_STATE,

    initGame: (playerId, mode = 'normal') => {
        // Pick random player if not specified
        const player = playerId
            ? BINGO_PLAYERS.find(p => p.id === playerId)
            : BINGO_PLAYERS[Math.floor(Math.random() * BINGO_PLAYERS.length)];

        if (!player) return;

        const grid = generateBingoGrid(player);

        set({
            ...INITIAL_STATE,
            currentLevel: player,
            grid,
            status: 'playing',
            timer: mode === 'blitz' ? 15 : 60,
            wildcards: mode === 'hardcore' ? 0 : 1,
        });
    },

    toggleTile: (tileId) => {
        const { status, grid } = get();
        if (status !== 'playing') return;

        set({
            grid: grid.map(tile =>
                tile.id === tileId ? { ...tile, isSelected: !tile.isSelected } : tile
            )
        });
    },

    validateGrid: () => {
        const { grid, status, score } = get();
        if (status !== 'playing') return;

        let roundScore = 0;
        let errors = 0;
        let correctFound = 0;
        const totalCorrect = grid.filter(t => t.isCorrect).length;

        const newGrid = grid.map(tile => {
            // Visual reveal logic could go here, or we just rely on isCorrect/isSelected
            return tile;
        });

        // Calculate Score
        grid.forEach(tile => {
            if (tile.isSelected && tile.isCorrect) {
                roundScore += 1;
                correctFound++;
            } else if (tile.isSelected && !tile.isCorrect) {
                roundScore -= 1;
                errors++;
            }
        });

        // Bonus for perfect round (found all correct, no errors)
        if (correctFound === totalCorrect && errors === 0) {
            roundScore += 3;
        }

        const finalStatus = errors > 0 ? 'lost' : 'won'; // Simple win/loss for now, or based on threshold?
        // Let's make it: Won if caught > 50% correct and error < 3?
        // User spec: "-1 incorrect". 
        // Let's say: Game Over if Hardcore and errors >= 3.
        // For now, let's just transition to 'won' or 'lost' based on if score > 0.

        set({
            status: roundScore > 0 ? 'won' : 'lost',
            score: score + Math.max(0, roundScore),
            grid: newGrid, // Update grid to show results (handled in UI via isCorrect)
            mistakes: errors,
        });
    },

    useWildcard: () => {
        const { grid, wildcards, status } = get();
        if (status !== 'playing' || wildcards <= 0) return;

        // Find 2 unselected incorrect tiles (traps) and reveal them (disable them)
        // Or select 2 unselected correct tiles?
        // User spec: "Removes 2 incorrect tiles automatically"

        let removed = 0;
        const newGrid = grid.map(tile => {
            if (removed < 2 && !tile.isCorrect && !tile.isSelected && !tile.isRevealed) {
                removed++;
                return { ...tile, isRevealed: true }; // Visual state: "Removed/Disabled"
            }
            return tile;
        });

        set({
            grid: newGrid,
            wildcards: wildcards - 1
        });
    },

    tickTimer: () => {
        const { timer, status, validateGrid } = get();
        if (status !== 'playing') return;

        if (timer <= 1) {
            validateGrid(); // Auto-validate on timeout
            set({ timer: 0 });
        } else {
            set({ timer: timer - 1 });
        }
    },

    resetGame: () => set(INITIAL_STATE),
}));
