import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';
import { ContactMessage } from '../../../core/interfaces/contact.interface';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-white">Messages</h1>
        <div class="px-4 py-2 bg-dark-900 rounded-lg border border-dark-800 text-gray-400 text-sm">
          {{ messages().length }} Total Messages
        </div>
      </div>

      <!-- Messages List -->
      <div class="bg-dark-900 rounded-2xl border border-dark-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-400">
            <thead class="bg-dark-950 text-xs uppercase font-medium">
              <tr>
                <th class="px-6 py-4">Sender</th>
                <th class="px-6 py-4">Subject</th>
                <th class="px-6 py-4">Date</th>
                <th class="px-6 py-4 text-center">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-800">
              <tr *ngFor="let msg of messages()" 
                  class="hover:bg-dark-800/50 transition-colors cursor-pointer group"
                  (click)="viewMessage(msg)">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-white font-medium group-hover:text-primary-400 transition-colors">{{ msg.name }}</span>
                    <span class="text-xs text-gray-500">{{ msg.email }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-gray-300 line-clamp-1">{{ msg.subject }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ msg.createdAt | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span *ngIf="msg.adminReply; else unreadBadge" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span> Replied
                  </span>
                  <ng-template #unreadBadge>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                       <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span> New
                    </span>
                  </ng-template>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="p-2 hover:bg-dark-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                          (click)="$event.stopPropagation(); viewMessage(msg)">
                    <span class="material-icons text-sm">visibility</span>
                  </button>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr *ngIf="messages().length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="material-icons text-4xl mb-3 text-dark-700">inbox</span>
                    <p>No messages found.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Message Detail Modal -->
      <div *ngIf="selectedMessage()" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" (click)="closeMessage()"></div>

        <div class="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
          <div class="relative bg-dark-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full border border-dark-800">
            
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-dark-800 flex justify-between items-center bg-dark-950/50">
              <h3 class="text-xl font-bold text-white flex items-center gap-2">
                <span class="material-icons text-primary-500">mail</span>
                Message Details
              </h3>
              <button (click)="closeMessage()" class="text-gray-500 hover:text-white transition-colors">
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="p-6">
                <!-- Sender Info -->
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h4 class="text-lg font-medium text-white">{{ selectedMessage()?.name }}</h4>
                        <a [href]="'mailto:' + selectedMessage()?.email" class="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 mt-1">
                            {{ selectedMessage()?.email }}
                            <span class="material-icons text-[14px]">launch</span>
                        </a>
                    </div>
                    <span class="text-sm text-gray-500 bg-dark-800 px-3 py-1 rounded-full border border-dark-700">
                        {{ selectedMessage()?.createdAt | date:'medium' }}
                    </span>
                </div>

                <!-- Message Content -->
                <div class="bg-dark-800 rounded-xl p-5 border border-dark-700 mb-6">
                    <p class="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wide">Subject:</p>
                    <p class="text-white font-medium text-lg mb-4">{{ selectedMessage()?.subject }}</p>
                    
                    <div class="h-px bg-dark-700 w-full mb-4"></div>
                    
                    <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">{{ selectedMessage()?.message }}</p>
                </div>

                <!-- Existing Reply -->
                <div *ngIf="selectedMessage()?.adminReply" class="bg-green-500/5 rounded-xl p-5 border border-green-500/20 mb-6">
                    <div class="flex items-center gap-2 mb-2 text-green-500">
                        <span class="material-icons text-sm">reply</span>
                        <span class="text-sm font-bold uppercase tracking-wide">Reply Sent</span>
                    </div>
                    <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">{{ selectedMessage()?.adminReply }}</p>
                </div>

                <!-- Reply Form -->
                <div *ngIf="!selectedMessage()?.adminReply" class="mt-6">
                    <h4 class="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">Reply to Message</h4>
                    <div class="relative">
                        <textarea
                            [(ngModel)]="replyMessage"
                            rows="5"
                            class="w-full bg-dark-950 border border-dark-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-600 resize-none transition-all"
                            placeholder="Type your reply here..."
                        ></textarea>
                    </div>
                    
                    <!-- Alert Messages -->
                    <div *ngIf="replySuccess()" class="mt-3 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg flex items-center gap-2">
                        <span class="material-icons text-sm">check_circle</span> Reply sent successfully!
                    </div>
                     <div *ngIf="replyError()" class="mt-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
                        <span class="material-icons text-sm">error</span> Failed to send reply. Please try again.
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-dark-950 px-6 py-4 flex justify-end gap-3 border-t border-dark-800">
               <button 
                type="button" 
                class="px-5 py-2.5 rounded-xl border border-dark-700 text-gray-300 font-medium hover:bg-dark-800 transition-colors"
                (click)="closeMessage()">
                Close
              </button>
              
              <button *ngIf="!selectedMessage()?.adminReply"
                type="button" 
                [disabled]="sendingReply() || !replyMessage"
                class="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-900/20" 
                (click)="sendReply()"
              >
                <span *ngIf="sendingReply()" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span *ngIf="!sendingReply()">Send Reply</span>
                <span *ngIf="!sendingReply()" class="material-icons text-sm">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminMessagesComponent implements OnInit {
  private contactService = inject(ContactService);
  messages = signal<ContactMessage[]>([]);
  selectedMessage = signal<ContactMessage | null>(null);

  // Reply functionality
  replyMessage = '';
  sendingReply = signal(false);
  replySuccess = signal(false);
  replyError = signal(false);

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.contactService.getMessages().subscribe({
      next: (res) => {
        this.messages.set(res.data);
      },
      error: (err) => console.error('Error loading messages', err)
    });
  }

  viewMessage(msg: ContactMessage) {
    this.selectedMessage.set(msg);
    // Reset reply state when opening new message
    this.replyMessage = '';
    this.replySuccess.set(false);
    this.replyError.set(false);
  }

  closeMessage() {
    this.selectedMessage.set(null);
  }

  sendReply() {
    const msg = this.selectedMessage();
    if (!msg || !this.replyMessage.trim()) return;

    this.sendingReply.set(true);
    this.replySuccess.set(false);
    this.replyError.set(false);

    this.contactService.replyToMessage({
      email: msg.email,
      subject: msg.subject,
      message: this.replyMessage,
      messageId: msg._id
    }).subscribe({
      next: (res) => {
        this.sendingReply.set(false);
        this.replySuccess.set(true);
        this.replyMessage = '';

        // Update local state to show replied status immediately
        if (msg) {
          const updatedMessages = this.messages().map(m =>
            m._id === msg._id ? { ...m, adminReply: this.replyMessage } : m
          );
          this.messages.set(updatedMessages);
          // Also update selected message to show the reply in the UI
          this.selectedMessage.update(m => m ? ({ ...m, adminReply: this.replyMessage }) : null);
        }
      },
      error: (err) => {
        console.error('Error sending reply', err);
        this.sendingReply.set(false);
        this.replyError.set(true);
      }
    });
  }
}
