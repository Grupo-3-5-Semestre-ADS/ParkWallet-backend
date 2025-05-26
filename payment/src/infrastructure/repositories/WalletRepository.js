import fetch from 'node-fetch';

/**
 * Repositório para interagir com o serviço de carteiras (wallet-api)
 */
class WalletRepository {
  constructor() {
    this.walletApiUrl = process.env.WALLET_API_URL || 'http://wallet-api:8080';
  }

  /**
   * Adiciona saldo à carteira de um usuário
   * @param {number} userId ID do usuário
   * @param {number} amount Valor a ser adicionado
   * @returns {Promise<Object>} Dados da carteira atualizada
   */
  async addBalance(userId, amount) {
    const walletApiUrl = `${this.walletApiUrl}/api/wallets/${userId}/balance`;
    console.log(`INFO: Tentando adicionar R$ ${amount} ao saldo do usuário ${userId} via Wallet API: ${walletApiUrl}`);

    const response = await fetch(walletApiUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: amount })
    });

    console.log(`INFO: Resposta da wallet-api (via Gateway) status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = `Falha ao comunicar com wallet-api: ${response.status} ${response.statusText}`;
      
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

      if (response.status === 404) {
        throw new Error(`Carteira para usuário ID ${userId} não encontrada.`);
      } else {
        throw new Error(`Erro ao atualizar saldo: ${errorMessage}`);
      }
    }

    return await response.json();
  }
}

export default new WalletRepository();
