import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GridGameState, GridPlayer, GridTile } from '@/types/grid';
import { GRID_PLAYERS, GRID_CATEGORIES } from '@/data/grid-data';
import { shuffleArray } from './utils';

// Helper to seed random for daily challenge
function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Generate a deterministic grid for a given date string (YYYY-MM-DD)
function generateDailyLevel(dateStr: string): { grid: GridTile[], deck: GridPlayer[] } {
    // Simple hash of date string to get seed
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
        seed += dateStr.charCodeAt(i);
    }

    // 1. Select 16 unique categories deterministically
    // For v1, we just take 16 random categories using our seeded random
    // ideally we ensure solvability.

    // Strategy: 
    // 1. Pick 16 players "The Solution".
    // 2. For each player, pick 1 valid category they match.
    // 3. This guarantees at least one solution exists.

    const allPlayers = [...GRID_PLAYERS];
    const solutionPlayers: GridPlayer[] = [];
    const tiles: GridTile[] = [];

    // Deterministic shuffle of players
    allPlayers.sort((a, b) => seededRandom(seed + a.id.length) - 0.5);

    // Pick 16 players for the solution slots
    // If we don't have enough players (we have 16 in DB now), we use all of them.
    // Ideally DB should be bigger. We loop them if needed but careful with uniqueness.

    // Let's rely on the categorie pool first.
    const allCats = [...GRID_CATEGORIES];
    // Shuffle categories deterministically
    allCats.sort((a, b) => seededRandom(seed + a.id.length * 2) - 0.5);

    const selectedCats = allCats.slice(0, 16);

    // Now build the tiles
    selectedCats.forEach((cat, index) => {
        tiles.push({
            id: `tile-${index}`,
            category: cat,
            assignedPlayerId: undefined,
            isCorrect: undefined,
            isLocked: false
        });
    });

    // Now build the Deck.
    // The deck MUST contain players that can fill these slots.
    // Since we picked categories randomly, it's possible some slots have NO matching player in our small DB.
    // This is a risk with small DB. 
    // FOR MVP: We will use a predefined "Hardcoded" grid logic for today if generatic fails, OR ensures DB is big enough.
    // With 16 players and 20 categories, collision is high.
    // Let's just put ALL players in the deck for now.

    const deck = [...GRID_PLAYERS];
    // Deterministic shuffle
    deck.sort((a, b) => seededRandom(seed + b.id.length) - 0.5);

    return { grid: tiles, deck };
}

interface GridStore extends GridGameState {
    initDaily: () => void;
    assignPlayer: (tileId: string) => void;
    skipPlayer: () => void; // Put current player at bottom of deck? Or discard? 
    // "Remaining players counter" implies we can skip or they are just in a queue.
    // Spec: "Each player can only be placed once."
    // Let's say Skip puts them at back of queue.
    resetGame: () => void;
}

const INITIAL_STATE: GridGameState = {
    grid: [],
    deck: [],
    currentPlayerIndex: 0,
    score: 0,
    mistakes: 0,
    status: 'idle',
    dayId: '',
};

export const useGridStore = create<GridStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE,

            initDaily: () => {
                const today = new Date().toISOString().split('T')[0];
                const state = get();

                // If already playing today's game, don't reset
                if (state.dayId === today && state.status !== 'idle') {
                    return;
                }

                const { grid, deck } = generateDailyLevel(today);

                set({
                    ...INITIAL_STATE,
                    grid,
                    deck,
                    status: 'playing',
                    dayId: today,
                });
            },

            assignPlayer: (tileId: string) => {
                const { grid, deck, currentPlayerIndex, mistakes, score } = get();
                const currentPlayer = deck[currentPlayerIndex];
                const tile = grid.find(t => t.id === tileId);

                if (!tile || !currentPlayer || tile.isLocked) return;

                // Validation Logic
                const isCorrect = tile.category.rule(currentPlayer);

                if (isCorrect) {
                    // Success
                    const newGrid = grid.map(t =>
                        t.id === tileId
                            ? { ...t, assignedPlayerId: currentPlayer.id, isCorrect: true, isLocked: true }
                            : t
                    );

                    // Next player
                    const nextIndex = currentPlayerIndex + 1;
                    const isWon = newGrid.every(t => t.isLocked);
                    const isGameOver = nextIndex >= deck.length && !isWon;

                    set({
                        grid: newGrid,
                        currentPlayerIndex: nextIndex,
                        score: score + 1, // Simple score
                        status: isWon ? 'won' : (isGameOver ? 'lost' : 'playing'),
                    });

                } else {
                    // Failure
                    const newMistakes = mistakes + 1;
                    const isLost = newMistakes >= 3; // Hardcore implicit or config? User said "Hardcore mode". 
                    // Default mode: Unlimited mistakes? "Classic Daily: Unlimited mistakes".
                    // Let's implement Classic for now (no lose on mistake, just Feedback).

                    // But wait, "Immediate feedback: Correct -> Lock, Incorrect -> Error count".
                    // Does the player stay current? Or moves to next?
                    // Usually in these games, if you get it wrong, you lose the player (or lose a life).
                    // If "Unlimited", maybe you just retry?
                    // Spec: "Action: User clicks one tile to assign... Incorrect -> Error count increases".
                    // It doesn't say "Next Player".
                    // So user keeps the player and tries another tile?
                    // OR user loses the player? 
                    // "Player pool runs out" is a lose condition.
                    // So incorrect assignment consumes the player? -> That makes it HARD.
                    // Let's assume: Incorrect -> Error Flash -> Player stays (in Classic).
                    // In Hardcore: Incorrect -> Player stays/Consumed?

                    set({
                        mistakes: newMistakes,
                        // Flash feedback logic would be UI side ideally, or we set a temp state
                    });
                }
            },

            skipPlayer: () => {
                const { deck, currentPlayerIndex } = get();
                // Cycle player to end of queue? Or discard?
                // Spec: "Remaining players counter".
                // Let's cycle to back.
                const newDeck = [...deck];
                const skipped = newDeck.splice(currentPlayerIndex, 1)[0];
                newDeck.push(skipped);

                // Current index stays same (pointing to new card at this index), unless we are at end.
                // Actually if we modify deck, we should respect index.
                // Simpler: Just increment index, but if index > length, wrap?
                // No, simpler to just Move Item in array.

                set({ deck: newDeck });
            },

            resetGame: () => {
                // Debug/Testing only, normally daily is persisted
                set(INITIAL_STATE);
                get().initDaily();
            }
        }),
        {
            name: 'football-grid-daily', // unique name
        }
    )
);
