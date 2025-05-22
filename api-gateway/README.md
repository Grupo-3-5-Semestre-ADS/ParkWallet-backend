# API Gateway Service

Este serviço atua como o ponto de entrada único (Single Entry Point - SEP) para todas as requisições dos clientes destinadas aos microserviços backend. Ele é responsável por rotear as requisições para o serviço apropriado, além de disponibilizar toda a documentação de todos os microserviços. Ele também gerencia conexões WebSocket usando Socket.IO.

## Funcionalidades Principais

*   **Roteamento de Requisições (Proxy Reverso)**: Encaminha as requisições HTTP para os microserviços internos com base no caminho da URL.
*   **Descoberta de Serviços (Estática)**: Utiliza um registro de serviços (`serviceRegistry`) configurado via variáveis de ambiente para mapear prefixos de rota para os respectivos microserviços.
*   **Comunicação WebSocket**: Utiliza Socket.IO para permitir comunicação em tempo real com os clientes. A lógica específica do Socket.IO é gerenciada em `socketManager.js`.
*   **Documentação da API (Swagger)**: Expõe uma interface Swagger UI para visualização e interação com os endpoints da API (configurado em `swagger.js`).
*   **Segurança**: Utiliza `helmet` para adicionar cabeçalhos de segurança HTTP.
*   **CORS**: Habilita Cross-Origin Resource Sharing para permitir requisições de diferentes origens.
*   **Logging**: Utiliza `morgan` para registrar as requisições HTTP recebidas.

## Como Funciona o Roteamento

O roteamento é definido no arquivo `routes/index.js`:

1.  **Endpoints Específicos de Autenticação**:
    *   `POST /login`: Encaminhado para o `user-api` no endpoint `/login`.
    *   `POST /register`: Encaminhado para o `user-api` no endpoint `/register`.

2.  **Endpoints Genéricos de API (`/api/*`)**:
    *   Requisições para caminhos que começam com `/api/` são tratadas de forma dinâmica.
    *   O primeiro segmento do caminho após `/api/` (ex: `users` em `/api/users/123`) é usado como chave para consultar o `serviceRegistry`.
    *   O `serviceRegistry` mapeia essa chave para a URL base do microserviço correspondente (ex: `users` -> `http://user-api:8080`).
    *   A requisição é então encaminhada para o microserviço, preservando o caminho original (`/api/users/123` é enviado como `/api/users/123` para o `user-api`).
    *   Se nenhum serviço for encontrado para o recurso solicitado, um erro `404` é retornado.

3.  **Documentação da API**:
    *   A interface do Swagger é servida na rota (`/swagger-ui`) através do middleware configurado em `swagger.js`.

4.  **WebSocket (Socket.IO)**:
    *   O servidor Socket.IO é inicializado e anexado ao servidor HTTP principal.
    *   A lógica de manipulação de eventos do Socket.IO é delegada para `initializeSocketIO`.
    *   As conexões WebSocket são estabelecidas diretamente com este gateway.
