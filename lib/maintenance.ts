/**
 * Maintenance Mode Configuration
 *
 * To enable maintenance mode:
 * 1. Set environment variable NEXT_PUBLIC_MAINTENANCE_MODE=true in Vercel
 * 2. Redeploy the site
 *
 * To disable:
 * 1. Set NEXT_PUBLIC_MAINTENANCE_MODE=false (or remove it)
 * 2. Redeploy
 */

export function isMaintenanceMode(): boolean {
    return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
}

export const maintenanceConfig = {
    title: "Site en maintenance",
    message: "Nous effectuons actuellement des travaux de maintenance pour améliorer votre expérience.",
    returnDate: "Retour prévu : Février 2026",
    contactEmail: "contact@yecars.autos",
    contactPhone: "+225 XX XX XX XX XX",
};
