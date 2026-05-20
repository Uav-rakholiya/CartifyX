import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RecentlyViewedService {
    private readonly STORAGE_KEY = 'recently_viewed_products';
    private readonly MAX_ITEMS = 8;

    // Signal to hold current state for reactive updates across the app
    recentIds = signal<string[]>([]);

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.recentIds.set(JSON.parse(stored));
            }
        } catch (e) {
            console.warn('Could not load recently viewed products from local storage', e);
        }
    }

    addProduct(productId: string) {
        if (!productId) return;

        let current = this.recentIds();

        // Remove if already exists to push to top
        current = current.filter(id => id !== productId);

        // Add to beginning
        current.unshift(productId);

        // Limit to MAX_ITEMS
        if (current.length > this.MAX_ITEMS) {
            current = current.slice(0, this.MAX_ITEMS);
        }

        this.recentIds.set(current);
        this.saveToStorage(current);
    }

    private saveToStorage(ids: string[]) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
        } catch (e) {
            console.warn('Could not save recently viewed products to local storage', e);
        }
    }

    clear() {
        this.recentIds.set([]);
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
