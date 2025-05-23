# Catalog API Microservice

Este microserviço é responsável por gerenciar todas as informações relacionadas ao catálogo de produtos e instalações da aplicação.

## Endpoints da API

Os principais endpoints são prefixados com `/api`:

*   **Produtos**:
    *   `GET /api/products`
    *   `GET /api/products/:id`
    *   `POST /api/products`
    *   `PUT /api/products/:id`
    *   `PATCH /api/products/:id/toggle-status`
*   **Instalações (Facilities)**:
    *   `GET /api/facilities`
    *   `GET /api/facilities/:id/products`
    *   `GET /api/facilities/:id/transactions`
    *   `GET /api/facilities/:id`
    *   `POST /api/facilities`
    *   `PUT /api/facilities/:id`
    *   `PATCH /api/facilities/:id/toggle-status`
*   **Documentação Swagger**:
    *   `GET /swagger`: Interface do Swagger UI.
    *   `GET /swagger/swagger.json`: Definição da API no formato JSON.

## Variáveis de Ambiente

Este serviço espera as seguintes variáveis de ambiente:

*   `SERVER_PORT`: Porta em que o serviço irá escutar (padrão: `8081` se não definida).
*   `MYSQL_DATABASE`: Nome do banco de dados a ser usado.
*   `MYSQL_USER`: Usuário para conexão com o banco de dados.
*   `MYSQL_PASSWORD`: Senha para conexão com o banco de dados.
*   `MYSQL_HOST`: Hostname do servidor de banco de dados.
*   `JWT_SECRET`: Segredo usado para assinar e verificar tokens JWT.
*   `GATEWAY_HOST`: Hostname do API Gateway para comunicação entre microserviços.
*   `GATEWAY_PORT`: Porta da API Gateway para comunicação entre microserviços.

## Configuração e Execução (Dentro do Monorepo)

Este serviço é projetado para ser executado como um container Docker, orquestrado pelo `docker-compose.yml` na raiz do monorepositório.

1.  **Contexto de Build**: O Dockerfile para este serviço está localizado em `./catalog/Dockerfile`.
2.  **Dependências**:
    *   `catalog-db`: Depende de uma instância de banco de dados MySQL saudável para iniciar.
    *   `rabbitmq`: Depende que o serviço RabbitMQ esteja iniciado.
3.  **Porta**: O serviço escuta internamente na porta definida por `SERVER_PORT`. Esta porta não é exposta diretamente ao host, pois o acesso é feito através do API Gateway.

Para iniciar o serviço `catalog-api` junto com os outros componentes:

```bash
# Na raiz do monorepositório
docker-compose up --build -d
