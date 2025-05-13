import {faker} from '@faker-js/faker/locale/pt_BR';
import dotenv from 'dotenv';
import {Transaction, ItemTransaction} from './models/index.js';

dotenv.config();

const NUM_USERS = 100;
const TRANSACTIONS_PER_USER_MIN = 10;
const TRANSACTIONS_PER_USER_MAX = 20;
const ITEMS_PER_PURCHASE_TRANSACTION_MIN = 1;
const ITEMS_PER_PURCHASE_TRANSACTION_MAX = 5;
const CREDIT_AMOUNT_MIN = 10;
const CREDIT_AMOUNT_MAX = 100;
const MIN_PRODUCT_ID = 1;
const MAX_PRODUCT_ID = 1000;

const seedDatabase = async () => {
  for (let i = 0; i < NUM_USERS; i++) {
    const userId = i + 1;

    const numTransactionsForUser = faker.number.int({
      min: TRANSACTIONS_PER_USER_MIN,
      max: TRANSACTIONS_PER_USER_MAX
    });

    for (let j = 0; j < numTransactionsForUser; j++) {
      const operation = faker.helpers.arrayElement(['purchase', 'credit']);
      let transactionTotalValue = 0;
      const itemsToCreate = [];

      if (operation === 'purchase') {
        const numItemsInTransaction = faker.number.int({
          min: ITEMS_PER_PURCHASE_TRANSACTION_MIN,
          max: ITEMS_PER_PURCHASE_TRANSACTION_MAX
        });

        if (numItemsInTransaction === 0) continue;

        for (let k = 0; k < numItemsInTransaction; k++) {
          const quantity = faker.number.int({min: 1, max: 3});
          const productPrice = faker.number.float({
            min: 1,
            max: 40
          });
          const productId = faker.number.float({
            min: MIN_PRODUCT_ID,
            max: MAX_PRODUCT_ID
          });

          const totalValue = parseFloat((productPrice * quantity).toFixed(2));

          itemsToCreate.push({
            productId,
            quantity,
            totalValue,
          });

          transactionTotalValue += totalValue;
        }

        transactionTotalValue = parseFloat(transactionTotalValue.toFixed(2));
      } else if (operation === 'credit') {
        transactionTotalValue = parseFloat(faker.finance.amount({
          min: CREDIT_AMOUNT_MIN,
          max: CREDIT_AMOUNT_MAX,
          dec: 2
        }));
      }

      try {
        const transactionData = {
          userId: userId,
          totalValue: transactionTotalValue,
          operation: operation,
          active: faker.datatype.boolean(0.95),
        };

        const newTransaction = await Transaction.create(transactionData);

        if (operation === 'purchase' && itemsToCreate.length > 0) {
          for (const itemData of itemsToCreate) {
            await ItemTransaction.create({
              ...itemData,
              transactionId: newTransaction.id,
            });
          }
        }
      } catch (error) {
        console.error(`Error creating transaction or items for user ${userId}:`, error.message);
        if (error.errors) {
          error.errors.forEach(err => console.error(`  - ${err.path}: ${err.message}`));
        }
      }
    }
  }
};

export {seedDatabase};
