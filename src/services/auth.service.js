import { User } from "../models/index.js";
import { comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

export const loginUser = async ({ email, password }) => {
    const user =
        await User.findOne({
            where: {
                email,
            },
        });

    if (!user) {
        throw new Error(
            "Credenciales incorrectas"
        );
    }

    const validPassword = await comparePassword(password, user.password); // password -> escrita por el usuario. user.password -> contraseña guardada en la BBDD

    if (!validPassword) {
        throw new Error(
            "Credenciales incorrectas"
        );
    }

    const token = generateToken({ id: user.id });

    return {
        token,

        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};
