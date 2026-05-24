import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

import './models/index.js';
import { Customer, Transaction, User } from './models/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadCSV = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');

    return parse(file, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ';',
    });
};

// SEED FUNCTION
export const runSeed = async () => {
    try {
        console.log('🌱 Iniciando seed...');

        const runSeed = process.env.RUN_SEED === 'true';

        if (!runSeed) {
            console.log('⛔ Seed skipped');
            return;
        }

        // ADMIN (IDEMPOTENTE)
        const adminEmail = process.env.SEED_ADMIN_EMAIL;
        const adminPassword = process.env.SEED_ADMIN_PASSWORD;

        const existingAdmin = await User.findOne({
            where: { email: adminEmail },
        });

        if (!existingAdmin) {
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: adminPassword,
            });

            console.log('👑 Admin creado');
        } else {
            console.log('👑 Admin ya existe');
        }

        // LIMPIEZA DATOS
        await Transaction.destroy({
            where: {},
            truncate: {
                cascade: true,
                restartIdentity: true,
            },
        });
        await Customer.destroy({
            where: {},
            truncate: {
                cascade: true,
                restartIdentity: true,
            },
        });

        console.log('🧹 Datos limpiados');

        // CUSTOMERS
        const customersPath = path.join(__dirname, '../assets/customers.csv');
        // console.log('CUSTOMERS PATH:', customersPath);
        // console.log('EXISTS:', fs.existsSync(customersPath));
        const customers = loadCSV(customersPath)
            .filter((c) => c.type && c.age)
            .map((c) => ({
                id: Number(c.id),
                type: c.type,
                age: Number(c.age),
            }));

        if (customers.length === 0) {
            throw new Error('CSV de customers vacío o mal parseado');
        }

        const createdCustomers = await Customer.bulkCreate(customers);
        console.log(`👤 Customers: ${createdCustomers.length}`);

        // TRANSACTIONS
        const transactionsPath = path.join(__dirname, '../assets/transactions.csv');
        const transactions = loadCSV(transactionsPath);

        const formatted = transactions.map((t) => ({
            ...t,
            is_night: t.is_night === 'true',
            is_weekend: t.is_weekend === 'true',
            is_fraud: t.is_fraud === 'true',
            target_final: t.target_final === '' ? null : t.target_final === 'true',
            id_usuario: t.id_usuario === '' ? null : t.id_usuario,
            fecha_revision: t.fecha_revision === '' ? null : new Date(t.fecha_revision),
        }));

        const createdTransactions = await Transaction.bulkCreate(formatted);

        console.log(`💳 Transactions: ${createdTransactions.length}`);

        console.log('🚀 Seed completo');
        console.log('🌱 Seed ejecutado');
    } catch (error) {
        console.error('❌ Error seed:', error);
        throw error;
    }
};
