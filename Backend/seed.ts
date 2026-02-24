import mongoose from "mongoose";

import Pass from './src/models/Pass.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/visiting_db';

const seedData = async () => {
    await mongoose.connect(MONGO_URI);
    await Pass.deleteMany({});

    const names = ['Juan Perez','Ana','Carlos','María','Luis','Sofía','Pedro','Laura','Diego','Elena'];
    const pases = [];

    for (let i = 0; i < 10; i++) {
        const randomHour = Math.floor(Math.random() * (20 - 8 + 1)) + 8;
        const date = new Date();
        date.setHours(randomHour, Math.floor(Math.random() * 60));
        
        pases.push({
            guestName: names[Math.floor(Math.random() * names.length)],
            hostId: 'Admin_1',
            accessCode: `VIS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            status: Math.random() > 0.3 ? 'USED' : 'PENDING',
            usedAt: date,
            createdAt: new Date()
        });
    }

    await Pass.insertMany(pases);
    console.log('Datos de prueba insertados');
    process.exit();
};

seedData();