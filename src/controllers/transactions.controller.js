import { getTransactionsService, getTransactionByIdService, updateTransactionByIdService } from '../services/transactions.service.js';

export const getTransactions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            id_usuario,
            target_final,
            riskLevel,
            from,
            to
        } = req.query;

        const data = await getTransactionsService({
            page: Number(page),
            limit: Number(limit),
            id_usuario,
            target_final,
            riskLevel,
            from,
            to
        });

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching transactions'
        });
    }
};


export const getTransactionByIdController = async (req, res) => {
    const { id } = req.params;

    const data = await getTransactionByIdService(id);

    if (!data) {
        return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(data);
};


export const updateTransactionByIdController = async (req, res) => {
    const { id } = req.params;
    const { target_final, id_usuario } = req.body;

    const updated = await updateTransactionByIdService(id, {
        target_final,
        id_usuario
    });

    if (!updated) {
        return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(updated);
};