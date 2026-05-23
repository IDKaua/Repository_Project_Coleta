import React, { useState, useEffect } from "react";
import pontosService from "../../services/pontosService";

const HistoricoColetas = () => {
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    const buscarHistorico = async () => {
      if (!usuarioLogado) return;
      try {
        const response = await fetch("http://localhost:8080/api/coletas/all");
        if (response.ok) {
          const dados = await response.json();
          // Filtra coletas deste usuário
          const coletasUsuario = dados.filter(c => c.morador?.id === usuarioLogado.id);
          
          // Mapeia para o formato da tabela
          const formatado = coletasUsuario.map(c => {
            let statusLabel = "Pendente";
            let statusCor = "status-aguardando";
            let icone = "fas fa-clock";

            if (c.status === "EM ANDAMENTO") {
              statusLabel = "Em Trânsito";
              statusCor = "status-transito";
              icone = "fas fa-truck";
            } else if (c.status === "COLETADO") {
              statusLabel = "Entregue";
              statusCor = "status-entregue";
              icone = "fas fa-check-circle";
            }

            // Calcula pontos para exibir (mesmo que ainda não tenha sido "processado" pelo polling)
            const pts = c.status === "COLETADO" ? pontosService.calcularPontos(c) : 0;

            return {
              id: c.id,
              data: c.dataAgendamento || "N/A",
              itens: c.tipoResiduo || "Resíduos",
              status: statusLabel,
              cor: statusCor,
              icone: icone,
              pontos: pts > 0 ? `+${pts} PTS` : "0 PTS"
            };
          });

          setHistorico(formatado.reverse()); // Mais recentes primeiro
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setCarregando(setCarregando(false));
      }
    };

    buscarHistorico();
  }, [usuarioLogado?.id]);

  return (
    <div className="conta-card historico-card">
      <h3 className="dados-titulo">Histórico de Coletas</h3>

      <div className="table-wrapper">
        <table className="historico-table">
          <thead>
            <tr>
              <th>Data <i className="fas fa-sort-down"></i></th>
              <th>Itens</th>
              <th>Status <i className="fas fa-sort"></i></th>
              <th>Pontos</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>Carregando histórico...</td></tr>
            ) : historico.length > 0 ? (
              historico.map((row, i) => (
                <tr key={i}>
                  <td>{row.data}</td>
                  <td>| {row.itens}</td>
                  <td>
                    <span className={`status-badge ${row.cor}`}>
                      <i className={row.icone}></i> {row.status}
                    </span>
                  </td>
                  <td className="pontos-col">{row.pontos}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>Nenhuma coleta encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricoColetas;
