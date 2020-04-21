/* eslint-disable no-param-reassign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const balance = transactions.reduce(
      (newBalance: Balance, elemento) => {
        if (elemento.type === 'income') {
          newBalance.income += elemento.value;
        } else {
          newBalance.outcome += elemento.value;
        }
        newBalance.total = newBalance.income - newBalance.outcome;
        return newBalance;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }
}

export default TransactionsRepository;
