import { Schema, model } from 'mongoose';

const passSchema = new Schema({
  guestName: { type: String, required: true },
  accessCode: { type: String, required: true, unique: true }, // Ej: V-1234
  hostId: { type: String, required: true }, // ID del residente
  status: { 
    type: String, 
    enum: ['PENDING', 'USED', 'EXPIRED'], 
    default: 'PENDING' 
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

export const Pass = model('Pass', passSchema);