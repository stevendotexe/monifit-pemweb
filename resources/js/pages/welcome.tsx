import { type SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { LandingNavbar } from '@/components/layout/LandingNavbar';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-50">
                <LandingNavbar />
                <main className="pt-16">
                    {/* Your existing content */}
                </main>
            </div>
        </>
    );
}
