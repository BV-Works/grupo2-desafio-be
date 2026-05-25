import Transaction from './Transaction.js';
import Prediction from './Prediction.js';
import User from './User.js';

// TRANSACTION ↔ PREDICTION

Transaction.hasOne(Prediction, {
    foreignKey: 'id_transaccion',
    sourceKey: 'id_transaccion',
});

Prediction.belongsTo(Transaction, {
    foreignKey: 'id_transaccion',
    targetKey: 'id_transaccion',
});

// USER ↔ TRANSACTION

User.hasMany(Transaction, {
    foreignKey: 'id_usuario',
    sourceKey: 'id',
});

Transaction.belongsTo(User, {
    foreignKey: 'id_usuario',
    targetKey: 'id',
});

export { Transaction, Prediction, User };