import React from "react";

export const ListaColetores = () => (
  <section className="painel-card">
    <div className="card-header-tag">
      <i className="fas fa-users"></i>
      <h3>LISTA DE COLETORES DA COOPERATIVA</h3>
      <button className="btn-novo">
        <i className="fas fa-plus"></i> Novo Coletor
      </button>
    </div>
    <div className="table-wrapper">
      <table className="painel-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Carlos Silva</td>
            <td>123.456.789-00</td>
            <td>(82) 99123-4567</td>
            <td><span className="nivel-tag nivel-baixo">Ativo</span></td>
          </tr>
          <tr>
            <td>Ana Souza</td>
            <td>987.654.321-00</td>
            <td>(82) 98765-4321</td>
            <td><span className="nivel-tag nivel-medio">Em Rota</span></td>
          </tr>
          <tr>
            <td>João Ferreira</td>
            <td>456.123.789-00</td>
            <td>(82) 91234-5678</td>
            <td><span className="nivel-tag nivel-cheio">Inativo</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);

export const ListaConteineres = () => (
  <section className="painel-card">
    <div className="card-header-tag">
      <i className="fas fa-box"></i>
      <h3>LISTA DE CONTÊINERES CADASTRADOS</h3>
      <button className="btn-novo">
        <i className="fas fa-plus"></i> Novo Contêiner
      </button>
    </div>
    <div className="table-wrapper">
      <table className="painel-table">
        <thead>
          <tr>
            <th>Localização</th>
            <th>Capacidade</th>
            <th>Nível</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rua das Flores, 120 — Maceió</td>
            <td>500 kg</td>
            <td><span className="nivel-tag nivel-medio">Médio</span></td>
          </tr>
          <tr>
            <td>Av. Fernandes Lima, 340 — Maceió</td>
            <td>1000 kg</td>
            <td><span className="nivel-tag nivel-cheio">Cheio</span></td>
          </tr>
          <tr>
            <td>Rua do Comércio, 88 — Maceió</td>
            <td>750 kg</td>
            <td><span className="nivel-tag nivel-baixo">Baixo</span></td>
          </tr>
          <tr>
            <td>Rua do Comércio, 88 — Maceió</td>
            <td>750 kg</td>
            <td><span className="nivel-tag nivel-baixo">Baixo</span></td>
          </tr>
          <tr>
            <td>Rua do Comércio, 88 — Maceió</td>
            <td>750 kg</td>
            <td><span className="nivel-tag nivel-baixo">Baixo</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);