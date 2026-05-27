import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10); // 10 -> salt rounds.Eso controla cuántas veces bcrypt procesa la contraseña. Más alto = más seguro y más alto = más lento. 10 es el valor estándar más usado
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
