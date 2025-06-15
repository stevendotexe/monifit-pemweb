import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { format } from 'date-fns';

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Heading from '@/components/heading';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';

export default function CreateFood() {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fat_g: '',
        consumed_at: new Date(),
    });

    transform((data) => ({
        ...data,
        consumed_at: format(data.consumed_at, 'yyyy-MM-dd'),
    }));

    useEffect(() => {
        const protein = parseFloat(data.protein_g) || 0;
        const carbs = parseFloat(data.carbs_g) || 0;
        const fat = parseFloat(data.fat_g) || 0;

        // Rumus: 1g Protein = 4 cal, 1g Carbs = 4 cal, 1g Fat = 9 cal
        const calculatedCalories = (protein * 4) + (carbs * 4) + (fat * 9);

        setData('calories', String(Math.round(calculatedCalories)));

    }, [data.protein_g, data.carbs_g, data.fat_g]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('foods.store'));
    };

    return (
        <AppLayout>
            <Head title="Add Food" />

            <Card>
                <CardHeader>
                    <Heading title="Log a New Food" description="Enter the details of the food you consumed." />
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
                                <Input id="calories" type="number" value={data.calories} readOnly className="bg-muted" onChange={(e) => setData('calories', e.target.value)} />
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

                        <Button disabled={processing}>
                            {processing ? 'Saving...' : 'Save Food'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}