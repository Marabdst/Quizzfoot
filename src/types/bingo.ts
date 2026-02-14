export interface BingoPlayer {
    id: string;
    name: string;
    photoUrl?: string; // Optional, maybe for later or "reveal"
    // Pools of correct facts
    clubs: string[];
    teammates: string[];
    trophies: string[];
    managers: string[];
    years_active: string;
    nationality: string;
    position: string;
    // Pools of incorrect facts (traps)
    decoy_clubs: string[];
    decoy_teammates: string[];
    decoy_trophies?: string[];
    decoy_managers?: string[];
    decoy_nationality?: string[];
}

export interface BingoTile {
    id: string;
    content: string;
    type: 'club' | 'teammate' | 'trophy' | 'manager' | 'nationality' | 'position' | 'info';
    isCorrect: boolean;
    isSelected: boolean;
    isRevealed?: boolean; // For "Wildcard" or End game
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface GameState {
    currentLevel: BingoPlayer | null;
    grid: BingoTile[];
    status: GameStatus;
    score: number;
    timer: number;
    mistakes: number;
    wildcards: number;
    streak: number;
}
