import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    address?: string; // Legacy single address field, kept for backward compatibility if needed
    addresses?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
        _id?: string;
    }[];
    role: 'user' | 'admin';
    wishlist: mongoose.Types.ObjectId[];
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    resetPasswordOtp?: string;
    resetPasswordOtpExpire?: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    addresses: [{
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: { type: Boolean, default: false }
    }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    resetPasswordOtp: { type: String },
    resetPasswordOtpExpire: { type: Date }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
