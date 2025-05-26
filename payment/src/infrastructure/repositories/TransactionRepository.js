import fetch from 'node-fetch';

/**
 * Repositório para interagir com o serviço de transações (transaction-api)
 */
class TransactionRepository {
  constructor() {
    this.transactionApiUrl = process.env.TRANSACTION_API_URL || 'http://transaction-api:8080';
  }

  /**
   * Registra uma transação de recarga
   * @param {Object} transactionData Dados da transação
   * @returns {Promise<Object>} Transação criada
   */
  async createTransaction(transactionData) {
    const transactionApiUrl = `${this.transactionApiUrl}/api/transactions`;
    console.log(`INFO: Criando registro de transação para recarga do usuário ${transactionData.userId} via Transaction API: ${transactionApiUrl}`);
    
    try {
      const response = await fetch(transactionApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      console.log(`INFO: Resposta da transaction-api (via Gateway) status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = `Falha ao comunicar com transaction-api: ${response.status} ${response.statusText}`;
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          }
        } catch (parseError) {
          console.error("Erro ao interpretar resposta JSON do erro:", parseError);
        }

        throw new Error(`Erro ao registrar transação: ${errorMessage}`);
      }

      if (response.status === 201) {
        return { success: true };
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      throw new Error(`Falha ao registrar transação: ${error.message}`);
    }
  }
}

export default new TransactionRepository();
