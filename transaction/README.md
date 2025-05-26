# Transaction API Microservice

Este microserviço é responsável por gerenciar todas as informações relacionadas as transações da aplicação.

## Endpoints da API

Os principais endpoints são prefixados com `/api`:

*   **Transações**:
    *   `GET /api/transactions`
    *   `GET /api/transactions/by-user`
    *   `GET /api/transactions/by-products`
    *   `GET /api/transactions/:id/items`
    *   `GET /api/transactions/:id`
    *   `POST /api/transactions`
    *   `PUT /api/transactions/:id`
    *   `PATCH /api/transactions/:id/toggle-status`
*   **Pagamento**:
    *   `POST /api/payment/:userId`
*   **Documentação Swagger**:
    *   `GET /swagger`
    *   `GET /swagger/swagger.json`

## Variáveis de Ambiente

Este serviço espera as seguintes variáveis de ambiente:

*   `SERVER_PORT`: Porta em que o serviço irá escutar (padrão: `8081` se não definida).
*   `MYSQL_DATABASE`: Nome do banco de dados a ser usado.
*   `MYSQL_USER`: Usuário para conexão com o banco de dados.
*   `MYSQL_PASSWORD`: Senha para conexão com o banco de dados.
*   `MYSQL_HOST`: Hostname do servidor de banco de dados.
*   `JWT_SECRET`: Segredo usado para assinar e verificar tokens JWT.

## Configuração e Execução (Dentro do Monorepo)

Este serviço é projetado para ser executado como um container Docker, orquestrado pelo `docker-compose.yml` na raiz do monorepositório.

1.  **Contexto de Build**: O Dockerfile para este serviço está localizado em `./transaction/Dockerfile`.
2.  **Dependências**:
    *   `transaction-db`: Depende de uma instância de banco de dados MySQL saudável para iniciar.
    *   `rabbitmq`: Depende que o serviço RabbitMQ esteja iniciado.
3.  **Porta**: O serviço escuta internamente na porta definida por `SERVER_PORT`. Esta porta não é exposta diretamente ao host, pois o acesso é feito através do API Gateway.

Para iniciar o serviço `transaction-api` junto com os outros componentes:

```bash
# Na raiz do monorepositório
docker-compose up --build -d
