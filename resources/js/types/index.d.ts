export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    gender: string | null;
    birth_date: string | null;
    weight_kg: number | null;
    height_cm: number | null;
    must_verify_email?: boolean;
};

export type Food = {
    id: number;
    name: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    consumed_at: string;
};

export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
};

export type SharedData = {
    auth: {
        user: User;
    };
    ziggy: unknown;
    flash: {
        success?: string;
        error?: string;
    };
};

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    title: string;
    href: string;
    icon: React.ElementType;
};

export type DailyTotals = {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
};

export type FoodDayGroup = {
    date: string;
    formatted_date: string;
    foods: Food[];
    totals: DailyTotals;
};