import React from 'react';
import { Construction, Mail, Phone, Calendar } from 'lucide-react';
import { maintenanceConfig } from '@/lib/maintenance';
import Image from 'next/image';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-32 h-32">
                            <Image
                                src="/logo.png"
                                alt="YECARS Logo"
                                width={128}
                                height={128}
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Construction Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-100 rounded-full p-6">
                            <Construction className="w-16 h-16 text-red-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">
                        {maintenanceConfig.title}
                    </h1>

                    {/* Message */}
                    <p className="text-lg text-center text-slate-600 mb-8">
                        {maintenanceConfig.message}
                    </p>

                    {/* Return Date */}
                    <div className="bg-slate-50 rounded-lg p-6 mb-8">
                        <div className="flex items-center justify-center gap-3">
                            <Calendar className="w-6 h-6 text-red-600" />
                            <p className="text-lg font-semibold text-slate-800">
                                {maintenanceConfig.returnDate}
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t border-slate-200 pt-8">
                        <p className="text-center text-slate-600 mb-4">
                            Pour toute urgence, contactez-nous :
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
                            <a
                                href={`mailto:${maintenanceConfig.contactEmail}`}
                                className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                <span className="font-medium">{maintenanceConfig.contactEmail}</span>
                            </a>
                            {maintenanceConfig.contactPhone && (
                                <a
                                    href={`tel:${maintenanceConfig.contactPhone}`}
                                    className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span className="font-medium">{maintenanceConfig.contactPhone}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            Merci de votre patience et de votre compréhension.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
