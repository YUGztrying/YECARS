"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { Reservation } from "@/types";

interface ClientInfoFormProps {
    data: Partial<Reservation>;
    onChange: (data: Partial<Reservation>) => void;
    isUserLoggedIn?: boolean;
}

export default function ClientInfoForm({ data, onChange, isUserLoggedIn = false }: ClientInfoFormProps) {
    const handleChange = (field: keyof Reservation, value: string) => {
        onChange({ [field]: value });
    };

    // Le champ email ne doit être désactivé QUE si l'utilisateur est vraiment connecté
    // ET que l'email a été pré-rempli (c'est-à-dire qu'il contient déjà une valeur)
    const isEmailPrefilledFromAccount = isUserLoggedIn && data.email && data.email.length > 0;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                    <Label htmlFor="prenom" className="flex items-center gap-2 text-sm sm:text-base">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        Prénom *
                    </Label>
                    <Input
                        id="prenom"
                        value={data.prenom || ''}
                        onChange={(e) => handleChange('prenom', e.target.value)}
                        placeholder="Votre prénom"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nom" className="text-sm sm:text-base">Nom *</Label>
                    <Input
                        id="nom"
                        value={data.nom || ''}
                        onChange={(e) => handleChange('nom', e.target.value)}
                        placeholder="Votre nom"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        Email *
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="votre@email.com"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        disabled={!!isEmailPrefilledFromAccount}
                    />
                    {isEmailPrefilledFromAccount && (
                        <p className="text-xs text-slate-500">
                            Email automatiquement rempli depuis votre compte
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="telephone" className="flex items-center gap-2 text-sm sm:text-base">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        Téléphone *
                    </Label>
                    <Input
                        id="telephone"
                        type="tel"
                        value={data.telephone || ''}
                        onChange={(e) => handleChange('telephone', e.target.value)}
                        placeholder="06 12 34 56 78"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="adresse" className="flex items-center gap-2 text-sm sm:text-base">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    Adresse complète *
                </Label>
                <Input
                    id="adresse"
                    value={data.adresse || ''}
                    onChange={(e) => handleChange('adresse', e.target.value)}
                    placeholder="123 rue de la République"
                    className="h-10 sm:h-12 text-sm sm:text-base"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="ville" className="text-sm sm:text-base">Ville *</Label>
                <Input
                    id="ville"
                    value={data.ville || ''}
                    onChange={(e) => handleChange('ville', e.target.value)}
                    placeholder="Abidjan"
                    className="h-10 sm:h-12 text-sm sm:text-base"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="commentaires" className="text-sm sm:text-base">Commentaires ou demandes spéciales</Label>
                <Textarea
                    id="commentaires"
                    value={data.commentaires || ''}
                    onChange={(e) => handleChange('commentaires', e.target.value)}
                    placeholder="Informations complémentaires (digicode, instructions d'accès, etc.)"
                    className="h-20 sm:h-24 text-sm sm:text-base resize-none"
                />
            </div>
        </div>
    );
}
