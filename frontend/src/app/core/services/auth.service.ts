import { Injectable, signal, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { tap, switchMap, from } from 'rxjs';
import { Auth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from '@angular/fire/auth';
// import { User } from '../models/user.model'; 

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    addresses?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
        _id?: string;
    }[];
    token?: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    currentUser = signal<any | null>(null);
    currentUser$ = toObservable(this.currentUser);
    private auth = inject(Auth);

    constructor(private http: HttpClient, private router: Router) {
        this.checkToken();
    }

    checkToken() {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            this.currentUser.set(JSON.parse(userStr));
        }
    }

    register(data: any) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
    }

    login(data: any) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
            tap(res => this.handleAuthSuccess(res))
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.auth.signOut();
        this.router.navigate(['/auth/login']);
    }

    forgotPassword(email: string) {
        return this.http.post(`${this.apiUrl}/forgot-password`, { email });
    }

    resetPassword(data: any) {
        return this.http.put(`${this.apiUrl}/reset-password`, data);
    }

    forgotPasswordMobile(phone: string) {
        return this.http.post(`${this.apiUrl}/forgot-password-mobile`, { phone });
    }

    verifyOtp(data: any) {
        return this.http.post(`${this.apiUrl}/verify-otp`, data);
    }

    googleLogin() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        return this.socialLogin(provider, 'google');
    }

    facebookLogin() {
        const provider = new FacebookAuthProvider();
        provider.addScope('email');
        provider.addScope('public_profile');
        return this.socialLogin(provider, 'facebook');
    }

    private socialLogin(provider: any, providerName: string) {
        return from(signInWithPopup(this.auth, provider)).pipe(
            switchMap(result => {
                return from(result.user.getIdToken());
            }),
            switchMap(idToken => {
                return this.http.post<AuthResponse>(`${this.apiUrl}/${providerName}`, { idToken, provider: providerName });
            }),
            tap(res => this.handleAuthSuccess(res))
        );
    }

    private handleAuthSuccess(res: AuthResponse) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    addAddress(address: any) {
        return this.http.post<any[]>(`${environment.apiUrl}/users/address`, address).pipe(
            tap(addresses => {
                const currentUser = this.currentUser();
                if (currentUser) {
                    const updatedUser = { ...currentUser, addresses };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    this.currentUser.set(updatedUser);
                }
            })
        );
    }

    deleteAddress(addressId: string) {
        return this.http.delete<any[]>(`${environment.apiUrl}/users/address/${addressId}`).pipe(
            tap(addresses => {
                const currentUser = this.currentUser();
                if (currentUser) {
                    const updatedUser = { ...currentUser, addresses };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    this.currentUser.set(updatedUser);
                }
            })
        );
    }
}
