"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Reservation } from "@/types";

const allTimeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
    "20:00 - 22:00",
    "22:00 - 00:00",
    "00:00 - 02:00",
    "02:00 - 04:00",
    "04:00 - 06:00",
    "06:00 - 08:00"
];

export default function DateTimeSelection({ data, onChange }: { data: Partial<Reservation>, onChange: (data: Partial<Reservation>) => void }) {
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (!data.date_service) {
                setBookedSlots([]);
                return;
            }
            setIsLoadingSlots(true);
            try {
                const { data: reservations, error } = await supabase
                    .from('reservations')
                    .select('heure_service')
                    .eq('date_service', data.date_service)
                    .neq('statut', 'annulee');

                if (error) throw error;

                const slots = reservations?.map(r => r.heure_service) || [];
                setBookedSlots(slots);
            } catch (error) {
                console.error("Erreur lors de la récupération des créneaux:", error);
            }
            setIsLoadingSlots(false);
        };

        fetchBookedSlots();
    }, [data.date_service]);

    const handleChange = (field: keyof Reservation, value: string) => {
        if (field === 'date_service') {
            // Réinitialiser le créneau horaire quand la date change
            onChange({ [field]: value, 'heure_service': '' });
        } else {
            onChange({ [field]: value });
        }
    };

    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

    // Permettre les réservations à partir d'aujourd'hui (jour même)
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Date Selection */}
                <Card className="border-2 hover:border-blue-200 transition-all duration-200">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            </div>
                            <div>
                                <Label className="text-base md:text-lg font-semibold">Date du service *</Label>
                                <p className="text-xs md:text-sm text-slate-600">Choisissez votre date (même le jour J !)</p>
                            </div>
                        </div>
                        <Input
                            type="date"
                            min={minDate}
                            value={data.date_service || ''}
                            onChange={(e) => handleChange('date_service', e.target.value)}
                            className="h-10 md:h-12 text-sm md:text-lg"
                        />
                    </CardContent>
                </Card>

                {/* Time Selection */}
                <Card className="border-2 hover:border-blue-200 transition-all duration-200">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            </div>
                            <div>
                                <Label className="text-base md:text-lg font-semibold">Créneau horaire *</Label>
                                <p className="text-xs md:text-sm text-slate-600">Sélectionnez l'heure de passage</p>
                            </div>
                        </div>
                        <Select
                            value={data.heure_service || ''}
                            onValueChange={(value) => handleChange('heure_service', value)}
                            disabled={!data.date_service || isLoadingSlots}
                        >
                            <SelectTrigger className="h-10 md:h-12 text-sm md:text-lg">
                                <SelectValue placeholder={!data.date_service ? "Choisissez une date d'abord" : "Choisir un créneau"} />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoadingSlots ? (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Chargement...
                                    </div>
                                ) : availableSlots.length > 0 ? (
                                    availableSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot} className="text-sm md:text-lg py-2 md:py-3">
                                            {slot}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-slate-600">
                                        Aucun créneau disponible pour cette date.
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>

            {/* Information Box */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 md:p-6">
                    <h3 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">✅ Informations importantes</h3>
                    <ul className="text-blue-800 text-xs md:text-sm space-y-1">
                        <li>• <strong>Service 24h/24, 7j/7 :</strong> Nous travaillons tous les jours pour votre confort !</li>
                        <li>• <strong>RDV le jour même possible :</strong> Vous pouvez réserver pour aujourd'hui</li>
                        <li>• La durée du service peut aller jusqu'à 2 heures</li>
                        <li>• Nous vous contactons 30 minutes avant notre arrivée</li>
                        <li>• Nous apportons tout le matériel et les produits nécessaires</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
