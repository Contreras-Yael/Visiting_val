import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

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