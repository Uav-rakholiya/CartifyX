import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    userId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    subject: string;
    message: string;
    adminReply?: string;
    isReplyRead: boolean;
    createdAt: Date;
}

const ContactSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    adminReply: { type: String },
    isReplyRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IContact>('Contact', ContactSchema);
