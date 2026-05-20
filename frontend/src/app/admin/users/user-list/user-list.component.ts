import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../core/services/user.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-admin-user-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">Users</h1>
      </div>

      <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-400">
            <thead class="bg-dark-950 text-xs uppercase font-medium tracking-wider">
              <tr>
                <th class="px-6 py-4">User</th>
                <th class="px-6 py-4">Role</th>
                <th class="px-6 py-4">Joined</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-800">
              <tr *ngFor="let user of users()" class="hover:bg-dark-800/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold border border-primary-500/30">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-medium text-white">{{ user.name }}</div>
                      <div class="text-xs text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium border"
                    [ngClass]="{
                      'bg-purple-500/10 text-purple-400 border-purple-500/20': user.role === 'admin',
                      'bg-gray-700/30 text-gray-400 border-gray-600/30': user.role === 'user'
                    }">
                    {{ user.role | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 font-mono text-xs">
                  {{ user.createdAt | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button (click)="toggleRole(user)" 
                    class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                    [ngClass]="user.role === 'admin' ? 
                      'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 
                      'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20'">
                    {{ user.role === 'admin' ? 'Revoke Admin' : 'Make Admin' }}
                  </button>
                  <button (click)="deleteUser(user._id)" 
                    class="p-1.5 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete User">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="users().length === 0" class="p-8 text-center text-gray-500">
          No users found.
        </div>
      </div>
    </div>
  `
})
export class AdminUserListComponent {
    private userService = inject(UserService);
    users = signal<User[]>([]);

    constructor() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getAllUsers().subscribe({
            next: (data) => this.users.set(data),
            error: (err) => console.error('Error loading users', err)
        });
    }

    deleteUser(id: string) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.userService.deleteUser(id).subscribe({
                next: () => {
                    // Optimistic update or reload
                    this.users.update(users => users.filter(u => u._id !== id));
                },
                error: (err) => alert('Failed to delete user')
            });
        }
    }

    toggleRole(user: User) {
        const action = user.role === 'admin' ? 'revoke admin rights from' : 'grant admin rights to';
        if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
            this.userService.updateUserRole(user._id).subscribe({
                next: (res) => {
                    // Update local state
                    this.users.update(users => users.map(u =>
                        u._id === user._id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
                    ));
                },
                error: (err) => alert('Failed to update role')
            });
        }
    }
}
