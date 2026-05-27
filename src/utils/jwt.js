import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
    // El payload es la información que quieres guardar dentro del token
    // jwt.sign -> Crear y firmar el token
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET); // Comprueba si Firma válida ¿se creó con mi JWT_SECRET? y si expiró ¿sigue dentro de 1 día?
};
