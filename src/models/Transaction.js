import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

import Customer from './Customer.js';
import User from './User.js';

const Transaction = sequelize.define(
    'Transaction',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        cuenta_envio_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: Customer,
                key: 'id',
            },
        },

        is_night: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        is_weekend: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        is_fraud: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        // ===== CAMPOS DEL ANALISTA =====

        target_final: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },

        estado_revision: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        id_usuario: {
            type: DataTypes.UUID,
            allowNull: true,

            references: {
                model: User,
                key: 'id',
            },
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
