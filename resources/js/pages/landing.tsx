import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Activity, Apple, ChevronRight } from 'lucide-react';

export default function Landing() {
    return (
        <>
            <Head title="MoniFit - Your Personal Health & Fitness Companion">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            MoniFit
                        </Link>
                        <div className="hidden md:flex space-x-6">
                            <Link href="#features" className="text-gray-600 hover:text-primary">Features</Link>
                            <Link href="#pricing" className="text-gray-600 hover:text-primary">Pricing</Link>
                            <Link href="#testimonials" className="text-gray-600 hover:text-primary">Testimonials</Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href={route('login')} className="text-gray-600 hover:text-primary">
                            Log in
                        </Link>
                        <Link href={route('register')}>
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8">
                            <h1 className="text-5xl font-bold leading-tight">
                                Transform Your Health Journey with <span className="text-primary">MoniFit</span>
                            </h1>
                            <p className="text-xl text-gray-600">
                                Track your nutrition, monitor your fitness progress, and achieve your health goals with our comprehensive health tracking app.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={route('register')}>
                                    <Button size="lg" className="w-full sm:w-auto">
                                        Start Free Trial
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <img 
                                src="/images/hero-app.png" 
                                alt="MoniFit App Preview" 
                                className="w-full max-w-lg mx-auto rounded-lg shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need to Stay Healthy</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive tools and features to help you achieve your health and fitness goals
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-lg border bg-white hover:shadow-lg transition-shadow">
                            <Heart className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Nutrition Tracking</h3>
                            <p className="text-gray-600">
                                Track your daily meals, calories, and nutrients with our easy-to-use food diary.
                            </p>
                        </div>
                        <div className="p-6 rounded-lg border bg-white hover:shadow-lg transition-shadow">
                            <Activity className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Fitness Monitoring</h3>
                            <p className="text-gray-600">
                                Log your workouts, track your progress, and stay motivated with personalized goals.
                            </p>
                        </div>
                        <div className="p-6 rounded-lg border bg-white hover:shadow-lg transition-shadow">
                            <Apple className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Health Insights</h3>
                            <p className="text-gray-600">
                                Get detailed analytics and insights about your health journey and progress.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Health Journey?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of users who have transformed their lives with MoniFit
                    </p>
                    <Link href={route('register')}>
                        <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                            Get Started Now
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">MoniFit</h3>
                            <p className="text-sm">
                                Your personal health and fitness companion for a better lifestyle.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-white">Download</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white">About</Link></li>
                                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                                <li><Link href="#" className="hover:text-white">Careers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                                <li><Link href="#" className="hover:text-white">Terms</Link></li>
                                <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
                        © {new Date().getFullYear()} MoniFit. All rights reserved.
                    </div>
                </div>
            </footer>
        </>
    );
} 