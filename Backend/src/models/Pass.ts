import { Schema, model } from 'mongoose';

const passSchema = new Schema({
  guestName: { type: String, required: true },
  hostId: { type: String, required: true }, // ID del anfitrión que genera el pase
  accessCode: { type: String, unique: true }, // Ej: V-
  status: { 
    type: String, 
    enum: ['PENDING', 'USED', 'EXPIRED'], 
    default: 'PENDING' 
  },
  visitingType:{
    type: String,
    enum: ['FRECUENTE', 'UNICA', 'SERVICIO'],
    default: 'UNICA'
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  usedAt:{type: Date}
});

export const Pass = model('Pass', passSchema);