import { Schema, model } from 'mongoose';

const passSchema = new Schema({
  guestName: { type: String, required: true },
  hostId: { type: String, required: true },
  accessCode: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'USED', 'EXPIRED'], 
    default: 'PENDING' 
  },
  visitingType:{
    type: String,
    enum: ['FRECUENTLY', 'UNIQUE', 'SERVICE'],
    default: 'UNIQUE'
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  usedAt:{type: Date}
});

export const Pass = model('Pass', passSchema);