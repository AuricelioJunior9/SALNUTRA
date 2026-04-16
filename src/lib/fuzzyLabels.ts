/**
 * Natural-language fuzzy labels per variable.
 * Keys match fuzzy membership keys: muitoBaixo, baixo, normal, alto, muitoAlto
 */
export const FUZZY_NATURAL_LABELS: Record<string, Record<string, string>> = {
  // === Salmoura ===
  tds: {
    muitoBaixo: "Salmoura fraca",
    baixo: "Concentração baixa",
    normal: "Concentração ideal",
    alto: "Concentração elevada",
    muitoAlto: "Salmoura saturada",
  },
  ph: {
    muitoBaixo: "Acidez crítica",
    baixo: "Levemente ácido",
    normal: "Equilibrado",
    alto: "Levemente alcalino",
    muitoAlto: "Alcalinidade alta",
  },
  temp_sal: {
    muitoBaixo: "Processo lento",
    baixo: "Abaixo do ideal",
    normal: "Temperatura adequada",
    alto: "Atenção: aquecimento",
    muitoAlto: "Risco térmico",
  },
  na: {
    muitoBaixo: "Baixa concentração de sal",
    baixo: "Baixa concentração de sal",
    normal: "Teor adequado de sódio",
    alto: "Alta concentração de sódio",
    muitoAlto: "Alta concentração de sódio",
  },
  ca: {
    muitoBaixo: "Sem interferência",
    baixo: "Sem interferência",
    normal: "Atenção: presença moderada",
    alto: "Risco de incrustação",
    muitoAlto: "Risco de incrustação",
  },
  mg: {
    muitoBaixo: "Dentro do padrão",
    baixo: "Dentro do padrão",
    normal: "Presença moderada",
    alto: "Pode afetar qualidade",
    muitoAlto: "Pode afetar qualidade",
  },
  nivel: {
    muitoBaixo: "Nível crítico",
    baixo: "Nível baixo",
    normal: "Operação normal",
    alto: "Próximo do limite",
    muitoAlto: "Risco de transbordo",
  },
  // === Motor ===
  vibracao: {
    muitoBaixo: "Operação estável",
    baixo: "Operação estável",
    normal: "Funcionamento normal",
    alto: "Desbalanceamento",
    muitoAlto: "Risco mecânico",
  },
  rotacao: {
    muitoBaixo: "Subvelocidade",
    baixo: "Subvelocidade",
    normal: "Rotação nominal",
    alto: "Sobrerrotação",
    muitoAlto: "Sobrerrotação",
  },
  corrente: {
    muitoBaixo: "Baixa carga",
    baixo: "Baixa carga",
    normal: "Carga normal",
    alto: "Sobrecarga",
    muitoAlto: "Risco elétrico",
  },
  temp_motor: {
    muitoBaixo: "Frio",
    baixo: "Frio",
    normal: "Temperatura normal",
    alto: "Aquecendo",
    muitoAlto: "Superaquecimento",
  },
};
