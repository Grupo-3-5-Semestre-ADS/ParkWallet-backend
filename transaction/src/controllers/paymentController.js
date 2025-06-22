import { Transaction, ItemTransaction } from '../models/index.js';
import fetch from 'node-fetch';
import database from '../config/database.js';
const { sequelize } = database;

const API_GATEWAY_BASE_URL = process.env.API_GATEWAY_URL || 'http://localhost:8080';

async function fetchProductDetailsAndCalculateValue(productInput) {
    const { productId, quantity } = productInput;
    if (!productId || quantity == null || quantity < 0) {
        throw new Error(`Dados inválidos para o produto: productId=${productId}, quantity=${quantity}`);
    }

    const catalogApiUrl = `${API_GATEWAY_BASE_URL}/api/products/${productId}`;
    const response = await fetch(catalogApiUrl);

    if (!response.ok) {
        let errorDetails = "";
        try {
            const errorBody = await response.json();
            if (errorBody && errorBody.error) errorDetails = ` Detalhes: ${errorBody.error}`;
            else if (errorBody && errorBody.message) errorDetails = ` Detalhes: ${errorBody.message}`;
        } catch (e) {
          console.error(e)
        }

        if (response.status === 404) {
            throw new Error(`Produto com ID ${productId} não encontrado via API Gateway (catalog-api).${errorDetails}`);
        }
        throw new Error(`Falha ao buscar produto ${productId} via API Gateway (catalog-api): ${response.status} ${response.statusText}.${errorDetails}`);
    }

    const productData = await response.json();

    if (!productData || !productData.active) {
        throw new Error(`Produto com ID ${productId} está inativo ou não retornou dados válidos via API Gateway (catalog-api).`);
    }

    const unitPrice = parseFloat(productData.price);
    if (isNaN(unitPrice) || unitPrice < 0) {
        throw new Error(`Preço inválido retornado para o produto ID ${productId} via API Gateway (catalog-api): ${productData.price}`);
    }

    const itemTotalValue = unitPrice * quantity;

    return {
        productId: parseInt(productId, 10),
        quantity: parseInt(quantity, 10),
        unitPrice,
        totalValue: parseFloat(itemTotalValue.toFixed(2)),
        name: productData.name
    };
}


export const makePayment = async (req, res, next) => {
    const dbTransaction = await sequelize.transaction();
    let mainTransactionRecord = null;
    let processedProductsDetails = [];
    let overallTotalValue = 0;

    try {
        const { userId } = req.params;
        const requestedProducts = req.body.products;

        if (!userId) {
            throw new Error("userId não fornecido nos parâmetros da rota.");
        }
        if (!requestedProducts || requestedProducts.length === 0) {
            throw new Error("Nenhum produto fornecido para pagamento.");
        }

        const productDetailsPromises = requestedProducts.map(p =>
            fetchProductDetailsAndCalculateValue(p).catch(err => {
                err.productId = p.productId;
                throw err;
            })
        );

        try {
            processedProductsDetails = await Promise.all(productDetailsPromises);
        } catch (productFetchError) {
            console.error(`ERRO ao buscar detalhes do produto ${productFetchError.productId || ''}: ${productFetchError.message}`);
            throw productFetchError;
        }

        overallTotalValue = processedProductsDetails.reduce((sum, product) => sum + product.totalValue, 0);
        overallTotalValue = parseFloat(overallTotalValue.toFixed(2));

        if (overallTotalValue <= 0 && requestedProducts.length > 0) {
            throw new Error("O valor total da compra não pode ser zero ou negativo se houver produtos.");
        }

        mainTransactionRecord = await Transaction.create({
            userId,
            totalValue: overallTotalValue,
            operation: 'purchase',
            status: 'pending'
        }, { transaction: dbTransaction });

        const itemDataForDb = processedProductsDetails.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
            totalValue: p.totalValue,
            transactionId: mainTransactionRecord.id
        }));

        await ItemTransaction.bulkCreate(itemDataForDb, { transaction: dbTransaction });

        const walletApiUrl = `${API_GATEWAY_BASE_URL}/api/wallets/${userId}/balance`;

        const walletResponse = await fetch(walletApiUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: -overallTotalValue })
        });

        if (!walletResponse.ok) {
            let errorDataFromWallet = null;
            let extractedMessage = `Falha ao comunicar com wallet-api (via Gateway): ${walletResponse.status} ${walletResponse.statusText}`;
            let errorDetails = "";
            try {
                const contentType = walletResponse.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    errorDataFromWallet = await walletResponse.json();
                    if (errorDataFromWallet && errorDataFromWallet.message) {
                        extractedMessage = errorDataFromWallet.message;
                        errorDetails = ` Detalhes: ${errorDataFromWallet.message}`;
                    } else if (errorDataFromWallet && errorDataFromWallet.error) {
                        extractedMessage = errorDataFromWallet.error;
                        errorDetails = ` Detalhes: ${errorDataFromWallet.error}`;
                    }
                } else {
                    const text = await walletResponse.text();
                    if (text) {
                        extractedMessage = text;
                        errorDetails = ` Detalhes: ${text}`;
                    }
                }
            } catch (parseErr) {
                console.error('ERRO: Falha ao parsear corpo da resposta de erro da wallet-api (via Gateway):', parseErr);
            }

            if (walletResponse.status === 400) {
                if (extractedMessage.toLowerCase().includes('saldo insuficiente')) {
                    let detail = `Valor da tentativa de débito: ${overallTotalValue}.`;
                    if (errorDataFromWallet && errorDataFromWallet.currentBalance !== undefined) {
                        detail += ` Saldo atual na carteira: ${errorDataFromWallet.currentBalance}.`;
                    }
                        throw new Error(`Saldo insuficiente na carteira (via Gateway) para cobrir o valor de ${overallTotalValue}. ${detail}`);
                } else {
                    throw new Error(`Erro da wallet-api (400 Bad Request via Gateway): ${extractedMessage}. Valor da tentativa de débito: ${overallTotalValue}.${errorDetails}`);
                }
            } else if (walletResponse.status === 404) {
                    throw new Error(`Recurso da carteira para userId ${userId} não encontrado na wallet-api (via Gateway). Tentativa de débito de ${overallTotalValue}.${errorDetails}`);
            } else {
                throw new Error(`Erro da wallet-api (${walletResponse.status} via Gateway): ${extractedMessage}. Tentativa de débito de ${overallTotalValue}.${errorDetails}`);
            }
        }

        await mainTransactionRecord.update({ status: 'completed' }, { transaction: dbTransaction });

        await dbTransaction.commit();

        res.status(200).json({ message: 'Pagamento processado com sucesso', transactionId: mainTransactionRecord.id });

    } catch (err) {
        console.error("ERRO GERAL no makePayment:", err.message);
        if (err.stack && !err.message.toLowerCase().includes('saldo insuficiente')) {
            console.error(err.stack);
        }

        if (dbTransaction && dbTransaction.finished !== 'committed' && dbTransaction.finished !== 'rolled back') {
            try {
                await dbTransaction.rollback();
            } catch (rollbackErr) {
                console.error("ERRO CRÍTICO: Falha ao fazer rollback da transação:", rollbackErr);
            }
        }

        const userIdForFailure = req.params.userId;
        if (userIdForFailure) {
            try {
                await Transaction.create({
                    userId: userIdForFailure,
                    totalValue: parseFloat(overallTotalValue.toFixed(2)),
                    operation: 'purchase',
                    status: 'failed',
                    failureReason: err.message.substring(0, 255)
                });
            } catch (createFailedErr) {
                console.error("ERRO CRÍTICO: Não foi possível criar o registro de transação 'failed':", createFailedErr.message);
                if (createFailedErr.stack) console.error(createFailedErr.stack);
            }
        } else {
            console.warn("AVISO: Não foi possível registrar a transação como 'failed' por falta de userId.");
        }

        let statusCode = 500;
        if (err.message.toLowerCase().includes('saldo insuficiente')) {
            statusCode = 402;
        } else if (err.message.includes('não encontrado') || err.message.includes('inativo')) {
            statusCode = 404;
        } else if (err.message.includes('Dados inválidos') ||
          err.message.includes('Preço inválido') ||
          err.message.includes('400 Bad Request')) {
            statusCode = 400;
        }

        if (!res.headersSent) {
            res.status(statusCode).json({
                error: err.message || 'Ocorreu um erro ao processar o pagamento.'
            });
        } else {
            next(err);
        }
    }
};
