import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { TbMeat } from "react-icons/tb";
import { GiButter } from "react-icons/gi";
import { FaBowlRice } from "react-icons/fa6";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subscribe to MoniFit',
        href: '/subscribe',
    },
];

type User = { name : String };
type PageProps = { auth: { user: User}};

export default function Subscribe() {
    const { auth } = usePage<PageProps>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscribe to MoniFit" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="relative min-h-[20vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex flex-col justify-center h-full pl-8">
                        <h2 className="text-5xl font-bold">Choose Your Plan</h2>
                        <p className="text-xl text-muted-foreground mt-4">Select the subscription that best fits your needs</p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Basic Plan */}
                    <div className="flex flex-col p-6 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h3 className="text-2xl font-bold">Basic</h3>
                        <div className="mt-4 text-3xl font-bold">Rp12.000<span className="text-lg text-muted-foreground">/month</span></div>
                        <ul className="mt-6 space-y-4 flex-1">
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Basic meal tracking</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Weight tracking</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Basic analytics</span>
                            </li>
                        </ul>
                        <button className="mt-8 w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors cursor-pointer">
                            Subscribe Now
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="flex flex-col p-6 rounded-xl border-2 border-primary relative">
                        <div className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">Popular</div>
                        <h3 className="text-2xl font-bold">Pro</h3>
                        <div className="mt-4 text-3xl font-bold">Rp24.000<span className="text-lg text-muted-foreground">/month</span></div>
                        <ul className="mt-6 space-y-4 flex-1">
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Everything in Basic</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Advanced analytics</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Meal planning</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Workout tracking</span>
                            </li>
                        </ul>
                        <button className="mt-8 w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors cursor-pointer">
                            Subscribe Now
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="flex flex-col p-6 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <h3 className="text-2xl font-bold">Premium</h3>
                        <div className="mt-4 text-3xl font-bold">Rp80.000<span className="text-lg text-muted-foreground">/month</span></div>
                        <ul className="mt-6 space-y-4 flex-1">
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Everything in Pro</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">1-on-1 coaching</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Personalized meal plans</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3">Priority support</span>
                            </li>
                        </ul>
                        <button className="mt-8 w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors cursor-pointer">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
