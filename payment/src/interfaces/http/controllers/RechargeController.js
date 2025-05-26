import ProcessRechargeUseCase from '../../../application/usecases/ProcessRechargeUseCase.js';

/**
 * Controlador para as operações de recarga
 */
export default {
  /**
   * Processa uma solicitação de recarga
   * @param {Object} req Requisição Express
   * @param {Object} res Resposta Express
   * @param {Function} next Próxima função middleware
   */
  async processRecharge(req, res, next) {
    try {
      const { userId } = req.params;
      const { amount } = req.body;

      console.log(`Processando recarga para usuário ${userId} no valor de ${amount}`);

      if (!userId) {
        return res.status(400).json({ 
          message: "ID do usuário não fornecido nos parâmetros da rota." 
        });
      }

      // Executa o caso de uso para processar a recarga
      const result = await ProcessRechargeUseCase.execute(userId, amount);
      
      console.log(`Recarga processada com sucesso: ${JSON.stringify(result)}`);
      
      // Retorna a resposta apropriada com base no status da recarga
      if (result.transaction.status === 'completed') {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (err) {
      console.error("Erro ao processar recarga:", err);
      
      // Determina o status HTTP com base no tipo de erro
      if (err.message.includes('não encontrada')) {
        return res.status(404).json({ message: err.message });
      } else if (err.message.includes('deve ser') || err.message.includes('inválid')) {
        return res.status(400).json({ message: err.message });
      } else {
        return res.status(500).json({ message: "Erro interno ao processar recarga" });
      }
    }
  }
};
