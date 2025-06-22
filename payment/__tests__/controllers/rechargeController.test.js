import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock do fetch global
global.fetch = jest.fn();

// Mock das funções de resposta
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createMockRequest = (params = {}, body = {}) => {
  return {
    params,
    body
  };
};

const createMockNext = () => jest.fn();

// Simular a função processRecharge
const processRecharge = async (req, res, next) => {
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

    // Simular criação de transação
    const transactionResponse = await fetch('http://localhost:8080/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: parseInt(userId),
        totalValue: amount,
        operation: 'credit',
        status: 'pending'
      })
    });

    if (!transactionResponse.ok) {
      return res.status(500).json({ 
        message: "Erro ao criar registro de transação" 
      });
    }

    // Simular atualização do saldo
    const walletResponse = await fetch(`http://localhost:8080/api/wallets/${userId}/balance`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: amount })
    });

    if (!walletResponse.ok) {
      if (walletResponse.status === 404) {
        return res.status(404).json({ 
          message: `Carteira para usuário ID ${userId} não encontrada.` 
        });
      }
      return res.status(500).json({ 
        message: "Erro ao atualizar saldo" 
      });
    }

    const walletData = await walletResponse.json();
    return res.status(200).json({
      message: "Recarga processada com sucesso",
      transaction: {
        userId,
        amount,
        newBalance: walletData.balance,
        timestamp: new Date().toISOString(),
        status: "completed"
      }
    });

  } catch (error) {
    next(error);
  }
};

describe('RechargeController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('processRecharge', () => {
    it('deve processar recarga com sucesso', async () => {
      const userId = '1';
      const amount = 50.00;
      
      // Mock das respostas das APIs
      fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: () => Promise.resolve({ id: 1 })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ balance: 150.00 })
        });

      const req = createMockRequest({ userId }, { amount });
      const res = createMockResponse();
      const next = createMockNext();

      await processRecharge(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Recarga processada com sucesso",
        transaction: expect.objectContaining({
          userId,
          amount,
          newBalance: 150.00,
          status: "completed"
        })
      });
    });

    it('deve retornar erro quando userId não é fornecido', async () => {
      const req = createMockRequest({}, { amount: 50.00 });
      const res = createMockResponse();
      const next = createMockNext();

      await processRecharge(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "ID do usuário não fornecido nos parâmetros da rota."
      });
    });

    it('deve retornar erro quando amount é menor ou igual a zero', async () => {
      const req = createMockRequest({ userId: '1' }, { amount: 0 });
      const res = createMockResponse();
      const next = createMockNext();

      await processRecharge(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Valor de recarga deve ser maior que zero."
      });
    });

    it('deve retornar erro quando falha ao criar transação', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const req = createMockRequest({ userId: '1' }, { amount: 50.00 });
      const res = createMockResponse();
      const next = createMockNext();

      await processRecharge(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao criar registro de transação"
      });
    });

    it('deve retornar erro 404 quando carteira não é encontrada', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: () => Promise.resolve({ id: 1 })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        });

      const req = createMockRequest({ userId: '999' }, { amount: 50.00 });
      const res = createMockResponse();
      const next = createMockNext();

      await processRecharge(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Carteira para usuário ID 999 não encontrada."
      });
    });

    it('deve retornar erro quando falha ao atualizar saldo', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: () => Promise.resolve({ id: 1 })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        });

      const req = createMockRequest({ userId: '1' }, { amount: 50.00 });
      const res = createMockResponse();
      const next = createMockNext();

      await processRecharge(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao atualizar saldo"
      });
    });

    it('deve chamar next com erro quando ocorre exceção', async () => {
      const error = new Error('Network error');
      fetch.mockRejectedValue(error);

      const req = createMockRequest({ userId: '1' }, { amount: 50.00 });
      const res = createMockResponse();
      const next = createMockNext();

      await processRecharge(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});