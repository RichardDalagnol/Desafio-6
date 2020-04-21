import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    let category_id = null;

    if (!category) {
      throw new AppError('A categoria é obrigatória', 400);
    }

    const categoryExist = await categoryRepository.findOne({
      where: { title: category },
    });

    if (categoryExist) {
      category_id = categoryExist.id;
    } else {
      const createCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(createCategory);
      category_id = createCategory.id;
    }
    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError(
        'Você não possui saldo suficiente para este movimento',
        400,
      );
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
