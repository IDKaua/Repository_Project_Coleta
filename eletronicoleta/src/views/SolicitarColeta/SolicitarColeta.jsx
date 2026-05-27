import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SolicitarColeta.css";
import "./FormColeta.css";

import UploadFotos from "./UploadFotos";
import InfoLixo from "./InfoLixo";
import Agendamento from "./Agendamento";

// Corrige o ícone do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Sub-componente mágico que escuta o clique e centraliza a câmera
function LocationMarker({ posicao, setPosicao, setEnderecoFormatado }) {
  const map = useMap();

  // Faz a câmera do mapa "voar" para a posição sempre que ela mudar (ex: ao clicar no botão de GPS)
  useEffect(() => {
    if (posicao) {
      map.flyTo(posicao, 16, { animate: true, duration: 1.5 });
    }
  }, [posicao, map]);

  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPosicao([lat, lng]);

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        setEnderecoFormatado(data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      } catch (error) {
        setEnderecoFormatado(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      }
    },
  });

  return posicao === null ? null : (
    <Marker position={posicao}>
      <Popup>O caminhão virá aqui!</Popup>
    </Marker>
  );
}

const SolicitarColeta = () => {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado para solicitar uma coleta!");
      navigate("/login");
    }
  }, [usuarioLogado, navigate]);

  const [formData, setFormData] = useState({
    tipo_residuo: "Computadores",
    quantidade: 1,
    porte: "Pequeno",
    telefone: usuarioLogado?.telefone || "",
    ponto_referencia: "",
    data: "",
    hora: "",
  });

  const [fotos, setFotos] = useState([]);
  const [posicaoExata, setPosicaoExata] = useState(null);
  const [enderecoFormatado, setEnderecoFormatado] = useState("");
  const [buscandoGPS, setBuscandoGPS] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "data") {
      const ano = value.split("-")[0];
      if (ano && ano.length > 4) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── NOVA FUNÇÃO: Botão de GPS do Usuário ────────────────────────────────
  const pegarLocalizacaoAtual = () => {
    if (!("geolocation" in navigator)) {
      alert("Seu navegador não suporta GPS.");
      return;
    }

    setBuscandoGPS(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setPosicaoExata([lat, lng]); // Isso já vai fazer o mapa voar para lá automaticamente

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          setEnderecoFormatado(data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        } catch (error) {
          setEnderecoFormatado(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        }
        setBuscandoGPS(false);
      },
      (error) => {
        console.error("Erro GPS:", error);
        alert("Não foi possível obter sua localização. Verifique as permissões do navegador.");
        setBuscandoGPS(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioLogado) return;
    if (!posicaoExata) {
      alert("Por favor, clique no mapa ou use sua localização para informar o local da coleta!");
      return;
    }

    const dadosParaOJava = {
      nome: usuarioLogado?.nome || "Cliente",
      endereco: `${enderecoFormatado} (Ref: ${formData.ponto_referencia})`,
      telefone: formData.telefone || usuarioLogado?.telefone || "",
      tipoResiduo: formData.tipo_residuo,
      descricao: `Coleta de ${formData.quantidade} item(ns) porte ${formData.porte}. Agendamento: ${formData.data || ""} ${formData.hora || ""}`,
    };

    try {
      const resposta = await fetch(
        `http://localhost:8080/api/coletas/solicitar/${usuarioLogado.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaOJava),
        }
      );

      if (resposta.ok) {
        alert("Sucesso! O caminhão da cooperativa foi acionado.");
        try { localStorage.removeItem("rastreioOcultoUntil"); } catch (e) {}
        window.dispatchEvent(new Event("coletaSolicitada"));
        navigate("/rastreio");
      } else {
        alert("Erro ao solicitar a coleta. Verifique os dados.");
      }
    } catch (erro) {
      console.error("Erro no servidor:", erro);
      alert(`Erro de conexão: ${erro.message}`);
    }
  };

  return (
    <div className="coleta-wrapper">
      <main className="coleta-container">
        <br></br>
        <h1 className="titulo-sessao">NOVA SOLICITAÇÃO DE COLETA</h1>

        <form onSubmit={handleSubmit}>
          <UploadFotos fotos={fotos} setFotos={setFotos} />

          <div className="coleta-grid">
            <InfoLixo formData={formData} setFormData={setFormData} handleChange={handleChange} />

            <div className="coluna-direita">
              <div className="r-card" style={{ padding: '15px' }}>
                
                {/* ── CABEÇALHO DO MAPA COM O BOTÃO NOVO ────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>Local da Coleta:</p>
                  
                  <button 
                    type="button" 
                    onClick={pegarLocalizacaoAtual}
                    disabled={buscandoGPS}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: buscandoGPS ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {buscandoGPS ? "⏳ Buscando..." : "Usar minha localização"}
                  </button>
                </div>

                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                  Clique no botão verde acima ou toque em qualquer lugar do mapa para definir o ponto exato.
                </p>

                <div style={{ height: '250px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                  <MapContainer center={[-9.6658, -35.7350]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker 
                      posicao={posicaoExata} 
                      setPosicao={setPosicaoExata} 
                      setEnderecoFormatado={setEnderecoFormatado} 
                    />
                  </MapContainer>
                </div>

                {enderecoFormatado && (
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', textAlign: 'center' }}>
                    <strong>Endereço capturado:</strong> {enderecoFormatado}
                  </p>
                )}

                <input
                  type="text"
                  name="ponto_referencia"
                  placeholder="Ponto de Referência (Opcional)"
                  value={formData.ponto_referencia}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <Agendamento formData={formData} handleChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn-enviar-solicitacao">
            ENVIAR SOLICITAÇÃO
          </button>
        </form>
      </main>
    </div>
  );
};

export default SolicitarColeta;