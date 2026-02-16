'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthLoadingOverlay() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Token değişimini dinle
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' || e.key === null) {
                setIsLoading(true);
                // Kısa bir gecikme ile sayfayı yenile
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-lg font-semibold text-slate-900">Hesap değiştiriliyor...</p>
                <p className="text-sm text-slate-500">Lütfen bekleyin</p>
            </div>
        </div>
    );
}
