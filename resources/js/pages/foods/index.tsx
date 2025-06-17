// File: resources/js/pages/foods/Index.tsx

import { Head, Link, usePage, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FoodDayGroup, SharedData, Food } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Index({ foodsByDay }: { foodsByDay: FoodDayGroup[] }) {
    const { flash } = usePage<SharedData>().props;
    const [isDeleting, setIsDeleting] = useState<Food | null>(null);

    const handleDelete = () => {
        if (!isDeleting) return;
        router.delete(route('foods.destroy', isDeleting.id), {
            onFinish: () => setIsDeleting(null),
        });
    };

    return (
        <AppLayout>
            <Head title="My Foods" />

            <div className="p-4 sm:p-6 lg:p-8">
                {flash?.success && (
                    <Alert className="mb-6 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <div>
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{flash.success}</AlertDescription>
                        </div>
                    </Alert>
                )}

                <div className="flex flex-row items-center justify-between">
                    <Heading title="My Food Log" description="A list of all the food you have consumed, grouped by day." />
                    <Link href={route('foods.pre-added')}>
                        <Button className='cursor-pointer'>Add New Food</Button>
                    </Link>
                </div>

                <div className="mt-6 space-y-8">
                    {foodsByDay.length > 0 ? (
                        foodsByDay.map((dayGroup) => (
                            <div key={dayGroup.date}>
                                <h2 className="mb-4 text-xl font-bold tracking-tight">{dayGroup.formatted_date}</h2>

                                {/* Daily Statistics */}
                                <Card className="mb-4 bg-secondary/50">
                                    <CardHeader>
                                        <CardTitle className="text-base font-medium">Daily Totals</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Calories</p>
                                                <p className="text-2xl font-bold">{Math.round(dayGroup.totals.calories)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Protein</p>
                                                <p className="text-2xl font-bold">{Math.round(dayGroup.totals.protein_g)}g</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Carbs</p>
                                                <p className="text-2xl font-bold">{Math.round(dayGroup.totals.carbs_g)}g</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Fat</p>
                                                <p className="text-2xl font-bold">{Math.round(dayGroup.totals.fat_g)}g</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Food Table for the day */}
                                <Card className='bg-sidebar p-4'>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Calories</TableHead>
                                                <TableHead>Protein</TableHead>
                                                <TableHead>Carbs</TableHead>
                                                <TableHead>Fat</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dayGroup.foods.map((food: Food) => (
                                                <TableRow key={food.id}>
                                                    <TableCell className="font-medium">{food.name}</TableCell>
                                                    <TableCell>{food.calories} kcal</TableCell>
                                                    <TableCell>{food.protein_g}g</TableCell>
                                                    <TableCell>{food.carbs_g}g</TableCell>
                                                    <TableCell>{food.fat_g}g</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link href={route('foods.edit', food.id)}>
                                                                <Button className='cursor-pointer' variant="outline" size="icon">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={() => setIsDeleting(food)}
                                                                className='cursor-pointer'
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center">
                            <Card className="mx-auto max-w-md">
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground">You haven't logged any food yet.</p>
                                    <Link href={route('foods.create')} className="mt-4 inline-block">
                                        <Button>Log Your First Food</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={!!isDeleting} onOpenChange={(open) => !open && setIsDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the food item: <strong>{isDeleting?.name}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
