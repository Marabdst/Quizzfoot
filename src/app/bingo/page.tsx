import { Navbar } from "@/components/layout/navbar";
import { BingoGame } from "@/components/bingo/bingo-game";

export const metadata = {
    title: "Bingo Foot - Mode Carrière | QuizzFoot",
    description: "Devine le joueur mystère en cochant les bons indices de sa carrière.",
};

export default function BingoPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container max-w-6xl mx-auto px-4 py-8">
                <BingoGame />
            </main>
        </div>
    );
}
