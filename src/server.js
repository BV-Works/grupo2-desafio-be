import app from './app.js';
import dotenv from 'dotenv';
import sequelize from './config/db.js';

import './models/index.js';
import { runSeed } from './seed.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // DB CONNECT
        await sequelize.authenticate();
        console.log('✅ DB conectada');

        // SYNC MODELS
        await sequelize.sync({ alter: true });
        console.log('🧱 Modelos sincronizados');

        // SEED (AUTO EN DEV)
        await runSeed();

        // START SERVER
        app.listen(PORT, () => {
            console.log(`🚀 Servidor en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();
