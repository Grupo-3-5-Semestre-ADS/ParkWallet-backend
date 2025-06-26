import fetch from 'node-fetch';

const API_GATEWAY_BASE_URL = process.env.API_GATEWAY_URL || 'http://localhost:8080';

export const processRecharge = async (req, res, next) => {
  let transactionId = null;

  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "ID do usuário não fornecido nos parâmetros da rota."
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Valor de recarga deve ser maior que zero."
      });
    }

    const transactionApiUrl = `${API_GATEWAY_BASE_URL}/api/transactions`;

    try {
      const transactionResponse = await fetch(transactionApiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': req.token
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          totalValue: amount,
          operation: 'credit',
          status: 'pending'
        })
      });

      if (!transactionResponse.ok) {
        let errorMessage = `Falha ao criar transação via API Gateway: ${transactionResponse.status} ${transactionResponse.statusText}`;

        try {
          const contentType = transactionResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await transactionResponse.json();
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          }
        } catch (parseError) {
          console.error("Erro ao interpretar resposta JSON do erro da transação:", parseError);
        }

        return res.status(500).json({
          message: `Erro ao criar registro de transação: ${errorMessage}`
        });
      }

    } catch (transactionFetchError) {
      console.error("Erro ao comunicar com transaction-api:", transactionFetchError);
      return res.status(500).json({
        message: "Erro de comunicação com o serviço de transações."
      });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const walletApiUrl = `${API_GATEWAY_BASE_URL}/api/wallets/${userId}/balance`;

    try {
      const walletResponse = await fetch(walletApiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: amount })
      });

      if (!walletResponse.ok) {
        let errorMessage = `Falha ao comunicar com wallet-api (via Gateway): ${walletResponse.status} ${walletResponse.statusText}`;

        try {
          const contentType = walletResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await walletResponse.json();
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          }
        } catch (parseError) {
          console.error("Erro ao interpretar resposta JSON do erro:", parseError);
        }

        if (walletResponse.status === 404) {
          return res.status(404).json({
            message: `Carteira para usuário ID ${userId} não encontrada.`
          });
        } else {
          return res.status(500).json({
            message: `Erro ao atualizar saldo: ${errorMessage}`
          });
        }
      }

      const userTransactionsUrl = `${API_GATEWAY_BASE_URL}/api/transactions/by-user?userId=${userId}&_size=1&_order=createdAt DESC`;

      try {
        const findTransactionResponse = await fetch(userTransactionsUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (findTransactionResponse.ok) {
          const transactionData = await findTransactionResponse.json();

          if (transactionData.data && transactionData.data.length > 0) {
            const recentTransaction = transactionData.data.find(t =>
              t.operation === 'credit' &&
              t.status === 'pending' &&
              parseFloat(t.totalValue) === amount
            );

            if (recentTransaction) {
              transactionId = recentTransaction.id;

              const updateTransactionUrl = `${API_GATEWAY_BASE_URL}/api/transactions/${transactionId}`;
              const updateResponse = await fetch(updateTransactionUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: parseInt(userId),
                  totalValue: amount,
                  operation: 'credit',
                  status: 'completed'
                })
              });

              if (updateResponse.ok) {
                console.info(`INFO: Status da transação ${transactionId} atualizado para 'completed'`);
              } else {
                console.warn(`AVISO: Falha ao atualizar status da transação ${transactionId}: ${updateResponse.status}`);
              }
            }
          }
        }
      } catch (updateError) {
        console.error("Erro ao atualizar status da transação:", updateError);
      }

      const walletData = await walletResponse.json();
      return res.status(200).json({
        message: "Recarga processada com sucesso",
        transaction: {
          userId,
          amount,
          newBalance: walletData.balance,
          timestamp: new Date().toISOString(),
          status: "completed",
          transactionId: transactionId
        }
      });

    } catch (fetchError) {
      console.error("Erro ao comunicar com wallet-api:", fetchError);
      return res.status(500).json({
        message: "Erro de comunicação com o serviço de carteiras."
      });
    }

  } catch (err) {
    console.error("Erro geral no processamento da recarga:", err);
    next(err);
  }
};
