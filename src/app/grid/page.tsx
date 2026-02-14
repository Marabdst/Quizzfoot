import { GridGame } from "@/components/grid/grid-game";
import { Navbar } from "@/components/layout/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mercato Grid - QuizzFoot",
    description: "Le défi quotidien : complète la grille avec les bons joueurs !",
};

export default function GridPage() {
    return (
        <div className="min-h-screen bg-background">
            <main className="container max-w-6xl mx-auto py-6 sm:py-8">
                <GridGame />
            </main>
        </div>
    );
}
