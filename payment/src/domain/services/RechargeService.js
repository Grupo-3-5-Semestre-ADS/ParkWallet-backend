import Recharge from '../entities/Recharge.js';

/**
 * Serviço de domínio que gerencia as recargas
 */
class RechargeService {
  /**
   * Cria uma nova recarga
   * @param {number} userId ID do usuário
   * @param {number} amount Valor da recarga
   * @returns {Recharge} Nova recarga
   */
  createRecharge(userId, amount) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Valor da recarga deve ser um número maior que zero');
    }
    
    return new Recharge(userId, amount);
  }

  /**
   * Valida uma recarga
   * @param {Recharge} recharge Recarga a ser validada
   * @returns {boolean} Resultado da validação
   */
  validateRecharge(recharge) {
    if (!recharge || !(recharge instanceof Recharge)) {
      throw new Error('Recarga inválida');
    }
    
    return recharge.amount > 0;
  }
}

export default new RechargeService();
