import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { TbMeat } from "react-icons/tb";
import { GiButter } from "react-icons/gi";
import { FaBowlRice, FaGlassWater } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type User = { name: string; gender: string; birth_date: string; weight_kg: number; height_cm: number; };
type TodayTotals = {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    water_ml: number;
};
type Food = {
    id: number;
    name: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    consumed_at: string;
};
type PageProps = { auth: { user: User }, todayTotals: TodayTotals, todayFoods: Food[] };

const GLASS_ML = 250; // Standard glass size in ml
const BOTTLE_ML = 500; // Standard water bottle size in ml

function calculateAge(birthDate: string) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function calculateBMR(user: User) {
    const age = calculateAge(user.birth_date);
    if (user.gender === 'male') {
        return 10 * user.weight_kg + 6.25 * user.height_cm - 5 * age + 5;
    } else {
        return 10 * user.weight_kg + 6.25 * user.height_cm - 5 * age - 161;
    }
}

function calculateTDEE(bmr: number) {
    // Assume sedentary for now (1.2)
    return Math.round(bmr * 1.2);
}

function getMacros(tdee: number) {
    // Standard: 20% protein, 30% fat, 50% carbs
    const proteinCals = tdee * 0.20;
    const fatCals = tdee * 0.30;
    const carbCals = tdee * 0.50;
    return {
        protein: Math.round(proteinCals / 4), // grams
        fat: Math.round(fatCals / 9), // grams
        carbs: Math.round(carbCals / 4), // grams
    };
}

function calculateBMI(weight_kg: number, height_cm: number) {
    const height_m = height_cm / 100;
    return weight_kg / (height_m * height_m);
}

function calculateHydrationNeeds(weight_kg: number, height_cm: number) {
    // Basic calculation: 30-35ml per kg of body weight
    // We'll use 33ml as a middle ground
    const baseHydration = weight_kg * 33;
    
    // Adjust based on BMI
    const bmi = calculateBMI(weight_kg, height_cm);
    let adjustment = 1.0;
    
    if (bmi < 18.5) {
        // Underweight - slightly increase hydration
        adjustment = 1.1;
    } else if (bmi > 25) {
        // Overweight - slightly decrease hydration
        adjustment = 0.9;
    }
    
    return Math.round(baseHydration * adjustment);
}

export default function Dashboard() {
    const { auth, todayTotals, todayFoods } = usePage<PageProps>().props;
    const [waterAmount, setWaterAmount] = useState('');
    const [isWaterOpen, setIsWaterOpen] = useState(false);
    const [weightAmount, setWeightAmount] = useState('');
    const [isWeightOpen, setIsWeightOpen] = useState(false);
    const user = auth.user;
    const bmr = calculateBMR(user);
    const tdee = calculateTDEE(bmr);
    const macros = getMacros(tdee);
    const caloriesConsumed = todayTotals.calories;
    const proteinConsumed = todayTotals.protein_g;
    const fatConsumed = todayTotals.fat_g;
    const carbsConsumed = todayTotals.carbs_g;
    const waterConsumed = todayTotals.water_ml || 0;
    const calorieProgress = tdee === 0 ? 0 : caloriesConsumed / tdee;
    const hydrationNeeds = calculateHydrationNeeds(user.weight_kg, user.height_cm);
    const hydrationProgress = hydrationNeeds === 0 ? 0 : waterConsumed / hydrationNeeds;

    const handleWaterLog = () => {
        const amount = parseInt(waterAmount);
        if (amount > 0) {
            router.post(route('water.log'), { amount }, {
                onSuccess: () => {
                    setWaterAmount('');
                    setIsWaterOpen(false);
                },
            });
        }
    };

    const addGlasses = (count: number) => {
        setWaterAmount((prev) => {
            const current = parseInt(prev) || 0;
            return (current + (count * GLASS_ML)).toString();
        });
    };

    const addBottle = () => {
        setWaterAmount((prev) => {
            const current = parseInt(prev) || 0;
            return (current + BOTTLE_ML).toString();
        });
    };

    const handleWeightLog = () => {
        const amount = parseFloat(weightAmount);
        if (amount > 0) {
            router.post(route('weight.log'), { weight_kg: amount }, {
                onSuccess: () => {
                    setWeightAmount('');
                    setIsWeightOpen(false);
                },
            });
        }
    };

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
                            })()}, {user.name}
                        </h2>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Dialog open={isWeightOpen} onOpenChange={setIsWeightOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Log Weight</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Log Your Weight</DialogTitle>
                                <DialogDescription>
                                    Enter your current weight in kilograms
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Weight in kg"
                                        value={weightAmount}
                                        onChange={(e) => setWeightAmount(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleWeightLog}>Save Weight</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => router.visit(route('data.history'))}>
                        View Data History
                    </Button>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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
                                    {/* Progress circle */}
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
                                        strokeDashoffset={`${345.6 * (1 - calorieProgress)}`}
                                    />
                                    <text 
                                        x="60" 
                                        y="55" 
                                        className="fill-foreground text-xl font-bold" 
                                        textAnchor="middle"
                                    >
                                        {caloriesConsumed}
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
                                <div className="mt-2 text-sm text-muted-foreground">out of {tdee} calories needed today</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative min-h-[300px] rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex flex-col gap-8 h-full items-center justify-center">
                            <h2 className="text-2xl">Hydration Today</h2>
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
                                    {/* Progress circle */}
                                    <circle 
                                        className="stroke-blue-500 transition-all duration-700 ease-out"
                                        cx="60" 
                                        cy="60" 
                                        r="55"
                                        fill="none"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        transform="rotate(-90 60 60)"
                                        strokeDasharray="345.6"
                                        strokeDashoffset={`${345.6 * (1 - hydrationProgress)}`}
                                    />
                                    <text 
                                        x="60" 
                                        y="55" 
                                        className="fill-foreground text-xl font-bold" 
                                        textAnchor="middle"
                                    >
                                        {waterConsumed}
                                    </text>
                                    <text 
                                        x="60" 
                                        y="75" 
                                        className="fill-muted-foreground text-xs" 
                                        textAnchor="middle"
                                    >
                                        ml
                                    </text>
                                </svg>
                                <div className="mt-2 text-sm text-muted-foreground">out of {hydrationNeeds}ml needed today</div>
                                <Dialog open={isWaterOpen} onOpenChange={setIsWaterOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="mt-4" variant="outline">
                                            <FaGlassWater className="mr-2 h-4 w-4" />
                                            Log Water
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Log Water Consumption</DialogTitle>
                                            <DialogDescription>
                                                Quick add common amounts or enter a custom amount below.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <div className="flex flex-wrap gap-2">
                                                    <Button variant="outline" onClick={() => addGlasses(1)}>
                                                        1 Glass ({GLASS_ML}ml)
                                                    </Button>
                                                    <Button variant="outline" onClick={() => addGlasses(2)}>
                                                        2 Glasses ({GLASS_ML * 2}ml)
                                                    </Button>
                                                    <Button variant="outline" onClick={() => addGlasses(3)}>
                                                        3 Glasses ({GLASS_ML * 3}ml)
                                                    </Button>
                                                    <Button variant="outline" onClick={addBottle}>
                                                        1 Bottle ({BOTTLE_ML}ml)
                                                    </Button>
                                                </div>
                                                <div className="mt-4">
                                                    <label htmlFor="water-amount" className="text-sm font-medium">
                                                        Custom Amount (ml)
                                                    </label>
                                                    <Input
                                                        id="water-amount"
                                                        type="number"
                                                        placeholder="Enter amount in ml"
                                                        value={waterAmount}
                                                        onChange={(e) => setWaterAmount(e.target.value)}
                                                    />
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-2">
                                                    <p>Quick reference:</p>
                                                    <ul className="list-disc list-inside">
                                                        <li>Standard glass: {GLASS_ML}ml</li>
                                                        <li>Standard bottle: {BOTTLE_ML}ml</li>
                                                        <li>Daily goal: {hydrationNeeds}ml</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <Button onClick={handleWaterLog} disabled={!waterAmount || parseInt(waterAmount) <= 0}>
                                                Log {waterAmount ? `${waterAmount}ml` : 'Water'}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
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
                                        <span className="text-sm text-muted-foreground">{proteinConsumed}g / {macros.protein}g</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div style={{ width: `${macros.protein === 0 ? 0 : (proteinConsumed / macros.protein) * 100}%` }} className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 flex flex-row border border-sidebar-border/70 dark:border-sidebar-border rounded-xl p-2">
                                <GiButter className="border h-12 w-12 p-2 mb-0 rounded-xl"/>
                                <div className="flex-1 pl-2">
                                    <div className="flex items-center justify-between p-2">
                                        <span className="text-sm font-medium">Fat</span>
                                        <span className="text-sm text-muted-foreground">{fatConsumed}g / {macros.fat}g</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div style={{ width: `${macros.fat === 0 ? 0 : (fatConsumed / macros.fat) * 100}%` }} className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 flex flex-row border border-sidebar-border/70 dark:border-sidebar-border rounded-xl p-2">
                                <FaBowlRice className="border h-12 w-12 p-2 mb-0 rounded-xl"/>
                                <div className="flex-1 pl-2">
                                    <div className="flex items-center justify-between p-2">
                                        <span className="text-sm font-medium">Carbs</span>
                                        <span className="text-sm text-muted-foreground">{carbsConsumed}g / {macros.carbs}g</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div style={{ width: `${macros.carbs === 0 ? 0 : (carbsConsumed / macros.carbs) * 100}%` }} className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <h2 className="text-2xl p-4">Foods Consumed Today</h2>
                    {todayFoods.length > 0 ? (
                        <ul className="p-4 space-y-2">
                            {todayFoods.map((food) => (
                                <li key={food.id} className="flex justify-between items-center p-2 border border-sidebar-border/70 dark:border-sidebar-border rounded-xl">
                                    <span className="font-medium">{food.name}</span>
                                    <span className="text-sm text-muted-foreground">{food.calories} calories</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-muted-foreground">No foods consumed today.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

