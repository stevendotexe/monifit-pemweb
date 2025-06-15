import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Star, Clock, Phone, Leaf, Wheat, Vegan } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface VendorFood {
    id: number;
    name: string;
    description: string;
    price: number;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    image_url: string;
    category: string;
    is_available: boolean;
    is_vegetarian: boolean;
    is_vegan: boolean;
    is_gluten_free: boolean;
}

interface Vendor {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    opening_hours: string;
    rating: number;
    images: {
        id: number;
        image_url: string;
        image_type: string;
    }[];
    foods: VendorFood[];
    is_vegetarian_friendly: boolean;
    is_vegan_friendly: boolean;
    is_gluten_free_friendly: boolean;
}

interface Props {
    vendor: Vendor;
}

const Show = ({ vendor }: Props) => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = ['all', 'main course', 'appetizer', 'dessert', 'beverage'];

    const filteredFoods = vendor.foods.filter(food => {
        return selectedCategory === 'all' || food.category === selectedCategory;
    });

    const handleAddToFoodLog = (food: VendorFood) => {
        router.post(route('foods.store'), {
            name: food.name,
            calories: food.calories,
            protein_g: food.protein_g,
            carbs_g: food.carbs_g,
            fat_g: food.fat_g,
            consumed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // You could add a toast notification here
                console.log('Food item added to log');
            },
        });
    };

    return (
        <AppLayout>
            <Head title={vendor.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Vendor Header */}
                    <div className="bg-sidebar text-card-foreground overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="relative h-64">
                            <img
                                src={vendor.images.find(img => img.image_type === 'exterior')?.image_url || 'https://via.placeholder.com/1200x400'}
                                alt={vendor.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                                <h1 className="text-4xl font-bold text-card-foreground">{vendor.name}</h1>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex items-center text-muted-foreground">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    {vendor.address}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <Star className="h-5 w-5 mr-2 text-accent" />
                                    {vendor.rating}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <Clock className="h-5 w-5 mr-2" />
                                    {vendor.opening_hours}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <Phone className="h-5 w-5 mr-2" />
                                    {vendor.phone}
                                </div>
                            </div>
                            <div className="flex gap-2 mb-4">
                                {vendor.is_vegetarian_friendly && (
                                    <span className="flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                                        <Leaf className="h-4 w-4 mr-1" />
                                        Vegetarian
                                    </span>
                                )}
                                {vendor.is_vegan_friendly && (
                                    <span className="flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                                        <Vegan className="h-4 w-4 mr-1" />
                                        Vegan
                                    </span>
                                )}
                                {vendor.is_gluten_free_friendly && (
                                    <span className="flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                                        <Wheat className="h-4 w-4 mr-1" />
                                        Gluten Free
                                    </span>
                                )}
                            </div>
                            <p className="text-muted-foreground">{vendor.description}</p>
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="bg-sidebar text-card-foreground overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Menu</h2>
                            
                            {/* Category Filter */}
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full whitespace-nowrap ${
                                            selectedCategory === category
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Food Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredFoods.map(food => (
                                    <div key={food.id} className="bg-sidebar text-card-foreground border border-border rounded-lg overflow-hidden">
                                        <div className="relative h-48">
                                            <img
                                                src={food.image_url}
                                                alt={food.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-sidebar text-card-foreground px-2 py-1 rounded-full text-sm font-semibold">
                                                Rp {food.price.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold mb-2">{food.name}</h3>
                                            <p className="text-muted-foreground text-sm mb-4">{food.description}</p>
                                            
                                            {/* Nutritional Info */}
                                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                                <div>
                                                    <span className="text-muted-foreground">Calories:</span>
                                                    <span className="ml-2 font-medium">{food.calories} kcal</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Protein:</span>
                                                    <span className="ml-2 font-medium">{food.protein_g}g</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Carbs:</span>
                                                    <span className="ml-2 font-medium">{food.carbs_g}g</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Fat:</span>
                                                    <span className="ml-2 font-medium">{food.fat_g}g</span>
                                                </div>
                                            </div>

                                            {/* Dietary Icons */}
                                            <div className="flex gap-2 mb-4">
                                                {food.is_vegetarian && (
                                                    <span className="flex items-center text-accent">
                                                        <Leaf className="h-4 w-4" />
                                                    </span>
                                                )}
                                                {food.is_vegan && (
                                                    <span className="flex items-center text-accent">
                                                        <Vegan className="h-4 w-4" />
                                                    </span>
                                                )}
                                                {food.is_gluten_free && (
                                                    <span className="flex items-center text-accent">
                                                        <Wheat className="h-4 w-4" />
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleAddToFoodLog(food)}
                                                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                Add to Food Log
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Show; 