"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Reservation as ReservationType } from "@/types";
import { User } from "@supabase/supabase-js";

import ClientInfoForm from "@/components/reservation/ClientInfoForm";
import ServiceSelection from "@/components/reservation/ServiceSelection";
import DateTimeSelection from "@/components/reservation/DateTimeSelection";
import OrderSummary from "@/components/reservation/OrderSummary";
import PaymentSection from "@/components/reservation/PaymentSection";
import { useRouter } from "next/navigation";

const STEPS = [
    { id: 1, title: "Informations", icon: MapPin },
    { id: 2, title: "Service", icon: Calendar },
    { id: 3, title: "Date & Heure", icon: Clock },
    { id: 4, title: "Paiement", icon: CreditCard }
];

export default function ReservationPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [user, setUser] = useState<User | null>(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [reservationData, setReservationData] = useState<Partial<ReservationType>>({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        ville: "",
        service_type: [],
        date_service: "",
        heure_service: "",
        type_vehicule: "",
        prix: 0,
        commentaires: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                setIsUserLoggedIn(true);
                setReservationData(prev => ({
                    ...prev,
                    email: user.email || '',
                    // Try to guess name from metadata if available, otherwise blank
                    nom: user.user_metadata?.full_name?.split(' ').pop() || '',
                    prenom: user.user_metadata?.full_name?.split(' ')[0] || ''
                }));
            }
        } catch (error) {
            console.log("Utilisateur non connecté ou erreur:", error);
            setUser(null);
            setIsUserLoggedIn(false);
        }
    };

    const updateReservationData = (newData: Partial<ReservationType>) => {
        setReservationData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmitReservation = async () => {
        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('reservations')
                .insert({
                    ...reservationData,
                    statut: 'en_attente', // Default status
                    // If user is logged in, we might want to link it to their ID, but schema didn't specify user_id
                    // Adding user_id if column exists would be good, but following strict schema provided:
                })
                .select();

            if (error) throw error;
            if (!data || data.length === 0) throw new Error("La réservation a été créée mais aucune donnée n'a été retournée.");

            const newReservation = data[0];

            // Send confirmation emails
            try {
                await fetch('/api/emails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'reservation',
                        data: newReservation,
                        target: 'admin_notification' // Client gets no email yet
                    })
                });
            } catch (emailError) {
                console.error("Erreur lors de l'envoi des emails:", emailError);
            }

            router.push(`/confirmation?reservation_id=${newReservation.id}`);

        } catch (error: any) {
            console.error("Erreur complète détectée:", error);

            // Log properties individually since JSON.stringify fails on Error objects
            if (error && typeof error === 'object') {
                console.log("Message d'erreur:", error.message);
                console.log("Code d'erreur:", error.code);
                console.log("Détails d'erreur:", error.details);
            }

            let message = "Une erreur est survenue lors de la réservation.";

            if (error.message) {
                message = error.message;
            } else if (error.error_description) {
                message = error.error_description;
            } else if (error.details) {
                message = error.details;
            } else if (typeof error === 'string') {
                message = error;
            } else {
                message = error.code ? `Erreur ${error.code}: ${error.message || 'RLS Policy Issue'}` : "Erreur technique (vérifiez la console)";
            }

            setSubmitError(message);
        }
        setIsSubmitting(false);
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return !!(reservationData.nom && reservationData.prenom && reservationData.email &&
                    reservationData.telephone && reservationData.adresse && reservationData.ville);
            case 2:
                return !!(reservationData.service_type && reservationData.service_type.length > 0 && reservationData.type_vehicule);
            case 3:
                return !!(reservationData.date_service && reservationData.heure_service);
            case 4:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Réserver votre service à domicile
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600">
                        Suivez ces étapes simples pour réserver votre service
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2 md:space-x-8">
                            {STEPS.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step.id
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                            : 'bg-white border-slate-300 text-slate-400'
                                            }`}>
                                            <step.icon className="w-4 h-4 md:w-6 md:h-6" />
                                        </div>
                                        <span className={`mt-2 text-[10px] md:text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'
                                            }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className={`h-0.5 w-4 sm:w-12 md:w-24 transition-all duration-300 ${currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'
                                            }`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl border-0">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                                <CardTitle className="text-2xl text-slate-900">
                                    {currentStep === 1 && "Vos informations"}
                                    {currentStep === 2 && "Choix du service"}
                                    {currentStep === 3 && "Date et horaire"}
                                    {currentStep === 4 && "Paiement"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {currentStep === 1 && (
                                            <ClientInfoForm
                                                data={reservationData}
                                                onChange={updateReservationData}
                                                isUserLoggedIn={isUserLoggedIn}
                                            />
                                        )}
                                        {currentStep === 2 && (
                                            <ServiceSelection
                                                data={reservationData}
                                                onChange={updateReservationData}
                                            />
                                        )}
                                        {currentStep === 3 && (
                                            <DateTimeSelection
                                                data={reservationData}
                                                onChange={updateReservationData}
                                            />
                                        )}
                                        {currentStep === 4 && (
                                            <PaymentSection
                                                data={reservationData}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>



                                {submitError && (
                                    <Alert variant="destructive" className="mt-6">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {submitError}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                                    <Button
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className="px-6"
                                    >
                                        Précédent
                                    </Button>

                                    {currentStep < 4 ? (
                                        <Button
                                            onClick={nextStep}
                                            disabled={!isStepValid()}
                                            className="bg-blue-600 hover:bg-blue-700 px-6"
                                        >
                                            Suivant
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSubmitReservation}
                                            disabled={isSubmitting || !isStepValid()}
                                            className="bg-green-600 hover:bg-green-700 px-8"
                                        >
                                            {isSubmitting ? "Confirmation..." : "Confirmer la réservation"}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <OrderSummary data={reservationData} />

                        {/* Error Alert Location (Mobile/Sidebar fallback) */}
                        {/* We'll actually put the main error inside the card for better visibility */}
                    </div>
                </div>
            </div>
        </div >
    );
}

// NOTE: I need to allow adding state for error message earlier in the file.
// I will use a separate replace_file_content for the state definition and import.
