import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Customer = sequelize.define(
    'Customer',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },

    {
        tableName: 'customers',
        timestamps: false,
    }
);

export default Customer;
