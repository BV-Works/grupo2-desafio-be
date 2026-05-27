import { DataTypes } from 'sequelize'; // Tipos de datos como DataTypes.STRING...
import sequelize from '../config/db.js'; // Importamos la conexion

// sequelize.define -> crea un modelo de Sequelize
const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID, // generara un codigo unico y seguro para api
            defaultValue: DataTypes.UUIDV4, // se genera automáticamente al crear un usuario
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false, // allowNull: false → obligatorio
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // no se puede repetir
            validate: {
                isEmail: true, // valida formato email
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },

    {
        tableName: 'users',
        timestamps: true,
    }
);

export default User;
