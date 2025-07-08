export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    dateOfBirth?: Date;
    role: 'user' | 'admin';
    addresses: Address[];
    defaultAddressId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Address {
    id: string;
    type: 'home' | 'work' | 'other';
    address: string;
    city: string;
    district: string;
    ward: string;
    isDefault: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    isNewUser: boolean;
}

export interface GoogleLoginRequest {
    accessToken: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface UpdateProfileRequest {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface AddAddressRequest {
    type: 'home' | 'work' | 'other';
    address: string;
    city: string;
    district: string;
    ward: string;
    isDefault: boolean;
} 