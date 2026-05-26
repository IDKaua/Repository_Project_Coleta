package com.coleta.backend.controller; // Ajustado para o seu pacote correto pela foto!

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "http://localhost:5173")
public class RastreioController {

    // Recebe dados de: /app/rastreio/{coletaId}/atualizar
    // Envia automaticamente para: /topic/rastreio/{coletaId}
    @MessageMapping("/rastreio/{coletaId}/atualizar")
    @SendTo("/topic/rastreio/{coletaId}")
    public CoordenadasDTO atualizarLocalizacao(@DestinationVariable String coletaId, CoordenadasDTO coordenadas) {
        // O Java recebe a latitude/longitude do coletor e faz o "eco" para o morador e cooperativa
        return coordenadas; 
    }

    // Classe auxiliar (DTO) para mapear o formato do JSON que vem do React
    public static class CoordenadasDTO {
        private double lat;
        private double lng;

        public double getLat() {
            return lat;
        }

        public void setLat(double lat) {
            this.lat = lat; // <-- Era aqui que faltava fechar bonitinho!
        }

        public double getLng() {
            return lng;
        }

        public void setLng(double lng) {
            this.lng = lng;
        }
    }
}