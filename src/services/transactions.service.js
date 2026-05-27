import { Transaction, Prediction } from '../models/index.js';
import { Op } from 'sequelize';
import { getPredictionsFromML } from './ml.service.js';
import { mapMLPredictionToDB } from '../utils/prediction.mapper.js';

const parseBoolean = (value) => {
    if (value === undefined) return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
};

export const getTransactionsService = async ({ page, limit, target_final, riskLevel, sort }) => {
    const offset = (page - 1) * limit;

    // WHERE Transactions
    const where = {};

    if (target_final !== undefined) {
        const parsed = parseBoolean(target_final);

        if (parsed === false) {
            where.target_final = {
                [Op.or]: [{ [Op.eq]: false }, { [Op.is]: null }],
            };
        } else {
            where.target_final = { [Op.eq]: parsed };
        }
    }

    // 1. Transactions
    const transactions = await Transaction.findAll({
        where,
        attributes: [
            'id_transaccion',
            'id_cliente',
            'id_cuenta',
            'cuenta_origen',
            'estado_cuenta',
            'saldo_actual',
            'saldo_medio_30_dias',
            'volumen_entrante_30_dias',
            'volumen_saliente_30_dias',
            'numero_transferencias_recibidas_7_dias',
            'numero_transferencias_enviadas_7_dias',
            'id_tarjeta',
            'estado_tarjeta',
            'fecha_creacion_tarjeta',
            'antiguedad_tarjeta_dias',
            'limite_importe_transacciones',
            'veces_superar_limite_7_dias',
            'tipo_transaccion',
            'fecha_hora',
            'is_night',
            'is_weekend',
            'tiempo_desde_ultima_transaccion',
            'numero_transacciones_ultima_hora',
            'importe_transaccion',
            'metodo_autenticacion',
            'numero_pin_disponibles',
            'identificador_dispositivo_fingerprint',
            'dispositivo_reconocido',
            'operacion_pais',
            'operacion_region',
            'direccion_ip_origen',
            'geolocalizacion',
            'cuenta_destino',
            'destino_alto_riesgo',
            'target_final',
            'fecha_revision',
        ],
    });

    const txIds = transactions.map((t) => t.id_transaccion);

    // 2. Predictions
    const predictions = await Prediction.findAll({
        where: {
            id_transaccion: txIds,
        },
    });

    const predictionMap = new Map();
    for (const p of predictions) {
        predictionMap.set(p.id_transaccion, p);
    }

    // 3. Merge
    let merged = transactions.map((t) => {
        const p = predictionMap.get(t.id_transaccion);

        const risk_score = p ? p.prob_fraud * 100 : 0;

        return {
            ...t.toJSON(),
            prediction: p ? p.toJSON() : null,
            risk_score,
        };
    });

    // 4. RISK FILTER
    if (riskLevel) {
        merged = merged.filter((t) => {
            const r = t.risk_score;

            if (riskLevel === 'high') return r > 70;
            if (riskLevel === 'medium') return r > 30 && r <= 70;
            return r <= 30;
        });
    }

    // 5. SORT
    if (sort === 'prob_fraud_desc') {
        merged.sort((a, b) => b.risk_score - a.risk_score);
    }

    if (sort === 'prob_fraud_asc') {
        merged.sort((a, b) => a.risk_score - b.risk_score);
    }

    // 6. PAGINATION
    const total = merged.length;
    const paginated = merged.slice(offset, offset + limit);

    return {
        page,
        limit,
        total,
        data: paginated,
    };
};

export const getTransactionByIdService = async (id) => {
    const transaction = await Transaction.findOne({
        where: { id_transaccion: id },
        attributes: [
            'id_transaccion',
            'id_cliente',
            'id_cuenta',
            'cuenta_origen',
            'estado_cuenta',
            'saldo_actual',
            'saldo_medio_30_dias',
            'volumen_entrante_30_dias',
            'volumen_saliente_30_dias',
            'numero_transferencias_recibidas_7_dias',
            'numero_transferencias_enviadas_7_dias',
            'id_tarjeta',
            'estado_tarjeta',
            'fecha_creacion_tarjeta',
            'antiguedad_tarjeta_dias',
            'limite_importe_transacciones',
            'veces_superar_limite_7_dias',
            'tipo_transaccion',
            'fecha_hora',
            'is_night',
            'is_weekend',
            'tiempo_desde_ultima_transaccion',
            'numero_transacciones_ultima_hora',
            'importe_transaccion',
            'metodo_autenticacion',
            'numero_pin_disponibles',
            'identificador_dispositivo_fingerprint',
            'dispositivo_reconocido',
            'operacion_pais',
            'operacion_region',
            'direccion_ip_origen',
            'geolocalizacion',
            'cuenta_destino',
            'destino_alto_riesgo',
            'target_final',
            'fecha_revision',
            'id_usuario',
        ],
    });

    if (!transaction) return null;

    const prediction = await Prediction.findOne({
        where: { id_transaccion: id },
    });

    const risk_score = prediction ? prediction.prob_fraud * 100 : 0;

    return {
        ...transaction.toJSON(),
        prediction: prediction ? prediction.toJSON() : null,
        risk_score,
    };
};

export const updateTransactionByIdService = async (id, { target_final, id_usuario }) => {
    const transaction = await Transaction.findOne({
        where: { id_transaccion: id },
    });

    if (!transaction) return null;

    const parsedTarget =
        target_final === undefined
            ? transaction.target_final
            : target_final === 'true' || target_final === true;

    await transaction.update({
        target_final: parsedTarget,
        fecha_revision: new Date(),
        id_usuario,
    });

    return transaction;
};

export const createTransactionsWithPrediction = async (transactions) => {
    const mlResponse = await getPredictionsFromML(transactions);

    const predictions = mlResponse?.predicciones;

    if (!Array.isArray(predictions)) {
        throw new Error('ML response invalid');
    }

    const createdTransactions = await Transaction.bulkCreate(transactions);

    const formattedPredictions = predictions.map(mapMLPredictionToDB);

    const createdPredictions = await Prediction.bulkCreate(formattedPredictions);

    return {
        transactions: createdTransactions,
        predictions: createdPredictions,
    };
};
