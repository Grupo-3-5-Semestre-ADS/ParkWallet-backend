# Wallet Microservice Test Suite

Este diretório contém a suíte de testes completa para o microserviço **Wallet** do projeto ParkWallet.

## 📁 Estrutura dos Testes

```
__tests__/
├── README.md                     # Este arquivo
├── setup/
│   └── testSetup.js             # Configurações globais dos testes
├── controllers/
│   └── walletController.test.js # Testes unitários do controller
└── integration/
    └── wallets.test.js          # Testes de integração das rotas
```

## 🧪 Tipos de Testes

### Testes Unitários
- **Localização**: `controllers/walletController.test.js`
- **Foco**: Testam funções individuais do `walletController`
- **Cobertura**: 
  - `showWallet` - Buscar carteira por ID
  - `listWallets` - Listar carteiras com paginação
  - `createWallet` - Criar nova carteira
  - `editWallet` - Editar carteira existente
  - `deleteWallet` - Deletar carteira
  - `patchBalance` - Atualizar saldo da carteira

### Testes de Integração
- **Localização**: `integration/wallets.test.js`
- **Foco**: Testam endpoints da API completos
- **Cobertura**:
  - `GET /api/wallets` - Listar todas as carteiras
  - `GET /api/wallets/:id` - Buscar carteira específica
  - `POST /api/wallets` - Criar nova carteira
  - `PUT /api/wallets/:id` - Atualizar carteira
  - `DELETE /api/wallets/:id` - Deletar carteira
  - `PATCH /api/wallets/:id/balance` - Atualizar saldo

## ⚙️ Configuração

### Dependências de Teste
- **Jest**: Framework de testes
- **Supertest**: Testes de API HTTP
- **Babel**: Transpilação ES6+
- **@jest/globals**: Utilitários globais do Jest

### Mocks e Simulações
- **Modelo Wallet**: Simulado para isolamento dos testes
- **Respostas HTTP**: Mockadas para testes unitários
- **Console**: Silenciado durante os testes
- **Fetch**: Mockado globalmente

### Variáveis de Ambiente
```javascript
NODE_ENV=test
PORT=3000
API_GATEWAY_URL=http://localhost:8080
DB_HOST=localhost
DB_PORT=3306
DB_NAME=test_wallet_db
DB_USER=test_user
DB_PASS=test_password
JWT_SECRET=test_jwt_secret
```

## 🚀 Executando os Testes

### Comandos Disponíveis
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Relatório de Cobertura
Após executar `npm run test:coverage`, o relatório será gerado em:
- **Terminal**: Resumo da cobertura
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`

## 📋 Cenários de Teste

### WalletController (Unitários)

#### showWallet
- ✅ Retorna carteira quando encontrada
- ✅ Retorna 404 quando carteira não encontrada
- ✅ Trata erros de banco de dados

#### listWallets
- ✅ Retorna carteiras paginadas
- ✅ Usa valores padrão de paginação
- ✅ Aplica ordenação correta

#### createWallet
- ✅ Cria nova carteira com dados válidos
- ✅ Trata erros de criação

#### editWallet
- ✅ Atualiza carteira existente
- ✅ Retorna 404 para carteira inexistente

#### deleteWallet
- ✅ Deleta carteira existente
- ✅ Retorna 404 para carteira inexistente

#### patchBalance
- ✅ Atualiza saldo com valor positivo
- ✅ Valida saldo insuficiente para débito
- ✅ Valida formato do valor
- ✅ Retorna 404 para carteira inexistente

### API Endpoints (Integração)

#### GET /api/wallets
- ✅ Lista todas as carteiras
- ✅ Suporta parâmetros de paginação

#### GET /api/wallets/:id
- ✅ Retorna carteira específica
- ✅ Retorna 404 para ID inexistente

#### POST /api/wallets
- ✅ Cria carteira com dados válidos
- ✅ Valida campos obrigatórios
- ✅ Rejeita saldo negativo

#### PUT /api/wallets/:id
- ✅ Atualiza carteira existente
- ✅ Retorna 404 para ID inexistente

#### DELETE /api/wallets/:id
- ✅ Deleta carteira existente
- ✅ Retorna 404 para ID inexistente

#### PATCH /api/wallets/:id/balance
- ✅ Atualiza saldo da carteira
- ✅ Valida formato do valor
- ✅ Retorna 404 para ID inexistente

### Validação de Dados
- ✅ Valida tipos de dados
- ✅ Trata valores decimais
- ✅ Valida campos obrigatórios

## 🔧 Padrões de Teste

### Nomenclatura
- Arquivos de teste terminam com `.test.js`
- Descritores usam formato "should [ação] when [condição]"
- Grupos organizados por função/endpoint

### Estrutura AAA
- **Arrange**: Configuração dos dados de teste
- **Act**: Execução da função/endpoint
- **Assert**: Verificação dos resultados

### Mocks
- Isolamento de dependências externas
- Simulação de cenários de erro
- Controle de retornos de banco de dados

## 📈 Próximos Passos

1. **Testes de Performance**: Adicionar testes de carga
2. **Testes E2E**: Implementar testes end-to-end
3. **Testes de Segurança**: Validar autenticação e autorização
4. **Testes de Concorrência**: Testar operações simultâneas
5. **Snapshot Testing**: Para validação de estruturas de resposta

---

**Nota**: Esta suíte de testes garante a qualidade e confiabilidade do microserviço Wallet, cobrindo cenários críticos de negócio e casos extremos.