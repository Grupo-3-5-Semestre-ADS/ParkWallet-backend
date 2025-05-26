/**
 * Entidade que representa uma recarga de crédito na carteira
 */
class Recharge {
  constructor(userId, amount, status = 'pending', timestamp = new Date().toISOString()) {
    this.userId = userId;
    this.amount = amount;
    this.status = status;
    this.timestamp = timestamp;
  }

  /**
   * Marca a recarga como concluída
   * @param {number} newBalance Novo saldo após a recarga
   */
  complete(newBalance) {
    this.status = 'completed';
    this.newBalance = newBalance;
    return this;
  }

  /**
   * Marca a recarga como falha
   * @param {string} reason Motivo da falha
   */
  fail(reason) {
    this.status = 'failed';
    this.failureReason = reason;
    return this;
  }

  /**
   * Converte a recarga para o formato necessário para criar uma transação
   * @returns {Object} Dados para criação da transação
   */
  toTransactionData() {
    return {
      userId: this.userId,
      totalValue: this.amount,
      operation: 'credit',  // Using 'credit' as it's accepted by transaction service
      status: this.status
    };
  }

  /**
   * Converte a recarga para objeto de resposta para o cliente
   * @returns {Object} Objeto de resposta
   */
  toResponseData() {
    const response = {
      message: this.status === 'completed' 
        ? "Recarga processada com sucesso" 
        : "Falha ao processar recarga",
      transaction: {
        userId: this.userId,
        amount: this.amount,
        timestamp: this.timestamp,
        status: this.status
      }
    };

    if (this.newBalance !== undefined) {
      response.transaction.newBalance = this.newBalance;
    }

    if (this.failureReason) {
      response.error = this.failureReason;
    }

    return response;
  }
}

export default Recharge;
