import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./config/db.js"
import "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate(); // Sequelize intenta conectarse a PostgreSQL
        console.log("Base de datos conectada correctamente");

        await sequelize.sync({ alter: true }); // sequelize -> conexión con PostgreSQL, sync -> sincroniza modelos base de datos y si no existe crea la tabla, Si cambió el modelo, { alter: true } -> modifica la tabla sin borrarla

        console.log("Modelos sincronizados");

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar servidor:", error);
    }
};

startServer();

