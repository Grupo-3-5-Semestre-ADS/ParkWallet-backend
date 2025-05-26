# Payment API Microservice

Este microserviço é responsável por simular o processamento de recargas de crédito para o aplicativo ParkWallet-mobile. Ele atua como um simulador de pagamento sem integração com serviços externos reais.

## Endpoints da API

Os principais endpoints são prefixados com `/api`:

* **Recargas (Recharges)**:
  * `POST /api/recharges/:userId`: Processa uma recarga de crédito para o usuário especificado.

* **Documentação Swagger**:
  * `GET /swagger`: Interface do Swagger UI.
  * `GET /swagger/swagger.json`: Definição da API no formato JSON.

## Variáveis de Ambiente

Este serviço espera as seguintes variáveis de ambiente:

* `SERVER_PORT`: Porta em que o serviço irá escutar (padrão: `8080` se não definida).
* `JWT_SECRET`: Segredo usado para assinar e verificar tokens JWT.
* `API_GATEWAY_URL`: URL base do API Gateway para comunicação com outros microsserviços.

## Fluxo de Processamento de Recarga

1. O cliente solicita uma recarga de crédito via app móvel
2. Este serviço recebe a solicitação e valida o valor
3. Não há processamento real de pagamento - todas as recargas são automaticamente "aprovadas"
4. O serviço atualiza o saldo da carteira do usuário através do serviço wallet-api
5. Retorna uma confirmação de sucesso para o cliente

## Configuração e Execução

Este serviço é projetado para ser executado como parte do monorepo ParkWallet-backend usando Docker Compose. Consulte as instruções no README principal do repositório para detalhes sobre como iniciar todos os serviços juntos.
