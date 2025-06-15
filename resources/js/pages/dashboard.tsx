import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { TbMeat } from "react-icons/tb";
import { GiButter } from "react-icons/gi";
import { FaBowlRice } from "react-icons/fa6";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type User = { name : String };
type PageProps = { auth: { user: User}};

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[20vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex flex-col justify-center h-full pl-8">
                        <h2 className="text-5xl font-bold">
                            {(() => {
                                const hour = new Date().getHours();
                                if (hour >= 5 && hour < 12) return 'Good Morning';
                                if (hour >= 12 && hour < 17) return 'Good Afternoon';
                                if (hour >= 17 && hour < 21) return 'Good Evening';
                                return 'Hello';
                            })()}, {auth.user.name}
                        </h2>
                    </div>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="relative min-h-[300px] rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex flex-col gap-8 h-full items-center justify-center">
                            <h2 className="text-2xl">Calories Consumed Today</h2>
                            <div className="relative flex flex-col items-center">
                                <svg className="size-40" viewBox="0 0 120 120">
                                    {/* Background circle */}
                                    <circle 
                                        className="stroke-muted" 
                                        cx="60" 
                                        cy="60" 
                                        r="55" 
                                        fill="none" 
                                        strokeWidth="10"
                                    />
                                    {/* Progress circle - set stroke-dasharray and stroke-dashoffset dynamically */}
                                    <circle 
                                        className="stroke-primary transition-all duration-700 ease-out"
                                        cx="60" 
                                        cy="60" 
                                        r="55"
                                        fill="none"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        transform="rotate(-90 60 60)"
                                        strokeDasharray="345.6"
                                        strokeDashoffset="172.8" // Adjust this value (345.6 * (1 - progress))
                                    />
                                    <text 
                                        x="60" 
                                        y="55" 
                                        className="fill-foreground text-xl font-bold" 
                                        textAnchor="middle"
                                    >
                                        1200
                                    </text>
                                    <text 
                                        x="60" 
                                        y="75" 
                                        className="fill-muted-foreground text-xs" 
                                        textAnchor="middle"
                                    >
                                        calories
                                    </text>
                                </svg>
                                <div className="mt-2 text-sm text-muted-foreground">out of 2000 calories needed today</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative min-h-[300px] rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex h-full flex-col justify-center space-y-4 p-6">
                        <h2 className="text-2xl">Food Distribution</h2>
                            <div className="space-y-2 flex flex-row items-center border border-sidebar-border/70 dark:border-sidebar-border rounded-xl p-2">
                                <TbMeat className="border h-12 w-12 p-2 rounded-xl mb-0 self-center"/>
                                <div className="flex-1 pl-2">
                                    <div className="flex items-center justify-between p-2">
                                        <span className="text-sm font-large">Protein</span>
                                        <span className="text-sm text-muted-foreground">45g / 120g</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full w-[37.5%] rounded-full bg-primary transition-all duration-300 ease-in-out" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 flex flex-row border border-sidebar-border/70 dark:border-sidebar-border rounded-xl p-2">
                                <GiButter className="border h-12 w-12 p-2 mb-0 rounded-xl"/>
                                <div className="flex-1 pl-2">
                                    <div className="flex items-center justify-between p-2">
                                        <span className="text-sm font-medium">Fat</span>
                                        <span className="text-sm text-muted-foreground">25g / 65g</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full w-[38.5%] rounded-full bg-primary transition-all duration-300 ease-in-out" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 flex flex-row border border-sidebar-border/70 dark:border-sidebar-border rounded-xl p-2">
                                <FaBowlRice className="border h-12 w-12 p-2 mb-0 rounded-xl"/>
                                <div className="flex-1 pl-2">
                                    <div className="flex items-center justify-between p-2">
                                        <span className="text-sm font-medium">Carbs</span>
                                        <span className="text-sm text-muted-foreground">89g / 275g</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full w-[32.4%] rounded-full bg-primary transition-all duration-300 ease-in-out" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    {/* TODO: make "Eaten Today" */}
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
