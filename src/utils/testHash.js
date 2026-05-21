import { hashPassword } from "./bcrypt.js";

const hash =
    await hashPassword(
        "123456"
    );

console.log(hash);