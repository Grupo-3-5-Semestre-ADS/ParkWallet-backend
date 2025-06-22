#!/usr/bin/env node

/**
 * Script para executar testes do microserviço User
 * Uso: node test-runner.js [opções]
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações de teste
const TEST_CONFIGS = {
  unit: {
    description: 'Executar apenas testes unitários',
    pattern: '__tests__/unit/',
    coverage: false
  },
  integration: {
    description: 'Executar apenas testes de integração',
    pattern: '__tests__/integration/',
    coverage: false
  },
  all: {
    description: 'Executar todos os testes',
    pattern: '__tests__/',
    coverage: false
  },
  coverage: {
    description: 'Executar todos os testes com cobertura',
    pattern: '__tests__/',
    coverage: true
  },
  watch: {
    description: 'Executar testes em modo watch',
    pattern: '__tests__/',
    coverage: false,
    watch: true
  }
};

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Função para colorir texto
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Função para mostrar ajuda
function showHelp() {
  console.log(colorize('\n🧪 Test Runner - Microserviço User ParkWallet\n', 'cyan'));
  console.log(colorize('Uso:', 'bright'));
  console.log('  node test-runner.js [comando] [opções]\n');
  
  console.log(colorize('Comandos disponíveis:', 'bright'));
  Object.entries(TEST_CONFIGS).forEach(([key, config]) => {
    console.log(`  ${colorize(key.padEnd(12), 'green')} ${config.description}`);
  });
  
  console.log(colorize('\nOpções:', 'bright'));
  console.log('  --verbose     Saída detalhada');
  console.log('  --silent      Saída mínima');
  console.log('  --bail        Parar no primeiro erro');
  console.log('  --help, -h    Mostrar esta ajuda\n');
  
  console.log(colorize('Exemplos:', 'bright'));
  console.log('  node test-runner.js unit');
  console.log('  node test-runner.js coverage --verbose');
  console.log('  node test-runner.js watch');
  console.log('  node test-runner.js all --bail\n');
}

// Função para executar comando
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(colorize(`\n🚀 Executando: ${command} ${args.join(' ')}\n`, 'blue'));
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname,
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(colorize('\n✅ Testes concluídos com sucesso!\n', 'green'));
        resolve(code);
      } else {
        console.log(colorize(`\n❌ Testes falharam com código: ${code}\n`, 'red'));
        reject(new Error(`Processo terminou com código ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.error(colorize(`\n💥 Erro ao executar comando: ${error.message}\n`, 'red'));
      reject(error);
    });
  });
}

// Função para construir argumentos do Jest
function buildJestArgs(config, options) {
  const args = [];
  
  // Padrão de arquivos
  if (config.pattern) {
    args.push(config.pattern);
  }
  
  // Cobertura
  if (config.coverage) {
    args.push('--coverage');
  }
  
  // Watch mode
  if (config.watch) {
    args.push('--watch');
  }
  
  // Opções adicionais
  if (options.verbose) {
    args.push('--verbose');
  }
  
  if (options.silent) {
    args.push('--silent');
  }
  
  if (options.bail) {
    args.push('--bail');
  }
  
  // Configurações padrão
  args.push('--passWithNoTests');
  args.push('--detectOpenHandles');
  args.push('--forceExit');
  
  return args;
}

// Função para verificar dependências
async function checkDependencies() {
  try {
    console.log(colorize('🔍 Verificando dependências...', 'yellow'));
    
    // Verificar se Jest está instalado
    await runCommand('npx', ['jest', '--version'], { stdio: 'pipe' });
    
    console.log(colorize('✅ Dependências verificadas\n', 'green'));
  } catch (error) {
    console.error(colorize('❌ Erro ao verificar dependências:', 'red'));
    console.error(colorize('Certifique-se de que as dependências estão instaladas:', 'yellow'));
    console.error(colorize('npm install\n', 'cyan'));
    process.exit(1);
  }
}

// Função para mostrar estatísticas
function showStats() {
  console.log(colorize('📊 Estatísticas dos Testes:\n', 'magenta'));
  console.log('📁 Estrutura:');
  console.log('  • Testes unitários: 4 arquivos');
  console.log('  • Testes integração: 3 arquivos');
  console.log('  • Mocks: 3 arquivos');
  console.log('  • Setup: 1 arquivo\n');
  
  console.log('🎯 Cobertura esperada:');
  console.log('  • Linhas: ≥ 70%');
  console.log('  • Funções: ≥ 70%');
  console.log('  • Branches: ≥ 70%');
  console.log('  • Statements: ≥ 70%\n');
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  
  // Verificar se é pedido de ajuda
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    showHelp();
    return;
  }
  
  // Verificar se é pedido de estatísticas
  if (args.includes('--stats')) {
    showStats();
    return;
  }
  
  const command = args[0];
  const options = {
    verbose: args.includes('--verbose'),
    silent: args.includes('--silent'),
    bail: args.includes('--bail')
  };
  
  // Verificar se o comando existe
  if (!TEST_CONFIGS[command]) {
    console.error(colorize(`❌ Comando desconhecido: ${command}\n`, 'red'));
    showHelp();
    process.exit(1);
  }
  
  try {
    // Verificar dependências
    await checkDependencies();
    
    // Configurar teste
    const config = TEST_CONFIGS[command];
    console.log(colorize(`📋 ${config.description}`, 'cyan'));
    
    // Construir argumentos
    const jestArgs = buildJestArgs(config, options);
    
    // Executar testes
    await runCommand('npx', ['jest', ...jestArgs]);
    
  } catch (error) {
    console.error(colorize('💥 Erro durante execução:', 'red'));
    console.error(error.message);
    process.exit(1);
  }
}

// Tratar sinais de interrupção
process.on('SIGINT', () => {
  console.log(colorize('\n\n⏹️  Execução interrompida pelo usuário', 'yellow'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(colorize('\n\n⏹️  Execução terminada', 'yellow'));
  process.exit(0);
});

// Executar
main().catch((error) => {
  console.error(colorize('💥 Erro fatal:', 'red'));
  console.error(error);
  process.exit(1);
});