import RechargeService from '../../domain/services/RechargeService.js';
import WalletRepository from '../../infrastructure/repositories/WalletRepository.js';
import TransactionRepository from '../../infrastructure/repositories/TransactionRepository.js';

/**
 * Caso de uso para processar uma recarga de crédito
 */
class ProcessRechargeUseCase {
  /**
   * Executa o caso de uso para processar uma recarga
   * @param {number} userId ID do usuário
   * @param {number} amount Valor da recarga
   * @returns {Promise<Object>} Resultado da operação
   */
  async execute(userId, amount) {
    try {
      // Cria a entidade de recarga usando o serviço de domínio
      const recharge = RechargeService.createRecharge(userId, amount);
      
      // Valida a recarga
      RechargeService.validateRecharge(recharge);
      
      try {
        // Simula um pequeno atraso como se estivesse processando o pagamento externo
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Atualiza o saldo da carteira
        const walletData = await WalletRepository.addBalance(userId, amount);
        
        // Marca a recarga como concluída
        recharge.complete(walletData.balance);
        
        // Registra a transação no microsserviço de transações
        await TransactionRepository.createTransaction(recharge.toTransactionData());
        
        // Retorna o resultado da operação
        return recharge.toResponseData();
      } catch (error) {
        // Em caso de erro, marca a recarga como falha
        recharge.fail(error.message);
        
        // Tenta registrar a transação com status de falha
        try {
          const failedTransactionData = recharge.toTransactionData();
          await TransactionRepository.createTransaction(failedTransactionData);
        } catch (transactionError) {
          console.error("Erro ao registrar transação de falha:", transactionError);
        }
        
        throw error;
      }
    } catch (error) {
      console.error("Erro no caso de uso ProcessRecharge:", error);
      throw error;
    }
  }
}

export default new ProcessRechargeUseCase();
