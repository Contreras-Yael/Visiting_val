import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pass } from './models/Pass.js'; 
import { generateAccessCode } from './utils/codegenerator.js';
import e from 'express';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
//const MONGO_URI = process.env.MONGO_URI || 'tu_url_de_mongo_aqui';
const MONGO_URI = process.env.MONGO_URI || 'tu_url_de_mongo_aqui';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

app.get('/', (req, res) => {
  res.send('API de Visitor Pass funcionando ');
});

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});

app.post('/api/passes', async (req, res) => {
  try {
    const { guestName, hostId, daysValid = 1 } = req.body;
    const accessCode = generateAccessCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysValid);

    const newPass = new Pass({
      guestName,
      accessCode,
      hostId,
      expiresAt,
      status: 'PENDING'
    });
    await newPass.save();

    res.status(201).json({
      message: 'Pass creado exitosamente',
      pass: newPass
    });
  } catch (error) {
    console.error('Error al crear el pass:', error);
    res.status(500).json({ message: 'Error al crear el pass' });
  }
});

app.get('/api/passes/validate/:code', async (req, res) => {
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

app.patch('/api/passes/use/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const pass = await Pass.findOne(
      { accessCode: code},
      // { status: 'USED' },
      // { new: true }
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

app.get('/api/passes/stats', async (req, res) => {
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

app.get('/api/stats/hourly', async (req, res) => {
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

app.get('/api/stats/hourly-flow', async (req, res) => {
  try {
    const flow = await Pass.aggregate([
      {$match:{status:'USED'}},
      {$group: {
        _id: {$hour: "$usedAt"},
        count: {$sum: 1}
      }},
      {$sort: {"_id":1}}
    ]);

    res.json(flow);
  }catch (error) {
    res.status(500).send(error);
  }
}); 