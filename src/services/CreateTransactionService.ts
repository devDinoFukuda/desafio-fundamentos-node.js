import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: Request): Transaction {

    //**Invalidando transactions não sendo types income e outcome *******//
    if(!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction not authorized. Invalid type');
    }
    //**Invalidando transactions não sendo types income e outcome *******//

    //*****should not be able to create outcome transaction without a valid balance ****/
    const { total } = this.transactionsRepository.getBalance();
    if(type === 'outcome' && total < value) {
      throw new Error('You have no balance for this transaction');
    }

    //*****should not be able to create outcome transaction without a valid balance ****/

    const transaction = this.transactionsRepository.create({
      title, value, type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
