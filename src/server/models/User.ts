import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  role: 'farmer' | 'expert' | 'gov_officer' | 'researcher' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['farmer', 'expert', 'gov_officer', 'researcher', 'admin'], default: 'farmer' },
  avatar: { type: String }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
