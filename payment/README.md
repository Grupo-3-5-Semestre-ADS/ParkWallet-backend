# Payment API Microservice

Este microserviço é responsável por simular um serviço de pagamento de terceiros quando uma recarga é efetuada.

## Endpoints da API

Os principais endpoints são prefixados com `/api`:

*   **Recarga**:
    *   `POST /api/recharges/:userId`
*   **Documentação Swagger**:
    *   `GET /swagger`
    *   `GET /swagger/swagger.json`

## Variáveis de Ambiente

Este serviço espera as seguintes variáveis de ambiente:

*   `SERVER_PORT`: Porta em que o serviço irá escutar (padrão: `8081` se não definida).
*   `JWT_SECRET`: Segredo usado para assinar e verificar tokens JWT.
*   `WALLET_API_URL`: URL da API de carteira.
*   `TRANSACTION_API_URL`: URL da API de transações.

## Configuração e Execução (Dentro do Monorepo)

Este serviço é projetado para ser executado como um container Docker, orquestrado pelo `docker-compose.yml` na raiz do monorepositório.

1.  **Contexto de Build**: O Dockerfile para este serviço está localizado em `./payment/Dockerfile`.
2.  **Porta**: O serviço escuta internamente na porta definida por `SERVER_PORT`. Esta porta não é exposta diretamente ao host, pois o acesso é feito através do API Gateway.

Para iniciar o serviço `payment-api` junto com os outros componentes:

```bash
# Na raiz do monorepositório
docker-compose up --build -d
