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

## 🔥 Health check:

GET /api/health
Respuesta:
{
"message": "Backend funcionando correctamente"
}

## 🚀 Auth: Autenticación

POST /api/auth/login
POST /api/auth/register

## 📡Clients: Clientes

GET /api/clients

Este endpoint te devuelve una lista de clientes agregados desde transactions, con métricas de comportamiento y riesgo.

### 🧠 QUÉ HACE

Agrupa transactions por id_cliente
Calcula métricas promedio:
gasto medio
volatilidad
actividad
fraudes históricos
Genera un risk_score
Permite filtros + paginación

### ⚙️ QUERY PARAMS DISPONIBLES

📄 1. PAGINACIÓN
page=1
limit=20

Ejemplo: /api/clients?page=1&limit=10

🌍 2. FILTROS GEOGRÁFICOS
country=ES
region=Centro

Ejemplo: /api/clients?country=ES&region=Norte
🚨 3. FILTRO DE RIESGO
riskLevel=low
riskLevel=medium
riskLevel=high

Ejemplo: /api/clients?riskLevel=high

## 📡 Transactions: Transacciones

🔍 GET Transactions
GET /api/transactions

Este endpoint devuelve una lista de transacciones enriquecidas con su predicción de fraude asociada (Prediction), incluyendo un risk_score calculado en backend.

### 🧠 QUÉ HACE

Cada transacción incluye:

Datos financieros y operativos (Transaction)
Resultado del modelo de fraude (Prediction)
Score de riesgo calculado (0–100)

### ⚙️ QUERY PARAMS DISPONIBLES

📄 1. PAGINACIÓN
page → número de página (default: 1)
limit → elementos por página (default: 10)

Ejemplo: /api/transactions?page=2&limit=10

🎯 2. FILTROS:
🔹 target_final (revisado por analista):

target_final=true
target_final=false

Ejemplo: /api/transactions?target_final=false

🔹 riskLevel (nivel de riesgo calculado):

Basado en prob_fraud \* 100

riskLevel=high // > 70
riskLevel=medium // 30 - 70
riskLevel=low // < 30

Ejemplo: /api/transactions?riskLevel=high

🔹 sort:
sort=prob_fraud_desc
sort=prob_fraud_asc

Ejemplo: /api/transactions?sort=prob_fraud_desc

🔍 GET Transaction by ID

GET /api/transactions/:id

Este endpoint devuelve el detalle completo de una transacción concreta junto con su predicción de fraude asociada y el risk_score calculado.

### 🧠 QUÉ HACE

Devuelve:

Datos completos de la transacción (Transaction)
Predicción del modelo asociada (Prediction)
risk_score calculado en backend (prob_fraud \* 100)

### 📌 PARÁMETROS

id string ID de la transacción

EJEMPLO: GET /api/transactions/trx-001

✏️ PUT Transaction by ID (Review analista)
PUT /api/transactions/:id

Este endpoint permite que un analista revise una transacción y registre su decisión final sobre si es fraude o no.

### 🧠 QUÉ HACE

Actualiza:

target_final → decisión del analista
fecha_revision → timestamp automático de la revisión
id_usuario → analista que realiza la revisión

📦 BODY REQUEST
{
"target_final": true,
"id_usuario": "analyst-001"
}
📦 RESPUESTA
{
"message": "Transaction updated successfully",
"data": {
"id_transaccion": "trx-001",
"target_final": true,
"fecha_revision": "2026-05-25T20:00:00.000Z",
"id_usuario": "analyst-001"
}
}

### 📌 PARÁMETROS

id string ID de la transacción

### ⚠️ NOTAS

Si target_final no se envía, no se modifica
fecha_revision se asigna automáticamente en backend
Este endpoint es clave para feedback del modelo ML

➕ POST Transactions: Crear transacciones

POST /api/transactions

Este endpoint permite crear una o múltiples transacciones nuevas en el sistema.
Al crear la transacción:

Se almacena en la tabla transactions
Se envía automáticamente al microservicio ML
Se genera la predicción de fraude (Prediction)
Se calcula el risk_score

### 🧠 QUÉ HACE

Por cada transacción:

✅ Guarda la operación financiera
✅ Ejecuta inferencia ML automática
✅ Inserta la predicción asociada
✅ Devuelve transacción + predicción enriquecida

Compatible con:

creación individual
inserción masiva (bulk create)

### 📦 BODY REQUEST

[
{
"id_transaccion": "trx-bulk-001",
"id_cliente": "cli-bulk-001",
"tipo_cliente": "persona",
"edad_cliente": 31,
"customer_country": "ES",
"customer_region": "Asturias",
"tenure": 450,
"importe_medio_mensual": 1100,
"desviacion_estandar_mensual": 120,
"media_transacciones_al_dia": 3.2,
"numero_fraudes_ultimo_ano": 0,
"id_cuenta": "acc-bulk-001",
"cuenta_origen": "ES111111111",
"estado_cuenta": "activa",
"saldo_actual": 4200,
"saldo_medio_30_dias": 3900,
"volumen_entrante_30_dias": 5200,
"volumen_saliente_30_dias": 4700,
"numero_transferencias_recibidas_7_dias": 4,
"numero_transferencias_enviadas_7_dias": 2,
"id_tarjeta": "card-bulk-001",
"estado_tarjeta": "activa",
"fecha_creacion_tarjeta": "2023-02-10",
"antiguedad_tarjeta_dias": 450,
"limite_importe_transacciones": 3000,
"veces_superar_limite_7_dias": 0,
"tipo_transaccion": "transferencia",
"fecha_hora": "2026-05-27 10:15:00",
"is_night": false,
"is_weekend": false,
"tiempo_desde_ultima_transaccion": 1200,
"numero_transacciones_ultima_hora": 1,
"importe_transaccion": 320,
"metodo_autenticacion": "PIN",
"numero_pin_disponibles": 3,
"identificador_dispositivo_fingerprint": "fp-bulk-001",
"dispositivo_reconocido": true,
"operacion_pais": "ES",
"operacion_region": "Asturias",
"direccion_ip_origen": "192.168.1.10",
"geolocalizacion": "43.3614,-5.8494",
"cuenta_destino": "ES999000111",
"destino_alto_riesgo": false
}
]

### 📦 RESPUESTA

"message": "Transactions processed with predictions",
"data": {
"transactions": [
{
"id_transaccion": "trx-bulk-001",
"id_cliente": "cli-bulk-001",
"tipo_cliente": "persona",
"edad_cliente": 31,
"customer_country": "ES",
"customer_region": "Asturias",
"tenure": 450,
"importe_medio_mensual": 1100,
"desviacion_estandar_mensual": 120,
"media_transacciones_al_dia": 3.2,
"numero_fraudes_ultimo_ano": 0,
"id_cuenta": "acc-bulk-001",
"cuenta_origen": "ES111111111",
"estado_cuenta": "activa",
"saldo_actual": 4200,
"saldo_medio_30_dias": 3900,
"volumen_entrante_30_dias": 5200,
"volumen_saliente_30_dias": 4700,
"numero_transferencias_recibidas_7_dias": 4,
"numero_transferencias_enviadas_7_dias": 2,
"id_tarjeta": "card-bulk-001",
"estado_tarjeta": "activa",
"fecha_creacion_tarjeta": "2023-02-10",
"antiguedad_tarjeta_dias": 450,
"limite_importe_transacciones": 3000,
"veces_superar_limite_7_dias": 0,
"tipo_transaccion": "transferencia",
"fecha_hora": "2026-05-27T08:15:00.000Z",
"is_night": false,
"is_weekend": false,
"tiempo_desde_ultima_transaccion": 1200,
"numero_transacciones_ultima_hora": 1,
"importe_transaccion": 320,
"metodo_autenticacion": "PIN",
"numero_pin_disponibles": 3,
"identificador_dispositivo_fingerprint": "fp-bulk-001",
"dispositivo_reconocido": true,
"operacion_pais": "ES",
"operacion_region": "Asturias",
"direccion_ip_origen": "192.168.1.10",
"geolocalizacion": "43.3614,-5.8494",
"cuenta_destino": "ES999000111",
"destino_alto_riesgo": false,
"createdAt": "2026-05-27T09:11:48.269Z",
"updatedAt": "2026-05-27T09:11:48.269Z",
"target_final": null,
"id_usuario": null,
"fecha_revision": null
}
],
"predictions": [
{
"id_transaccion": "trx-bulk-001",
"is_fraud": false,
"prob_fraud": 0.1135,
"impacto_fraude": 0,
"es_transfronteriza": false,
"ratio_imp_limite": 0.1067,
"intensidad_tx": 0.0008,
"severidad_tx": 320,
"flujo_neto_30d": 500,
"mensaje": "Transaccion legitima - probabilidad fraude 11%",
"createdAt": "2026-05-27T09:11:48.275Z",
"updatedAt": "2026-05-27T09:11:48.275Z"
}
]
}
]

### 📌 NOTAS

✅ El sistema llama automáticamente al modelo ML tras crear la transacción.

✅ Las predicciones se almacenan en la tabla predictions.

✅ El endpoint soporta creación masiva (bulk insert).

---

# 🌱 8. Seed automático

El seed se ejecuta automáticamente al iniciar el servidor si en .env RUN_SEED=true.

Incluye:

Usuario admin inicial
Carga de predictions desde CSV
Carga de transactions desde CSV

📁 Archivos CSV:

/assets/predictions.csv
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
