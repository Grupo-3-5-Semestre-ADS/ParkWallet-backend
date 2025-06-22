# Testes do Microserviço User - ParkWallet

Este diretório contém todos os testes para o microserviço de usuários do ParkWallet.

## Estrutura dos Testes

```
__tests__/
├── __mocks__/              # Mocks das dependências
│   ├── bcryptjs.js         # Mock do bcryptjs
│   ├── jsonwebtoken.js     # Mock do JWT
│   └── sequelize.js        # Mock do Sequelize
├── integration/            # Testes de integração
│   ├── auth.test.js        # Testes das rotas de autenticação
│   ├── register.test.js    # Testes das rotas de registro
│   └── users.test.js       # Testes das rotas de usuários
├── setup/                  # Configuração dos testes
│   └── testSetup.js        # Setup global dos testes
└── unit/                   # Testes unitários
    ├── authController.test.js      # Testes do controller de auth
    ├── registerController.test.js  # Testes do controller de registro
    ├── userController.test.js      # Testes do controller de usuários
    └── userModel.test.js           # Testes do modelo User
```

## Tipos de Testes

### Testes Unitários
Testam componentes individuais isoladamente:
- **Controllers**: Testam a lógica de negócio dos controladores
- **Models**: Testam os modelos e suas validações
- **Middlewares**: Testam middlewares de autenticação e autorização

### Testes de Integração
Testam a integração entre componentes:
- **Rotas de API**: Testam endpoints completos
- **Fluxos de autenticação**: Testam login, registro e autorização
- **Operações CRUD**: Testam criação, leitura, atualização e exclusão

## Configuração

### Dependências de Teste
- **Jest**: Framework de testes
- **Supertest**: Testes de API HTTP
- **@faker-js/faker**: Geração de dados fake para testes

### Mocks
Todos os mocks estão configurados para simular:
- **Sequelize**: Operações de banco de dados
- **JWT**: Geração e verificação de tokens
- **Bcrypt**: Hash e comparação de senhas

## Como Executar

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

### Executar testes específicos
```bash
# Apenas testes unitários
npm test -- __tests__/unit/

# Apenas testes de integração
npm test -- __tests__/integration/

# Teste específico
npm test -- __tests__/unit/userController.test.js
```

## Cobertura de Código

Os testes cobrem:
- ✅ Controllers (auth, user, register)
- ✅ Models (User)
- ✅ Rotas de API
- ✅ Validações
- ✅ Autenticação e autorização
- ✅ Tratamento de erros

### Métricas de Cobertura
- **Linhas**: Mínimo 70%
- **Funções**: Mínimo 70%
- **Branches**: Mínimo 70%
- **Statements**: Mínimo 70%

## Cenários Testados

### Autenticação
- ✅ Geração de tokens JWT
- ✅ Verificação de tokens válidos/inválidos
- ✅ Controle de acesso por roles
- ✅ Tokens expirados

### Usuários
- ✅ Login com credenciais válidas/inválidas
- ✅ Listagem de usuários com filtros
- ✅ Busca de usuário por ID
- ✅ Edição de dados do usuário
- ✅ Controle de acesso (ADMIN/CUSTOMER)

### Registro
- ✅ Criação de usuário com dados válidos
- ✅ Validação de email
- ✅ Validação de CPF único
- ✅ Validação de senha
- ✅ Tratamento de erros de validação

### Modelo User
- ✅ Validações de campos
- ✅ Hash de senhas
- ✅ Comparação de senhas
- ✅ Verificação de roles
- ✅ Hooks do Sequelize

## Variáveis de Ambiente para Testes

As seguintes variáveis são configuradas automaticamente:
```
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key
JWT_EXPIRATION_TIME=1h
DB_HOST=localhost
DB_PORT=3306
DB_NAME=parkwallet_test
DB_USER=test_user
DB_PASS=test_password
RABBITMQ_URL=amqp://localhost:5672
```

## Helpers de Teste

O arquivo `testSetup.js` fornece helpers úteis:
- `createMockResponse()`: Cria mock de response do Express
- `createMockRequest()`: Cria mock de request do Express
- `createMockNext()`: Cria mock da função next
- `createMockUser()`: Cria mock do modelo User
- `createMockUserInstance()`: Cria mock de instância de usuário

## Debugging

Para debuggar testes:
```bash
# Executar com verbose
npm test -- --verbose

# Executar teste específico com logs
npm test -- --verbose __tests__/unit/userController.test.js
```

## Contribuindo

Ao adicionar novos testes:
1. Siga a estrutura existente
2. Use os mocks fornecidos
3. Mantenha a cobertura acima de 70%
4. Documente cenários complexos
5. Use nomes descritivos para os testes

## Troubleshooting

### Problemas Comuns

1. **Erro de ES Modules**
   - Certifique-se que o `package.json` tem `"type": "module"`
   - Use `import` ao invés de `require`

2. **Mocks não funcionando**
   - Verifique se os mocks estão no diretório correto
   - Confirme que o Jest está configurado corretamente

3. **Testes lentos**
   - Use `--maxWorkers=1` para debugging
   - Verifique se há vazamentos de memória

4. **Falhas intermitentes**
   - Verifique se os mocks estão sendo limpos corretamente
   - Use `beforeEach` e `afterEach` para reset