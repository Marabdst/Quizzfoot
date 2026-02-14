import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
    description: APP_DESCRIPTION,
    metadataBase: new URL(APP_URL),
    openGraph: {
        title: APP_NAME,
        description: APP_DESCRIPTION,
        url: APP_URL,
        siteName: APP_NAME,
        locale: "fr_FR",
        type: "website",
    },
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.svg" },
    manifest: "/manifest.json",
    other: { "mobile-web-app-capable": "yes", "apple-mobile-web-app-capable": "yes" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                <meta name="theme-color" content="#22C55E" />
                <link rel="apple-touch-icon" href="/icon-192.svg" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', () => {
                                    navigator.serviceWorker.register('/sw.js');
                                });
                            }
                        `,
                    }}
                />
            </head>
            <body className="min-h-screen flex flex-col">
                <Providers>
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
