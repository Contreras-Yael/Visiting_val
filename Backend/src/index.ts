import express from 'express';
import mongoose from 'mongoose';
//import cors from 'cors';
import { Pass } from './models/Pass.js'; 
import jwt from 'jsonwebtoken';
//import e from 'express';

const app = express();
app.use(express.json());
//use(cors());

const PASS_EXPIRY_CONFIG = {
  value: 1,          // Cambiar este número
  unit: 'minuto'     // 'minuto', 'hora', 'dia'
};

const llave= '123456789';

mongoose.connect('mongodb://localhost:27017/visitorpass')
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión:', err));

app.post('/api/passes',async (req, res) => {
  try {
    const { guestName, hostId } = req.body;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const expiresAt = new Date();
    switch (PASS_EXPIRY_CONFIG.unit) {
      case 'minuto':
        expiresAt.setMinutes(expiresAt.getMinutes() + PASS_EXPIRY_CONFIG.value);
        break;
      case 'hora':
        expiresAt.setHours(expiresAt.getHours() + PASS_EXPIRY_CONFIG.value);
        break;
      case 'dia':
        expiresAt.setDate(expiresAt.getDate() + PASS_EXPIRY_CONFIG.value);
        break;
      default:
        expiresAt.setMinutes(expiresAt.getMinutes() + 60);
    }

    const newPass = new Pass({
      guestName: guestName,
      accessCode: code,
      hostId: hostId,
      expiresAt: expiresAt,
      status: 'PENDIENTE'
    });
    await newPass.save();
    res.json({ message: 'Pase creado', code: code });
  } catch (error) {
    res.status(500).json({ message: 'Error creando pase' });
  }
}); 

app.get('/api/passes/validate/:code', async (req, res) => {
  try {
    const codin = req.params.code;

    const findpass= await Pass.findOne({ accessCode: codin });

    if (!findpass) {
      return res.status(404).json({ valid: false, message: 'Pase no encontrado' });
    }

    if (findpass.status === 'USADO') {
      return res.status(403).json({ valid: false, message: 'Ya utilizado' });
    }

    if (!findpass.expiresAt) {
      return res.status(400).json({ valid: false, message: 'Pase sin fecha de expiración' });
    }

    const now = new Date();
    const expiresAt = new Date(findpass.expiresAt);
    if (now > expiresAt) {
      return res.status(400).json({ valid: false, message: 'Pase expirado' });
    }

    res.json({ valid: true, message: 'Pase válido', guestName: findpass.guestName });
  } catch (error) {
    res.status(500).json({ message: 'Error validando pase' });
  }
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if( email ==="ejemplo@correo" && password ==="Contra123") {
    const token = jwt.sign({ email }, llave, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Email o contraseña inválidos' });
});

//const paylaod = {

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

//interceptor, capta salidas http