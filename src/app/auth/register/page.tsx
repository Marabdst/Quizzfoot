"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Client-side validation
        if (username.length < 3) { setError("Le pseudo doit faire au moins 3 caractères"); return; }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) { setError("Pseudo : lettres, chiffres, _ et - uniquement"); return; }
        if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères"); return; }

        setLoading(true);
        const result = await signUp(email, password, username);
        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            // Auto redirect after a short delay
            setTimeout(() => router.push("/profile"), 2000);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="font-heading text-2xl font-bold mb-2">Compte créé !</h2>
                    <p className="text-muted-foreground mb-4">Vérifie tes emails si nécessaire, puis connecte-toi.</p>
                    <Link href="/auth/login"><Button>Se connecter</Button></Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md">
                <Card className="glass-card">
                    <CardHeader className="text-center">
                        <div className="text-4xl mb-2">⚽</div>
                        <CardTitle className="text-2xl">Inscription</CardTitle>
                        <CardDescription>Crée ton compte et commence à jouer</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input type="text" placeholder="Pseudo" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} maxLength={20}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input type={showPwd ? "text" : "password"} placeholder="Mot de passe (6 car. min)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {showPwd ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                </button>
                            </div>
                            <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Créer mon compte <ArrowRight className="h-4 w-4" /></>}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Déjà un compte ? <Link href="/auth/login" className="text-primary hover:underline">Se connecter</Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
