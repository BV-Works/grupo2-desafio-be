import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// ROUTES
import authRoutes from './routes/auth.routes.js';
import clientsRoutes from './routes/clients.routes.js';
import transactionsRoutes from './routes/transactions.routes.js';

const app = express();

app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
        ],
        credentials: true, // Permite cookies/sesión entre FE y BE
    })
);

app.use(express.json()); // Si llega un body en formato JSON, conviértelo a objeto JavaScript
app.use(cookieParser()); // Le dice a Express, cuando lleguen cookies, léelas y mételas dentro de req.cookies

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/transactions', transactionsRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend funcionando correctamente' });
});

export default app;
