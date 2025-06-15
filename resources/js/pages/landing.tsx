import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Scale } from 'lucide-react';
import { MdDirectionsRun as RunningMan } from "react-icons/md";
import { LuSalad } from "react-icons/lu";

import { 
    Card,
    CardContent,
    CardTitle,
    CardDescription
 } from '@/components/ui/card'
import { FaAppleAlt, FaRunning, FaBed } from 'react-icons/fa';

export default function Landing() {
    return (
        <>
            <Head title="MoniFit - Your Personal Health & Fitness Companion">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            {/* Navigation */}
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-15 bg-gradient-to-b from-primary/17 to-background">
                {/* Lamp housing effect */}
                {/* <div
                    className="absolute left-1/2 -translate-x-1/2 -top-32 w-32 h-10 bg-gray-900/70 rounded-xl shadow-lg z-10"
                    aria-hidden="true"
                /> */}
                {/* Light square effect */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 -top-24 w-[800px] h-[300px] bg-white/40 rounded-3xl blur-3xl opacity-20 pointer-events-none z-0"
                    aria-hidden="true"
                />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8">
                            <h1 className="text-5xl font-bold leading-tight">
                                Transform Your Health Journey with <span className="text-primary">MoniFit</span>
                            </h1>
                            <p className="text-xl muted">
                                Track your nutrition, monitor your fitness progress, and achieve your health goals with our comprehensive health tracking app.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={route('bmi-test')}>
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

            {/* Features */}
            <section className="pt-10 px-15" id="features">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center gap-10">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-center">Features</h2>
                        </div>
                        <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <Card>
                                    <CardContent>
                                        <Scale className="h-6 w-6 card-foreground mb-4" />
                                        <CardTitle className="text-xl">Weight Tracking</CardTitle>
                                        <CardDescription>
                                            Monitor and take action on your Body Mass Index to keep a healthy and balanced lifestyle.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent>
                                        <RunningMan className="h-6 w-6 card-foreground mb-4" />
                                        <CardTitle className="text-xl">Calorie Intake Tracking</CardTitle>
                                        <CardDescription>
                                            Log and monitor what you consume.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                                <Card>
                                <CardContent>
                                        <LuSalad className="h-6 w-6 card-foreground mb-4" />
                                        <CardTitle className="text-xl">Find Cheap & Healthy Foods</CardTitle>
                                        <CardDescription>
                                            Find vendors serving healthy foods at a quick pace.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Balance is Important Section */}
            <section className="py-20 bg-background px-15">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-4 text-center">Why Balance is Important</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl text-center mb-8">
                        Achieving a balance between nutrition, physical activity, and rest is crucial for overall well-being. A balanced lifestyle helps maintain a healthy weight, reduces the risk of chronic diseases, improves mood and energy levels, and supports long-term health. MoniFit empowers you to track and manage all aspects of your health journey, making it easier to find your personal balance.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl">
                        <div className="p-6 rounded-lg border bg-white dark:bg-card shadow-sm flex flex-col items-center">
                            <FaAppleAlt className="text-4xl mb-2" />
                            <h3 className="font-semibold text-lg mb-2">Nutrition</h3>
                            <p className="text-muted-foreground text-center">Proper nutrition fuels your body and mind, supporting growth, repair, and daily activities.</p>
                        </div>
                        <div className="p-6 rounded-lg border bg-white dark:bg-card shadow-sm flex flex-col items-center">
                            <FaRunning className="text-4xl mb-2" />
                            <h3 className="font-semibold text-lg mb-2">Physical Activity</h3>
                            <p className="text-muted-foreground text-center">Regular exercise strengthens your body, boosts mood, and helps prevent chronic diseases.</p>
                        </div>
                        <div className="p-6 rounded-lg border bg-white dark:bg-card shadow-sm flex flex-col items-center">
                            <FaBed className="text-4xl mb-2" />
                            <h3 className="font-semibold text-lg mb-2">Rest & Recovery</h3>
                            <p className="text-muted-foreground text-center">Adequate rest and sleep are essential for recovery, mental clarity, and overall health.</p>
                        </div>
                    </div>
                    {/* Supported by Research */}
                    <div className="mt-12 w-full max-w-3xl">
                        <h3 className="text-xl font-semibold mb-4 text-center">Supported by Research</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>
                                <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7019938/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Nutrition and Health: Guidelines for Dietary Balance (NIH)</a>
                            </li>
                            <li>
                                <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4241367/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Physical Activity and Risk of Chronic Disease (NIH)</a>
                            </li>
                            <li>
                                <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2656292/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Sleep and Health: The Importance of Sleep for Well-being (NIH)</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Logo Philosophy Section */}
            <section className="py-16 bg-white dark:bg-background px-15 border-t">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4 text-center">Logo Philosophy</h2>
                    <img src="/images/logowhite.png" alt="MoniFit Logo" className="mx-auto mb-4 w-32 h-auto" />
                    <p className="text-lg text-muted-foreground max-w-2xl text-center mb-4">
                        Our logo is a golden ratio, with an orange above the "i" in MoniFit symbolizing health, vitality, and a fresh start. The circle represents wholeness and balance, which are at the core of our mission.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 bg-gray-100 dark:bg-gray-900 text-center text-gray-500 dark:text-gray-400 border-t mt-8">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col items-center md:flex-row md:items-center gap-2 md:gap-6">
                        <img src="/images/logowhite.png" alt="MoniFit Logo" className="w-16 h-auto mb-2 md:mb-0" />
                        <span className="font-bold text-lg">MoniFit</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
                        <Link href="/bmi-test" className="hover:underline">BMI Test</Link>
                        <Link href="/login" className="hover:underline">Login</Link>
                        <Link href="/register" className="hover:underline">Register</Link>
                    </div>
                    <div className="text-xs mt-2 md:mt-0">&copy; {new Date().getFullYear()} MoniFit. All rights reserved.</div>
                </div>
            </footer>
        </>
    );
} 