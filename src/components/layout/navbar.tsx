"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Trophy, Home, LayoutGrid, Calendar, User, Shield, LogIn, LogOut, Loader2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/categories", label: "Catégories", icon: LayoutGrid },
    { href: "/daily", label: "Daily", icon: Calendar },
    { href: "/leaderboard", label: "Classement", icon: Trophy },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, loading, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-50 w-full glass-card border-b">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold">
                    <span className="text-2xl">⚽</span>
                    <span className="text-gradient">{APP_NAME}</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    <Link href="/leaderboard" className="hover:text-primary transition-colors flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        Classement
                    </Link>
                    <Link href="/grid" className="font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-1 animate-pulse">
                        🧩 Mercato Grid
                    </Link>
                    <ThemeToggle />
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : user ? (
                        <>
                            <Link
                                href="/profile"
                                className={cn(
                                    "hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    pathname === "/profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                <User className="h-4 w-4" />
                                <span className="max-w-[100px] truncate">
                                    {user.user_metadata?.username || user.email?.split("@")[0] || "Profil"}
                                </span>
                            </Link>
                            <Link href="/admin" className="hidden md:flex">
                                <Shield className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                title="Déconnexion"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <LogIn className="h-4 w-4" />
                            Connexion
                        </Link>
                    )}
                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-accent"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t bg-background/95 backdrop-blur-xl">
                    <div className="container mx-auto px-4 py-4 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                        {/* Mobile auth links */}
                        {user ? (
                            <>
                                <Link href="/profile" onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent">
                                    <User className="h-5 w-5" />
                                    {user.user_metadata?.username || "Profil"}
                                </Link>
                                <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
                                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10">
                                    <LogOut className="h-5 w-5" />
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/10">
                                <LogIn className="h-5 w-5" />
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
