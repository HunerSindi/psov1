import Dexie, { Table } from 'dexie';

export interface LocalCategory {
    id?: number;
    name: string;
    color?: string;
}

export interface LocalItem {
    id?: number;
    categoryId: number;
    name: string;
    barcode: string;
    price: number;
    unitType: string; // <--- NEW FIELD ("single", "packet", etc.)
    color?: string;
    image?: string;
}

class EasyAccessDB extends Dexie {
    categories!: Table<LocalCategory>;
    items!: Table<LocalItem>;

    constructor() {
        super('EasyAccessDB');
        this.version(2).stores({ // Bump version to 2
            categories: '++id, name',
            items: '++id, categoryId, name'
        });
        // If you already ran the app, you might need to delete the DB in DevTools > Application 
        // or handle schema upgrade, but for dev just deleting DB is easier.
    }
}

export const db = new EasyAccessDB();