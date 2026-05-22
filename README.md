# // 1º SPRINT

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

# // 2º SPRINT
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

# // 3º SPRINT

Uma breve descrição de como rodar nosso projeto.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas na sua máquina:
* [Java JDK](https://www.oracle.com/java/technologies/downloads/) (versão 11, 17 ou 21+)
* [Maven](https://maven.apache.org/)
* [Node.js](https://nodejs.org/) (inclui o `npm`)
* [Git](https://git-scm.com/)

---

## 🚀 Como executar o projeto localmente

O projeto está estruturado em duas partes principais: Back-end (Java/Maven) e Front-end (React). Você precisará de dois terminais abertos para rodar ambos simultaneamente.

### 1. Clone o repositório

Primeiro, faça o clone do projeto para a sua máquina:

```bash
git clone https://github.com/IDKaua/Repository_Project_Coleta.git
cd Repository_Project_Coleta
```

### 2. Rodando o Back-end

Abra um terminal, navegue até o diretório do back-end e inicie a aplicação:

```bash
# Entre na pasta do back-end
cd backend

# Baixe as dependências e compile o projeto
./mvnw clean install

# Inicie o servidor (comando padrão para projetos Spring Boot)
./mvnw spring-boot:run
```
O servidor da API estará rodando por padrão em `http://localhost:8080` (ajuste se necessário).

### 3. Rodando o Front-end

Abra um **novo terminal**, navegue até o diretório do front-end e inicie a interface:

```bash
# Entre na pasta do front-end
cd eletronicocoleta

# Instale as dependências
npm install

# Inicie a aplicação em modo de desenvolvimento
npm run dev
```
O front-end estará disponível no seu navegador em `http://localhost:5173` (padrão Vite) ou `http://localhost:3000`.

---

## 🗺️ Fluxos de Usuário

O sistema possui três tipos principais de usuários, cada um com jornadas e permissões específicas de acesso.

### 👤 1. Fluxo do Cliente (Usuário)

```text
[Início/Home] ──> [Serviços] ──> [Solicitar Coleta] (Requer Autenticação)
                                       │
                                       ├──> Se não tem conta: [Cadastro]
                                       └──> Se já tem conta:  [Login]
```

**Passo a Passo:**
1. **Início/Home:** Página Inicial da plataforma.
2. **Serviços:** Listagem e vitrine de serviços disponíveis.
3. **Autenticação:** Gatilho ativado pelos botões "Acessar", "Área do Usuário" ou ao tentar solicitar coleta.
   * **3.1 Login:** Acesso para usuários já registrados.
   * **3.2 Cadastro:** Criação de uma nova conta de cliente.
4. **Solicitar Coleta:** Acesso liberado à funcionalidade principal somente após a conclusão do passo 3.1 ou 3.2.

### 🏢 2. Fluxo da Cooperativa

```text
[Início/Home] ──> [Serviços] ──> [Painel da Cooperativa] (Requer Autenticação)
                                       │
                                       ├──> [Login da Cooperativa]
                                       └──> [Cadastro da Cooperativa] (Selecionar modo Cooperativa)
```

**Passo a Passo:**
1. **Início/Home:** Página Inicial.
2. **Serviços:** Listagem de serviços.
3. **Autenticação da Cooperativa:** Etapa obrigatória para acessar as ferramentas de gestão.
   * **3.1 Cadastro:** Criação de conta com a obrigatoriedade de selecionar o "Modo Cooperativa" no formulário.
   * **3.2 Login:** Acesso para cooperativas já registradas.
4. **Painel da Cooperativa:** Área restrita e dashboard de gestão, liberada somente após o login com perfil de cooperativa.

### 🚚 3. Fluxo do Coletor

```text
[Início/Home] ──> [Acessar] ──> [Portal do Coletor]
                                      │
                                      └──> [Login (Digita o CPF)]
                                             │
                                             ├──> CPF NÃO cadastrado ──> [Mensagem de Erro / Bloqueio]
                                             └──> CPF CADASTRADO     ──> [Tela do Coletor (Área Restrita)]
```

**Passo a Passo:**
1. **Início/Home:** Página Inicial.
2. **Acessar:** Navegação para a área de login.
3. **Autenticação do Coletor (`/login/coletor`):**
   * **Regra de Input:** Campo único ou principal exclusivo para inserção do CPF.
   * **Validação (Back-end):** O sistema consulta a base de dados de coletores que foram pré-vinculados/cadastrados pela Cooperativa.
   * **Tratamento de Exceção:** Se o CPF inserido não existir na base de dados, o sistema bloqueia o acesso e exibe o aviso: *"CPF não autorizado ou erro"*.
4. **Tela do Coletor (Área Restrita):** Acesso liberado após validação. Exibe as funcionalidades específicas para o trabalho do coletor, como informações do endereço do cliente, detalhes da coleta agendada e rotas.
