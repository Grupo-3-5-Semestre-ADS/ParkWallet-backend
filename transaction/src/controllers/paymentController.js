import { Transaction, ItemTransaction } from '../models/index.js';
import fetch from 'node-fetch';
import database from '../config/database.js';
const { sequelize } = database;

const API_GATEWAY_BASE_URL = process.env.API_GATEWAY_URL || 'http://localhost:8080';

// Função auxiliar para buscar detalhes do produto e calcular o valor do item
async function fetchProductDetailsAndCalculateValue(productInput) {
    const { productId, quantity } = productInput;
    if (!productId || quantity == null || quantity < 0) {
        throw new Error(`Dados inválidos para o produto: productId=${productId}, quantity=${quantity}`);
    }

    // A rota no API Gateway para produtos deve ser algo como /api/products/:id
    const catalogApiUrl = `${API_GATEWAY_BASE_URL}/api/products/${productId}`;
    console.log(`INFO: Buscando detalhes para productId: ${productId} via API Gateway: ${catalogApiUrl}`);
    // const response = await fetch(`http://catalog-api:8080/api/products/${productId}`); // Antigo
    const response = await fetch(catalogApiUrl); // Novo

    if (!response.ok) {
        // Tentar obter mais detalhes do erro do corpo da resposta, se disponível
        let errorDetails = "";
        try {
            const errorBody = await response.json();
            if (errorBody && errorBody.error) errorDetails = ` Detalhes: ${errorBody.error}`;
            else if (errorBody && errorBody.message) errorDetails = ` Detalhes: ${errorBody.message}`;
        } catch (e) { /* ignora se não for JSON */ }

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
    console.log("INFO: Iniciando makePayment");
    const dbTransaction = await sequelize.transaction();
    let mainTransactionRecord = null;
    let processedProductsDetails = [];
    let overallTotalValue = 0;

    try {
        const { userId } = req.params;
        const requestedProducts = req.body.products;

        // ... (validações iniciais permanecem as mesmas) ...
        if (!userId) {
            throw new Error("userId não fornecido nos parâmetros da rota.");
        }
        if (!requestedProducts || requestedProducts.length === 0) {
            throw new Error("Nenhum produto fornecido para pagamento.");
        }
        // ...

        console.log(`INFO: userId: ${userId}, produtos requisitados count: ${requestedProducts.length}`);

        const productDetailsPromises = requestedProducts.map(p =>
            fetchProductDetailsAndCalculateValue(p).catch(err => { // fetchProductDetailsAndCalculateValue já usa o API Gateway
                err.productId = p.productId;
                throw err;
            })
        );
        // ... (lógica de Promise.all e cálculo de overallTotalValue permanece a mesma) ...
        try {
            processedProductsDetails = await Promise.all(productDetailsPromises);
            console.log("INFO: Detalhes de todos os produtos buscados e valores calculados:");
            processedProductsDetails.forEach(p => console.log(`  - ID: ${p.productId}, Nome: ${p.name}, Qtd: ${p.quantity}, Preço Un: ${p.unitPrice}, Total Item: ${p.totalValue}`));
        } catch (productFetchError) {
            console.error(`ERRO ao buscar detalhes do produto ${productFetchError.productId || ''}: ${productFetchError.message}`);
            throw productFetchError;
        }

        overallTotalValue = processedProductsDetails.reduce((sum, product) => sum + product.totalValue, 0);
        overallTotalValue = parseFloat(overallTotalValue.toFixed(2));
        console.log(`INFO: Valor total GERAL calculado: ${overallTotalValue}`);

        if (overallTotalValue <= 0 && requestedProducts.length > 0) {
            throw new Error("O valor total da compra não pode ser zero ou negativo se houver produtos.");
        }
        // ... (criação de Transaction e ItemTransaction permanece a mesma) ...
        mainTransactionRecord = await Transaction.create({
            userId,
            totalValue: overallTotalValue,
            operation: 'purchase',
            status: 'pending'
        }, { transaction: dbTransaction });
        console.log(`INFO: Registro de Transaction principal criado (em memória/transação): ID ${mainTransactionRecord.id}`);

        const itemDataForDb = processedProductsDetails.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
            totalValue: p.totalValue,
            transactionId: mainTransactionRecord.id
        }));

        await ItemTransaction.bulkCreate(itemDataForDb, { transaction: dbTransaction });
        console.log("INFO: Registros de ItemTransaction criados (em memória/transação)");
        // ...

        // A rota no API Gateway para o saldo da carteira deve ser algo como /api/wallets/:userId/balance
        const walletApiUrl = `${API_GATEWAY_BASE_URL}/api/wallets/${userId}/balance`;
        console.log(`INFO: Tentando debitar ${overallTotalValue} do usuário ${userId} via API Gateway: ${walletApiUrl}`);
        // const walletResponse = await fetch(`http://wallet-api:8080/api/wallets/${userId}/balance`, { // Antigo
        const walletResponse = await fetch(walletApiUrl, { // Novo
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: -overallTotalValue })
        });
        console.log(`INFO: Resposta da wallet-api (via Gateway) status: ${walletResponse.status}`);

        // ... (lógica de tratamento de erro da walletResponse permanece a mesma,
        // mas agora as mensagens de erro podem refletir que a chamada foi via Gateway) ...
        if (!walletResponse.ok) {
            let errorDataFromWallet = null;
            let extractedMessage = `Falha ao comunicar com wallet-api (via Gateway): ${walletResponse.status} ${walletResponse.statusText}`;
             // Tentar obter mais detalhes do erro do corpo da resposta
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
        // ... (lógica de commit e resposta de sucesso permanece a mesma) ...
        console.log("INFO: Débito na wallet-api (via Gateway) bem-sucedido. Atualizando status da transação principal para 'completed'.");
        await mainTransactionRecord.update({ status: 'completed' }, { transaction: dbTransaction });
        console.log("INFO: Status da transação principal atualizado para 'completed' (em memória/transação).");

        await dbTransaction.commit();
        console.log("INFO: Transação do banco de dados COMITADA com sucesso.");

        res.status(200).json({ message: 'Pagamento processado com sucesso', transactionId: mainTransactionRecord.id });

    } catch (err) {
        // ... (bloco catch permanece o mesmo, mas as mensagens de erro já terão a indicação "via Gateway") ...
        console.error("ERRO GERAL no makePayment:", err.message);
        if (err.stack && !err.message.toLowerCase().includes('saldo insuficiente')) {
            console.error(err.stack);
        }

        if (dbTransaction && dbTransaction.finished !== 'committed' && dbTransaction.finished !== 'rolled back') {
            try {
                console.log("INFO: Tentando rollback da transação do banco de dados...");
                await dbTransaction.rollback();
                console.log("INFO: Transação do banco de dados ROLLED BACK com sucesso.");
            } catch (rollbackErr) {
                console.error("ERRO CRÍTICO: Falha ao fazer rollback da transação:", rollbackErr);
            }
        }

        const userIdForFailure = req.params.userId;
        if (userIdForFailure) {
            try {
                console.log("INFO: Tentando criar um novo registro de Transaction com status 'failed'.");
                const failedTransaction = await Transaction.create({
                    userId: userIdForFailure,
                    totalValue: parseFloat(overallTotalValue.toFixed(2)),
                    operation: 'purchase',
                    status: 'failed',
                    failureReason: err.message.substring(0, 255)
                });
                console.log(`INFO: Novo registro de Transaction 'failed' criado com ID: ${failedTransaction.id}`);
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
        } else if (err.message.includes('Dados inválidos') || err.message.includes('Preço inválido') || err.message.includes('400 Bad Request')) {
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
