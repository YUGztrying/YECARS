"use client";

import React, { useState, useEffect } from "react";
import { Reservation } from "@/types";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Car, Phone } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusColors: any = {
    en_attente: "bg-yellow-100 text-yellow-800",
    en_attente_paiement: "bg-orange-100 text-orange-800",
    confirmee: "bg-blue-100 text-blue-800",
    en_cours: "bg-purple-100 text-purple-800",
    terminee: "bg-green-100 text-green-800",
    annulee: "bg-red-100 text-red-800"
};

const statusLabels: any = {
    en_attente: "En attente",
    en_attente_paiement: "En attente de paiement",
    confirmee: "Confirmée",
    en_cours: "En cours",
    terminee: "Terminée",
    annulee: "Annulée"
};

const serviceLabels: any = {
    lavage_simple: "Lavage Simple",
    lavage_premium: "Lavage Premium",
    lavage_complet: "Formule Complète",
    nettoyage_interieur: "Nettoyage Intérieur",
    // Fallbacks based on previous arrays
    essentiel: "Essentiel",
    confort: "Confort",
    premium: "Premium",
    prestige: "Prestige"
};

export default function MesReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            // If user is not logged in, we can't show reservations easily unless we rely on local storage or handle it elsewhere
            if (!user || !user.email) {
                setIsLoading(false);
                return;
            }

            // Filter by email
            const { data, error } = await supabase
                .from('reservations')
                .select('*')
                .eq('email', user.email) // Using email as the link
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReservations(data || []);
        } catch (error) {
            console.error("Erreur lors du chargement:", error);
            setReservations([]);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-slate-600">Chargement de vos réservations...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Mes réservations
                    </h1>
                    <p className="text-xl text-slate-600">
                        Suivez l'état de vos demandes de lavage
                    </p>
                </div>

                {reservations.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Car className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Aucune réservation
                            </h3>
                            <p className="text-slate-600">
                                Vous n'avez pas encore réservé de service de lavage.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {reservations.map((reservation) => (
                            <Card key={reservation.id} className="shadow-lg border-0 overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl text-slate-900 mb-2">
                                                {/* Handle array or string service type */}
                                                {Array.isArray(reservation.service_type)
                                                    ? reservation.service_type.map(s => serviceLabels[s] || s).join(', ')
                                                    : serviceLabels[reservation.service_type] || reservation.service_type
                                                }
                                            </CardTitle>
                                            <Badge className={statusColors[reservation.statut] || "bg-gray-100"}>
                                                {statusLabels[reservation.statut] || reservation.statut}
                                            </Badge>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {reservation.prix?.toLocaleString()} FCFA
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                Réservé le {reservation.created_at ? format(new Date(reservation.created_at), 'dd MMM yyyy', { locale: fr }) : '-'}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {format(new Date(reservation.date_service), 'EEEE dd MMMM yyyy', { locale: fr })}
                                                    </p>
                                                    <p className="text-sm text-slate-600">{reservation.heure_service}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-slate-900">{reservation.adresse}</p>
                                                    <p className="text-sm text-slate-600">
                                                        {reservation.ville}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Car className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-slate-900 capitalize">
                                                        {reservation.type_vehicule}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-slate-900">{reservation.telephone}</p>
                                                    <p className="text-sm text-slate-600">{reservation.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {reservation.commentaires && (
                                        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                                            <p className="text-sm text-slate-700">
                                                <strong>Commentaires :</strong> {reservation.commentaires}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
