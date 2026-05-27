const booleanToInt = (v) => (v ? 1 : 0);

const formatDateOnlyML = (value) => {
    if (!value) return '1970-01-01';

    const d = new Date(value);
    if (isNaN(d.getTime())) return '1970-01-01';

    const pad = (n) => String(n).padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatDateTimeML = (value) => {
    if (!value) return '1970-01-01 00:00:00';

    const d = new Date(value);
    if (isNaN(d.getTime())) return '1970-01-01 00:00:00';

    const pad = (n) => String(n).padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export const stripMLFields = (t) => {
    const {
        target_final,
        id_usuario,
        fecha_revision,
        createdAt,
        updatedAt,
        ...clean
    } = t;

    return clean;
};

export const formatTransactionsToML = (transactions) => {
    return transactions.map((t) =>
        stripMLFields({
            id_transaccion: t.id_transaccion,
            id_cliente: t.id_cliente,
            tipo_cliente: t.tipo_cliente,

            edad_cliente: Number(t.edad_cliente),

            customer_country: t.customer_country,
            customer_region: t.customer_region,
            tenure: Number(t.tenure),

            importe_medio_mensual: Number(t.importe_medio_mensual),
            desviacion_estandar_mensual: Number(t.desviacion_estandar_mensual),
            media_transacciones_al_dia: Number(t.media_transacciones_al_dia),

            numero_fraudes_ultimo_ano: Number(t.numero_fraudes_ultimo_ano),

            id_cuenta: t.id_cuenta,
            cuenta_origen: t.cuenta_origen,
            estado_cuenta: t.estado_cuenta,

            saldo_actual: Number(t.saldo_actual),
            saldo_medio_30_dias: Number(t.saldo_medio_30_dias),

            volumen_entrante_30_dias: Number(t.volumen_entrante_30_dias),
            volumen_saliente_30_dias: Number(t.volumen_saliente_30_dias),

            numero_transferencias_recibidas_7_dias: Number(t.numero_transferencias_recibidas_7_dias),
            numero_transferencias_enviadas_7_dias: Number(t.numero_transferencias_enviadas_7_dias),

            id_tarjeta: t.id_tarjeta,
            estado_tarjeta: t.estado_tarjeta,

            // 🟢 FIX CLAVE: nunca null
            fecha_creacion_tarjeta: formatDateOnlyML(t.fecha_creacion_tarjeta),

            antiguedad_tarjeta_dias: Number(t.antiguedad_tarjeta_dias),
            limite_importe_transacciones: Number(t.limite_importe_transacciones),
            veces_superar_limite_7_dias: Number(t.veces_superar_limite_7_dias),

            tipo_transaccion: t.tipo_transaccion,

            // 🟢 FIX CLAVE: nunca null
            fecha_hora: formatDateTimeML(t.fecha_hora),

            is_night: booleanToInt(t.is_night),
            is_weekend: booleanToInt(t.is_weekend),

            tiempo_desde_ultima_transaccion: Number(t.tiempo_desde_ultima_transaccion),
            numero_transacciones_ultima_hora: Number(t.numero_transacciones_ultima_hora),

            importe_transaccion: Number(t.importe_transaccion),
            metodo_autenticacion: t.metodo_autenticacion,

            numero_pin_disponibles: Number(t.numero_pin_disponibles),
            identificador_dispositivo_fingerprint: t.identificador_dispositivo_fingerprint,

            dispositivo_reconocido: booleanToInt(t.dispositivo_reconocido),

            operacion_pais: t.operacion_pais,
            operacion_region: t.operacion_region,
            direccion_ip_origen: t.direccion_ip_origen,
            geolocalizacion: t.geolocalizacion,

            cuenta_destino: t.cuenta_destino,
            destino_alto_riesgo: booleanToInt(t.destino_alto_riesgo),
        })
    );
};