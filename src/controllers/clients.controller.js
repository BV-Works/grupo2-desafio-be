import { getClientsService } from '../services/clients.service.js';

export const getClients = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            country,
            region,
            riskLevel
        } = req.query;

        const data = await getClientsService({
            page: Number(page),
            limit: Number(limit),
            country,
            region,
            riskLevel
        });

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching clients' });
    }
};