import { GridPlayer, GridCategory } from "@/types/grid";

// --- PLAYERS DATABASE ---
// We need a rich list of players to generate solvable grids.
export const GRID_PLAYERS: GridPlayer[] = [
    {
        id: "messi",
        name: "Lionel Messi",
        nationality: "Argentine",
        clubs: ["FC Barcelone", "Paris Saint-Germain", "Inter Miami"],
        leagues: ["Liga", "Ligue 1", "MLS"],
        trophies: ["Ligue des Champions", "Coupe du Monde", "Copa America", "Ligue 1", "Liga"],
        awards: ["Ballon d'Or", "Soulier d'Or"],
        teammates: ["Neymar", "Suarez", "Iniesta", "Xavi", "Mbappé"],
        managers: ["Pep Guardiola", "Luis Enrique"],
        retired: false
    },
    {
        id: "cr7",
        name: "Cristiano Ronaldo",
        nationality: "Portugal",
        clubs: ["Sporting CP", "Manchester United", "Real Madrid", "Juventus", "Al-Nassr"],
        leagues: ["Liga", "Premier League", "Serie A", "Saudi Pro League", "Liga Portugal"],
        trophies: ["Ligue des Champions", "Euro", "Premier League", "Liga", "Serie A"],
        awards: ["Ballon d'Or", "Soulier d'Or"],
        teammates: ["Benzema", "Rooney", "Modric", "Bale", "Dybala"],
        managers: ["Alex Ferguson", "Zinedine Zidane", "Carlo Ancelotti", "Jose Mourinho"],
        retired: false
    },
    {
        id: "zidane",
        name: "Zinedine Zidane",
        nationality: "France",
        clubs: ["AS Cannes", "Bordeaux", "Juventus", "Real Madrid"],
        leagues: ["Ligue 1", "Serie A", "Liga"],
        trophies: ["Ligue des Champions", "Coupe du Monde", "Euro", "Serie A", "Liga"],
        awards: ["Ballon d'Or"],
        teammates: ["Deschamps", "Henry", "Ronaldo", "Figo", "Beckham"],
        managers: ["Aimé Jacquet", "Marcello Lippi"],
        retired: true
    },
    {
        id: "henry",
        name: "Thierry Henry",
        nationality: "France",
        clubs: ["AS Monaco", "Juventus", "Arsenal", "FC Barcelone", "New York Red Bulls"],
        leagues: ["Ligue 1", "Serie A", "Premier League", "Liga", "MLS"],
        trophies: ["Ligue des Champions", "Coupe du Monde", "Euro", "Premier League", "Liga", "Ligue 1"],
        awards: [],
        teammates: ["Bergkamp", "Vieira", "Messi", "Zidane"],
        managers: ["Arsène Wenger", "Pep Guardiola"],
        retired: true
    },
    {
        id: "benzema",
        name: "Karim Benzema",
        nationality: "France",
        clubs: ["Olympique Lyonnais", "Real Madrid", "Al-Ittihad"],
        leagues: ["Ligue 1", "Liga", "Saudi Pro League"],
        trophies: ["Ligue des Champions", "Ligue 1", "Liga", "Nations League"],
        awards: ["Ballon d'Or"],
        teammates: ["CR7", "Bale", "Vinicius Jr", "Juninho"],
        managers: ["Zinedine Zidane", "Carlo Ancelotti", "Jose Mourinho"],
        retired: false
    },
    {
        id: "modric",
        name: "Luka Modrić",
        nationality: "Croatie",
        clubs: ["Dinamo Zagreb", "Tottenham", "Real Madrid"],
        leagues: ["Premier League", "Liga"],
        trophies: ["Ligue des Champions", "Liga", "Copa del Rey"],
        awards: ["Ballon d'Or"],
        teammates: ["CR7", "Bale", "Benzema", "Kroos"],
        managers: ["Zinedine Zidane", "Carlo Ancelotti", "Jose Mourinho"],
        retired: false
    },
    {
        id: "neymar",
        name: "Neymar Jr",
        nationality: "Brésil",
        clubs: ["Santos", "FC Barcelone", "Paris Saint-Germain", "Al-Hilal"],
        leagues: ["Liga", "Ligue 1", "Saudi Pro League"],
        trophies: ["Ligue des Champions", "Libertadores", "Liga", "Ligue 1", "Jeux Olympiques"],
        awards: [],
        teammates: ["Messi", "Suarez", "Mbappé", "Verratti"],
        managers: ["Luis Enrique", "Thomas Tuchel"],
        retired: false
    },
    {
        id: "mbappe",
        name: "Kylian Mbappé",
        nationality: "France",
        clubs: ["AS Monaco", "Paris Saint-Germain", "Real Madrid"], // Future proof ;)
        leagues: ["Ligue 1", "Liga"],
        trophies: ["Coupe du Monde", "Ligue 1", "Nations League"],
        awards: ["Soulier d'Or CDM"],
        teammates: ["Neymar", "Messi", "Benzema", "Griezmann"],
        managers: ["Didier Deschamps", "Thomas Tuchel"],
        retired: false
    },
    {
        id: "kante",
        name: "N'Golo Kanté",
        nationality: "France",
        clubs: ["US Boulogne", "SM Caen", "Leicester City", "Chelsea", "Al-Ittihad"],
        leagues: ["Ligue 1", "Premier League", "Saudi Pro League"],
        trophies: ["Coupe du Monde", "Ligue des Champions", "Premier League", "Europa League"],
        awards: [],
        teammates: ["Pogba", "Mahrez", "Hazard", "Benzema"],
        managers: ["Claudio Ranieri", "Antonio Conte", "Didier Deschamps", "Thomas Tuchel"],
        retired: false
    },
    {
        id: "zlatan",
        name: "Zlatan Ibrahimović",
        nationality: "Suède",
        clubs: ["Malmö", "Ajax", "Juventus", "Inter Milan", "FC Barcelone", "AC Milan", "Paris Saint-Germain", "Man Utd", "LA Galaxy"],
        leagues: ["Serie A", "Liga", "Ligue 1", "Premier League", "MLS", "Eredivisie"],
        trophies: ["Serie A", "Liga", "Ligue 1", "Europa League"],
        awards: [],
        teammates: ["Messi", "Thiago Silva", "Pogba", "Cavani"],
        managers: ["Jose Mourinho", "Pep Guardiola", "Carlo Ancelotti"],
        retired: true
    },
    {
        id: "ronaldinho",
        name: "Ronaldinho",
        nationality: "Brésil",
        clubs: ["Grêmio", "Paris Saint-Germain", "FC Barcelone", "AC Milan", "Flamengo", "Atlético Mineiro"],
        leagues: ["Ligue 1", "Liga", "Serie A", "Brasileirão"],
        trophies: ["Coupe du Monde", "Ligue des Champions", "Copa America", "Libertadores", "Liga", "Serie A"],
        awards: ["Ballon d'Or"],
        teammates: ["Ronaldo", "Rivaldo", "Messi", "Eto'o", "Deco"],
        managers: ["Luiz Felipe Scolari", "Frank Rijkaard", "Carlo Ancelotti"],
        retired: true
    },
    {
        id: "buffon",
        name: "Gianluigi Buffon",
        nationality: "Italie",
        clubs: ["Parme", "Juventus", "Paris Saint-Germain"],
        leagues: ["Serie A", "Ligue 1"],
        trophies: ["Coupe du Monde", "Serie A", "Ligue 1", "Coupe UEFA"],
        awards: [],
        teammates: ["Cannavaro", "Del Piero", "Pirlo", "Chiellini", "Mbappé", "Verratti"],
        managers: ["Marcello Lippi", "Antonio Conte", "Massimiliano Allegri"],
        retired: true
    },
    {
        id: "lewandowski",
        name: "Robert Lewandowski",
        nationality: "Pologne",
        clubs: ["Lech Poznan", "Borussia Dortmund", "Bayern Munich", "FC Barcelone"],
        leagues: ["Bundesliga", "Liga"],
        trophies: ["Ligue des Champions", "Bundesliga", "Liga"],
        awards: ["Soulier d'Or", "The Best"],
        teammates: ["Neuer", "Müller", "Reus", "Gundogan", "Pedri"],
        managers: ["Jurgen Klopp", "Pep Guardiola", "Hansi Flick", "Xavi"],
        retired: false
    },
    {
        id: "kroos",
        name: "Toni Kroos",
        nationality: "Allemagne",
        clubs: ["Bayern Munich", "Bayer Leverkusen", "Real Madrid"],
        leagues: ["Bundesliga", "Liga"],
        trophies: ["Coupe du Monde", "Ligue des Champions", "Bundesliga", "Liga"],
        awards: [],
        teammates: ["Müller", "Schweinsteiger", "Modric", "Ronaldo", "Ramos"],
        managers: ["Jupp Heynckes", "Pep Guardiola", "Carlo Ancelotti", "Zinedine Zidane"],
        retired: true
    },
    {
        id: "ramos",
        name: "Sergio Ramos",
        nationality: "Espagne",
        clubs: ["FC Séville", "Real Madrid", "Paris Saint-Germain"],
        leagues: ["Liga", "Ligue 1"],
        trophies: ["Coupe du Monde", "Euro", "Ligue des Champions", "Liga", "Ligue 1"],
        awards: [],
        teammates: ["Casillas", "Ronaldo", "Iniesta", "Pique", "Messi", "Neymar"],
        managers: ["Vicente del Bosque", "Jose Mourinho", "Zinedine Zidane", "Carlo Ancelotti"],
        retired: false // Free agent technically
    },
    {
        id: "iniesta",
        name: "Andrés Iniesta",
        nationality: "Espagne",
        clubs: ["FC Barcelone", "Vissel Kobe", "Emirates Club"],
        leagues: ["Liga", "J-League"],
        trophies: ["Coupe du Monde", "Euro", "Ligue des Champions", "Liga"],
        awards: [],
        teammates: ["Xavi", "Messi", "Puyol", "Busquets", "Villa"],
        managers: ["Pep Guardiola", "Vicente del Bosque", "Luis Enrique"],
        retired: true // Announced recently
    }
];

// --- CATEGORIES DATABASE ---
export const GRID_CATEGORIES: GridCategory[] = [
    // CLUBS
    { id: "c-real", type: "club", label: "A joué au Real Madrid", rule: (p) => p.clubs.includes("Real Madrid") },
    { id: "c-barca", type: "club", label: "A joué au FC Barcelone", rule: (p) => p.clubs.includes("FC Barcelone") },
    { id: "c-psg", type: "club", label: "A joué au PSG", rule: (p) => p.clubs.includes("Paris Saint-Germain") },
    { id: "c-juve", type: "club", label: "A joué à la Juventus", rule: (p) => p.clubs.includes("Juventus") },
    { id: "c-manutd", type: "club", label: "A joué à Man Utd", rule: (p) => p.clubs.includes("Manchester United") },
    { id: "c-bayern", type: "club", label: "A joué au Bayern Munich", rule: (p) => p.clubs.includes("Bayern Munich") },
    { id: "c-chelsea", type: "club", label: "A joué à Chelsea", rule: (p) => p.clubs.includes("Chelsea") },
    { id: "c-acmilan", type: "club", label: "A joué à l'AC Milan", rule: (p) => p.clubs.includes("AC Milan") },

    // LEAGUES
    { id: "l-PL", type: "league", label: "A joué en Premier League", rule: (p) => p.leagues.includes("Premier League") },
    { id: "l-L1", type: "league", label: "A joué en Ligue 1", rule: (p) => p.leagues.includes("Ligue 1") },
    { id: "l-SerA", type: "league", label: "A joué en Serie A", rule: (p) => p.leagues.includes("Serie A") },

    // NATIONALITIES
    { id: "n-fra", type: "country", label: "Français 🇫🇷", rule: (p) => p.nationality === "France" },
    { id: "n-bra", type: "country", label: "Brésilien 🇧🇷", rule: (p) => p.nationality === "Brésil" },
    { id: "n-arg", type: "country", label: "Argentin 🇦🇷", rule: (p) => p.nationality === "Argentine" },
    { id: "n-esp", type: "country", label: "Espagnol 🇪🇸", rule: (p) => p.nationality === "Espagne" },

    // TROPHIES & AWARDS
    { id: "t-ucl", type: "award", label: "Vainqueur Ligue des Champions", rule: (p) => p.trophies.includes("Ligue des Champions") },
    { id: "t-cdm", type: "award", label: "Vainqueur Coupe du Monde", rule: (p) => p.trophies.includes("Coupe du Monde") },
    { id: "t-bo", type: "award", label: "Ballon d'Or", rule: (p) => p.awards.includes("Ballon d'Or") },

    // MANAGERS
    { id: "m-pep", type: "stat", label: "Coaché par Guardiola", rule: (p) => p.managers.includes("Pep Guardiola") },
    { id: "m-mou", type: "stat", label: "Coaché par Mourinho", rule: (p) => p.managers.includes("Jose Mourinho") },
    { id: "m-zizou", type: "stat", label: "Coaché par Zidane", rule: (p) => p.managers.includes("Zinedine Zidane") },
    { id: "m-carlo", type: "stat", label: "Coaché par Ancelotti", rule: (p) => p.managers.includes("Carlo Ancelotti") },
];
