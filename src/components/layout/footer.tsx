import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
    return (
        <footer className="border-t bg-card/50 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 font-heading text-lg font-bold mb-3">
                            <span>⚽</span>
                            <span className="text-gradient">{APP_NAME}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Le quiz football ultime. Teste tes connaissances et défie tes amis !
                        </p>
                    </div>
                    <div>
                        <h4 className="font-heading font-semibold mb-3">Navigation</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/categories" className="hover:text-foreground transition-colors">Catégories</Link></li>
                            <li><Link href="/daily" className="hover:text-foreground transition-colors">Daily Challenge</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-foreground transition-colors">Classement</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-heading font-semibold mb-3">Infos</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Mode démo — données locales</li>
                            <li>150+ questions sur 10 catégories</li>
                            <li>Open source &amp; gratuit</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t mt-8 pt-4 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} {APP_NAME}. Fait avec ❤️ et ⚽
                </div>
            </div>
        </footer>
    );
}
