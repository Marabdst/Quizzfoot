import { BingoPlayer, BingoTile } from "@/types/bingo";
import { shuffleArray } from "@/lib/utils";

export const BINGO_PLAYERS: BingoPlayer[] = [
    {
        id: "essien",
        name: "Michael Essien",
        nationality: "Ghana",
        position: "Milieu",
        years_active: "2000-2020",
        clubs: ["Olympique Lyonnais", "Chelsea", "Real Madrid", "AC Milan", "Bastia", "Panathinaikos"],
        teammates: ["Didier Drogba", "Frank Lampard", "Karim Benzema", "Juninho", "John Terry"],
        managers: ["José Mourinho", "Carlo Ancelotti", "Guus Hiddink"],
        trophies: ["Ligue 1", "Premier League", "Champions League", "FA Cup"],
        decoy_clubs: ["Arsenal", "FC Barcelone", "Manchester United", "Inter Milan", "Marseille"],
        decoy_teammates: ["Thierry Henry", "Wayne Rooney", "Zlatan Ibrahimovic", "Ronaldinho"],
        decoy_managers: ["Arsène Wenger", "Pep Guardiola", "Alex Ferguson"],
        decoy_nationality: ["Nigeria", "Cameroun", "France", "Côte d'Ivoire"],
        decoy_trophies: ["Coupe du Monde", "Ballon d'Or", "Serie A"]
    },
    {
        id: "zidane",
        name: "Zinedine Zidane",
        nationality: "France",
        position: "Milieu",
        years_active: "1989-2006",
        clubs: ["AS Cannes", "Bordeaux", "Juventus", "Real Madrid"],
        teammates: ["Ronaldo", "David Beckham", "Didier Deschamps", "Thierry Henry", "Alessandro Del Piero"],
        managers: ["Aimé Jacquet", "Marcello Lippi", "Vicente del Bosque"],
        trophies: ["Coupe du Monde", "Euro", "Champions League", "Ballon d'Or", "Serie A", "La Liga"],
        decoy_clubs: ["Marseille", "PSG", "Manchester United", "AC Milan", "Bayern Munich"],
        decoy_teammates: ["Michel Platini", "Eric Cantona", "Diego Maradona", "Pelé"],
        decoy_managers: ["Arsène Wenger", "Raymond Domenech", "Jose Mourinho"],
        decoy_nationality: ["Algérie", "Espagne", "Italie"],
        decoy_trophies: ["Copa America", "Premier League", "Coupe d'Afrique"]
    },
    {
        id: "cr7",
        name: "Cristiano Ronaldo",
        nationality: "Portugal",
        position: "Attaquant",
        years_active: "2002-Present",
        clubs: ["Sporting CP", "Manchester United", "Real Madrid", "Juventus", "Al-Nassr"],
        teammates: ["Wayne Rooney", "Karim Benzema", "Luka Modric", "Paulo Dybala", "Sadio Mané"],
        managers: ["Alex Ferguson", "Zinedine Zidane", "Carlo Ancelotti", "Jose Mourinho", "Erik ten Hag"],
        trophies: ["Euro", "Champions League", "Ballon d'Or", "Premier League", "La Liga", "Serie A"],
        decoy_clubs: ["FC Barcelone", "PSG", "Manchester City", "Chelsea", "Bayern Munich"],
        decoy_teammates: ["Lionel Messi", "Neymar", "Zlatan Ibrahimovic", "Ronaldinho"],
        decoy_managers: ["Pep Guardiola", "Jurgen Klopp", "Arsène Wenger"],
        decoy_nationality: ["Brésil", "Espagne", "Argentine"],
        decoy_trophies: ["Coupe du Monde", "Copa America", "Libertadores"]
    }
];

export function generateBingoGrid(player: BingoPlayer): BingoTile[] {
    const tiles: BingoTile[] = [];

    // 1. Correct Facts (Target: 8-10)
    const allCorrect = [
        ...player.clubs.map(c => ({ content: c, type: 'club' as const })),
        ...player.teammates.map(t => ({ content: t, type: 'teammate' as const })),
        ...player.trophies.map(t => ({ content: t, type: 'trophy' as const })),
        ...player.managers.map(m => ({ content: m, type: 'manager' as const })),
        { content: player.nationality, type: 'nationality' as const },
    ];
    const shuffledCorrect = shuffleArray(allCorrect).slice(0, 9); // Take 9 correct facts

    // 2. Traps (Target: 16 - 9 = 7)
    const allDecoys = [
        ...player.decoy_clubs.map(c => ({ content: c, type: 'club' as const })),
        ...player.decoy_teammates.map(t => ({ content: t, type: 'teammate' as const })),
        ...(player.decoy_trophies || []).map(t => ({ content: t, type: 'trophy' as const })),
        ...(player.decoy_managers || []).map(m => ({ content: m, type: 'manager' as const })),
        ...(player.decoy_nationality || []).map(n => ({ content: n, type: 'nationality' as const })),
    ];
    const shuffledDecoys = shuffleArray(allDecoys).slice(0, 7); // Take 7 traps

    // 3. Combine and Shuffle
    const combined = [...shuffledCorrect.map(t => ({ ...t, isCorrect: true })), ...shuffledDecoys.map(t => ({ ...t, isCorrect: false }))];
    const finalShuffled = shuffleArray(combined);

    return finalShuffled.map((t, index) => ({
        id: `tile-${index}`,
        content: t.content,
        type: t.type,
        isCorrect: t.isCorrect,
        isSelected: false,
    }));
}
