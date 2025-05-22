# Backend Monorepo - ParkWallet

Este monorepositório contém todos os serviços de backend para a aplicação ParkWallet. Ele utiliza uma arquitetura de microserviços, onde cada serviço é responsável por uma funcionalidade de negócio específica. Os serviços são containerizados usando Docker e orquestrados com Docker Compose.

## Visão Geral da Arquitetura

O sistema é composto pelos seguintes componentes principais:

*   **API Gateway**: Ponto de entrada único para todas as requisições dos clientes. Roteia as requisições para os microserviços apropriados.
*   **Microserviços**:
    *   `user-api`: Gerencia usuários, autenticação e autorização.
    *   `catalog-api`: Gerencia o catálogo de produtos/estabelecimentos.
    *   `transaction-api`: Processa e gerencia transações dos clientes.
    *   `wallet-api`: Gerencia as carteiras digitais dos clientes.
    *   `chat-api`: Fornece funcionalidades do chat em tempo real.
    *   `notification-api`: Salva notificações dos usuários.
*   **Bancos de Dados**: Cada microserviço possui sua própria instância de banco de dados MySQL para garantir o isolamento dos dados.
*   **RabbitMQ**: Um message broker usado para comunicação assíncrona entre os serviços.

## Serviços Detalhados

| Serviço            | Porta (Host) | Container Interno | Descrição                                                 |
|:-------------------|:-------------|:------------------|:----------------------------------------------------------|
| `api-gateway`      | `8080`       | `8080`            | Gateway de API, roteia requisições para os microserviços. |
| `catalog-api`      | N/A          | `8080`            | API para gerenciamento de catálogo.                       |
| `chat-api`         | N/A          | `8080`            | API para funcionalidades de chat.                         |
| `notification-api` | N/A          | `8080`            | API para envio de notificações.                           |
| `transaction-api`  | N/A          | `8080`            | API para gerenciamento de transações.                     |
| `wallet-api`       | N/A          | `8080`            | API para gerenciamento de carteiras.                      |
| `user-api`         | N/A          | `8080`            | API para gerenciamento de usuários e autenticação.        |
| `catalog-db`       | N/A          | `3306`            | Banco de dados MySQL para o `catalog-api`.                |
| `chat-db`          | N/A          | `3306`            | Banco de dados MySQL para o `chat-api`.                   |
| `notification-db`  | N/A          | `3306`            | Banco de dados MySQL para o `notification-api`.           |
| `transaction-db`   | N/A          | `3306`            | Banco de dados MySQL para o `transaction-api`.            |
| `wallet-db`        | N/A          | `3306`            | Banco de dados MySQL para o `wallet-api`.                 |
| `user-db`          | N/A          | `3306`            | Banco de dados MySQL para o `user-api`.                   |
| `rabbitmq`         | `5672`       | `5672`            | Porta AMQP do RabbitMQ.                                   |
| `rabbitmq`         | `15672`      | `15672`           | Interface de gerenciamento web do RabbitMQ.               |

## Pré-requisitos

*   [Docker](https://www.docker.com/get-started)
*   [Docker Compose](https://docs.docker.com/compose/install/)

## Como Iniciar

1. **Clone o repositório:**
    ```bash
    git clone https://github.com/Grupo-3-5-Semestre-ADS/ParkWallet-backend.git
    cd <nome-do-diretorio>
    ```

2. **Estrutura de Diretórios:**
    ```
    ├── api-gateway/
    │   └── Dockerfile
    ├── catalog/
    │   └── Dockerfile
    ├── chat/
    │   └── Dockerfile
    ├── notification/
    │   └── Dockerfile
    ├── transaction/
    │   └── Dockerfile
    ├── user/
    │   └── Dockerfile
    ├── wallet/
    │   └── Dockerfile
    └── docker-compose.yml
    ```

3. **Construa e Inicie os containers:**
    ```bash
    docker-compose up --build -d
    ```

4. **Verificar o status dos containers:**
    ```bash
    docker-compose ps
    ```
    
5. **Acessar os serviços:**
    *   **API Gateway**: `http://localhost:8080/api/<coleção>`
    *   **Swagger UI**: `http://localhost:8080/swagger-ui`
    *   **RabbitMQ Management UI**: `http://localhost:15672` (Login: `guest` / `guest`)

    Obs: Os microserviços individuais (catalog-api, user-api, etc.) não são expostos diretamente ao host, mas se comunicam através das redes Docker definidas e são acessíveis através do API Gateway.

6. **Parar os containers:**
    ```bash
    docker-compose down
    ```
    Para parar e remover os volumes (cuidado, isso apagará os dados dos bancos de dados):
    ```bash
    docker-compose down -v
    ```

## Variáveis de Ambiente

As configurações cruciais para cada serviço são gerenciadas através de variáveis de ambiente no arquivo `docker-compose.yml`. Algumas variáveis importantes incluem:

*   **Conexões com Banco de Dados**: `MYSQL_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`.
*   **Segredos JWT**: `JWT_SECRET`.
*   **Comunicação Inter-Serviços**: `*_HOST` e `*_PORT` (ex: `CATALOG_HOST`, `USER_PORT`).
*   **Conexão com RabbitMQ**: `RABBITMQ_HOST`, `RABBITMQ_PORT`, etc.

**IMPORTANTE**: As credenciais e segredos padrão (ex: `MYSQL_PASSWORD: root`, `JWT_SECRET: secret`) são destinados apenas para desenvolvimento. **Altere-os para valores seguros antes de implantar em produção.**

## Redes Docker

Várias redes são definidas para segmentar a comunicação:

*   `catalog`, `chat`, `notification`, `transaction`, `wallet`, `user`: Redes dedicadas para cada serviço e seu respectivo banco de dados, promovendo isolamento.
*   `rabbit`: Rede para serviços que precisam se comunicar com o RabbitMQ.
*   `shared`: Uma rede compartilhada que alguns serviços (como `catalog-api` e `transaction-api`) podem usar para comunicação com outros componentes, como o `api-gateway`.

## Healthchecks

*   Os bancos de dados MySQL (`*-db`) possuem healthchecks configurados para garantir que os serviços dependentes só iniciem após o banco de dados estar saudável.
*   O RabbitMQ também possui um healthcheck para verificar seu status.

## Volumes

Volumes nomeados são usados para persistir os dados dos bancos de dados (`catalog`, `chat`, `notification`, `transaction`, `wallet`, `user`) entre reinicializações dos containers.
