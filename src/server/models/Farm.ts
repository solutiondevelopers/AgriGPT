import mongoose, { Schema, Document } from 'mongoose';

export interface ICrop {
  name: string;
  plantedDate?: Date;
  expectedHarvestDate?: Date;
  status: 'planned' | 'growing' | 'harvested' | 'failed';
}

export interface IField {
  name: string;
  areaInAcres: number;
  soilType?: string;
  currentCrop?: ICrop;
}

export interface IFarm extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  location: {
    state?: string;
    district?: string;
    coordinates?: { lat: number; lng: number };
  };
  totalAreaInAcres: number;
  fields: IField[];
  createdAt: Date;
  updatedAt: Date;
}

const CropSchema = new Schema<ICrop>({
  name: { type: String, required: true },
  plantedDate: { type: Date },
  expectedHarvestDate: { type: Date },
  status: { type: String, enum: ['planned', 'growing', 'harvested', 'failed'], default: 'planned' }
});

const FieldSchema = new Schema<IField>({
  name: { type: String, required: true },
  areaInAcres: { type: Number, required: true },
  soilType: { type: String },
  currentCrop: { type: CropSchema }
});

const FarmSchema = new Schema<IFarm>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  location: {
    state: { type: String },
    district: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  totalAreaInAcres: { type: Number, default: 0 },
  fields: [FieldSchema]
}, { timestamps: true });

export default mongoose.models.Farm || mongoose.model<IFarm>('Farm', FarmSchema);
