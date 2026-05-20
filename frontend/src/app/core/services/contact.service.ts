import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ContactMessage } from '../interfaces/contact.interface';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/contact`;

    sendMessage(data: { name: string; email: string; subject: string; message: string; userId?: string }) {
        return this.http.post<{ success: boolean; message: string }>(this.apiUrl, data);
    }

    getMessages() {
        return this.http.get<{ success: boolean; count: number; data: ContactMessage[] }>(this.apiUrl);
    }

    replyToMessage(data: { email: string; subject: string; message: string; messageId?: string }) {
        return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/reply`, data);
    }

    getNotifications(userId: string) {
        // Pass userId as query param
        return this.http.get<{ success: boolean; data: ContactMessage[] }>(`${this.apiUrl}/notifications`, { params: { userId } });
    }

    markAsRead(id: string) {
        return this.http.put<{ success: boolean }>(`${this.apiUrl}/notifications/${id}/read`, {});
    }
}
