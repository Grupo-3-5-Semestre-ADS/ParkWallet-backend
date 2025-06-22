# Testes do Microserviço Catalog

Este diretório contém todos os testes para o microserviço de catálogo do ParkWallet.

## Estrutura dos Testes

```
__tests__/
├── __mocks__/              # Mocks das dependências
│   ├── jsonwebtoken.js     # Mock do JWT
│   └── sequelize.js        # Mock do Sequelize
├── integration/            # Testes de integração
│   └── facilities.test.js  # Testes das rotas de facilities
├── setup/                  # Configuração dos testes
│   └── testSetup.js        # Setup global dos testes
└── unit/                   # Testes unitários
    ├── controllers/        # Testes dos controllers
    │   ├── facilityController.test.js
    │   └── productController.test.js
    └── models/             # Testes dos modelos
        └── facilityModel.test.js
```

## Tipos de Testes

### Testes Unitários
Testam componentes individuais isoladamente:
- **Controllers**: Testam a lógica de negócio dos controladores
  - `facilityController.test.js`: Testa operações CRUD de facilities
  - `productController.test.js`: Testa operações CRUD de produtos
- **Models**: Testam os modelos e suas validações
  - `facilityModel.test.js`: Testa definição e validações do modelo Facility

### Testes de Integração
Testam a integração entre componentes:
- **Rotas de API**: Testam endpoints completos
- **Operações CRUD**: Testam criação, leitura, atualização e exclusão
- **Validações**: Testam validações de entrada e respostas de erro

## Configuração

### Dependências de Teste
- **Jest**: Framework de testes
- **Supertest**: Testes de API HTTP (simulado)
- **@faker-js/faker**: Geração de dados fake para testes
- **Babel**: Transpilação para suporte a ES modules

### Mocks
Todos os mocks estão configurados para simular:
- **Sequelize**: Operações de banco de dados
- **JWT**: Geração e verificação de tokens
- **Models**: Modelos Facility e Product

### Variáveis de Ambiente de Teste
- `NODE_ENV=test`
- `JWT_SECRET=test-jwt-secret-key`
- `DB_NAME=parkwallet_catalog_test`
- Outras configurações de banco de dados para ambiente de teste

## Executando os Testes

### Comandos Disponíveis
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Estrutura dos Testes

#### Controllers
- Testam funções individuais dos controllers
- Verificam respostas corretas para diferentes cenários
- Testam tratamento de erros
- Validam chamadas para modelos

#### Models
- Testam definição correta dos modelos
- Verificam validações de campos
- Testam operações básicas (CRUD)
- Validam relacionamentos entre modelos

#### Integration
- Testam rotas completas da API
- Verificam códigos de status HTTP
- Testam payloads de request/response
- Validam comportamento end-to-end

## Cobertura de Código

Os testes cobrem:
- ✅ Controllers (facility, product)
- ✅ Models (facility)
- ✅ Rotas de integração (facilities)
- ⚠️ Middlewares (a implementar)
- ⚠️ Services (a implementar)

## Padrões de Teste

### Estrutura AAA (Arrange, Act, Assert)
Todos os testes seguem o padrão:
```javascript
it('deve fazer algo específico', async () => {
  // Arrange - Preparar dados e mocks
  const mockData = { ... };
  
  // Act - Executar a ação
  const result = await functionUnderTest(mockData);
  
  // Assert - Verificar resultados
  expect(result).toBe(expectedValue);
});
```

### Nomenclatura
- Testes em português para melhor compreensão da equipe
- Descrições claras do comportamento esperado
- Agrupamento lógico com `describe` blocks

### Mocks
- Isolamento completo de dependências externas
- Mocks configuráveis para diferentes cenários
- Limpeza automática entre testes

## Próximos Passos

1. **Implementar testes para outros controllers**:
   - authController
   
2. **Adicionar testes de modelos**:
   - productModel
   
3. **Expandir testes de integração**:
   - Rotas de produtos
   - Rotas de autenticação
   
4. **Implementar testes de middlewares**:
   - Validadores
   - Handlers de erro
   - HATEOAS

5. **Adicionar testes de performance**:
   - Testes de carga
   - Testes de stress