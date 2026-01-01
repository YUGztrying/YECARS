"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Users, Shield, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (!user) {
            setLoading(false);
            return router.push('/login'); // Or home
        }

        // Check admin role - assuming it's in user_metadata or a separate profiles table
        // For now, checking a metadata field 'role'
        const role = user.user_metadata?.role;
        if (role === 'admin') {
            setIsAdmin(true);
        } else {
            // Handle unauthorized
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Administration YECARS</h1>
                                <p className="text-slate-600">Gestion des réservations et abonnements</p>
                            </div>
                        </div>

                        {user && (
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-green-600" />
                                <span className="text-slate-600">Connecté en tant que</span>
                                <span className="font-semibold text-slate-900">{user.email}</span>
                                {isAdmin && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Admin</span>}
                            </div>
                        )}
                    </div>

                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </Button>
                </div>

                {/* Admin Navigation */}
                <div className="mb-6 flex border-b">
                    <Link
                        href="/admin/reservations"
                        className={`px-4 py-2 text-sm font-medium ${pathname.includes('/admin/reservations') ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Réservations
                    </Link>
                    <Link
                        href="/admin/subscriptions"
                        className={`px-4 py-2 text-sm font-medium ${pathname.includes('/admin/subscriptions') ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Abonnements
                    </Link>
                </div>

                {/* Page Content */}
                {!isAdmin ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3 text-red-800">
                        <Shield className="w-5 h-5" />
                        <div>
                            <strong>Accès restreint.</strong> Votre compte ne dispose pas des droits d'administrateur.
                        </div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
