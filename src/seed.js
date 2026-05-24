import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

import sequelize from './config/db.js';
import './models/index.js';

import { Customer, Transaction, User } from './models/index.js';

dotenv.config();

const __dirname = path.resolve();

const loadCSV = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    return parse(file, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
};

const seedDatabase = async () => {
    try {
        console.log('🔄 Conectando a DB...');

        await sequelize.authenticate();
        console.log('✅ DB conectada');

        await sequelize.sync({ alter: true });
        console.log('🧱 Tablas sincronizadas (sin recrear)');

        const adminEmail = process.env.SEED_ADMIN_EMAIL;
        const adminPassword = process.env.SEED_ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            throw new Error('Faltan SEED_ADMIN_EMAIL o SEED_ADMIN_PASSWORD en .env');
        }

        const existingAdmin = await User.findOne({
            where: { email: adminEmail },
        });

        if (!existingAdmin) {
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: adminPassword, // (si luego usas bcrypt aquí lo puedes hashear)
            });

            console.log('👑 Admin user creado');
        } else {
            console.log('👑 Admin user ya existe, se omite creación');
        }

        // =====================
        // LIMPIEZA TABLAS (opcional)
        // =====================
        await Transaction.destroy({ where: {}, truncate: true });
        await Customer.destroy({ where: {}, truncate: true });

        console.log('🧹 Datos antiguos limpiados');

        // =====================
        // CUSTOMERS
        // =====================
        const customersPath = path.join(__dirname, 'assets', 'customers.csv');
        const customers = loadCSV(customersPath);

        const createdCustomers = await Customer.bulkCreate(customers);
        console.log(`👤 Customers insertados: ${createdCustomers.length}`);

        // =====================
        // TRANSACTIONS
        // =====================
        const transactionsPath = path.join(__dirname, 'assets', 'transactions.csv');
        const transactions = loadCSV(transactionsPath);

        const formattedTransactions = transactions.map((t) => ({
            ...t,
            is_night: t.is_night === 'true',
            is_weekend: t.is_weekend === 'true',
            is_fraud: t.is_fraud === 'true',
            target_final: t.target_final === '' ? null : t.target_final === 'true',
            id_usuario: t.id_usuario === '' ? null : t.id_usuario,
            fecha_revision: t.fecha_revision === '' ? null : new Date(t.fecha_revision),
        }));

        const createdTransactions = await Transaction.bulkCreate(formattedTransactions);

        console.log(`💳 Transactions insertadas: ${createdTransactions.length}`);

        console.log('🚀 SEED COMPLETADO');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    }
};

seedDatabase();
