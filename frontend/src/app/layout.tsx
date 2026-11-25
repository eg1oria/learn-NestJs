import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Literata } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "cyrillic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: { default: "Гильдия героев · курс бэкенда", template: "%s · Гильдия героев" },
  description: "Персональный курс бэкенда на NestJS со сквозным проектом.",
};

/** Ставит тему до первой отрисовки: сохранённая → системная. */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-theme="light"
      suppressHydrationWarning
      className={`${plex.variable} ${literata.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line py-6 text-center text-xs text-muted">
          Прогресс обновляет ментор после каждой проверки · <code className="font-mono">learning/progress.json</code>
        </footer>
      </body>
    </html>
  );
}
