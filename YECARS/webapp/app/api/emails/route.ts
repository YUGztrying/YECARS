
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { type, data, target } = await req.json();

        if (!data) {
            return NextResponse.json({ error: 'Data is required' }, { status: 400 });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error("RESEND_API_KEY is not configured");
            return NextResponse.json({ error: "Configuration error" }, { status: 500 });
        }

        const clientEmail = data.user_email || data.email;
        // Target defaults: 'all' (backward compat), 'admin_notification', 'client_confirmed', 'client_refused'
        const effectiveTarget = target || 'all';

        // --- 1. PREPARE CLIENT EMAIL CONTENT ---
        let clientSubject = "";
        let clientHtml = "";

        if (type === 'subscription') {
            // ... Subscription logic stays same, usually auto-confirmed for now or ignored in this target logic update
            // For brevity, skipping full rewrite of subscription html here unless requested.
            // Assuming subscription flow remains automatic/direct for now or separate task.
            // I'll keep the existing subscription logic for safety but wrap sending.
            const dateDebut = new Date(data.start_date);
            const dateFin = new Date(data.end_date);
            const dateDebutFormatted = dateDebut.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
            const dateFinFormatted = dateFin.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

            clientSubject = `✅ Confirmation de votre abonnement YECARS ${data.plan_name}`;
            clientHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                <div style="background: #dc2626; color: white; padding: 25px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 24px;">YECARS - Abonnement Confirmé</h1>
                </div>
                <div style="padding: 30px;">
                    <p>Votre abonnement <strong>${data.plan_name}</strong> est actif du ${dateDebutFormatted} au ${dateFinFormatted}.</p>
                </div>
            </div>`;
        }
        else {
            // Reservation Logic
            const dateService = new Date(data.date_service);
            const dateFormatted = dateService.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            if (effectiveTarget === 'client_refusal') {
                clientSubject = `❌ Réservation YECARS refusée - ${dateFormatted}`;
                clientHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="background: #991b1b; color: white; padding: 25px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                        <h1 style="margin: 0; font-size: 24px;">Réservation Refusée</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1e293b; margin-top: 0;">Bonjour ${data.prenom},</h2>
                        <p style="color: #374151; font-size: 16px;">
                            Malheureusement, nous ne pouvons pas confirmer votre réservation pour le <strong>${dateFormatted} à ${data.heure_service}</strong>.
                        </p>
                        <p style="color: #374151;">
                            Ce créneau n'est plus disponible ou ne correspond pas à nos disponibilités actuelles.
                        </p>
                        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ef4444;">
                            <h3 style="color: #991b1b; margin-top: 0;">Que faire ?</h3>
                            <p style="color: #7f1d1d; margin: 0;">
                                Nous vous invitons à effectuer une nouvelle réservation en choisissant une autre date ou un autre horaire sur notre site.
                            </p>
                        </div>
                        <p style="text-align: center;">
                            <a href="https://yecars.autos/reservation" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Réserver à nouveau</a>
                        </p>
                    </div>
                </div>`;
            } else {
                const serviceLabels: any = {
                    lavage_unique: "Lavage Unique",
                    detailing_car: "Detailing Car",
                    nettoyage_sieges_tissus: "Sièges Tissus",
                    nettoyage_sieges_cuir: "Sièges Cuir",
                    cirage_exterieur_complet: "Cirage Extérieur",
                    sol_bas_caisse_moteur: "Sol + Moteur",
                    lavage_express_sans_eau: "Lavage sans eau"
                };
                // Confirmation (Standard)
                clientSubject = `✅ Confirmation de votre réservation YECARS pour le ${dateFormatted}`;
                clientHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="background: #dc2626; color: white; padding: 25px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                        <h1 style="margin: 0; font-size: 24px;">Réservation Confirmée</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1e293b; margin-top: 0;">Bonjour ${data.prenom},</h2>
                        <p style="color: #374151; font-size: 16px;">
                            Votre réservation pour le <strong>${dateFormatted} à ${data.heure_service}</strong> a été validée par notre équipe.
                        </p>
                        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
                            <h3 style="color: #15803d; margin-top: 0;">Confirmation Admin</h3>
                            <p style="color: #15803d; margin: 0;">
                                Un technicien YECARS sera présent à l'heure convenue.
                            </p>
                        </div>
                    </div>
                </div>`;
            }
        }

        // --- 2. PREPARE ADMIN EMAIL CONTENT ---
        let adminSubject = "";
        let adminHtml = "";

        // Similar admin logic as before...
        const dateService = new Date(data.date_service);
        const dateFormatted = dateService.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        adminSubject = `🚗 Nouvelle réservation YECARS - ${data.prenom} ${data.nom} (${dateFormatted})`;
        adminHtml = `
            <div>
                <h1>Nouvelle demande de réservation</h1>
                <p><strong>Client:</strong> ${data.prenom} ${data.nom}</p>
                <p><strong>Date:</strong> ${dateFormatted} à ${data.heure_service}</p>
                <p><strong>Statut:</strong> En attente de validation</p>
                <p>Veuillez vous connecter à l'admin pour confirmer ou refuser.</p>
            </div>
        `;

        // --- 3. SEND MAILS LOGIC ---
        const sendEmail = async (to: string, subject: string, html: string) => {
            if (!to) return null;
            return fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'YECARS <reservations@yecars.autos>',
                    to: [to],
                    subject: subject,
                    html: html
                })
            });
        };

        const emailsToSend = [];

        // Logic switch
        if (effectiveTarget === 'admin_notification') {
            console.log("Sending only Admin Notification");
            emailsToSend.push(sendEmail('yecars225@gmail.com', adminSubject, adminHtml));
        }
        else if (effectiveTarget === 'client_confirmation') {
            console.log("Sending only Client Confirmation");
            emailsToSend.push(sendEmail(clientEmail, clientSubject, clientHtml));
        }
        else if (effectiveTarget === 'client_refusal') {
            console.log("Sending only Client Refusal");
            emailsToSend.push(sendEmail(clientEmail, clientSubject, clientHtml));
        }
        else {
            // 'all' or default (e.g. subscriptions)
            emailsToSend.push(sendEmail('yecars225@gmail.com', adminSubject, adminHtml));
            emailsToSend.push(sendEmail(clientEmail, clientSubject, clientHtml));
        }

        await Promise.allSettled(emailsToSend);
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
