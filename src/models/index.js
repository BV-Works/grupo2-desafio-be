// models/index.js

import Customer from './Customer.js';
import Transaction from './Transaction.js';
import User from './User.js';

// ================= RELACIONES =================

// Customer -> Transactions
Customer.hasMany(Transaction, {
    foreignKey: 'cuenta_envio_id',
});

Transaction.belongsTo(Customer, {
    foreignKey: 'cuenta_envio_id',
});

// User (Analista) -> Transactions revisadas
User.hasMany(Transaction, {
    foreignKey: 'id_usuario',
});

Transaction.belongsTo(User, {
    foreignKey: 'id_usuario',
});

// ================= EXPORTS =================

export { Customer, Transaction, User };
