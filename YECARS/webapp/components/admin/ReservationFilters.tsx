
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ReservationFiltersProps {
    filters: {
        search: string;
        status: string;
        dateFrom: string;
        dateTo: string;
        service: string;
    };
    onFiltersChange: (update: any) => void; // Using any or specific setter type
}

export default function ReservationFilters({ filters, onFiltersChange }: ReservationFiltersProps) {
    // Helper to handle partial state updates if passed a setter (React SetStateAction style) or merging manually
    const updateFilter = (key: string, value: string) => {
        // Assuming onFiltersChange expects a callback or new object. 
        // Based on snippet 10: onFiltersChange(prev => ({ ...prev, [key]: value }));
        // So passed prop is likely setFilters directly.
        onFiltersChange((prev: any) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Recherche */}
            <div className="lg:col-span-2">
                <Label className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4" />
                    Rechercher
                </Label>
                <Input
                    placeholder="Nom, email, téléphone ou adresse..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="h-10"
                />
            </div>

            {/* Statut */}
            <div>
                <Label className="flex items-center gap-2 mb-2">
                    <Filter className="w-4 h-4" />
                    Statut
                </Label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger className="h-10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="en_attente">En attente</SelectItem>
                        <SelectItem value="en_attente_paiement">En attente de paiement</SelectItem>
                        <SelectItem value="confirmee">Confirmée</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="terminee">Terminée</SelectItem>
                        <SelectItem value="annulee">Annulée</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Service */}
            <div>
                <Label className="mb-2 block">Service</Label>
                <Select value={filters.service} onValueChange={(value) => updateFilter('service', value)}>
                    <SelectTrigger className="h-10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les services</SelectItem>
                        <SelectItem value="essentiel">Essentiel</SelectItem>
                        <SelectItem value="confort">Confort</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="prestige">Prestige</SelectItem>
                        <SelectItem value="nettoyage_integral_sieges">Nettoyage Sièges</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Dates */}
            <div className="lg:col-span-1 space-y-4">
                <div>
                    <Label className="mb-2 block">Date début</Label>
                    <Input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => updateFilter('dateFrom', e.target.value)}
                        className="h-10"
                    />
                </div>

                <div>
                    <Label className="mb-2 block">Date fin</Label>
                    <Input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => updateFilter('dateTo', e.target.value)}
                        className="h-10"
                    />
                </div>
            </div>
        </div>
    );
}
