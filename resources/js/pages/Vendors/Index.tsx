import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Star, Leaf, Vegan, Wheat } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Vendor {
    id: number;
    name: string;
    description: string;
    address: string;
    rating: number;
    price_range: string;
    images: {
        id: number;
        image_url: string;
        image_type: string;
    }[];
    is_vegetarian_friendly: boolean;
    is_vegan_friendly: boolean;
    is_gluten_free_friendly: boolean;
}

interface Props {
    vendors: {
        data: Vendor[];
        links: any;
    };
}

const Index = ({ vendors }: Props) => {
    const [search, setSearch] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('');

    const cuisines = ['Indonesian', 'Japanese', 'Korean', 'Western', 'Chinese', 'Indian'];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('vendors.index'), {
            search,
            cuisine: selectedCuisine,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const filteredVendors = vendors.data.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(search.toLowerCase()) ||
            vendor.description.toLowerCase().includes(search.toLowerCase());
        const matchesCuisine = !selectedCuisine || vendor.name.toLowerCase().includes(selectedCuisine.toLowerCase());
        return matchesSearch && matchesCuisine;
    });

    return (
        <AppLayout>
            <Head title="Vendors" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Search and Filters */}
                    <div className="bg-sidebar text-card-foreground overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search vendors..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <select
                                        value={selectedCuisine}
                                        onChange={(e) => setSelectedCuisine(e.target.value)}
                                        className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">All Cuisines</option>
                                        {cuisines.map(cuisine => (
                                            <option key={cuisine} value={cuisine}>
                                                {cuisine}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vendors Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVendors.map(vendor => (
                            <Link
                                key={vendor.id}
                                href={route('vendors.show', vendor.id)}
                                className="bg-sidebar text-card-foreground overflow-hidden shadow-sm sm:rounded-lg hover:shadow-lg transition-shadow"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={vendor.images.find(img => img.image_type === 'exterior')?.image_url || 'https://via.placeholder.com/400x300'}
                                        alt={vendor.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-sidebar text-card-foreground px-2 py-1 rounded-full text-sm font-semibold">
                                        {vendor.price_range}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{vendor.name}</h3>
                                    <p className="text-muted-foreground text-sm mb-4">{vendor.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
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
                                    <div className="flex items-center text-muted-foreground text-sm">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        {vendor.address}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index; 