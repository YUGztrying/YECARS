"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Phone, Menu, X, LogIn, LogOut, Shield, ArrowRight } from "lucide-react";
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
    const adminEmails = ['yecars225@gmail.com', 'guyismaelmbengue@gmail.com'];
    const isAdmin = user?.app_metadata?.role === 'admin' || user?.email?.includes('admin') || (user?.email && adminEmails.includes(user.email));

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
                <div className="lg:hidden absolute top-full left-0 w-full bg-slate-900 shadow-2xl border-t border-slate-800 z-50 animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col p-6 space-y-1">
                        {baseNavLinks.map((link) => (
                            <Link
                                key={`mobile-${link.href}`}
                                href={link.href}
                                className="py-3 px-4 rounded-xl text-lg font-semibold text-slate-100 hover:bg-white/10 transition-all flex items-center justify-between group"
                            >
                                {link.label}
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>
                        ))}
                        {user && userNavLinks.map((link) => (
                            <Link
                                key={`mobile-${link.href}`}
                                href={link.href}
                                className="py-3 px-4 rounded-xl text-lg font-semibold text-slate-100 hover:bg-white/10 transition-all flex items-center justify-between group"
                            >
                                {link.label}
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link
                                href={adminLink.href}
                                className="py-3 px-4 rounded-xl text-lg font-semibold text-red-400 hover:bg-red-400/10 transition-all flex items-center gap-3"
                            >
                                <adminLink.icon className="w-5 h-5" /> {adminLink.label}
                            </Link>
                        )}

                        <div className="border-t border-white/10 mt-6 pt-6 space-y-6">
                            {!isLoadingUser && (
                                user ? (
                                    <div className="space-y-4">
                                        <div className="px-4 py-3 bg-white/5 rounded-xl">
                                            <p className="text-xs text-slate-400 mb-1 leading-none uppercase tracking-wider font-bold">Connecté en tant que</p>
                                            <p className="text-sm text-white font-medium truncate">{user.email}</p>
                                        </div>
                                        <Button variant="outline" size="lg" onClick={handleLogout} className="w-full h-14 border-white/20 text-white hover:bg-white hover:text-slate-900 rounded-xl flex items-center justify-center gap-3 transition-all font-bold">
                                            <LogOut className="w-5 h-5" /> Se déconnecter
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="default" size="lg" onClick={handleLogin} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-3 transition-all font-bold shadow-lg shadow-red-900/20 text-lg">
                                        <LogIn className="w-5 h-5" /> Se connecter
                                    </Button>
                                )
                            )}
                            <a
                                href="tel:+2250170876218"
                                className="flex items-center justify-center gap-3 text-slate-400 hover:text-red-400 transition-colors py-4 bg-white/5 rounded-xl font-medium">
                                <Phone className="w-5 h-5" />
                                <span>+225 01 70 87 62 18</span>
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
