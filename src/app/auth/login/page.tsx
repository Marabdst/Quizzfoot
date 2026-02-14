"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await signIn(email, password);
        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/profile");
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md">
                <Card className="glass-card">
                    <CardHeader className="text-center">
                        <div className="text-4xl mb-2">⚽</div>
                        <CardTitle className="text-2xl">Connexion</CardTitle>
                        <CardDescription>Connecte-toi pour sauvegarder ta progression</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {showPwd ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                </button>
                            </div>
                            <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Se connecter <ArrowRight className="h-4 w-4" /></>}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Pas encore de compte ? <Link href="/auth/register" className="text-primary hover:underline">S&apos;inscrire</Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
