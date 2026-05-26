import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Prediction = sequelize.define(
    'Prediction',
    {
        id_transaccion: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        is_fraud: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        prob_fraud: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        impacto_fraude: {
            type: DataTypes.BOOLEAN,
        },

        es_transfronteriza: {
            type: DataTypes.BOOLEAN,
        },

        ratio_imp_limite: {
            type: DataTypes.FLOAT,
        },

        intensidad_tx: {
            type: DataTypes.FLOAT,
        },

        severidad_tx: {
            type: DataTypes.FLOAT,
        },

        flujo_neto_30d: {
            type: DataTypes.FLOAT,
        },

        mensaje: {
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: 'predictions',
        timestamps: true,
    }
);

export default Prediction;
