// File: resources/js/pages/foods/Edit.tsx

import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Heading from '@/components/heading';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Food } from '@/types';

export default function EditFood({ food }: { food: Food }) {
    const { data, setData, put, processing, errors, transform } = useForm({
        name: food.name || '',
        calories: String(food.calories || ''),
        protein_g: String(food.protein_g || ''),
        carbs_g: String(food.carbs_g || ''),
        fat_g: String(food.fat_g || ''),
        consumed_at: food.consumed_at ? parseISO(food.consumed_at) : new Date(),
    });

    transform((data) => ({
        ...data,
        consumed_at: format(data.consumed_at, 'yyyy-MM-dd'),
    }));

    useEffect(() => {
        const protein = parseFloat(data.protein_g) || 0;
        const carbs = parseFloat(data.carbs_g) || 0;
        const fat = parseFloat(data.fat_g) || 0;
        const calculatedCalories = protein * 4 + carbs * 4 + fat * 9;
        setData('calories', String(Math.round(calculatedCalories)));
    }, [data.protein_g, data.carbs_g, data.fat_g]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('foods.update', food.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit - ${food.name}`} />
            <Card>
                <CardHeader>
                    <Heading title="Edit Food Item" description={`You are editing "${food.name}".`} />
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="name">Food Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="protein_g">Protein (g)</Label>
                                <Input id="protein_g" type="number" value={data.protein_g} onChange={(e) => setData('protein_g', e.target.value)} />
                                <InputError message={errors.protein_g} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="carbs_g">Carbohydrates (g)</Label>
                                <Input id="carbs_g" type="number" value={data.carbs_g} onChange={(e) => setData('carbs_g', e.target.value)} />
                                <InputError message={errors.carbs_g} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="fat_g">Fat (g)</Label>
                                <Input id="fat_g" type="number" value={data.fat_g} onChange={(e) => setData('fat_g', e.target.value)} />
                                <InputError message={errors.fat_g} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="calories">Calories (kcal)</Label>
                                <Input id="calories" type="number" value={data.calories} className="bg-muted" />
                                <p className="text-xs text-muted-foreground mt-1">Calories are calculated automatically.</p>
                                <InputError message={errors.calories} className="mt-2" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="consumed_at">Consumed At</Label>
                            <DatePicker
                                date={data.consumed_at}
                                setDate={(date) => {
                                    if (date) {
                                        setData('consumed_at', date);
                                    }
                                }}
                            />
                            <InputError message={errors.consumed_at} className="mt-2" />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>{processing ? 'Updating...' : 'Update Food'}</Button>
                            <Link href={route('foods.index')}>
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}

