import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NotificationModalComponent } from './shared/components/notification-modal/notification-modal.component';
import { SearchOverlayComponent } from './shared/components/search-overlay/search-overlay.component';
import { ScrollAnimationDirective } from './shared/directives/scroll-animation.directive';
import { routeAnimations } from './shared/animations/route-animations';
import { AuthService } from './core/services/auth.service';
import { ContactService } from './core/services/contact.service';
import { SearchService } from './core/services/search.service';
import { ContactMessage } from './core/interfaces/contact.interface';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, ScrollAnimationDirective, NotificationModalComponent, SearchOverlayComponent],
    animations: [routeAnimations],
    template: `
        <div class="min-h-screen flex flex-col font-sans relative">
            <app-navbar></app-navbar>
            <main class="flex-grow relative">
                <div [@routeAnimations]="getRouteAnimationData(outlet)">
                    <router-outlet #outlet="outlet"></router-outlet>
                </div>
            </main>
            <app-footer></app-footer>
            
            <app-notification-modal 
                *ngIf="notification()" 
                [message]="notification()" 
                (onClose)="closeNotification()"
            ></app-notification-modal>

            <app-search-overlay></app-search-overlay>
        </div>
    `,
    styles: []
})
export class AppComponent implements OnInit, OnDestroy {
    authService = inject(AuthService);
    contactService = inject(ContactService);
    searchService = inject(SearchService);
    private router = inject(Router);

    notification = signal<ContactMessage | null>(null);
    notificationQueue = signal<ContactMessage[]>([]);
    isAdminRoute = signal<boolean>(false);

    private keydownListener!: (e: KeyboardEvent) => void;
    private destroy$ = new Subject<void>();

    ngOnInit() {
        // Subscribe to router events
        this.router.events
            .pipe(takeUntil(this.destroy$))
            .subscribe(event => {
                if (event instanceof NavigationEnd) {
                    this.isAdminRoute.set(event.url.includes('/admin'));
                }
            });

        // Setup global keyboard shortcut for search (Cmd+K on Mac, Ctrl+K on Windows)
        this.keydownListener = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchService.openSearch();
            }
        };
        document.addEventListener('keydown', this.keydownListener);

        // Check for notifications when user logs in or app initializes
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                console.log('AppComponent: Current user emitted:', user);
                if (user && (user.id || user._id)) {
                    const uid = user.id || user._id;
                    console.log('AppComponent: Checking notifications for user:', uid);
                    this.checkNotifications(uid);
                } else {
                    console.log('AppComponent: No user logged in');
                }
            });
    }

    ngOnDestroy() {
        if (this.keydownListener) {
            document.removeEventListener('keydown', this.keydownListener);
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    checkNotifications(userId: string) {
        this.contactService.getNotifications(userId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    console.log('AppComponent: Notifications response:', res);
                    if (res.data && res.data.length > 0) {
                        // Store all notifications in queue
                        this.notificationQueue.set(res.data);
                        // Show the first one
                        this.showNextNotification();
                    } else {
                        console.log('AppComponent: No unread notifications');
                    }
                },
                error: (err) => console.error('Error checking notifications', err)
            });
    }

    showNextNotification() {
        const queue = this.notificationQueue();
        if (queue.length > 0) {
            this.notification.set(queue[0]);
        } else {
            this.notification.set(null);
        }
    }

    closeNotification() {
        const msg = this.notification();
        if (msg && msg._id) {
            this.contactService.markAsRead(msg._id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        // Remove current notification from queue
                        const currentQueue = this.notificationQueue();
                        const newQueue = currentQueue.slice(1); // Remove first item
                        this.notificationQueue.set(newQueue);

                        // Show next notification if any
                        this.showNextNotification();
                    },
                    error: (err) => {
                        console.error('Error marking as read', err);
                        // Even if error, maybe we should close it to not block user? 
                        // For now, keep open so they can try again or manual close logic
                        this.notification.set(null);
                    }
                });
        } else {
            this.notification.set(null);
        }
    }

    getRouteAnimationData(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}
