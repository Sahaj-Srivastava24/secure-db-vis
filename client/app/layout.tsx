import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { QueryProvider } from "@/components/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DB Visualizer",
  description: "A modern database visualization tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="container mx-auto p-4 flex-1">{children}</main>
                <footer className="py-4 text-center text-sm text-muted-foreground">
                  made by{" "}
                  <a
                    href="https://github.com/Sahaj-Srivastava24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    mad1ad
                  </a>
                </footer>
              </div>
              <Toaster
                duration={5000}
                className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg"
              />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}