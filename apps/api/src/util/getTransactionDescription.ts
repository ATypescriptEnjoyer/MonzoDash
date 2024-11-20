import { WebhookTransactionData } from '../monzo/monzo.interfaces';
import { Pot } from '../monzo/monzo.service';

export const getTransactionDescription = (transaction: WebhookTransactionData, pots: Pot[]): string => {
  const description = transaction.merchant?.name || transaction.counterparty?.name;
  if (description === 'Flex') {
    return transaction.notes;
  }
  if (description) {
    return description;
  }
  if (transaction.description.startsWith('pot_')) {
    const potName = pots.find((pot) => pot.id === transaction.description)?.name || 'pot';
    return `${transaction.amount > 0 ? 'Withdrawal from' : 'Deposit to'} ${potName}`;
  }
  return 'Unknown Transaction';
};
