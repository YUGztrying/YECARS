"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Reservation as ReservationType, UserSubscription } from "@/types";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Clock } from "lucide-react";

import AdminStats from "@/components/admin/AdminStats";
import ReservationFilters from "@/components/admin/ReservationFilters";
import ReservationTable from "@/components/admin/ReservationTable";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminReservations() {
    const [reservations, setReservations] = useState<ReservationType[]>([]);
    const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<ReservationType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        dateFrom: "",
        dateTo: "",
        service: "all"
    });

    const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user?.email) setCurrentUserEmail(data.user.email);
        });
    }, []);

    const loadReservations = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('reservations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReservations(data || []);
        } catch (error) {
            console.error("Erreur lors du chargement des réservations:", error);
        }
    }, []);

    const loadSubscriptions = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('user_subscriptions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubscriptions(data || []);
        } catch (error) {
            console.error("Erreur lors du chargement des abonnements:", error);
        }
    }, []);

    const initData = useCallback(async () => {
        setIsLoading(true);
        await Promise.all([loadReservations(), loadSubscriptions()]);
        setIsLoading(false);
    }, [loadReservations, loadSubscriptions]);

    const applyFilters = useCallback(() => {
        let filtered = [...reservations];

        if (filters.search) {
            filtered = filtered.filter(r =>
                `${r.prenom} ${r.nom}`.toLowerCase().includes(filters.search.toLowerCase()) ||
                r.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                r.telephone.includes(filters.search) ||
                r.adresse.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.status !== "all") {
            filtered = filtered.filter(r => r.statut === filters.status);
        }

        if (filters.service !== "all") {
            filtered = filtered.filter(r => {
                const services = Array.isArray(r.service_type) ? r.service_type : [r.service_type].filter(Boolean);
                return services.some((s: string) => s === filters.service);
            });
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(r => new Date(r.date_service) >= new Date(filters.dateFrom));
        }
        if (filters.dateTo) {
            filtered = filtered.filter(r => new Date(r.date_service) <= new Date(filters.dateTo));
        }

        setFilteredReservations(filtered);
    }, [reservations, filters]);

    useEffect(() => {
        initData();
    }, [initData]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const updateReservationStatus = useCallback(async (reservationId: string, newStatus: string, serviceTypeFixed?: string[]) => {
        try {
            // Optimistic update
            setReservations(prev => prev.map(r =>
                r.id === reservationId ? { ...r, statut: newStatus as any } : r
            ));

            const updateData: any = { statut: newStatus };

            if (serviceTypeFixed) {
                updateData.service_type = serviceTypeFixed;
            }

            const { error } = await supabase.from('reservations').update(updateData).eq('id', reservationId);
            if (error) throw error;

            // Optionally reload to ensure consistency, but optimistic update handles the immediate UI feedback
            loadReservations();
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour:", error);
            alert(`Erreur de mise à jour: ${error.message || error.error_description || JSON.stringify(error)}`);
            // Revert on error (optional, but good practice if critical)
            await loadReservations();
        }
    }, [loadReservations]);

    const deleteReservation = useCallback(async (reservationId: string) => {
        try {
            const { error } = await supabase.from('reservations').delete().eq('id', reservationId);
            if (error) throw error;

            await loadReservations();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Erreur lors de la suppression de la réservation");
        }
    }, [loadReservations]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-slate-600">Chargement du panneau d'administration...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <AdminStats reservations={reservations} subscriptions={subscriptions} />

            <Card className="mb-6 shadow-lg border-0">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Filtres et recherche
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                            Connecté en tant que: {currentUserEmail}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ReservationFilters filters={filters} onFiltersChange={setFilters} />
                </CardContent>
            </Card>

            <Card className="shadow-xl border-0">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Liste des réservations ({filteredReservations.length})</span>
                        <span className="text-sm font-normal text-slate-600">
                            Total: {reservations.length} réservations
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ReservationTable
                        reservations={filteredReservations}
                        onStatusUpdate={updateReservationStatus}
                        onDelete={deleteReservation}
                    />
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
