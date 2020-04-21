import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    try {
      const transactionRepository = getCustomRepository(TransactionsRepository);
      await transactionRepository.delete({
        id,
      });
    } catch (error) {
      throw new AppError('Não foi possível excluir o registro', 400);
    }
  }
}

export default DeleteTransactionService;
