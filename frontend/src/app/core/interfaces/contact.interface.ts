export interface ContactMessage {
    _id?: string;
    userId?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    adminReply?: string;
    isReplyRead?: boolean;
    createdAt?: string;
}
