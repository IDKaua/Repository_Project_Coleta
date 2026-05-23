
export const PONTOS_CONFIG = {
  COMUM: 50,
  GRANDE: 100,
  MUITOS: 150,
  BONUS_PRIMEIRA: 50,
};

const STORAGE_KEYS = {
  PONTOS: "ecotech_pontos",
  LOG: "ecotech_pontos_log",
  PONTUADAS: "ecotech_coletas_pontuadas",
};

const pontosService = {
  getPontos: () => {
    return parseInt(localStorage.getItem(STORAGE_KEYS.PONTOS) || "0");
  },

  getExtrato: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOG) || "[]");
  },

  jaFoiPontuada: (coletaId) => {
    const pontuadas = JSON.parse(localStorage.getItem(STORAGE_KEYS.PONTUADAS) || "[]");
    return pontuadas.includes(coletaId);
  },

  formatarPontos: (valor) => {
    return new Intl.NumberFormat("pt-BR").format(valor) + " PTS";
  },

  calcularPontos: (coleta) => {
    const descricao = coleta.descricao || "";
    const match = descricao.match(/Coleta de (\d+) item/);
    const quantidade = match ? parseInt(match[1]) : 1;

    if (quantidade <= 3) return PONTOS_CONFIG.COMUM;
    if (quantidade <= 7) return PONTOS_CONFIG.GRANDE;
    return PONTOS_CONFIG.MUITOS;
  },

  creditarPontos: (coleta) => {
    if (pontosService.jaFoiPontuada(coleta.id)) return 0;

    const pontosGanhos = pontosService.calcularPontos(coleta);
    const extratoAtual = pontosService.getExtrato();
    const pontuadas = JSON.parse(localStorage.getItem(STORAGE_KEYS.PONTUADAS) || "[]");
    const saldoAtual = pontosService.getPontos();

    let bonus = 0;
    if (pontuadas.length === 0) {
      bonus = PONTOS_CONFIG.BONUS_PRIMEIRA;
    }

    const totalGanhos = pontosGanhos + bonus;
    const novoSaldo = saldoAtual + totalGanhos;

    // Atualiza saldo
    localStorage.setItem(STORAGE_KEYS.PONTOS, novoSaldo.toString());

    // Atualiza IDs pontuados
    pontuadas.push(coleta.id);
    localStorage.setItem(STORAGE_KEYS.PONTUADAS, JSON.stringify(pontuadas));

    // Atualiza Extrato
    const novoRegistro = {
      data: new Date().toLocaleDateString("pt-BR"),
      descricao: `Coleta #${coleta.id} concluída${bonus > 0 ? " (Bônus 1ª Coleta)" : ""}`,
      pontos: `+${totalGanhos} PTS`,
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify([novoRegistro, ...extratoAtual]));

    // Dispara evento para o Perfil atualizar
    window.dispatchEvent(new CustomEvent("pontosAtualizados", { detail: { saldo: novoSaldo } }));

    return totalGanhos;
  },
};

export default pontosService;
