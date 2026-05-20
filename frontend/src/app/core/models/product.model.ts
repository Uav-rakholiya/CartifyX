export interface Product {
    _id?: string;
    id: string;
    name: string;
    description: string;
    fullDescription?: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    category: string;
    stock: number;
    rating?: number;
    reviews?: number;
    featured?: boolean;
    inStock?: boolean;
    onSale?: boolean;
    sizes?: string[];
    additionalImages?: string[];
    vendor?: string;
    productType?: string;
    viewCount?: number;
    soldCount?: number;
    specifications?: Record<string, string> | Array<{ label: string; value: string }>;
    features?: string[];
    material?: string;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
        weight?: number;
    };
    warranty?: {
        period?: string;
        coverage?: string;
        description?: string;
    };
    returnPolicy?: {
        daysAllowed?: number;
        conditions?: string;
        process?: string;
    };
    additionalAttributes?: Record<string, any>;
    createdAt?: Date | string;
}
