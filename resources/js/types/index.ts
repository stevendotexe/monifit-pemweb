export interface PreAddedFood {
    id: number;
    name: string;
    description: string | null;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    category: string | null;
    is_vegetarian: boolean;
    is_vegan: boolean;
    is_gluten_free: boolean;
    created_at: string;
    updated_at: string;
} 