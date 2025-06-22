# Payment Microservice - Test Suite

Este diretório contém a suíte de testes para o microserviço de pagamento (Payment) do ParkWallet.

## Estrutura dos Testes

```
__tests__/
├── README.md                    # Este arquivo
├── setup/
│   └── testSetup.js            # Configurações globais dos testes
├── controllers/
│   └── rechargeController.test.js  # Testes unitários do controller de recarga
└── integration/
    └── recharge.test.js        # Testes de integração das rotas de recarga
```

## Tipos de Testes

### Testes Unitários
- **Controllers**: Testam a lógica de negócio dos controladores
  - `rechargeController.test.js`: Testa o processamento de recargas

### Testes de Integração
- **API Routes**: Testam as rotas da API end-to-end
  - `recharge.test.js`: Testa as rotas de recarga de carteira

## Configuração

### Dependências de Teste
- **Jest**: Framework de testes
- **Babel**: Transpilação de ES6+ para testes
- **Supertest**: Testes de integração HTTP
- **@faker-js/faker**: Geração de dados de teste

### Mocks
- **fetch**: Mock global para chamadas HTTP externas
- **console**: Mock para evitar logs durante testes
- **APIs externas**: Mocks para transaction-api e wallet-api

### Variáveis de Ambiente
- `NODE_ENV=test`
- `PORT=3005`
- `API_GATEWAY_URL=http://localhost:3000`

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
- ✅ Controllers (rechargeController)
- ✅ Rotas de integração
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Comunicação com APIs externas

## Padrões de Teste

### Nomenclatura
- Arquivos de teste: `*.test.js`
- Describe blocks: Nome do componente testado
- Test cases: Descrição clara do comportamento esperado

### Estrutura AAA (Arrange, Act, Assert)
```javascript
it('deve processar recarga com sucesso', async () => {
  // Arrange
  const userId = '1';
  const amount = 50.00;
  
  // Act
  await processRecharge(req, res, next);
  
  // Assert
  expect(res.status).toHaveBeenCalledWith(200);
});
```

### Mocks
- Sempre limpar mocks entre testes
- Usar mocks específicos para cada cenário
- Verificar chamadas de mocks quando relevante

## Cenários de Teste

### RechargeController
- ✅ Processamento de recarga bem-sucedido
- ✅ Validação de userId obrigatório
- ✅ Validação de valor positivo
- ✅ Tratamento de erro na criação de transação
- ✅ Tratamento de carteira não encontrada
- ✅ Tratamento de erro na atualização de saldo
- ✅ Tratamento de exceções gerais

### Integração
- ✅ Rotas de recarga
- ✅ Validação de dados de entrada
- ✅ Respostas de erro apropriadas
- ✅ Comunicação com APIs externas

## Próximos Passos

1. **Adicionar testes para middlewares**
   - Validação de entrada
   - Tratamento de erros

2. **Testes de performance**
   - Tempo de resposta
   - Carga de requisições

3. **Testes de segurança**
   - Validação de entrada maliciosa
   - Rate limiting

4. **Testes E2E**
   - Fluxo completo de recarga
   - Integração real com outros microserviços