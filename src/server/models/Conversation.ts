import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  summary?: string;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, default: 'New Conversation' },
  summary: { type: String },
  status: { type: String, enum: ['active', 'archived'], default: 'active' }
}, { timestamps: true });

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
