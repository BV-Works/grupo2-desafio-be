import { getTransactionsService } from '../services/transactions.service.js';

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