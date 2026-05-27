import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token; //Busca la cookie

        if (!token) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const decoded = verifyToken(token); // Guardamos decoded.id

        const user = await User.findByPk(
            // Busca por clave primaria
            decoded.id,
            {
                attributes: ['id', 'name', 'email'],
            }
        ); // En attributes solo devolvemos esos campos id ...

        if (!user) {
            return res.status(401).json({
                message: 'Usuario no encontrado',
            });
        }

        req.user = user; // Guardamos el user en req para que el siguiente controller pueda usarlo

        next();
    } catch (error) {
        res.status(401).json({
            message: 'Token inválido',
        });
    }
};
