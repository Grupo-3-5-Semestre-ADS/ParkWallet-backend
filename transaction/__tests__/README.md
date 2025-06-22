# Transaction Microservice - Test Suite

Este diretório contém a suíte de testes para o microserviço de transações (Transaction) do ParkWallet.

## Estrutura dos Testes

```
__tests__/
├── README.md                           # Este arquivo
├── setup/
│   └── testSetup.js                   # Configurações globais dos testes
├── controllers/
│   └── transactionController.test.js  # Testes unitários do controller de transações
└── integration/
    └── transactions.test.js           # Testes de integração das rotas de transações
```

## Tipos de Testes

### Testes Unitários
- **Controllers**: Testam a lógica de negócio dos controladores
  - `transactionController.test.js`: Testa todas as operações de transações

### Testes de Integração
- **API Routes**: Testam as rotas da API end-to-end
  - `transactions.test.js`: Testa as rotas de gerenciamento de transações

## Configuração

### Dependências de Teste
- **Jest**: Framework de testes
- **Babel**: Transpilação de ES6+ para testes
- **Supertest**: Testes de integração HTTP
- **@faker-js/faker**: Geração de dados de teste

### Mocks
- **Sequelize.Op**: Mock para operadores do Sequelize
- **console**: Mock para evitar logs durante testes
- **Models**: Mocks para Transaction e ItemTransaction
- **Response functions**: Mocks para funções de resposta HATEOAS

### Variáveis de Ambiente
- `NODE_ENV=test`
- `PORT=3003`
- `API_GATEWAY_URL=http://localhost:3000`
- `DB_HOST=localhost`
- `DB_PORT=3306`
- `DB_NAME=test_db`
- `DB_USER=test_user`
- `DB_PASS=test_pass`
- `JWT_SECRET=test_jwt_secret`

## Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

## Cobertura de Código

Os testes cobrem:
- ✅ Controllers (transactionController)
- ✅ Rotas de integração
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Operações CRUD completas
- ✅ Paginação e filtros
- ✅ Relacionamentos entre modelos

## Padrões de Teste

### Nomenclatura
- Arquivos de teste: `*.test.js`
- Describe blocks: Nome do componente testado
- Test cases: Descrição clara do comportamento esperado

### Estrutura AAA (Arrange, Act, Assert)
```javascript
it('deve retornar uma transação quando encontrada', async () => {
  // Arrange
  const mockTransactionData = { id: 1, userId: 1 };
  mockTransaction.findByPk.mockResolvedValue(mockTransactionData);
  
  // Act
  await showTransaction(mockRequest, mockResponse, mockNext);
  
  // Assert
  expect(mockResponse.hateoas_item).toHaveBeenCalledWith(mockTransactionData);
});
```

### Mocks
- Sempre limpar mocks entre testes
- Usar mocks específicos para cada cenário
- Verificar chamadas de mocks quando relevante

## Cenários de Teste

### TransactionController
- ✅ **showTransaction**: Buscar transação por ID
- ✅ **listTransactions**: Listar com paginação e filtros
- ✅ **listItemsByTransaction**: Listar itens de uma transação
- ✅ **createTransaction**: Criar nova transação
- ✅ **updateTransaction**: Atualizar transação existente
- ✅ **toggleTransactionStatus**: Alternar status ativo/inativo
- ✅ **listUserTransactionsWithItems**: Listar transações do usuário com itens
- ✅ **listTransactionsByProductIds**: Buscar por IDs de produtos

### Validações
- ✅ Campos obrigatórios
- ✅ Tipos de dados corretos
- ✅ Valores válidos (operações, status)
- ✅ Tratamento de erros 404
- ✅ Validação de parâmetros de consulta

### Integração
- ✅ Rotas GET, POST, PUT
- ✅ Respostas de sucesso e erro
- ✅ Paginação e filtros
- ✅ Relacionamentos com ItemTransaction

## Funcionalidades Testadas

### Operações CRUD
- **Create**: Criação de transações com validação
- **Read**: Busca individual e listagem com filtros
- **Update**: Atualização de dados e status
- **Delete**: Soft delete via toggle de status

### Funcionalidades Avançadas
- **Paginação**: Controle de página e tamanho
- **Filtros**: Por status ativo, usuário, produtos
- **Relacionamentos**: Inclusão de itens de transação
- **Busca complexa**: Por múltiplos IDs de produtos

### Validações de Negócio
- **Operações válidas**: debit, credit
- **Status válidos**: pending, completed, failed
- **Valores positivos**: totalValue > 0
- **Campos obrigatórios**: userId, totalValue, operation

## Próximos Passos

1. **Adicionar testes para outros controllers**
   - authController
   - paymentController

2. **Testes de modelos**
   - Validações do Sequelize
   - Relacionamentos entre modelos
   - Hooks e métodos customizados

3. **Testes de middlewares**
   - Autenticação JWT
   - Validação de entrada
   - Tratamento de erros

4. **Testes de performance**
   - Tempo de resposta
   - Carga de requisições
   - Otimização de queries

5. **Testes de segurança**
   - Validação de entrada maliciosa
   - Rate limiting
   - Autorização de acesso

6. **Testes E2E**
   - Fluxo completo de transações
   - Integração real com outros microserviços
   - Testes de consistência de dados