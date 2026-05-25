import { Transaction, Prediction } from '../models/index.js';
import { Op } from 'sequelize';

export const getClientsService = async ({
    page,
    limit,
    country,
    region,
    riskLevel
}) => {
    const offset = (page - 1) * limit;

    // WHERE dinámico
    const where = {};

    if (country) where.customer_country = country;
    if (region) where.customer_region = region;

    const transactions = await Transaction.findAll({
        where,
        attributes: [
            'id_cliente',
            'tipo_cliente',
            'edad_cliente',
            'customer_country',
            'customer_region',
            'tenure',
            'importe_medio_mensual',
            'desviacion_estandar_mensual',
            'media_transacciones_al_dia',
            'numero_fraudes_ultimo_ano'
        ]
    });

    // AGRUPAR POR CLIENTE
    const grouped = {};

    for (const t of transactions) {
        const id = t.id_cliente;

        if (!grouped[id]) {
            grouped[id] = {
                id_cliente: id,
                tipo_cliente: t.tipo_cliente,
                edad_cliente: t.edad_cliente,
                customer_country: t.customer_country,
                customer_region: t.customer_region,
                tenure: t.tenure,
                importe_medio_mensual: 0,
                desviacion_estandar_mensual: 0,
                media_transacciones_al_dia: 0,
                numero_fraudes_ultimo_ano: 0,
                count: 0
            };
        }

        const g = grouped[id];

        g.importe_medio_mensual += Number(t.importe_medio_mensual);
        g.desviacion_estandar_mensual += Number(t.desviacion_estandar_mensual);
        g.media_transacciones_al_dia += Number(t.media_transacciones_al_dia);
        g.numero_fraudes_ultimo_ano += Number(t.numero_fraudes_ultimo_ano);

        g.count++;
    }

    let clients = Object.values(grouped).map(c => ({
        ...c,
        importe_medio_mensual: c.importe_medio_mensual / c.count,
        desviacion_estandar_mensual: c.desviacion_estandar_mensual / c.count,
        media_transacciones_al_dia: c.media_transacciones_al_dia / c.count,
        risk_score:
            c.numero_fraudes_ultimo_ano * 3 +
            c.media_transacciones_al_dia * 0.5 +
            c.desviacion_estandar_mensual * 0.2
    }));

    // FILTRO RISK LEVEL
    if (riskLevel) {
        clients = clients.filter(c => {
            if (riskLevel === 'high') return c.risk_score > 5;
            if (riskLevel === 'medium') return c.risk_score > 2 && c.risk_score <= 5;
            return c.risk_score <= 2;
        });
    }

    // PAGINACIÓN
    const total = clients.length;

    const paginated = clients.slice(offset, offset + limit);

    return {
        page,
        limit,
        total,
        data: paginated
    };
};