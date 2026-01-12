export interface Reservation {
    id?: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    service_type: string[];
    supplementary_options?: string[];
    date_service: string;
    heure_service: string;
    type_vehicule: string;
    prix: number;
    statut: 'en_attente' | 'en_attente_paiement' | 'confirmee' | 'en_cours' | 'terminee' | 'annulee';
    commentaires?: string;
    created_at?: string;
}

export interface SubscriptionPlan {
    id?: string;
    name: string;
    price: number;
    duration_months: number;
    details: string[];
    is_featured: boolean;
    usage_limits?: Record<string, number>;
}

export interface UserSubscription {
    id?: string;
    user_email: string;
    nom: string;
    prenom: string;
    telephone: string;
    adresse?: string;
    ville?: string;
    plan_id: string;
    plan_name: string;
    start_date?: string;
    end_date?: string;
    status: 'en_attente' | 'actif' | 'expire' | 'annule';
    usage_counts?: Record<string, number>;
    is_initial_payment_collected: boolean;
    duration_months: number;
    price_paid: number;
    created_at?: string;
    updated_at?: string;
}
