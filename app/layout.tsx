import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MaintenancePage from "@/components/MaintenancePage";
import { cn } from "@/lib/utils";
import { isMaintenanceMode } from "@/lib/maintenance";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YECARS - Lavage auto à domicile",
  description: "Service de lavage auto premium à domicile à Abidjan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if maintenance mode is enabled
  const maintenanceMode = isMaintenanceMode();

  return (
    <html lang="fr">
      <body className={cn(inter.className, "min-h-screen bg-slate-50")} suppressHydrationWarning>
        {maintenanceMode ? (
          <MaintenancePage />
        ) : (
          <>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
