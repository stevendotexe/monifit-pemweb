import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PreAddedFood } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function PreAddedFoods({ preAddedFoods }: { preAddedFoods: PreAddedFood[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogDescription, setDialogDescription] = useState('');

    const filteredFoods = preAddedFoods.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToLog = (food: PreAddedFood) => {
        router.post(route('pre-added-foods.add-to-log', food.id), {}, {
            onSuccess: (response: any) => {
                if (response.props.success) {
                    setDialogTitle('Success!');
                    setDialogDescription(`${food.name} has been added to your food log.`);
                } else {
                    setDialogTitle('Error');
                    setDialogDescription(response.props.message || 'Failed to add food to your log. Please try again.');
                }
                setShowDialog(true);
            },
            onError: (errors) => {
                setDialogTitle('Error');
                setDialogDescription(
                    typeof errors === 'string' 
                        ? errors 
                        : 'Failed to add food to your log. Please try again.'
                );
                setShowDialog(true);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Pre-added Foods" />

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-row items-center justify-between">
                    <Heading title="Pre-added Foods" description="Browse and add common foods to your log." />
                    <Link href={route('foods.create')}>
                        <Button variant="outline">Create Custom Food</Button>
                    </Link>
                </div>

                <div className="mt-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search foods..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Card className='bg-sidebar'>
                        <CardHeader>
                            <CardTitle>Available Foods</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Calories</TableHead>
                                        <TableHead>Protein</TableHead>
                                        <TableHead>Carbs</TableHead>
                                        <TableHead>Fat</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredFoods.map((food) => (
                                        <TableRow key={food.id}>
                                            <TableCell className="font-medium">{food.name}</TableCell>
                                            <TableCell>{food.category}</TableCell>
                                            <TableCell>{food.calories} kcal</TableCell>
                                            <TableCell>{food.protein_g}g</TableCell>
                                            <TableCell>{food.carbs_g}g</TableCell>
                                            <TableCell>{food.fat_g}g</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAddToLog(food)}
                                                >
                                                    Add to Log
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>
                            {dialogDescription}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button onClick={() => setShowDialog(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
} 