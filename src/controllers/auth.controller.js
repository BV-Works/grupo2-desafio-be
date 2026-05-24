import { loginUser } from '../services/auth.service.js';

const cookieOptions = {
    httpOnly: true, // JavaScript del navegador NO puede leer esta cookie
    secure: process.env.NODE_ENV === 'production', // En producción → solo HTTPS y en desarrollo → HTTP permitido
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Controla si la cookie puede viajar entre dominios
    maxAge: 24 * 60 * 60 * 1000, // Duración de un día
};

export const login = async (req, res) => {
    try {
        const { token, user } = await loginUser(req.body);

        res.cookie('token', token, cookieOptions); // Nombre -> token, Valor -> token, configuración -> cookieOptions

        res.json({
            message: 'Login correcto',
            user,
        });
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
};

// Función de Usuario autenticado
export const getMe = async (req, res) => {
    res.json({
        user: req.user,
    });
};

export const logout = (req, res) => {
    res.clearCookie('token', cookieOptions);

    res.json({
        message: 'Sesión cerrada correctamente',
    });
};
