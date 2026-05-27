const toBoolean = (v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v === 'true' || v === '1';
    if (typeof v === 'number') return v > 0;
    return Boolean(v);
};

export const mapMLPredictionToDB = (p) => ({
    id_transaccion: p.id_transaccion,
    is_fraud: p.is_fraud,
    prob_fraud: p.prob_fraud,
    impacto_fraude: p.impacto_fraude,
    es_transfronteriza: toBoolean(p.es_transfronteriza),
    ratio_imp_limite: p.ratio_imp_limite,
    intensidad_tx: p.intensidad_tx,
    severidad_tx: p.severidad_tx,
    flujo_neto_30d: p.flujo_neto_30d,
    mensaje: p.mensaje,
});
