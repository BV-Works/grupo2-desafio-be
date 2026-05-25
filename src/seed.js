import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { hashPassword } from './utils/bcrypt.js';
import './models/index.js';

import { Transaction, Prediction, User } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV LOADER

const loadCSV = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');

    return parse(file, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ';',
        bom: true,
    });
};

const parseBoolean = (value) => {
    if (value === '' || value === null || value === undefined) {
        return null;
    }

    return value === 'true';
};

const parseDate = (value) => {
    if (!value || value.trim() === '') return null;

    const v = value.trim();

    // Si ya es ISO
    if (v.includes('T')) {
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
    }

    // formato: dd/mm/yyyy hh:mm
    const [datePart, timePart] = v.split(' ');

    if (!datePart) return null;

    const [day, month, year] = datePart.split('/');

    if (!day || !month || !year) return null;

    const iso = `${year}-${month}-${day}${timePart ? 'T' + timePart : ''}`;

    const date = new Date(iso);

    return isNaN(date.getTime()) ? null : date;
};

export const runSeed = async () => {
    try {
        console.log('🌱 Iniciando seed...');

        const shouldRunSeed = process.env.RUN_SEED === 'true';

        if (!shouldRunSeed) {
            console.log('⛔ Seed skipped');
            return;
        }

        // ADMIN USER

        const adminEmail = process.env.SEED_ADMIN_EMAIL;
        const adminPassword = process.env.SEED_ADMIN_PASSWORD;

        const existingAdmin = await User.findOne({
            where: { email: adminEmail },
        });

        if (!existingAdmin) {
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: await hashPassword(adminPassword),
            });

            console.log('👑 Admin creado');
        } else {
            console.log('👑 Admin ya existe');
        }

        // CLEAN TABLES

        await Prediction.destroy({
            where: {},
            truncate: {
                cascade: true,
                restartIdentity: true,
            },
        });

        await Transaction.destroy({
            where: {},
            truncate: {
                cascade: true,
                restartIdentity: true,
            },
        });

        console.log('🧹 Datos limpiados');

        // TRANSACTIONS CSV

        const transactionsPath = path.join(__dirname, '../assets/transactions.csv');

        const transactions = loadCSV(transactionsPath);

        if (transactions.length === 0) {
            throw new Error('CSV de transactions vacío');
        }

        const formattedTransactions = transactions.map((t) => ({
            ...t,
            id_transaccion: t.id_transaccion?.trim() || null,
            edad_cliente: Number(t.edad_cliente),
            tenure: Number(t.tenure),

            importe_medio_mensual: Number(t.importe_medio_mensual),
            desviacion_estandar_mensual: Number(t.desviacion_estandar_mensual),
            media_transacciones_al_dia: Number(t.media_transacciones_al_dia),

            numero_fraudes_ultimo_ano: Number(t.numero_fraudes_ultimo_ano),

            saldo_actual: Number(t.saldo_actual),
            saldo_medio_30_dias: Number(t.saldo_medio_30_dias),

            volumen_entrante_30_dias: Number(t.volumen_entrante_30_dias),
            volumen_saliente_30_dias: Number(t.volumen_saliente_30_dias),

            numero_transferencias_recibidas_7_dias: Number(
                t.numero_transferencias_recibidas_7_dias
            ),

            numero_transferencias_enviadas_7_dias: Number(t.numero_transferencias_enviadas_7_dias),

            antiguedad_tarjeta_dias: Number(t.antiguedad_tarjeta_dias),

            limite_importe_transacciones: Number(t.limite_importe_transacciones),

            veces_superar_limite_7_dias: Number(t.veces_superar_limite_7_dias),

            tiempo_desde_ultima_transaccion: Number(t.tiempo_desde_ultima_transaccion),

            numero_transacciones_ultima_hora: Number(t.numero_transacciones_ultima_hora),

            importe_transaccion: Number(t.importe_transaccion),

            numero_pin_disponibles: Number(t.numero_pin_disponibles),

            is_night: parseBoolean(t.is_night),
            is_weekend: parseBoolean(t.is_weekend),

            dispositivo_reconocido: parseBoolean(t.dispositivo_reconocido),

            destino_alto_riesgo: parseBoolean(t.destino_alto_riesgo),

            target_final: parseBoolean(t.target_final),

            id_usuario: t.id_usuario === '' ? null : t.id_usuario,
            
            fecha_creacion_tarjeta: parseDate(t.fecha_creacion_tarjeta),
            fecha_hora: parseDate(t.fecha_hora),
            fecha_revision: parseDate(t.fecha_revision),
        }));

        const createdTransactions = await Transaction.bulkCreate(formattedTransactions);

        console.log(`💳 Transactions insertadas: ${createdTransactions.length}`);

        // PREDICTIONS CSV

        const predictionsPath = path.join(__dirname, '../assets/predictions.csv');

        const predictions = loadCSV(predictionsPath);

        if (predictions.length === 0) {
            throw new Error('CSV de predictions vacío');
        }

        const formattedPredictions = predictions.map((p) => ({
            ...p,

            is_fraud: parseBoolean(p.is_fraud),

            impacto_fraude: parseBoolean(p.impacto_fraude),

            es_transfronteriza: parseBoolean(p.es_transfronteriza),

            prob_fraud: Number(p.prob_fraud),

            ratio_imp_limite: Number(p.ratio_imp_limite),

            intensidad_tx: Number(p.intensidad_tx),

            severidad_tx: Number(p.severidad_tx),

            flujo_neto_30d: Number(p.flujo_neto_30d),
        }));

        const createdPredictions = await Prediction.bulkCreate(formattedPredictions);

        console.log(`🧠 Predictions insertadas: ${createdPredictions.length}`);

        console.log('🚀 Seed completado correctamente');
    } catch (error) {
        console.error('❌ Error seed:', error);
        throw error;
    }
};
