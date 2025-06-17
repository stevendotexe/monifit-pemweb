import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data History',
        href: '/data/history',
    },
];

type WeightLog = {
    id: number;
    weight_kg: number;
    date: string;
};

type NutritionData = {
    date: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
};

type HydrationData = {
    date: string;
    water_ml: number;
};

type PageProps = {
    weightLogs: WeightLog[];
    nutritionData: NutritionData[];
    hydrationData: HydrationData[];
};

export default function History({ weightLogs, nutritionData, hydrationData }: PageProps) {
    const weightData = {
        labels: weightLogs.map(log => new Date(log.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Weight (kg)',
                data: weightLogs.map(log => log.weight_kg),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const nutritionChartData = {
        labels: nutritionData.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Calories',
                data: nutritionData.map(item => item.calories),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
            {
                label: 'Protein (g)',
                data: nutritionData.map(item => item.protein_g),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1,
            },
            {
                label: 'Carbs (g)',
                data: nutritionData.map(item => item.carbs_g),
                borderColor: 'rgb(255, 206, 86)',
                tension: 0.1,
            },
            {
                label: 'Fat (g)',
                data: nutritionData.map(item => item.fat_g),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const hydrationChartData = {
        labels: hydrationData.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Water (ml)',
                data: hydrationData.map(item => item.water_ml),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: false,
            },
        },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data History" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className='bg-sidebar'>
                        <CardHeader>
                            <CardTitle>Weight History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <Line options={chartOptions} data={weightData} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='bg-sidebar'>
                        <CardHeader>
                            <CardTitle>Hydration History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <Line options={chartOptions} data={hydrationChartData} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='bg-sidebar md:col-span-2'>
                        <CardHeader>
                            <CardTitle>Nutrition History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <Line options={chartOptions} data={nutritionChartData} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 