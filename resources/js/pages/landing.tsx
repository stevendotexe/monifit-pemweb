import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Activity, Apple, ChevronRight } from 'lucide-react';
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function Landing() {
    return (
        <>
            <Head title="MoniFit - Your Personal Health & Fitness Companion">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            {/* Navigation */}
            <nav>
                <LandingNavbar />
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 pl-20 pr-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8">
                            <h1 className="text-5xl font-bold leading-tight">
                                Transform Your Health Journey with <span className="text-primary">MoniFit</span>
                            </h1>
                            <p className="text-xl muted">
                                Track your nutrition, monitor your fitness progress, and achieve your health goals with our comprehensive health tracking app.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={route('register')}>
                                    <Button size="lg" className="w-full sm:w-auto cursor-pointer transition-colors">
                                        Take a quick BMI Test
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto cursor-pointer transition-colors">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="w-full max-w-lg mx-auto aspect-[4/3] rounded-lg shadow-2xl overflow-hidden">
                                <img 
                                    src="https://images.unsplash.com/photo-1642635055753-3eec6c0b2a6e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Person working out with fitness app"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learn More */}
            <section className="pt-10 pl-20 pr-20">
                <div className="container mx-auto px-4">
                    
                </div>
            </section>

        </>
    );
} 