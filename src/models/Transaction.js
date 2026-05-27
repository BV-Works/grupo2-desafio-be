import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Transaction = sequelize.define(
    'Transaction',
    {
        id_transaccion: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        id_cliente: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        tipo_cliente: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        edad_cliente: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        customer_country: {
            type: DataTypes.STRING,
        },

        customer_region: {
            type: DataTypes.STRING,
        },

        tenure: {
            type: DataTypes.INTEGER,
        },

        importe_medio_mensual: {
            type: DataTypes.FLOAT,
        },

        desviacion_estandar_mensual: {
            type: DataTypes.FLOAT,
        },

        media_transacciones_al_dia: {
            type: DataTypes.FLOAT,
        },

        numero_fraudes_ultimo_ano: {
            type: DataTypes.INTEGER,
        },

        id_cuenta: {
            type: DataTypes.STRING,
        },

        cuenta_origen: {
            type: DataTypes.STRING,
        },

        estado_cuenta: {
            type: DataTypes.STRING,
        },

        saldo_actual: {
            type: DataTypes.FLOAT,
        },

        saldo_medio_30_dias: {
            type: DataTypes.FLOAT,
        },

        volumen_entrante_30_dias: {
            type: DataTypes.FLOAT,
        },

        volumen_saliente_30_dias: {
            type: DataTypes.FLOAT,
        },

        numero_transferencias_recibidas_7_dias: {
            type: DataTypes.INTEGER,
        },

        numero_transferencias_enviadas_7_dias: {
            type: DataTypes.INTEGER,
        },

        id_tarjeta: {
            type: DataTypes.STRING,
        },

        estado_tarjeta: {
            type: DataTypes.STRING,
        },

        fecha_creacion_tarjeta: {
            type: DataTypes.DATEONLY,
        },

        antiguedad_tarjeta_dias: {
            type: DataTypes.INTEGER,
        },

        limite_importe_transacciones: {
            type: DataTypes.FLOAT,
        },

        veces_superar_limite_7_dias: {
            type: DataTypes.INTEGER,
        },

        tipo_transaccion: {
            type: DataTypes.STRING,
        },

        fecha_hora: {
            type: DataTypes.DATE,
        },

        is_night: {
            type: DataTypes.BOOLEAN,
        },

        is_weekend: {
            type: DataTypes.BOOLEAN,
        },

        tiempo_desde_ultima_transaccion: {
            type: DataTypes.INTEGER,
        },

        numero_transacciones_ultima_hora: {
            type: DataTypes.INTEGER,
        },

        importe_transaccion: {
            type: DataTypes.FLOAT,
        },

        metodo_autenticacion: {
            type: DataTypes.STRING,
        },

        numero_pin_disponibles: {
            type: DataTypes.INTEGER,
        },

        identificador_dispositivo_fingerprint: {
            type: DataTypes.STRING,
        },

        dispositivo_reconocido: {
            type: DataTypes.BOOLEAN,
        },

        operacion_pais: {
            type: DataTypes.STRING,
        },

        operacion_region: {
            type: DataTypes.STRING,
        },

        direccion_ip_origen: {
            type: DataTypes.STRING,
        },

        geolocalizacion: {
            type: DataTypes.STRING,
        },

        cuenta_destino: {
            type: DataTypes.STRING,
        },

        destino_alto_riesgo: {
            type: DataTypes.BOOLEAN,
        },

        // =========================
        // REVISION MANUAL ANALISTA
        // =========================

        target_final: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },

        id_usuario: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        fecha_revision: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },

    {
        tableName: 'transactions',
        timestamps: true,
    }
);

export default Transaction;
