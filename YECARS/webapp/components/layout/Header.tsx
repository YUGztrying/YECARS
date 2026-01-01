"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Phone, Menu, X, LogIn, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoadingUser(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsLoadingUser(false);
        };

        fetchUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fermer le menu quand l'URL change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const handleLogin = () => {
        // Redirect to login page
        // window.location.href works reliably without importing useRouter here if not needed widely, 
        // but let's using next/navigation implementation if possible. 
        // Since we are inside a client component with router available?
        // Header doesn't have useRouter imported. Wait, look at imports.
        // Line 5: import { usePathname } from "next/navigation";
        // I should verify if router is available. If not, window.location is safe.
        window.location.href = "/login";
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            window.location.href = "/";
        } catch (error) {
            console.error("Erreur de déconnexion", error);
        }
    };

    const baseNavLinks = [
        { href: createPageUrl("Accueil"), label: "Accueil" },
        { href: createPageUrl("Abonnements"), label: "Abonnements" },
        { href: createPageUrl("Reservation"), label: "Réserver" }
    ];

    const userNavLinks = [
        { href: "/mes-reservations", label: "Mes réservations" },
        { href: "/mes-abonnements", label: "Mon abonnement" }
    ];

    const adminLink = { href: "/admin/reservations", label: "Admin", icon: Shield };

    // Helper to check for admin role (mock logic or based on metadata)
    const isAdmin = user?.app_metadata?.role === 'admin' || user?.email?.includes('admin');

    return (
        <header className="bg-white/90 backdrop-blur-md border-b border-red-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link href={createPageUrl("Accueil")} className="flex items-center gap-3">
                        <img
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/03f1e2ac7_YECARSMobileCarWashLogo.png"
                            alt="YECARS Lavage auto à domicile"
                            className="w-14 h-14 object-contain" />

                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-slate-900">YECARS</h1>
                            <p className="text-xs text-red-600">Lavage auto à domicile</p>
                        </div>
                    </Link>

                    {/* Navigation Desktop */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {baseNavLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-red-600 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        {user && userNavLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-red-600 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link href={adminLink.href} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-red-600 transition-colors">
                                <adminLink.icon className="w-4 h-4" /> {adminLink.label}
                            </Link>
                        )}
                    </nav>

                    {/* Boutons CTA & Connexion Desktop */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href={createPageUrl("Reservation")}
                            className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition-all duration-200 text-sm">
                            Réserver
                        </Link>
                        {!isLoadingUser && (
                            user ? (
                                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                                    <LogOut className="w-4 h-4" /> Se déconnecter
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" onClick={handleLogin} className="flex items-center gap-2">
                                    <LogIn className="w-4 h-4" /> Se connecter
                                </Button>
                            )
                        )}
                    </div>

                    {/* Bouton Menu Mobile */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md hover:bg-slate-100 transition-colors"
                            aria-label="Ouvrir le menu">
                            {isMenuOpen ?
                                <X className="w-6 h-6 text-slate-800" /> :
                                <Menu className="w-6 h-6 text-slate-800" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile Dépliant */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-red-100 z-40">
                    <nav className="flex flex-col p-4">
                        {baseNavLinks.map((link) => (
                            <Link key={`mobile-${link.href}`} href={link.href} className="py-3 px-4 rounded-lg text-lg font-medium hover:bg-slate-100 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        {user && userNavLinks.map((link) => (
                            <Link key={`mobile-${link.href}`} href={link.href} className="py-3 px-4 rounded-lg text-lg font-medium hover:bg-slate-100 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link href={adminLink.href} className="py-3 px-4 rounded-lg text-lg font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
                                <adminLink.icon className="w-5 h-5" /> {adminLink.label}
                            </Link>
                        )}

                        <div className="border-t border-slate-200 mt-4 pt-4 space-y-4">
                            {!isLoadingUser && (
                                user ? (
                                    <Button variant="outline" size="lg" onClick={handleLogout} className="w-full flex items-center gap-2">
                                        <LogOut className="w-5 h-5" /> Se déconnecter
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="lg" onClick={handleLogin} className="w-full flex items-center gap-2">
                                        <LogIn className="w-5 h-5" /> Se connecter
                                    </Button>
                                )
                            )}
                            <a
                                href="tel:+2250170876218"
                                className="flex items-center justify-center gap-2 text-slate-600 hover:text-red-600 transition-colors py-2">
                                <Phone className="w-4 h-4" />
                                <span>+225 01 70 87 62 18</span>
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
