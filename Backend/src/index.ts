import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pass } from './models/Pass.js'; 
import { generateAccessCode } from './utils/codegenerator.js';
import jwt from 'jsonwebtoken';
//import e from 'express';

const llave= "Yael";

dotenv.config();

const expre = express();
expre.use(express.json());
expre.use(cors());

const PASS_EXPIRY_CONFIG = {
  value: 1,          // Cambiar este número
  unit: 'minutes'     // 'minutes', 'hours', 'days'
};

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/visitorpass';


mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

expre.get('/', (req, res) => {
  res.send('API de Visitor Pass funcionando ');
});

expre.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});

expre.post('/api/passes', async (req, res) => {
  try {
     const { guestName, hostId } = req.body;
     const accessCode = generateAccessCode();

  const expiresAt = new Date();
    switch (PASS_EXPIRY_CONFIG.unit) {

      case 'minutes':
        expiresAt.setMinutes(expiresAt.getMinutes() + PASS_EXPIRY_CONFIG.value);
        break;
      case 'hours':
        expiresAt.setHours(expiresAt.getHours() + PASS_EXPIRY_CONFIG.value);
        break;
      case 'days':
        expiresAt.setDate(expiresAt.getDate() + PASS_EXPIRY_CONFIG.value);
        break;
      default:
        expiresAt.setMinutes(expiresAt.getMinutes() + 60);
    }

    const newPass = new Pass({
      guestName,
      accessCode,
      hostId,
      expiresAt,
      status: 'PENDING'
    });
    await newPass.save();

    res.status(201).json({
      message: 'Pass creado',
      pass: newPass
    });
  } catch (error) {
    console.error('Error al crear el pass:', error);
    res.status(500).json({ message: 'Error al crear el pass' });
  }
});

expre.get('/api/passes/validate/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const pass = await Pass.findOne({ accessCode: code });
    const updatePass= await Pass.findOneAndUpdate(
      { accessCode: code, status: 'PENDING' },
      { status: 'EXPIRED' },
      { new: true }
    );

    if (!pass) {
      return res.status(404).json({ valid: false, message: 'Pass no encontrado' });
    }

    if (pass.status === 'USED') {
      return res.status(403).json({ valid: false, message: 'Ya se uso antes' });
    }

    if (pass.status === 'EXPIRED') {
       return res.status(403).json({ valid: false, message: 'Pase marcado como expirado' });
    }

    const now = new Date();
    if (pass.expiresAt && now > pass.expiresAt) {
      return res.status(403).json({ valid: false, message: 'Pass expirado' });
    }

    return res.json({ 
      valid: true, 
      message: 'Pass válido',
      guestName: pass.guestName,
    });

  } catch (error) {
    console.error('Error al validar el pass:', error);
    res.status(500).json({ message: 'Error al validar el pass' });
  }
});

expre.patch('/api/passes/use/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const pass = await Pass.findOne(
      { accessCode: code},
    );

    if (!pass) {
      return res.status(404).json({ message: 'Pase no encontrado' });
    }

    if (pass.status === 'USED') {
      return res.status(400).json({ message: 'Este pase ya fue utilizado' });
    }
    pass.status = 'USED';
    pass.usedAt = new Date();
    await pass.save();

    res.json({ message: 'Entrada registrada. Pase inválido para futuros usos', pass });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el pass' });
  }

});

expre.get('/api/passes/stats', async (req, res) => {
  try {
    const total = await Pass.countDocuments();
    const used = await Pass.countDocuments({ status: 'USED' });
    const pending = await Pass.countDocuments({ status: 'PENDING' });
    const expired = await Pass.countDocuments({ status: 'EXPIRED' });

    res.json({
      total,
      used,
      pending,
      expired,
      usedPercentage: total > 0 ? ((used / total) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

expre.get('/api/stats/hourly', async (req, res) => {
  try {
    const stats = await Pass.aggregate([
      {$match: {status:'USED'}},
      {$group: {
        _id: {$hour: "$usedAt"},
        count: {$sum: 1}
      }
    },
    {$sort: {"_id":1}}
    ]);

    res.json(stats);
  }catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
}); 

expre.get('/api/stats/hourly-flow', async (req, res) => {
  try {
    const flow = await Pass.aggregate([
      {$group: {
        _id: {$hour: "$createdAt"},
        count: {$sum: 1}
      }},
      {$sort: {"_id":1}}
    ]);

    res.json(flow);
  }catch (error) {
    res.status(500).send(error);
  }
}); 

expre.get('/api/stats/status-distribution', async (req, res) => {
  try {
    const now = new Date();
    const stats = await Pass.aggregate([
      {
        $project: {
          status: {
            $cond: {
              if:{
                $and: [
                  { $eq: ['$status', 'PENDING'] },
                  { $lt: ['$expiresAt', now] }
                ]
              },
              then: 'EXPIRED',
              else: '$status'
            }
          }
      }
    },
        {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
          }
        }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json(error);
  }
}); 



//Post evaluacion
expre.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if( email ==="admin@visitingval.com" && password === "admin123"){
    const token = jwt.sign({ email }, llave, {expiresIn: '1h' });
    res.json({ token });
  }

  res.status(401).json({ message: 'Wrong, credentials invalid' });
  })

/*
  //   if (PASS_EXPIRY_CONFIG.unit === 'minutes') {
  // expiresAt.setMinutes(expiresAt.getMinutes() + PASS_EXPIRY_CONFIG.value);
  //   } else if (PASS_EXPIRY_CONFIG.unit === 'hours') {
  // expiresAt.setHours(expiresAt.getHours() + PASS_EXPIRY_CONFIG.value);
  //   } else {
  // expiresAt.setDate(expiresAt.getDate() + PASS_EXPIRY_CONFIG.value);
  //   }
    

*/