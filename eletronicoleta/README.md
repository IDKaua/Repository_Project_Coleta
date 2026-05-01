# Desenvolvimento Realizado pelo Grupo Check-Point

## Descrição do Sistema:

### O sistema também possibilita o gerenciamento de usuários, cooperativas, coletores, endereços e solicitações, garantindo organização, controle e rastreabilidade das operações.

### Dessa forma, a plataforma contribui para a redução do lixo eletrônico, promove a sustentabilidade ambiental e facilita a comunicação entre quem deseja descartar materiais e quem realiza a reciclagem.

#### Integrantes Do Grupo:

##### Pabllo Wyllams Tavares Barbosa - 01633453
##### Eduardo Leandro Santos -  01670259
##### Flavio Miguel Guilherme dos Santos - 01647888
##### Cícero Barros da silva - 01638161
##### Edillan Kauã da Silva Oliveira   - 01611518

# 🌿 EcoTech - Sistema de Resíduos Eletrônicos

Este é o backend do sistema EcoTech, desenvolvido em Java com Spring Boot e conectado a um banco de dados PostgreSQL hospedado na nuvem (Neon).

## 🚀 Como rodar o backend localmente

### Pré-requisitos:
* Java Development Kit (JDK) 17 ou superior.
* Maven (ou utilizar o "Maven Wrapper" embutido no projeto).
* IDE de sua preferência (VS Code, IntelliJ, Eclipse).

### Passo a Passo:
1. Abra o terminal na pasta raiz do projeto backend.
2. Certifique-se de que o arquivo `src/main/resources/application.properties` possui a URL correta de conexão com o banco de dados Neon (`spring.datasource.url=jdbc:postgresql://...`).
3. Execute o comando para baixar as dependências e iniciar o servidor:
   ```bash
      ./mvnw spring-boot:run

### Aqui estão exemplos de como enviar dados para a API no formato JSON.

1. Cadastrar Usuário (`POST /api/usuarios/cadastrar`)

{
  "nome": "Edillan Kaua",
  "email": "edillan@email.com",
  "documento": "123.456.789-00",
  "telefone": "(82) 99999-9999",
  "endereco": "Rua Principal, 123",
  "cep": "57000-000",
  "complemento": "Apt 101",
  "cidade": "Maceió",
  "estado": "AL",
  "senha": "senha-segura",
  "tipoUsuario": "MORADOR"
}

2. Solicitar Coleta (`POST /api/coletas/solicitar/{usuario_id}`)
*Atenção: Substitua o `{usuario_id}` na URL pelo ID real do usuário.*

{
  "tipoResiduo": "Computadores",
  "quantidade": 2,
  "porte": "Médio",
  "nomeSolicitante": "Edillan Kaua",
  "cep": "57000-000",
  "rua": "Rua Principal",
  "numero": "123",
  "bairro": "Centro",
  "cidade": "Maceió",
  "uf": "AL",
  "pontoReferencia": "Perto da praça",
  "dataAgendamento": "2026-05-15",
  "horaAgendamento": "14:30"
}
   ./mvnw spring-boot:run