export interface User {
    id: string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    phone?: string;
    phoneNumber?: string;
    avatar?: string;
    isEmailVerified?: boolean;
    roles?: string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    addresses?: Address[];
    defaultAddressId?: string;
    dateOfBirth?: Date;
    role: 'user' | 'admin';
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
    idToken: string;
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