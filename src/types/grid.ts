export type GridCategoryType = 'club' | 'league' | 'country' | 'award' | 'stat';

export interface GridCategory {
    id: string;
    type: GridCategoryType;
    label: string;
    // A function to check if a player matches this category
    // In a real DB, this would be a query. Here, we check player tags/attributes.
    rule: (player: GridPlayer) => boolean;
}

export interface GridPlayer {
    id: string;
    name: string;
    photoUrl?: string; // Optional
    nationality: string;
    clubs: string[]; // List of clubs played for
    leagues: string[]; // List of leagues (Ligue 1, Premier League, etc.)
    trophies: string[]; // List of trophies (UCL, World Cup, etc.)
    awards: string[]; // Individual awards (Ballon d'Or, Golden Boot)
    teammates: string[]; // Notable teammates
    managers: string[]; // Notable managers
    retired: boolean;
}

export interface GridTile {
    id: string;
    category: GridCategory;
    assignedPlayerId?: string; // If player is placed here
    isCorrect?: boolean;     // Visual feedback
    isLocked?: boolean;      // Once correct, it's locked
}

export interface GridGameState {
    grid: GridTile[];
    deck: GridPlayer[];    // The queue of players to play
    currentPlayerIndex: number;
    score: number;
    mistakes: number;
    status: 'idle' | 'playing' | 'won' | 'lost';
    dayId: string; // YYYY-MM-DD
}
