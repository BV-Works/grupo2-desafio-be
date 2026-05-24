# grupo2-desafio-be

# 🚀 Backend Setup Guide

Este proyecto es un backend con Node.js + Express + Sequelize + PostgreSQL + Docker.

---

# 📦 1. Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- Node.js (v18+ recomendado)
- Docker Desktop
- Git
- npm o pnpm

Comprueba versiones en la consola de comand:
node -v
docker -v
npm -v

---

# 📥 2. Clonar el proyecto

git clone https://github.com/BV-Works/grupo2-desafio-be.git
cd <grupo2-desafio-be>

Durante el desarrollo la rama main estará probablemente vacia. La versión actual del proyecto esta en develop:
para moverte a la rama:

git checkout develop
para descargar el contenido de la rama:

## git pull develop

# 📦 3. Instalar dependencias

## npm install

---

# 🐳 4. Levantar la base de datos (PostgreSQL)

El proyecto usa Docker en local para la base de datos.

npm run db:up

Esto levantará:

PostgreSQL en local
Puerto típico: 5432

---

# ⚙️ 5. Configurar variables de entorno

Crea un archivo .env en la raíz:

PORT=3000

# PARA EL SEED DE SUPER USER (ANALISTA DE FRAUDES)

SEED_ADMIN_EMAIL=admin@test.com
SEED_ADMIN_PASSWORD=123456

# PARA EL DOCKER LOCAL O DESPLEGADO CON LA BBDD

PORT=3000

DB_NAME=nombre_BBDD
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=super_secret_key

# PARA CORS, CONFIGURAR EL ENTORNO Y DECIDIR SI QUIERES QUE PRECARGE DATOS DE SEED EN LA BBDD.

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
RUN_SEED=true

---

# 🌱 6. Ejecutar el backend (modo desarrollo)

npm run dev

Esto hará automáticamente:

Conexión a la base de datos
Creación de tablas (sync Sequelize)
Limpieza e inserción de datos (seed)
Arranque del servidor Express

---

# 📡 7. Endpoints disponibles

Health check:
GET /api/health
Respuesta:
{
"message": "Backend funcionando correctamente"
}

Auth:
POST /api/auth/login
POST /api/auth/register

---

# 🌱 8. Seed automático

El seed se ejecuta automáticamente al iniciar el servidor si en .env RUN_SEED=true.

Incluye:

Usuario admin inicial
Carga de customers desde CSV
Carga de transactions desde CSV

📁 Archivos CSV:

/assets/customers.csv
/assets/transactions.csv

---

# 🧹 9. Reset de base de datos

Si quieres reiniciar todo:

npm run db:down
npm run db:up

Luego:

npm run dev

---

# 🛠️ 10. Scripts disponibles

{
"dev": "node --watch src/server.js",
"db:up": "docker-compose up -d",
"db:down": "docker-compose down -v",
"format": "prettier --write ."
}

---

# 🛠️ 11. 🚀 Flujo completo

npm install
npm run db:up
npm run dev

---

# 🛠️ 12. 🎯 Resultado final

Backend corriendo en:

http://localhost:3000
