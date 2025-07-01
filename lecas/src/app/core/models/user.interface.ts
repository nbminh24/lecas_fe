export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    addresses: Address[];
    defaultAddressId?: string;
    preferences: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
}

export interface Address {
    id: string;
    type: 'home' | 'work' | 'other';
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

export interface UserPreferences {
    newsletter: boolean;
    marketingEmails: boolean;
    sizePreferences: string[];
    colorPreferences: string[];
    categoryPreferences: string[];
} 