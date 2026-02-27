import { Schema, model } from 'mongoose';

const passSchema = new Schema({
  guestName: { type: String, required: true },
  hostId: { type: String, required: true },
  accessCode: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ['PENDIENTE', 'USADO', 'EXPIRADO'], 
    default: 'PENDIENTE' 
  },
  // visitingType:{
  //   type: String,
  //   enum: ['FRECUENTEMENTE', 'UNICO', 'SERVICIO'],
  //   default: 'UNICO'
  // },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  usedAt:{type: Date}
});

export const Pass = model('Pass', passSchema);