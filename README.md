# Habitai
Projeto de locação de Imovel para disciplina de Desenvolvimento de Sistema Web II

Link: https://github.com/C-Fernandes/Habitai

## 🏛️ Estrutura do Projeto

O projeto é estruturado em diretórios separados:

* **`habitai-backend`** (ou `backend`): Contém o código Java (Spring Boot).
* **`habitai-frontend`** (ou `frontend`): Contém o código React/TypeScript.

---

## 💻 1. Backend: habitai (Java/Spring Boot)

O backend é construído com Spring Boot, utilizando Maven para gerenciamento e PostgreSQL para persistência de dados.

### 🛠️ Tecnologias Principais (Backend)

| Categoria | Tecnologia | Versão/Propósito |
| :--- | :--- | :--- |
| **Linguagem/Plataforma** | Java | **21** |
| **Framework** | Spring Boot | **3.5.6** |
| **Persistência** | Spring Data JPA | - |
| **Banco de Dados** | PostgreSQL | Driver de Conexão |
| **Utilities** | Lombok & MapStruct | Automação e Mapeamento de Objetos |

### ⚙️ Pré-requisitos (Backend)

1.  **Java Development Kit (JDK) 21**.
2.  **Apache Maven**.
3.  **Banco de Dados PostgreSQL** rodando e acessível (requer configuração no `application.properties`).

### ⚠️ Configuração Crucial do Banco de Dados ⚠️

#### 1. Pré-requisito do Banco de Dados

É **obrigatório** que uma instância do **PostgreSQL** esteja rodando antes de iniciar o backend.

* **Nome do Banco de Dados (Database Name):** `habitai`
* **Porta Padrão:** `5432` (Deve ser acessível pela aplicação).

#### 2. Configuração de Credenciais

As credenciais de conexão do banco de dados **NÃO** devem ser salvas nos arquivos de configuração padrão (`application.properties` ou `application.yml`).

Crie um arquivo chamado **`secret.properties`** dentro do diretório `src/main/resources/` (ou onde as configurações do Spring são lidas) e adicione as seguintes propriedades:

```properties
# Certifique-se de substituir USERNAME e PASSWORD pelas suas credenciais reais.
spring.datasource.url=jdbc:postgresql://localhost:5432/habitai
spring.datasource.username=USERNAME
spring.datasource.password=PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver
```

### ▶️ Como Rodar o Backend

1.  **Build do Projeto:**
    ```bash
    mvn clean install
    ```
2.  **Execução:**
    ```bash
    mvn spring-boot:run
    ```

---

## 🎨 2. Frontend: habitai-frontend (React/TypeScript)

O frontend é uma Single Page Application (SPA) moderna, usando React, TypeScript e Vite.

### 🛠️ Tecnologias Principais (Frontend)

| Categoria | Tecnologia | Versão (Aprox.) | Propósito |
| :--- | :--- | :--- | :--- |
| **Framework** | **React** | ^19.1.1 | Construção da Interface de Usuário. |
| **Linguagem** | **TypeScript** | ~5.9.3 | Tipagem estática para maior robustez. |
| **Tooling/Build** | **Vite** | ^7.1.7 | Bundler e Servidor de Desenvolvimento Rápido. |
| **Roteamento** | `react-router-dom` | Navegação da SPA. |

### ⚙️ Pré-requisitos (Frontend)

1.  **Node.js** (Versão LTS recomendada).
2.  **npm** (Node Package Manager) ou Yarn.

### ▶️ Como Rodar o Frontend

1.  Navegue para o diretório do frontend (`cd habitai-frontend`).
2.  **Instalar Dependências:**
    ```bash
    npm install
    # OU: yarn install
    ```
3.  **Rodar em Modo de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:5173` (ou porta similar).
