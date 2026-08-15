import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  role: 'user' | 'model' | 'system';
  content: string;
  uiBlocks?: any[];
  toolCalls?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  role: { type: String, enum: ['user', 'model', 'system'], required: true },
  content: { type: String, required: true },
  uiBlocks: { type: Schema.Types.Mixed }, // Array of dynamic JSON blocks for UI rendering
  toolCalls: { type: Schema.Types.Mixed }, // Array of tool calls (function execution)
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
